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
        }
    );
    return category;
};
