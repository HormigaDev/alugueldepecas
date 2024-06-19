const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'routes');

module.exports = (app) => {
  const allowedMethods = ['get', 'post', 'put', 'delete'];
  allowedMethods.forEach(method => {
    fs.readdirSync(path.join(dir, method)).filter(file => file.endsWith('.js')).forEach(file => {
      const route = require(path.join(dir, method, file));
      app[method](route.path, (req, res, next) => {
        req.closeWindow = app.closeWindow;
        next();
      },route.handler);
    });
  });
}