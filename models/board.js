module.exports = (sequelize, DataTypes) => {
    const board = sequelize.define(
        "board",
        {
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
                  model: "users", // uses 테이블 참조
                  key: "id",
                },
                onDelete: "CASCADE", // 사용자(부모테이블)가 삭제되면 해당 사용자의 게시글도 삭제
              },
              categoryId: { // 외래키
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                  model: "category", // category 테이블 참조
                  key: "id",
                },
                onDelete: "SET NULL", // 카테고리 삭제 시 null 처리
              },
              img_url: {
                type: Sequelize.TEXT,
                allowNull: true, // 대표 이미지 선택
              },
              title: {
                type: Sequelize.STRING(255),
                allowNull: false,
              },
              content: {
                type: Sequelize.TEXT, // 긴 글 저장
                allowNull: false,
              },
              createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
              },
              updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
              },
              likeCount: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0, // 기본값 0
              },
        },
        {
            tableName: "board",  // 실제 DB 테이블명
            timestamps: false, // createdAt, updatedAt 자동 생성 방지
        }
    );
    return board;
};