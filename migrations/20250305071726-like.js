'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable("like", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: { // 외래키
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users", // user 테이블을 참조
          key: "id",
        },
        onDelete: "CASCADE", // 사용자가 삭제되면 좋아요도 삭제
      },
      boardId: { // 외래키
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "board", // board 테이블을 참조
          key: "id",
        },
        onDelete: "CASCADE", // 게시글 삭제 시 좋아요도 삭제
      },
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable("like");
  }
};
