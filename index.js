const PORT = process.env.PORT || 5500;
const Router = require('./framework/Router');
const emitter = new EventEmitter();

const router = new Router();

router.get("/users", (req, res) => {
  res.end("you send GET request to /users endpoint");
});
router.get("/posts", (req, res) => {
  res.end("you send GET request to /posts endpoint");
});

const server = http.createServer((req, res) => {
  //   эмитим кастомное событие типа [/users]:[POST]
  //   передаем req и res внутрь события
  //   когда эмиттим событие то оно возвращает false если такого события не существует
  const emitted = emitter.emit(`[${req.url}]:[${req.method}]`, req, res);
  if (!emitted) {
    //  закрываем стрим
    res.end();
  }
});

server.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
