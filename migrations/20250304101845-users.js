'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.createTable("users", {
      id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      userid: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(35),
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING(225),
        allowNull: false,
      },
      gender:{
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      age:{
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      phone:{
        type: Sequelize.STRING(45),
        allowNull: false,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    queryInterface.dropTable("users");
  }
};
