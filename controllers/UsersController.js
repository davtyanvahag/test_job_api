const { User, File } = require('../models')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.addUser = (req, res) => {
    const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        birthDate: req.body.birthDate,
        registrationDate: req.body.registrationDate,
        ipAddress: req.body.ipAddress,
        status: req.body.status,
    };

    User.create(user)
        .then(data => {
            res.json({error: false, data: data});
        })
        .catch(err => {
            res.status(500).json({
                error: true,
                message:
                    err || "Some error occurred while creating the Tutorial."
            });
        });
};


exports.updateUser = (req, res) => {
    User.findOne({ where: { id: req.body.id } })
        .then((user) => {
            // Check if record exists in db
            if (user) {
                user.update({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    birthDate: req.body.birthDate,
                    ipAddress: req.body.ipAddress,
                    status: req.body.status,
                }).then(() => {
                    res.json({error: false, message: 'updated successfully'});
                }).catch((err) => {
                    res.json({error: true, err: err, message: 'update error'});
                })
            }
        })
        .catch((err) => {
            res.json({error: true, err: err, message: 'Error on getting users'});
        });
};

exports.getAll = async (req, res) => {
    User.findAll({})
        .then((users) => {
            res.json({error: false, data: users});
        })
        .catch((err) => {
            res.json({error: true, err: err, message: 'Error on getting users'});
        });
};

exports.search = async (req, res) => {
    var obj = {};
    if (req.body.name) {
        obj.firstName = {[Op.like]: `%${req.body.name}%`}
    } else {
        obj.firstName = {[Op.ne]: null}
    }
    if (req.body.email) {
        obj.email = {[Op.like]:`%${req.body.email}%`}
    }
    if (req.body.dobMax) {
        obj.birthDate = {[Op.lte]: req.body.dobMax}
    }
    if (req.body.dobMin) {
        obj.birthDate = {[Op.gte]: req.body.dobMin}
    }
    if (req.body.status) {
        obj.status = req.body.status
    }
    console.log(obj);
    User.findAll({where: obj})
        .then((users) => {
            res.json({error: false, data: users});
        })
        .catch((err) => {
            res.json({error: true, err: err, message: 'Error on getting users'});
        });
};

exports.getOne = (req, res) => {
    console.log(req.params.id);
    User.findOne({where: {id: +req.params.id},  include: [
        {model: File, required: false, as: 'Files', where: {userId: +req.params.id}}
    ]})
        .then((user) => {
            res.json({error: false, data: user});
        })
        .catch((err) => {
            console.log(err)
            res.json({error: true, err: err, message: 'Error on getting user'});
        });
};

exports.getUserFiles = (req, res) => {
    User.findAll({where: {status: req.params.status},  include: [
        {model: File, required: false, as: 'Files'}
    ]})
        .then((users) => {
            console.log(users)
            var files = users.map(el => el.Files);
            newArray =  [].concat.apply([], files);
            res.json({error: false, data: newArray});
        })
        .catch((err) => {
            console.log(err)
            res.json({error: true, err: err, message: 'Error on getting user'});
        });
};


exports.deleteUser = (req, res) => {
    User.destroy({
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

