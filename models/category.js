module.exports = (sequelize, DataTypes) => {
    const category = sequelize.define(
        "category",
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
              },
              name: {
                type: DataTypes.STRING(50),
                allowNull: false,
                unique: true, // 중복 방지
              },
        },
        {
            tableName: "category",
            timestamps: false,
        });
    
        // category는 여러 개의 board를 가질 수 있음
        category.associate = (models) => {
            category.hasMany(models.board, { 
              foreignKey: "categoryId",
              as: "boards",
            });
        };
    return category;
};
