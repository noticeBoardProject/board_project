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
                validate: {
                    isEmail: true, // 이메일 형식 검사
                },
            },
            password: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            username: {
                type: DataTypes.STRING(45),
                allowNull: false,
            },
            nickname: {
                type: DataTypes.STRING(45),
                allowNull: false,
                unique: true, // 중복 불가
            },
            address: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            gender: {
                type: DataTypes.ENUM('male', 'female'),
                allowNull: false,
            },
            birthdate: {
                type: DataTypes.DATEONLY, // 날짜만 저장
                allowNull: false,
            },
            phone: {
                type: DataTypes.STRING(45),
                unique: true, // 중복 불가
                allowNull: false,
            },
        },
        {
            tableName: "users",  // 실제 DB 테이블명
            timestamps: false, // createdAt, updatedAt 자동 생성 방지
        }
    );
    return users;
};