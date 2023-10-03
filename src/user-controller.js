const User = require("./user-model");

const getUsers = async (req, res) => {
  let users;
  const userIdParam = req.params.id;
  
  if (userIdParam) {
    users = await User.findById(userIdParam);
  }

  if (userIdParam === undefined) {
    users = await User.find();
  }

  res.send(users);
};

const createUser = async (req, res) => {
  const user = await User.create(req.body);
  res.send(user);
};

module.exports = {
    getUsers,
    createUser
};
