// 로그인창 띄우기
document.addEventListener("DOMContentLoaded", function () {
  const loginicon = document.querySelector(".loginicon");
  const modal = document.querySelector(".form-login-box");
  const overlay = document.querySelector(".modal-overlay");
  const closeBtn = document.querySelector(".close-btn");

  // 모달 열기
  loginicon.addEventListener("click", function () {
    modal.classList.remove("closing"); // 닫기 애니메이션 클래스 제거
    modal.classList.add("active");
    overlay.classList.add("active");
  });

  // 모달 닫기 (X 버튼)
  closeBtn.addEventListener("click", function () {
    modal.classList.add("closing"); // 닫기 애니메이션 추가
    overlay.classList.remove("active");

    // 애니메이션이 끝난 후 숨김 처리
    setTimeout(() => {
      modal.classList.remove("active");
      modal.classList.remove("closing");
    }, 300); // CSS 애니메이션 시간(0.3초)과 동일하게 설정
  });
});

// 스크롤시 헤더
// let preScrollTop = 0;
// const header = document.getElementById("main-header");
// const categoryNav = document.querySelector(".category-nav");

// window.addEventListener("scroll", () => {
//   let nextScrollTop = window.scrollY;
//   if (window.scrollY === 0) {
//     // 헤더와 카테고리 둘 다 고정
//     header.classList.remove("hide");
//     header.classList.remove("fix-header");
//     categoryNav.classList.remove("fix-category");
//   } else if (preScrollTop < nextScrollTop) {
//     // 아래로 스크롤
//     header.classList.add("hide");
//     header.classList.remove("fix-header");
//     categoryNav.classList.add("fix-category");
//   } else {
//     // 위로 스크롤
//     header.classList.remove("hide");
//     header.classList.add("fix-header");
//     categoryNav.classList.remove("fix-category");
//   }
//   preScrollTop = nextScrollTop;
// });
