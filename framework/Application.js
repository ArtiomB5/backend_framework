const http = require("http");
const events = require("node:events");

//  endpoint structure:
//   endpoint = {
//     '/users': {
//         'GET': handler
//     }
//   }

module.exports = class Application {
  constructor() {
    this.emitter = new events.EventEmitter();
    this.server = this.#createServer();
    this.middlewares = [];
  }

  listen(port, callback) {
    this.server.listen(port, callback);
  }

  use(middleware) {
    this.middlewares.push(middleware);
  }

  addRouter(router) {
    Object.keys(router.endpoints).forEach((url) => {
      const endpoint = router.endpoints[url];
      Object.keys(endpoint).forEach((method) => {
        const handler = endpoint[method];
        const routeMask = this.#getRouteMask(url, method);

        this.emitter.on(routeMask, (req, res) => {
          handler(req, res);
        });
      });
    });
  }

  #createServer() {
    return http.createServer((req, res) => {
      let reqBody = '';
      req.on('data', (chunk) => {
        reqBody += chunk;
      })
      req.on('end', (chunk) => {
        if (reqBody) {
          req.body = JSON.parse(reqBody);
        }
        this.middlewares.forEach(middleware => middleware(req, res));
        console.log(req.pathname)
        console.log(req.params)
        const routeMask = this.#getRouteMask(req.pathname, req.method);
        const emitted = this.emitter.emit(routeMask, req, res);
        if (!emitted) {
          res.end();
        }
      })
    });
  }

  #getRouteMask(url, method) {
    return `[${url}]:[${method}]`;
  }
};
