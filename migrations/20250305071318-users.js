'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable("users", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true, // 중복 불가
        validate: {
          isEmail: true, // 이메일 형식 검사
        },
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      nickname: {
        type: Sequelize.STRING(45),
        allowNull: false,
        unique: true, // 중복 불가
      },
      address: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      gender:{
        type: Sequelize.ENUM('male', 'female'),
        allowNull: false,
      },
      age:{
        type: Sequelize.DATE,
        allowNull: false,
      },
      phone:{
        type: Sequelize.STRING(45),
        unique: true, // 중복 불가
        allowNull: false,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable("users");
  }
};
