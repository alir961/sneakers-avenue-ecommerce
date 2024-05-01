const express = require('express');

const router = express.Router();

const {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
} = require('../../services/user.controller');

router.get('/users', getUsers);

router.post('/register', addUser);

router.put('/users:id', updateUser);

router.delete('/users:id', deleteUser);

module.exports = router;
