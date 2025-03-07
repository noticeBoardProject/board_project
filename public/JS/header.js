// 잘못된 값 입력시 안내
const emailtext = document.querySelector(".emailtext");
const passtext = document.querySelector(".passtext");

const search = document.getElementById("search");
const deletebtn = document.querySelector(".deltebtn");

const navItems = document.querySelectorAll(".cate");

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

// 페이지 로드 시 저장된 카테고리 불러오기
document.addEventListener("DOMContentLoaded", () => {
  const savedCategory = localStorage.getItem("selectedCategory");
  if (savedCategory) {
    navItems.forEach((item) => item.classList.remove("actives"));
    const activeItem = document.getElementById(savedCategory);
    if (activeItem) {
      activeItem.classList.add("actives");
    }
  }
});

// 네비게이션 활성화
navItems.forEach((item) => {
  item.addEventListener("click", () => {
    navItems.forEach((i) => i.classList.remove("actives"));
    item.classList.add("actives");

    // 선택한 카테고리를 localStorage에 저장
    localStorage.setItem("selectedCategory", item.id);

    // 이벤트 발생시킴
    window.dispatchEvent(new Event("categoryChange"));
  });
});

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

  // 로그인 요청
  await axios({
    method: "post",
    url: "/login",
    data: { email, password: pw, stayLogin },
  })
    .then((res) => {
      // 토큰이 있을 경우
      if (res.data.result) {
        alert("로그인 성공, 토큰 발급됨");
        // 로그인 상태 유지 체크 시 7일, 아니면 1일 유지
        const maxAge = stayLogin ? 60 * 60 * 24 * 7 : 60 * 60 * 24;
        document.cookie = `token=${res.data.token}; path=/; max-age=${maxAge}; Secure`;
        verifylogin(res.data.token);
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
            <a href="/mypage">
              <div class="myInfobtn">
                <img src="/public/image/setting.svg" alt="myInfo" />내 정보
              </div>
            </a>
            <div>
              <img src="/public/image/logout.svg" alt="write" />내 글
            </div>
            <div>
              <img src="/public/image/logout.svg" alt="like" />좋아요
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

// 새로고침 후 JWT 쿠키를 확인하여 로그인 상태 유지
const checkLoginStatus = async () => {
  try {
    await axios({
      method: "get",
      url: "/verify",
      withCredentials: true,
    }).then((res) => {
      if (res.data.result) {
        verifylogin(res.data.token);
      } else {
        document.querySelector(".loginbox").innerHTML = `
          <div class="loginicon" onclick="loginModal()">로그인</div>`;
      }
    });
  } catch (e) {
    console.log("로그인 상태 확인 실패:", e);
    document.querySelector(".loginbox").innerHTML = `
      <div class="loginicon" onclick="loginModal()">로그인</div>`;
  }
};

// 페이지 로드 후 로그인 상태 확인
document.addEventListener("DOMContentLoaded", checkLoginStatus);

// 로그아웃 함수
const logout = async () => {
  // 서버에서 쿠키 삭제 요청
  try {
    await axios({
      method: "post",
      url: "logout",
      withCredentials: true,
    })
      .then((res) => {
        if (res.data.result === true) {
          document.querySelector(".loginbox").innerHTML = `
          <div class="loginicon" onclick="loginModal()">로그인</div>`;
          alert("로그아웃 되었습니다.");
        }
      })
      .catch((e) => {
        console.log("쿠키삭제 실패:", e);
      });
  } catch (e) {
    console.log("로그아웃 실패:", e);
  }
};

// 내 정보나 로그아웃 볼 수 있는 모달
const mySet = () => {
  const home = document.querySelector(".login-home");

  if (home.style.display === "block") {
    home.style.display = "none";
  } else {
    home.style.display = "block";
  }
};

// 다른 부분을 누르면 없어지도록
const observer = new MutationObserver(() => {
  const home = document.querySelector(".login-home");
  const nickButton = document.querySelector(".login-nick");

  if (home && nickButton) {
    document.addEventListener("click", (e) => {
      if (!home.contains(e.target) && e.target !== nickButton) {
        home.style.display = "none";
      }
    });
    observer.disconnect();
  }
});

observer.observe(document.body, { childList: true, subtree: true });
