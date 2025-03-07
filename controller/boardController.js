const db = require("../models"); // board 가져오기
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

module.exports = { getCategory };