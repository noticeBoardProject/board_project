const db = require("../models");
const { where } = require("sequelize");
const boardModel = db.board; 
const categoryModel = db.category; 
const likeModel = db.like;

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
    const userId = req.user.id; // 로그인한 사용자 id
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

// 게시글 삭제
const deleteBoard = async (req, res) =>{
    const {boardId} = req.params;
    const userId = req.user.id;

    try {
        const board = await boardModel.findOne({
            where: {id: boardId, userId} // 본인 글만 삭제 가능
        });
    
        if (!board) {
          return res.json({ result: false, message: "게시글을 찾을 수 없습니다." });
        }
    
        // like 테이블에서 해당 게시글과 관련된 좋아요 삭제
        await likeModel.destroy({ where: { boardId } });
    
        // board 테이블에서 게시글 삭제
        await boardModel.destroy({ where: { id: boardId } });
    
        res.json({ result: true, message: "게시글 삭제 완료" });
    } catch (error) {
        console.error("게시글 삭제 오류:", error);
    }
};

module.exports = { getCategory, createBoard, deleteBoard };