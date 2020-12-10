const { File } = require('../models')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const mime = require('mime-types');
const multer = require('multer');

exports.uploadFile = (req, res) => {
    var name = uuidv4();
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './public');
        },
        filename: function (req, file, cb) {
            cb(null, name + '.' + mime.extension(file.mimetype));
        }
    });

    var upload = multer({
        storage: storage}).single('file');

    upload(req, res, function (err) {
            if (!err) {
                var file = {
                    filename: name,
                    originalName: req.file.originalname,
                    mime: mime.extension(req.file.mimetype),
                    size: req.file.size,
                    userId: +req.params.userId,
                };
                File.create(file)
                    .then(data => {
                        res.json({error: false, data: data});
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: true,
                            message:
                                err || "Some error occurred while creating the File."
                        });
                    });
            } else {
                console.log(err)
                res.status(500).json({
                    error: true,
                    message:
                        err || "Only pdf, img, png files"
                });
            }
    });
};

exports.deleteFile = (req, res) => {
    File.findOne({id: +req.params.id})
        .then((file) => {
            fs.unlink('./public/' + file.filename + '.' + file.mime, (err) => {
                if (err) {
                    res.json({error: true, message: 'NoFile'})
                } else {
                    File.destroy({
                        where: {
                            id: +req.params.id
                        }
                    }).then((user) => {
                        res.json({error: false, message: 'Deleted Successfully'});
                    })
                        .catch((err) => {
                            res.json({error: true, err: err, message: 'User not deleted'});
                        });
                }
            });
        })
        .catch((err) => {
            res.json({error: true, err: err, message: 'Error on getting user'});
        });
};

exports.getFilesByUserId = (req, res) => {
    File.findAll({userId: +req.params.userId})
        .then((files) => {
            res.json({error: false, data: files});
        })
        .catch((err) => {
            res.json({error: true, err: err, message: 'Error on getting files'});
        });
};

exports.deleteFilesByUserId = (req, res) => {
    File.findAll({userId: +req.params.userId})
        .then((files) => {
            dataDeleter(files).then(data => {
                res.json({error: false});
            });
        })
        .catch((err) => {
            res.json({error: true, err: err, message: 'Error on getting files'});
        });
};

function dataDeleter(array) {
    return Promise.all(
        array.map(
            file =>
                new Promise((res, rej) => {
                    try {
                        fs.unlink(`./public/${file.filename}.${file.mime}`, err => {
                            if (err) throw err;
                            res();
                        });
                    } catch (err) {
                        console.error(err);
                        rej(err);
                    }
                })
        )
    );
}


