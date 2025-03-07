"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("users", "password", {
      type: Sequelize.STRING(255),
      allowNull: true, 
    });

    await queryInterface.changeColumn("users", "address", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.changeColumn("users", "gender", {
      type: Sequelize.ENUM("male", "female"),
      allowNull: true,
    });

    await queryInterface.changeColumn("users", "birthdate", {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });

    await queryInterface.changeColumn("users", "email", {
      type: Sequelize.STRING(255),
      allowNull: false,
      unique: true,
    });

    await queryInterface.addColumn("users", "provider", {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("users", "password", {
      type: Sequelize.STRING(255),
      allowNull: false,
    });

    await queryInterface.changeColumn("users", "address", {
      type: Sequelize.STRING(255),
      allowNull: false,
    });

    await queryInterface.changeColumn("users", "gender", {
      type: Sequelize.ENUM("male", "female"),
      allowNull: false,
    });

    await queryInterface.changeColumn("users", "birthdate", {
      type: Sequelize.DATEONLY,
      allowNull: false,
    });

    await queryInterface.changeColumn("users", "email", {
      type: Sequelize.STRING(255),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    });

    await queryInterface.removeColumn("users", "provider");
  },
};
