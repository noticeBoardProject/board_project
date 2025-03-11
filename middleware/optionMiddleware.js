const db = require("../models"); // user 가져오기
const loginModel = db.users; // user 모델 사용

require("dotenv").config();
const secretKey = process.env.JWT_SECRET; // JWT 시크릿 키

const optionMiddleware = async (req, res, next) => {
    // 클라이언트 쿠키에서 JWT 가져오기
    const token = req.cookies.token; 

    if (!token) {
        req.user = null;  // 로그인이 안 되어도 계속 진행
        return next();
    }

    try {
        const decoded = jwt.verify(token, secretKey); // 서버에서 발급한 토큰인지 검증 
        const user = await loginModel.findOne({ where: { id: decoded.id } }); // id로 사용자 조회

        if (!user) {
            req.user = null;  // 유저를 찾을 수 없으면 null로 설정
        } else {
            req.user = user;  // 조회된 사용자 정보를 할당
        }

    } catch (error) {
        console.error("토큰 검증 오류:", error);
    }

    next();  // 다음 미들웨어 실행
};

module.exports = optionMiddleware;