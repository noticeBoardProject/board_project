const db = require("../models"); // board 가져오기
const { where, Op } = require("sequelize");
const boardModel = db.board; // board 모델 사용
const userModel = db.users; // users 모델 사용
const categoryModel = db.category; // category 모델 사용
const moment = require("moment");

const getMainBoard = async (req, res) =>{
    const {categoryId} = req.query;

    let userId = null; // 기본값을 null로 설정
    if (req.user) {
        userId = req.user.id;
    }

    try {
        let boardList;

        if(categoryId === "all"){
            boardList = await boardModel.findAll({
                include: [
                    { model: userModel, as:"author", attributes: ["nickname"] },
                    { model: categoryModel, as: "category", attributes: ["name"] },
                ],
                order: [["updatedAt", "DESC"]], // 최신순 정렬
            });
        } else {
            boardList = await boardModel.findAll({
                where: {categoryId},
                include: [
                    { model: userModel, as:"author", attributes: ["nickname"] },
                    { model: categoryModel, as: "category", attributes: ["name"] },
                ],
                order: [["updatedAt", "DESC"]], // 최신순 정렬
            });
        }

        const boardData = boardList.map((x) =>({
            id: x.id, // 게시판 PK
            categoryName: x.category.name, // category의 이름
            title: x.title,
            nickname: x.author.nickname, // users의 별명
            updatedAt: moment(x.updatedAt).format("YYYY-MM-DD HH:mm"),
            likeCount: x.likeCount,
            img_url: x.img_url,
            userCheck: userId !== null ? userId === x.userId : false, // 작성한 유저와 동일한지 체크
        }));
        console.log("나타날 리스트 확인: ", boardData);

        res.json( {results: true , data: boardData }); // for 메인페이지 리스트 출력
        // render("") // for 상세페이지 이동? 정보전달?

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
        return res.render("search", { boardAll, searchWord });
    
    } catch (error) {
        console.error("검색 체크 오류:", error);
    }
}

module.exports = { getMainBoard, searchTitle };
