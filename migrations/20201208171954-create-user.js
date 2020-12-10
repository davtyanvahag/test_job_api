'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        isEmail:{
          args:true,
          msg:'Valid email-id required'
        },
        validate: {
          isEmail: true,

        }
      },
      birthDate: {
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      registrationDate: {
        type: Sequelize.DATE,
        allowNull: false, defaultValue: Sequelize.NOW
      },
      ipAddress: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      status: {
        type: Sequelize.ENUM(),
        values: ['lead', 'demo', 'client'],
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};
