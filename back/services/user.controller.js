const User = require('../schema/users/users.model');

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
};

const addUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.send(user);
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.send(` user ${User} has been deleted`);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

module.exports = {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
};
