const db = require("../models"); // board, category 가져오기
const { where, Op } = require("sequelize");
const boardModel = db.board; // board 모델 사용
const categoryModel = db.category; // category 모델 사용

// 메인페이지 테이블형식: pk번호, 제목, 글쓴이, 날짜(update), 좋아요개수, 이미지 필요함 (번호는 js로 자동 생성)
const getMainBoard = async (req, res) => {
  // console.log("받은 카테고리 정보: ", req.body);
  try {
    const boardAll = await boardModel.findAll();
    const boardByCategory = await boardModel.findOne({ where: {} });
  } catch (error) {
    console.error("메인 리스트 불러오기 오류:", error);
  }
};

// 제목 기준 검색
const searchTitle = async (req, res) => {
  const { searchWord } = req.query;
  console.log("검색된 데이터들:", searchWord);
  try {
    // const boardAll = await boardModel.findAll({
    //   where: {
    //     title: { [Op.like]: `%${searchWord}%` },
    //   },
    // });
    // return res.render("search", { results: boardAll, searchWord });
  } catch (error) {
    console.error("검색 체크 오류:", error);
  }
};

module.exports = { getMainBoard, searchTitle };
