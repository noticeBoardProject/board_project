// 잘못된 값 입력시 안내
const emailtext = document.querySelector(".emailtext");
const passtext = document.querySelector(".passtext");

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

const login = async (event) => {
  event.preventDefault();
  // 로그인에 입력한 입력값
  const email = document.getElementById("email").value;
  const pw = document.getElementById("pw").value;

  // 유효성 검사
  if (!email) {
    emailtext.innerText = "아이디를 입력해주세요";
  }
  if (!pw) {
    passtext.innerText = "비밀번호를 입력해주세요";
  }

  // 로그인 요청
  await axios.post("/login", { email, password:pw }).then((result) => {
    // 토큰이 있을 경우
    if (result.data.result) {
      alert("로그인 성공, 토큰 발급됨");
      verifylogin(result.data.token);
      console.log("토큰 :", result.data.token);
      window.location.href = "/"; // 페이지 새로고침
    } else {
      alert(`로그인 실패: ${result.data.message}`);
    }
  });
};

// 로그인 검증 요청
const verifylogin = async (token) => {
  await axios.post(
    "/verify",
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

const checkemail = () => {
  // 로그인에 입력한 입력값
  const email = document.getElementById("email").value;
  if (email) {
    emailtext.innerText = "";
  }
};

const checkpw = () => {
  // 로그인에 입력한 입력값
  const pw = document.getElementById("pw").value;

  if (pw) {
    passtext.innerText = "";
  }
};
