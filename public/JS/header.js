// 잘못된 값 입력시 안내
const emailtext = document.querySelector(".emailtext");
const passtext = document.querySelector(".passtext");

const search = document.getElementById("search");
const deletebtn = document.querySelector(".deltebtn");

window.addEventListener("DOMContentLoaded", () => {
  if (sessionStorage.getItem("openModal") === "true") {
    document.querySelector(".loginicon").click(); // 모달 열기
    sessionStorage.removeItem("openModal"); // 값 삭제
  }
});

// 로그인창 띄우기
const loginModal = () => {
  const modal = document.querySelector(".form-login-box");
  const overlay = document.querySelector(".modal-overlay");
  const closeBtn = document.querySelector(".close-btn");

  // 모달 열기
  modal.classList.remove("closing"); // 닫기 애니메이션 클래스 제거
  modal.classList.add("active");
  overlay.classList.add("active");

  // 모달 닫기 (X 버튼)
  closeBtn.addEventListener("click", function () {
    modal.classList.add("closing"); // 닫기 애니메이션 추가
    overlay.classList.remove("active");
    emailtext.innerText = "";
    passtext.innerText = "";

    // 애니메이션이 끝난 후 숨김 처리
    setTimeout(() => {
      modal.classList.remove("active");
      modal.classList.remove("closing");
    }, 300); // CSS 애니메이션 시간(0.3초)과 동일하게 설정
  });
};

// 검색창 띄우기
const searchModal = () => {
  const modal = document.querySelector(".search-wrap");
  const overlay = document.querySelector(".modal-overlay");
  const closeBtn = document.querySelector(".close");

  // 모달 열기
  modal.classList.remove("closing");
  modal.classList.add("active");
  overlay.classList.add("active");

  // 모달 닫기 (X 버튼)
  closeBtn.addEventListener("click", function () {
    modal.classList.add("closing");
    overlay.classList.remove("active");
    search.innerText = "";

    setTimeout(() => {
      modal.classList.remove("active");
      modal.classList.remove("closing");
    }, 300);
  });
};

// 검색 실시간 확인
const checkSearch = () => {
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

const login = async (event) => {
  event.preventDefault();
  // 로그인에 입력한 입력값
  const email = document.getElementById("email").value;
  const pw = document.getElementById("pw").value;
  const stayLogin = document.getElementById("stayLogin").checked; //false,true

  // 유효성 검사
  if (!email || !pw) {
    if (!email) {
      emailtext.innerText = "아이디를 입력해주세요";
    }
    if (!pw) {
      passtext.innerText = "비밀번호를 입력해주세요";
    }
    return;
  }
  // , stayLogin
  // 로그인 요청
  await axios({
    method: "post",
    url: "/login",
    data: { email, password: pw },
  })
    .then((res) => {
      // 토큰이 있을 경우
      if (res.data.result) {
        alert("로그인 성공, 토큰 발급됨");
        verifylogin(res.data.token);
        console.log("토큰 :", res.data.token);
        document.querySelector(".close-btn").click();
      } else {
        alert(`로그인 실패: ${res.data.message}`);
      }
    })
    .catch((e) => {
      console.log(e, ":로그인 요청 실패");
    });
};

const verifylogin = async (token) => {
  await axios({
    headers: { Authorization: `Bearer ${token}` },
    method: "post",
    url: "/verify",
  })
    .then((res) => {
      if (res.data.result) {
        // innerHTML로 해당 사람의 닉네임 넣기
        document.querySelector(".loginbox").innerHTML = `
        <div class="login-nick" onclick="mySet()">
          <img src="/public/image/login.svg">${res.data.user.nickname}<div class="usernick">님</div>
          <img src="/public/image/arrowdrop.svg">
        </div>
        <div class="login-home">
          <div class="login-homebox">
            <div class="myInfobtn">
              <img src="/public/image/setting.svg" alt="myInfo" />내 정보
            </div>
            <div class="logoutbtn" onclick="logout()">
              <img src="/public/image/logout.svg" alt="logout" />로그아웃
            </div>
          </div>
        </div>`;
      }
    })
    .catch((e) => {
      console.log(e, ":검증 요청 실패");
    });
};

const checkpw = () => {
  // 로그인에 입력한 입력값
  const pw = document.getElementById("pw").value;
  if (pw) {
    passtext.innerText = "";
  }
};

// 이메일 유효성 검사
const emailValidCheck = () => {
  const checkemail1 = document.querySelector(".emailtext");
  const pattern = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/;
  const emailinput = document.getElementById("email").value;
  if (pattern.test(emailinput) === false) {
    checkemail1.innerText = "올바른 메일 형식으로 입력해주세요";
  } else {
    checkemail1.innerText = "";
  }

  if (emailinput.length === 0) {
    checkemail1.innerText = ``;
  }
};

// 로그아웃 함수
const logout = () => {
  document.querySelector(
    ".loginbox"
  ).innerHTML = `<div class="loginicon" onclick="loginModal()">로그인</div>`;

  // 쿠키 삭제
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  // 페이지 새로 고침
  window.location.reload();
};

const mySet = () => {
  const home = document.querySelector(".login-home");

  if (home.style.display === "block") {
    home.style.display = "none";
  } else {
    home.style.display = "block";
  }
};

// 다른 부분을 누르면 없어지도록
// document.addEventListener("click", (e) => {
//   const home = document.querySelector(".login-home");
//   const nickButton = document.querySelector(".login-nick");

//   if (!home.contains(e.target) && e.target !== nickButton) {
//     home.style.display = "none";
//   }
// });

// try {
//   // 쿠키에서 토큰 추출하기
//   const cookies = document.cookie.split(";");
//   const tokenCookie = cookies.find((item) => item.trim().startsWith("token="));

//   if (!tokenCookie) {
//     // 토큰이 없으면 로그인 링크 표시
//     document.querySelector(
//       ".loginbox"
//     ).innerHTML = `<div class="loginicon" onclick="loginModal()">
//           로그인
//         </div>`;
//   } else {
//     // 토큰 값만 추출(token= 부분 제거)
//     const token = tokenCookie.trim().substring(6);
//     verifylogin(token);
//   }
// } catch (error) {
//   console.error("Authentication error:", error);
//   info.innerHTML = `<p>인증 오류가 발생했습니다.</p><a href="/login">로그인</a>`;
// }
