var express = require('express');
var router = express.Router();
var FilesController = require('../controllers/FilesController');

router.post('/add/:userId', function(req, res, next) {
    FilesController.uploadFile(req, res);
});

router.delete('/delete/:id', function(req, res, next) {
    FilesController.deleteFile(req, res);
});

router.delete('/delete-user-files/:userId', function(req, res, next) {
    FilesController.deleteFilesByUserId(req, res);
});

router.get('/get-user-files/:userId', function(req, res, next) {
    FilesController.getFilesByUserId(req, res);
});

module.exports = router;
