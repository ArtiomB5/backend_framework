const http = require("http");
const EventEmitter = require("events");

module.exports = class Application {
  constructor() {
    this.emitter = new EventEmitter();
    this.server = this.#createServer();
  }

  addRouter(router) {
    Object.keys(router.endpoints).forEach((url) => {
        const endpoint = router.endpoints[url];
    })
  }

  //    приватный метод
  #createServer() {
    return http.createServer((req, res) => {
      const routeMask = this.#getRouteMask(req.url, req.method);

      //   эмитим кастомное событие типа [/users]:[POST]
      //   передаем req и res внутрь события
      //   когда эмиттим событие то оно возвращает false если такого события не существует
      const emitted = this.emitter.emit(routeMask, req, res);
      if (!emitted) {
        //  закрываем стрим
        res.end();
      }
    });
  }

  #getRouteMask(url, method) {
    return `[${url}]:[${method}]`;
  }
};
