module.exports = (sequelize, DataTypes) => {
    const users = sequelize.define(
        "users",
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            email: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: true, // 중복 불가
            },
            password: {
                type: DataTypes.STRING(255),
                allowNull: true, // 중복 허용 (SNS 로그인 사용자)
            },
            username: {
                type: DataTypes.STRING(45),
                allowNull: false,
            },
            nickname: {
                type: DataTypes.STRING(45),
                allowNull: false,
                unique: true,
            },
            address: {
                type: DataTypes.STRING(255),
                allowNull: true, // 빈 값 허용
            },
            gender: {
                type: DataTypes.ENUM('male', 'female'),
                allowNull: true, // 빈 값 허용
            },
            birthdate: {
                type: DataTypes.DATEONLY,
                allowNull: true, // 빈 값 허용
            },
            phone: {
                type: DataTypes.STRING(45),
                unique: true,
                allowNull: false,
            },
            provider: {
                type: DataTypes.STRING(50),
                allowNull: true, // 빈 값 허용
            }
        },
        {
            tableName: "users",
            timestamps: false,
        });

        // user는 여러 개의 board를 가질 수 있음
        users.associate = (models) => {
            users.hasMany(models.board, { 
                foreignKey: "userId",
                as: "boards",
            });
        };

    return users;
};
