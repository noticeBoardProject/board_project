const db = require("../models"); // board, category 가져오기
const { where } = require("sequelize");
const boardModel = db.board; // board 모델 사용
const categoryModel = db.category; // category 모델 사용

// 카테고리 목록 가져오기
const getCategory = async (req, res) =>{
    const categoryAll = await categoryModel.findAll();
    // console.log("총 카테고리", categoryAll)

    try{
        if(!categoryAll){
            return res.json({ result: false, message: "카테고리 정보가 없습니다." });
        }
        res.json({ result: true, category: categoryAll });   
    } catch (error){
        console.error("카테고리 목록 조회 오류:", error);
    }
}

// 게시물 db 연동
const createBoard = async (req, res) =>{
    const userId = req.user.id; // 로그인한 사용자 id (미들웨어로 가져올 수 있음)
    const { categoryId, title, content } = req.body;

    // 이미지 배열 처리
    let img_url = req.files.map((img) => img.filename).join(",");

    try {
        // db에 저장
        const newBoard = await boardModel.create({
            userId,
            categoryId,
            img_url,
            title,
            content,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        res.json({ result: true, board: newBoard });

    } catch (error) {
        console.error("게시글 저장 오류:", error);
    }
};

module.exports = { getCategory, createBoard };