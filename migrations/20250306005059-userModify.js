'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn("users", "age", "birthdate"); // 필드명 변경
    await queryInterface.changeColumn("users", "birthdate", { // 데이터타입 변경
      type: Sequelize.DATEONLY,
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn("users", "birthdate", "age");
    await queryInterface.changeColumn("users", "age", {
      type: Sequelize.DATE,
      allowNull: false,
    });
  }
};
