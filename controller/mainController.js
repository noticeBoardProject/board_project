const db = require("../models"); // board 가져오기
const { where, Op } = require("sequelize");
const boardModel = db.board; // board 모델 사용
const userModel = db.users; // users 모델 사용
const categoryModel = db.category; // category 모델 사용
const likeModel = db.like; // like 모델 사용
const moment = require("moment");

// 필요한 데이터 요청
const getMainBoard = async (req, res) => {
  const { categoryId, page = 1, limit = 6 } = req.query;
  let userId = null; // 기본값을 null로 설정
  if (req.user) {
    userId = req.user.id;
  }

  try {
    let boardList;
    const offset = (page - 1) * limit; // offset 계산

    if (categoryId === "all") {
      boardList = await boardModel.findAndCountAll({
        include: [
          { model: userModel, as: "author", attributes: ["nickname"] },
          { model: categoryModel, as: "category", attributes: ["name"] },
        ],
        order: [["createdAt", "DESC"]], // 최신순 정렬
        limit: parseInt(limit),
        offset: offset,
      });
    } else {
      boardList = await boardModel.findAndCountAll({
        where: { categoryId },
        include: [
          { model: userModel, as: "author", attributes: ["nickname"] },
          { model: categoryModel, as: "category", attributes: ["name"] },
        ],
        order: [["createdAt", "DESC"]], // 최신순 정렬
        limit: parseInt(limit),
        offset: offset,
      });
    }

    const totalPages = Math.ceil(boardList.count / limit); // 전체 페이지 수 계산
    const boardData = boardList.rows.map((x) => ({
      id: x.id, // 게시판 PK
      categoryName: x.category.name, // category의 이름
      title: x.title,
      nickname: x.author.nickname, // users의 별명
      content: x.content,
      createdAt: moment(x.createdAt).format("YYYY-MM-DD HH:mm"),
      updatedAt: moment(x.updatedAt).format("YYYY-MM-DD HH:mm"),
      likeCount: x.likeCount,
      img_url: x.img_url,
      userCheck: userId === x.userId, // 작성한 유저와 동일한지 체크
    }));

    res.json({
      results: true,
      data: boardData,
      totalPage: totalPages,
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("메인 리스트 불러오기 오류:", error);
    res.status(500).json({ results: false, message: "서버 오류" });
  }
};

// 상세페이지 이동
const getDetailBoard = async (req, res) => {
  const { id } = req.params;

  let userId = null; // 기본값을 null로 설정
  if (req.user) {
    userId = req.user.id;
  }

  try {
    const board = await boardModel.findOne({
      where: { id },
      include: [
        { model: userModel, as: "author", attributes: ["nickname"] },
        { model: categoryModel, as: "category", attributes: ["name"] },
      ],
    });

    if (!board) {
      return res.json({ result: false, message: "게시글을 찾을 수 없습니다." });
    }

    // 좋아요 여부 확인
    const like = await likeModel.findOne({
      where: { userId, boardId: id },
    });
    const likedByUser = like ? true : false;

    const boardData = {
      id: board.id, // 게시판 PK
      categoryName: board.category.name, // category의 이름
      title: board.title,
      nickname: board.author.nickname, // users의 별명
      content: board.content,
      createdAt: moment(board.createdAt).format("YYYY-MM-DD HH:mm"),
      updatedAt: moment(board.updatedAt).format("YYYY-MM-DD HH:mm"),
      likeCount: board.likeCount,
      img_url: board.img_url,
      userCheck: userId === board.userId, // 작성한 유저와 동일한지 체크
      likedByUser: likedByUser,
    };
    // console.log("해당 상세페이지 확인: ", boardData);

    // 다음게시물
    const nextBoard = await boardModel.findOne({
      where: { updatedAt: { [Op.gt]: board.updatedAt } }, // 현재 updatedAt보다 큰 updatedAt
      order: [["updatedAt", "ASC"]], //오름차순
    });

    // 이전 게시물
    const prevBoard = await boardModel.findOne({
      where: { updatedAt: { [Op.lt]: board.updatedAt } }, //현재 updatedAt보다 작은 updatedAt
      order: [["updatedAt", "DESC"]], // 내림차순
    });

    // 다음 게시물이 없으면 false
    const nextId = nextBoard ? nextBoard.id : false;
    const prevId = prevBoard ? prevBoard.id : false;

    const nextTitle = nextBoard ? nextBoard.title : false;
    const prevTitle = prevBoard ? prevBoard.title : false;

    const nextData = {
      nextId: nextId,
      prevId: prevId,
      nextTitle: nextTitle,
      prevTitle: prevTitle,
    };

    // res.json({ result: true, data: boardData });
    res.render("detailpage", {
      data: boardData,
      nextData,
    });
  } catch (error) {
    console.error("상세페이지 오류:", error);
  }
};

// 제목 기준 검색
const searchTitle = async (req, res) => {
  const { searchWord } = req.query;

  try {
    const boardAll = await boardModel.findAll({
      where: {
        title: { [Op.like]: `%${searchWord}%` },
      },
      include: [{ model: userModel, as: "author", attributes: ["nickname"] }],
    });

    const boardData = boardAll.map((x) => ({
      id: x.id, // 게시판 PK
      userId: x.userId,
      categoryId: x.categoryId,
      img_url: x.img_url,
      title: x.title,
      content: x.content,
      createdAt: moment(x.createdAt).format("YYYY-MM-DD HH:mm"),
      updatedAt: moment(x.updatedAt).format("YYYY-MM-DD HH:mm"),
      likeCount: x.likeCount,
      nickname: x.author.nickname, // users의 별명
    }));

    // console.log("검색된 데이터들:", boardData);
    return res.render("search", { boardData, searchWord });
  } catch (error) {
    console.error("검색 체크 오류:", error);
  }
};

// 내글모음
const getMyWrite = async (req, res) => {
  const userId = req.user.id;

  try {
    const boardAll = await boardModel.findAll({
      where: { userId },
      include: [{ model: categoryModel, as: "category", attributes: ["name"] }],
    });

    const boardData = boardAll.map((x) => ({
      id: x.id, // 게시판 PK
      categoryName: x.category.name, // category의 이름
      img_url: x.img_url,
      title: x.title,
      content: x.content,
      createdAt: moment(x.createdAt).format("YYYY-MM-DD HH:mm"),
      updatedAt: moment(x.updatedAt).format("YYYY-MM-DD HH:mm"),
      likeCount: x.likeCount,
    }));

    // console.log("내 글 데이터들:", boardData);
    return res.render("mywrite", { boardData });
  } catch (error) {
    console.error("내글 모음 확인 오류:", error);
  }
};

// 내 좋아요 모음
const getMyLike = async (req, res) => {
  const userId = req.user.id;

  try {
    const likeBoardAll = await boardModel.findAll({
      include: [
        { model: likeModel, as: "likes", where: { userId } },
        { model: userModel, as: "author", attributes: ["nickname"] },
        { model: categoryModel, as: "category", attributes: ["name"] },
      ],
    });

    const boardData = likeBoardAll.map((x) => ({
      id: x.id, // 게시판 PK
      categoryName: x.category.name, // category의 이름
      img_url: x.img_url,
      title: x.title,
      content: x.content,
      createdAt: moment(x.createdAt).format("YYYY-MM-DD HH:mm"),
      updatedAt: moment(x.updatedAt).format("YYYY-MM-DD HH:mm"),
      likeCount: x.likeCount,
      nickname: x.author.nickname, // users의 별명
    }));

    console.log("내 좋아요 데이터들:", boardData);
    return res.render("mylike", { boardData });
  } catch (error) {
    console.error("내글 모음 확인 오류:", error);
  }
};

// 게시글 수정 이동
const getEdit = async (req, res) =>{
  const {boardId} = req.params;
  try {
    // 게시판, 카테고리 정보 필요
    const board = await boardModel.findByPk(boardId);
    const category = await categoryModel.findAll();

    res.render("edit", { data: board, categories: category });
  } catch (error) {
    console.error("수정 이동 오류:", error);
  }
}

module.exports = {
  getMainBoard,
  getDetailBoard,
  searchTitle,
  getMyWrite,
  getMyLike,
  getEdit,
};
