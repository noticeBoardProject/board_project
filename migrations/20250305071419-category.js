'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable("category", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true, // 중복 방지
      },
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable("category");
  }
};