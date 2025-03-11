const content = document.querySelector(".content");

// 기존 선택 카테고리 데이터 요청
document.addEventListener("DOMContentLoaded", () => {
  const savedCategory = sessionStorage.getItem("selectedCategory") || "all";
  fetchCateData(savedCategory);
});

// 변경 감지
window.addEventListener("categoryChange", () => {
  const savedCategory = sessionStorage.getItem("selectedCategory") || "all";
  fetchCateData(savedCategory);
});

// 카테고리 변경시
const fetchCateData = async (categoryId) => {
  await axios({
    method: "get",
    url: "/main/boardData",
    params: { categoryId }, // all 또는 카테고리ID
  })
    .then((res) => {
      content.innerHTML = ""; // 기존 내용 초기화

      const data = res.data.data;

      console.log("잘받아왔낭", data);
      if (data && data.length > 0) {
        const sortedData = data.sort((a, b) => b.id - a.id);
        sortedData.forEach((item, i) => {
          content.innerHTML += `
          <a href="/main/move/detail/${item.id}" class="detailtag">
            <div class="article board">
              <div>${i + 1}</div>
              <div class="title">${item.title}</div>
              <div>${item.nickname}</div>
              <div>${item.updatedAt.split("T")[0]}</div>
              <div>${item.likeCount}</div>
              <div class="imagebox imagebox${item.id}"></div>
            </div>
          </a>`;

          if (item.img_url) {
            document.querySelector(
              `.imagebox${item.id}`
            ).innerHTML += `<img src="http://localhost:3000/uploads/${
              item.img_url.split(",")[0]
            }" alt="등록된 사진" />`;
          }
        });
      } else {
        content.innerText = "게시물이 없습니다.";
      }
    })
    .catch((e) => {
      console.log("에러", e);
    });
};

// 검색창 검색(제목 기준)
document.querySelector(".search-btn").addEventListener("click", async () => {
  const searchWord = document.getElementById("search").value;
  window.location.href = `/main/search?searchWord=${searchWord}`;
});

document.addEventListener("DOMContentLoaded", function () {
  console.log(localStorage.hasOwnProperty("login"));
  if (localStorage.hasOwnProperty("login")) {
    // 로그인 상태라면 버튼을 변경
    document.querySelector(".write").innerHTML = `
    <div id="writeBtn" class="writebtn" onclick="loginModal()" title="글쓰기">
        <img src="/public/image/pen.svg" alt="글쓰기" />
      </div>
    `;
  } else {
    document.querySelector(".write").innerHTML = `
        <a href="/write">
        <div class="writebtn" title="글쓰기">
          <img src="/public/image/pen.svg" alt="글쓰기" />
        </div>
      </a>
    `;
  }
});
