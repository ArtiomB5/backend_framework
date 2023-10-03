const Application = require("./framework/Application");
const jsonParser = require("./framework/parseJson");
const urlParser = require("./framework/parseUrl");
const userRouter = require("./src/user-router");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 5500;

const app = new Application();

app.addRouter(userRouter);
app.use(jsonParser);
app.use(urlParser(`http://localhost:${PORT}`));

const start = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URL);
    console.log(connection);
    app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();