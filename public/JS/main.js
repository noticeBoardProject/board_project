const content = document.querySelector(".content");

// 기존 선택 카테고리 데이터 요청
document.addEventListener("DOMContentLoaded", () => {
  const savedCategory = localStorage.getItem("selectedCategory") || "all";
  fetchCateData(savedCategory);
});

// 변경 감지
window.addEventListener("categoryChange", () => {
  const savedCategory = localStorage.getItem("selectedCategory") || "all";
  fetchCateData(savedCategory);
});

// 카테고리 변경시
const fetchCateData = async (categoryId) => {
  await axios({
    method: "get",
    url: "boarddata",
    params: { nowCategory: categoryId },
  })
    .then((res) => {
      content.innerHTML = ""; // 기존 내용 초기화
      const data = res.data;

      if (data && data.length > 0) {
        data.forEach((item, i) => {
          content.innerHTML += `
          <div class="article board">
              <div>${i + 1}</div>
              <div class="title">${item.title}</div>
              <div>${item.nickname}</div>
              <div>${item.updateAt}</div>
              <div>${item.likeCount}</div>
              <img src="${img_url}" alt="테스트" />
            </div>`;
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
  await axios({
    method: "get",
    url: "search/title",
  })
    .then((res) => {
      console.log(res.data);
    })
    .catch((e) => {
      console.log("검색 실패:", e);
    });
});
