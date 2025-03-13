const db = require("../models"); // board 가져오기
const { where, Op } = require("sequelize");
const boardModel = db.board;
const likeModel = db.like; 

// 좋아요 상태 확인
const getLikeStatus = async (req, res) =>{
    const { boardId } = req.params;
    
    let userId = null; // 기본값을 null로 설정
    if (req.user) {
        userId = req.user.id;
    }
    
    try{
        // board테이블의 좋아요 수 가져오기
        const board = await boardModel.findByPk(boardId,{
            attributes: ["likeCount"],
        });

        // 사용자 좋아요 클릭 여부 확인
        const like = await likeModel.findOne({
            where: {userId, boardId},
        });

        let likedByUser = false;
        if(like){
            likedByUser = true;
        }

        const likeCount = board.likeCount;

        res.json({ likeCount: likeCount, likedByUser: likedByUser});
        console.log("테이블 좋아요 수 확인", likeCount);
        console.log("사용자 클릭 여부 확인", likedByUser);

    } catch (error) {
        console.error("좋아요 오류:", error);
    }
}

// 좋아요 추가
const addLike = async (req, res) =>{
    const { boardId } = req.body;
    const userId = req.user.id;

    console.log("받은 boardId:", boardId);
    console.log("받은 userId:", userId);

    try {
        const checkLike = await likeModel.findOne({
            where: {userId, boardId},
        });

        if (checkLike){
            return res.json({ message: "이미 좋아요를 눌렀습니다." });
        }

        await likeModel.create({userId, boardId});
        await boardModel.increment("likeCount", {where: {id: boardId}});

        res.json({ message: "좋아요 추가 완료" });
    } catch (error) {
        console.error("좋아요 추가 오류:", error);
    }
}

// 좋아요 취소
const deleteLike = async (req, res) =>{
    const { boardId } = req.params;
    const userId = req.user.id;

    try{
        const checkLike = await likeModel.findOne({
            where: {userId, boardId},
        });

        await likeModel.destroy({where: {userId, boardId}});
        await boardModel.decrement("likeCount", {where: {id: boardId}});

        res.json({ message: "좋아요 취소 완료" });
    } catch (error) {
        console.error("좋아요 취소 오류:", error);
    }
}

module.exports = { getLikeStatus, addLike, deleteLike };