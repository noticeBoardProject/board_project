const jwt = require("jsonwebtoken");

const loginModel = require("../models/users"); // db 모델

const loginMiddleware = async (req, res, next) => {
    // 클라이언트 쿠키에서 JWT 가져오기
    const token = req.cookies.token; 

    if (!token) {
        return res.json({ result: false, message: "토큰 없음" });
    }
    console.log("받은 토큰:", token);

    try {
        const decoded = jwt.verify(token, secretKey); // 서버에서 발급한 토큰인지 검증
        console.log("검증된 토큰:", decoded);

        const user = await loginModel.findOne({where: {id: decoded.id}}); // id로 사용자 조회
        
        if (!user) {
            return res.json({ result: false, message: "사용자를 찾을 수 없음" });
        }

        req.user = user;  // 조회된 사용자 정보를 할당
        next(); // 다음 미들웨어 실행

    } catch (error) {
        console.error("토큰 검증 오류:", error);
        return res.json({ result: false, message: "유효하지 않은 토큰" });
    }
};

module.exports = loginMiddleware;