const events = require("node:events");

module.exports = class Router {
  constructor() {
    this.endpoints = {};
    this.emitter = new events.EventEmitter();
  }

  request(method = "GET", url, handler) {
    // проверяем есть-ли url в объекте endpoints
    if (!this.endpoints[url]) {
      // если ключа в объекте endpoints нету то инициализируем пустым объектом
      this.endpoints[url] = {};
    }

    // получаем эндпоинт по пути
    const endpoint = this.endpoints[url];

    // проверяем есть-ли method в объекте endpoint
    if (endpoint[method]) {
      throw new Error(`[${method}] по адресу ${url} уже существует`);
    } else {
      // если нету method то присваиваем по ключу-методу для него обработчик
      endpoint[method] = handler;

      // добавляем слушатель события на кастомное событие типа [/users]:[POST]
      this.emitter.on(`[${url}]:[${method}]`, (req, res) => {
        handler(req, res);
      });
    }
  }

  get(url, handler) {
    this.request("GET", url, handler);
  }

  post(url, handler) {
    this.request("POST", url, handler);
  }

  put(url, handler) {
    this.request("PUT", url, handler);
  }

  delete(url, handler) {
    this.request("DELETE", url, handler);
  }
};
