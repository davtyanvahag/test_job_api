'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    birthDate: DataTypes.DATE,
    registrationDate: DataTypes.DATE,
    ipAddress: DataTypes.STRING,
    status: DataTypes.ENUM('lead', 'demo', 'client'),
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'User',
  });
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.File, {
      foreignKey: {
        name: 'userId',
        allowNull: false
      },
      as: 'Files'
    })
  };
  return User;
};
