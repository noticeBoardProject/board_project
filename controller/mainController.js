const db = require("../models"); // board 가져오기
const { where, Op } = require("sequelize");
const boardModel = db.board; // board 모델 사용
const userModel = db.users; // users 모델 사용

const getMainBoard = async (req, res) =>{
    const {categoryId} = req.query;
    const userId = req.user.id; // 로그인한 유저

    try {
        let boardList;

        if(categoryId === "all"){
            boardList = await boardModel.findAll({
                include: [
                    { model: userModel, as:"author", attributes: ["nickname"] },
                ],
            });
        } else {
            boardList = await boardModel.findAll({
                where: {categoryId},
                include: [
                    { model: userModel, as:"author", attributes: ["nickname"] },
                ],
            });
        }

        const boardData = boardList.map((x) =>({
            id: x.id, // 게시판 PK
            title: x.title,
            nickname: x.author.nickname,
            updatedAt: x.updatedAt,
            likeCount: x.likeCount,
            img_url: x.img_url,
            userCheck: userId === x.userId, // 작성한 유저와 동일한지 체크
        }));
        // console.log("나타날 리스트 확인: ", boardData);

        res.json( {results: true , data: boardData });

    } catch (error) {
        console.error("메인 리스트 불러오기 오류:", error);
      }
}

// 제목 기준 검색
const searchTitle = async (req, res) =>{
    const {searchWord} = req.query;

    try {
        const boardAll = await boardModel.findAll({
            where: {
                title: { [Op.like]: `%${searchWord}%` }
            },
        });
        // console.log("검색된 데이터들:", boardAll);
        return res.render("search", { results: boardAll, searchWord });
    
    } catch (error) {
        console.error("검색 체크 오류:", error);
    }
}

module.exports = { getMainBoard, searchTitle };