process.env.ROOT = 'C:/';
process.env.JWT_TOKEN = 'secret';
const { app, BrowserWindow } = require('electron');
const path = require('node:path');
const express = require('express');
const server = express();
const frontend = express();
const cors = require('cors');
const db = require('./database');
const { authenticate } = require('./utils/auth');

db.createDatabase();

frontend.use(express.static(path.join(__dirname, 'spa')));
frontend.use(cors());
frontend.use(express.json({ limit: '50mb'}));
frontend.use(express.urlencoded({ extended: true }));

frontend.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'spa', 'index.html'));
});

frontend.listen(19555, () => {
  console.log('Frontend is running on port 19555');
});

server.use(cors());
server.use(express.json({ limit: '50mb'}));
server.use(express.urlencoded({ extended: true }));
server.use(authenticate);


require('./router')(server);

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let modalNovoAnuncio = null;
let modalNovoPedido = null;
let modalDetalhes = null;

const createModalNovoAnuncio = (parent) => {
  modalNovoAnuncio = new BrowserWindow({
    width: 720,
    height: 540,
    frame: false,
    parent,
    modal: true,
    hasShadow: true,
    resizable: false,
  });

  modalNovoAnuncio.loadURL('http://localhost:19555/#/cadastro/novo-anuncio');
}

const createModalNovoPedido = (parent) => {
  modalNovoPedido = new BrowserWindow({
    width: 720,
    height: 540,
    frame: false,
    parent,
    modal: true,
    hasShadow: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
    }
  });

  modalNovoPedido.webContents.on('before-input-event', (event, input) => {
    if (input.control && input.key.toLowerCase() === 'd') {
      modalNovoPedido.webContents.toggleDevTools();
    }
    if (input.control && input.key.toLowerCase() === 'r') {
      modalNovoPedido.reload();
    }
  });

  modalNovoPedido.loadURL('http://localhost:19555/#/pedidos/novo-pedido');
}

const createModalDetalhes = (parent) => {
  modalDetalhes = new BrowserWindow({
    width: 720,
    height: 540,
    frame: false,
    parent,
    modal: true,
    hasShadow: true,
    resizable: false,
  });

  modalDetalhes.webContents.on('before-input-event', (event, input) => {
    if (input.control && input.key.toLowerCase() === 'd') {
      modalDetalhes.webContents.toggleDevTools();
    }
    if (input.control && input.key.toLowerCase() === 'r') {
      modalDetalhes.reload();
    }
  });

  modalDetalhes.loadURL('http://localhost:19555/#/detalhes/detalhes');
}

const createWindow = () => {
  
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1240,
    height: 720,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  server.post('/novo-anuncio', (req, res) => {
    const windows = {
      main: mainWindow,
      novo_anuncio: modalNovoAnuncio,
      novo_pedido: modalNovoPedido,
      detalhes: modalDetalhes
    };
    createModalNovoAnuncio(windows[req.body.parent]??mainWindow);
    res.status(200).json({ message: 'Modal aberto com sucesso' });
  });

  server.post('/novo-pedido', (req, res) => {
    const windows = {
      main: mainWindow,
      novo_anuncio: modalNovoAnuncio,
      novo_pedido: modalNovoPedido,
      detalhes: modalDetalhes
    };
    createModalNovoPedido(windows[req.body.parent]??mainWindow);
    res.status(200).json({ message: 'Modal aberto com sucesso' });
  });

  server.post('/detalhes', (req, res) => {
    const windows = {
      main: mainWindow,
      novo_anuncio: modalNovoAnuncio,
      novo_pedido: modalNovoPedido,
      detalhes: modalDetalhes
    };
    createModalDetalhes(windows[req.body.parent]??mainWindow);
    res.status(200).json({ message: 'Modal aberto com sucesso' });
  });

  server.post('/action', (req, res) => {
    const window = req.body.window;
    const action = req.body.action;
    const windows = {
      main: mainWindow,
      novo_anuncio: modalNovoAnuncio,
      novo_pedido: modalNovoPedido,
      detalhes: modalDetalhes
    };
    if(!windows[window]) {
      res.status(404).json({ message: 'Janela não encontrada' });
    }
    switch(action){
      case 'close':
        windows[window].close();
        res.status(200).json({ message: 'Janela fechada com sucesso' });
        break;
      case 'minimize':
        windows[window].minimize();
        res.status(200).json({ message: 'Janela minimizada com sucesso' });
        break;
      case 'maximize':
        if(windows[window].isMaximized()){
          windows[window].restore();
          res.status(200).json({ message: 'Janela restaurada com sucesso' });
        } else {
          windows[window].maximize();
          res.status(200).json({ message: 'Janela maximizada com sucesso' });
        }
        break;
    }
  });

  server.closeWindow = (window) => {
    const windows = {
      main: mainWindow,
      novo_anuncio: modalNovoAnuncio,
      novo_pedido: modalNovoPedido,
      detalhes: modalDetalhes
    };
    if(windows[window]){
      windows[window].close();
    }
  }

  // and load the index.html of the app.
  mainWindow.loadURL('http://localhost:19555/#/main/anuncios');

  // Registra os atalhos Ctrl+D para abrir os recursos de desenvolvimento (DevTools) e Ctrl+R para recarregar a janela
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.control && input.key.toLowerCase() === 'd') {
      mainWindow.webContents.toggleDevTools();
    }
    if (input.control && input.key.toLowerCase() === 'r') {
      mainWindow.reload();
    }
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
