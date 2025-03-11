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
        console.log("실패");
      }
    });
  } catch (e) {
    console.log("로그인 상태 확인 실패:", e);
    sessionStorage.setItem("openModal", "true"); // 세션 스토리지에 저장
    window.location.href = "http://localhost:3000/";
  }
};

// 페이지 로드 후 로그인 상태 확인
document.addEventListener("DOMContentLoaded", checkLoginStatus);

const verifylogin = async (token) => {
  await axios({
    headers: { Authorization: `Bearer ${token}` },
    method: "post",
    url: "/verify",
  })
    .then((res) => {
      if (res.data.result) {
        document.querySelector(".loginbox").innerHTML = `
        <div class="login-nick" onclick="OpenMySet()">
          ${res.data.user.nickname}<img src="/public/image/login.svg">
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

// 로그아웃 함수
const logout = async () => {
  // 서버에서 쿠키 삭제 요청
  try {
    await axios({
      method: "post",
      url: "logout",
    })
      .then((res) => {
        if (res.data.result === true) {
          localStorage.setItem("login", false);
          sessionStorage.removeItem("reloaded");
          document.querySelector(".loginbox").innerHTML = `
          <div class="loginicon" onclick="loginModal()">로그인</div>`;
          window.location.href = "http://localhost:3000/";
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
const OpenMySet = () => {
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
