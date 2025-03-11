const deletebtn = document.querySelector(".deletebtn");

// 검색 실시간 확인
const checkSearch = () => {
  document.getElementById("search").classList.remove("info");
  if (search.value.length === 0) {
    deletebtn.classList.add("closing");
    deletebtn.classList.remove("active");
  } else {
    deletebtn.classList.add("active");
    deletebtn.classList.remove("closing");
  }
};

// 검색 글자 삭제
const deleteKeyword = () => {
  search.value = "";
  deletebtn.classList.add("closing");
  deletebtn.classList.remove("active");
};

// 검색창 검색(제목 기준)
document.querySelector(".search-btn").addEventListener("click", async () => {
  const searchWord = document.getElementById("search").value;
  if (searchWord.length !== 0) {
    document.getElementById("search").classList.remove("info");
    // 검색 요청
    window.location.href = `/main/search?searchWord=${searchWord}`;
  } else {
    document.getElementById("search").classList.add("info");
  }
});

// 검색 엔터키
const input = document.querySelector('input[type="text"]');

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    document.querySelector(".search-btn").click();
  }
});

// 선 넣기
const boards = document.querySelectorAll(".eachboard");

boards.forEach((board, index) => {
  // 마지막 요소를 제외한 모든 요소에 'has-border' 클래스를 추가
  if (index < boards.length - 1) {
    board.classList.add("has-border");
  }
});
