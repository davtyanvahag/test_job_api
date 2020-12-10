var express = require('express');
var router = express.Router();
var UsersController = require('../controllers/UsersController');

router.post('/add', function(req, res, next) {
  UsersController.addUser(req, res);
});
router.put('/update', function(req, res, next) {
  UsersController.updateUser(req, res);
});
router.get('/get-all', function(req, res, next) {
  UsersController.getAll(req, res);
});
router.post('/search', function(req, res, next) {
  UsersController.search(req, res);
});
router.get('/get-one/:id', function(req, res, next) {
  UsersController.getOne(req, res);
});
router.get('/get-file/?:status', function(req, res, next) {
  UsersController.getUserFiles(req, res);
});
router.delete('/delete/:id', function(req, res, next) {
  UsersController.deleteUser(req, res);
});


module.exports = router;
