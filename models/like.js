module.exports = (sequelize, DataTypes) => {
    const like = sequelize.define(
        "like",
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            userId: { // 외래키
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "users", // user 테이블을 참조
                    key: "id",
                },
                onDelete: "CASCADE", // 사용자가 삭제되면 좋아요도 삭제
            },
            boardId: { // 외래키
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "board", // board 테이블을 참조
                    key: "id",
                },
                onDelete: "CASCADE", // 게시글 삭제 시 좋아요도 삭제
            },
        },
        {
            tableName: "like",
            timestamps: false,
        });
    
        // users, board는 여러 개의 like를 가질 수 있음
        like.associate = (models) => {
            like.belongsTo(models.users, { 
                foreignKey: "userId",
                as: "user",
            });
    
            like.belongsTo(models.board, { 
              foreignKey: "boardId",
              as: "board",
            });
        };
    return like;
};
