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
  await axios.post("/login", { email, pw }).then((result) => {
    if (result.data.result) {
      // // 쿠키에서 토큰 추출하기
      // const cookies = document.cookie.split(";");
      // const tokenCookie = cookies.find((item) =>
      //   item.trim().startsWith("token=")
      // );
      // if (!tokenCookie) {
      //   alert("오류");
      // }
      // // 토큰 값만 추출(token= 부분 제거)
      // const token = tokenCookie.trim().substring(6);
      verifylogin(result.data.token);
      // window.location.href = "/";
    } else {
      alert(result.data.message);
    }
  });
};

const verifylogin = async (token) => {
  await axios.post(
    "/verify",
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (res.data.result) {
    alert(res.data.result, "성공");

    // data = `<button type="button" onClick="logout()">로그아웃</button>
    // <div>${res.data.name}님 환영합니다.</div><br>
    //   <button onClick="chat()">채팅</button>
    // `;
  }
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
