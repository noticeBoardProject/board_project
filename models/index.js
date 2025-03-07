const { Sequelize, DataTypes } = require("sequelize");

// 운영버전일땐 production 개발할땐 development
const env = process.env.NODE_ENV || "development";

// config데이터를 가져온거에서 development의 데이터 가져옴
const config = require("../config/config.json")[env];
const db = {};

// sequelize가 node와 mySQL연결해는 코드
// node와 mySQL을 연결해주는 드라이버역할인 mysql2라이브러리에 필요정보를 줘서 역할을 수행하게 함
// 연결성공하면 sequelize객체에 연결정보가 담김
// 근데 연결만 성공해서는 아무 의미 없고 mySQL에 테이블들을 만들어줘야한다.
const sequelize = new Sequelize(
  config.database, // db명
  config.username, // 사용자
  config.password, // 비밀번호
  config, // 정보전체
);

// 모델 파일 불러오기
db.users = require("./users")(sequelize, DataTypes);
db.board = require("./board")(sequelize, DataTypes);
db.category = require("./category")(sequelize, DataTypes);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("데이터베이스 연결됨.");
  })
  .catch((err) => {
    console.error(err);
  });

module.exports = db;