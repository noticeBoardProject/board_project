let currentPage = 1; // 기본 페이지 설정
const postsPerPage = 5; // 한 페이지에 표시할 게시물 수
let totalPages = 1; // 총 페이지 수
let currentCategory = "all"; // 기본 카테고리 설정

const content = document.querySelector(".content");
const categoryBox = document.querySelector(".category-box");
const numberWrap = document.querySelector(".numberWrap");

// 카테고리 데이터 가져오기
const getCategory = async () => {
  await axios({
    method: "get",
    url: "/board/category",
  })
    .then((res) => {
      if (res.data.result) {
        const category = res.data.category;
        categoryBox.innerHTML = `<li><div class="cate actives" id="all">전체</div></li>`;

        category
          .sort((a, b) => a.id - b.id) // 오름차순 정렬
          .forEach((cate) => {
            categoryBox.innerHTML += `<li><div class="cate" id="${cate.id}">${cate.name}</div></li>`;
          });

        // 카테고리 클릭 이벤트 설정
        initCategoryEvents();
      } else {
        alert("카테고리 정보를 불러오지 못했습니다.");
      }
    })
    .catch((e) => {
      console.log(e);
    });
};

// 카테고리 버튼 클릭 이벤트
const initCategoryEvents = () => {
  const navItems = document.querySelectorAll(".cate");

  // 카테고리 클릭 시
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      navItems.forEach((i) => i.classList.remove("actives"));
      item.classList.add("actives");

      currentCategory = item.id; // 클릭한 카테고리
      currentPage = 1; // 카테고리 변경 시 페이지 1로 리셋
      fetchPosts(); // 새로운 카테고리로 게시물 데이터 가져오기
    });
  });
};

// 게시물 가져오기
const fetchPosts = async () => {
  try {
    const res = await axios({
      method: "get",
      url: "/main/boardData",
      params: {
        categoryId: currentCategory,
        page: currentPage,
        limit: postsPerPage,
      },
    });

    const data = res.data.data;
    totalPages = res.data.totalPage;
    console.log(data);
    content.innerHTML = ""; // 기존 게시물 초기화
    if (data && data.length > 0) {
      data.forEach((item, i) => {
        content.innerHTML += `
          <a href="/main/move/detail/${item.id}" class="detailtag">
            <div class="article">
              <div class="contentbox">
                  <div class="titlebox">
                    <div class="title">${item.title}</div>
                    <div class="content">${item.content}</div>
                  </div>

                  <div class="imagebox imagebox${item.id}"></div>
              </div>
              <div class="infobox">
                <div class="nickname">${item.nickname}</div>
                <span class="day">${item.createdAt}</span>
                <span class="imgwrap likecount">좋아요수 ${item.likeCount}</span>
              </div>
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

    updatePagination();
  } catch (error) {
    console.log("게시물 가져오기 에러:", error);
  }
};

// 페이지네이션 업데이트
const updatePagination = () => {
  numberWrap.innerHTML = ""; // 기존 페이지 번호 버튼 초기화

  const maxVisiblePages = 5; // 한 그룹당 페이지 수
  const totalGroups = Math.ceil(totalPages / maxVisiblePages); // 전체 그룹의 수 계산
  const currentGroup = Math.ceil(currentPage / maxVisiblePages); // 현재 그룹 번호 계산

  // 그룹의 시작 페이지 번호
  const startPage = (currentGroup - 1) * maxVisiblePages + 1;
  // 그룹의 끝 페이지 번호
  const endPage = Math.min(currentGroup * maxVisiblePages, totalPages);

  // 페이지 번호 버튼 추가
  for (let i = startPage; i <= endPage; i++) {
    const pageButton = document.createElement("button");
    pageButton.classList.add("number-btn");
    pageButton.innerText = i;
    pageButton.onclick = () => goToPage(i);

    if (i === currentPage) {
      pageButton.classList.add("active");
    }

    numberWrap.appendChild(pageButton);
  }

  // 이전/다음 버튼 활성화/비활성화
  document.querySelector(".prev-btn").disabled = currentPage === 1;
  document.querySelector(".next-btn").disabled = currentPage === totalPages;
  document.querySelector(".first-btn").disabled = currentPage === 1;
  document.querySelector(".last-btn").disabled = currentPage === totalPages;
};
// 그룹 이동 함수
const goToGroup = (group) => {
  if (group < 1 || group > Math.ceil(totalPages / 5)) return; // 그룹 번호 범위 체크
  currentPage = (group - 1) * 5 + 1; // 그룹의 첫 페이지로 이동
  fetchPosts(); // 페이지 변경 후 게시물 데이터 다시 가져오기
};

// 페이지 이동
const goToPage = (page) => {
  currentPage = page;
  fetchPosts(); // 페이지 변경 후 게시물 데이터 다시 가져오기
};

// 첫 페이지로 이동
const goToFirstPage = () => {
  currentPage = 1;
  fetchPosts(); // 첫 페이지로 이동 후 게시물 데이터 다시 가져오기
};

// 이전 페이지로 이동
const goToPrevPage = () => {
  if (currentPage > 1) {
    currentPage--;
    fetchPosts(); // 이전 페이지로 이동 후 게시물 데이터 다시 가져오기
  }
};

// 다음 페이지로 이동
const goToNextPage = () => {
  if (currentPage < totalPages) {
    currentPage++;
    fetchPosts(); // 다음 페이지로 이동 후 게시물 데이터 다시 가져오기
  }
};

// 마지막 페이지로 이동
const goToLastPage = () => {
  currentPage = totalPages;
  fetchPosts(); // 마지막 페이지로 이동 후 게시물 데이터 다시 가져오기
};
// 페이지 로드 시 카테고리와 게시물 가져오기
document.addEventListener("DOMContentLoaded", () => {
  getCategory(); // 카테고리 불러오기
  fetchPosts(); // 첫 번째 게시물 불러오기
});
