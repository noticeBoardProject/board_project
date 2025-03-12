// 잘못된 값 입력시 안내
const emailtext = document.querySelector(".emailtext");
const passtext = document.querySelector(".passtext");

const search = document.getElementById("search");
const deletebtn = document.querySelector(".deletebtn");

// 카테고리 가져오기
const getCategory = async () => {
  await axios({
    method: "get",
    url: "/board/category",
  })
    .then((res) => {
      if (res.data.result) {
        const categorybox = document.querySelector(".category-box");
        const category = res.data.category;

        categorybox.innerHTML = `<li><div class="cate actives" id="all">전체</div></li>`;

        category
          .sort((a, b) => a.id - b.id) // 오름차순 정렬
          .map((cate) => {
            categorybox.innerHTML += `<li><div class="cate" id="${cate.id}">${cate.name}</div></li>`;
          });

        // 요소가 동적으로 생성된 후 navItems 할당 및 이벤트 추가
        initCategoryEvents();
      } else {
        alert("카테고리 정보를 불러오지 못했습니다.");
      }
    })
    .catch((e) => {
      console.log(e);
    });
};

// 네비게이션 이벤트 바인딩 함수
const initCategoryEvents = () => {
  const navItems = document.querySelectorAll(".cate"); // DOM이 업데이트된 후 요소 선택
  const savedCategory = sessionStorage.getItem("selectedCategory");

  if (savedCategory) {
    navItems.forEach((item) => item.classList.remove("actives"));
    const activeItem = document.getElementById(savedCategory);

    if (activeItem) {
      activeItem.classList.add("actives");
    }
  }

  // 동적으로 생성된 카테고리에 이벤트 리스너 추가
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      navItems.forEach((i) => i.classList.remove("actives"));
      item.classList.add("actives");

      // 선택한 카테고리를 sessionStorage에 저장
      sessionStorage.setItem("selectedCategory", item.id);

      // 이벤트 발생시킴
      window.dispatchEvent(new Event("categoryChange"));
    });
  });
};

// 페이지 로드 시 저장된 카테고리 불러오기
document.addEventListener("DOMContentLoaded", () => {
  getCategory();
});

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
    document.getElementById("search").classList.remove("info");
    modal.classList.add("closing");
    overlay.classList.remove("active");
    search.value = "";

    setTimeout(() => {
      modal.classList.remove("active");
      modal.classList.remove("closing");
    }, 300);
  });
};

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
    method: "post",
    url: "/verify",
  })
    .then((res) => {
      if (res.data.result) {
        // innerHTML로 해당 사람의 닉네임 넣기
        document.querySelector(".loginbox").innerHTML = `
        <div class="login-nick" onclick="OpenMySet()">
          <img src="/public/image/profiles.png">${res.data.user.nickname}<div class="usernick">님</div>
          <img src="/public/image/arrowdrop.svg">
        </div>
        <div class="login-home">
          <div class="login-homebox">
            <a href="/mypage">
              <div class="myInfobtn">
                <img src="/public/image/setting.svg" alt="myInfo" />내 정보
              </div>
            </a>
            <a href="/main/mywrite">
              <div class="mywritebtn">
                <img src="/public/image/mywrite.svg" alt="mywrite" />내 글
              </div>
            </a>
            <a href="/main/mylike">
              <div class="mylikebtn">
                <img src="/public/image/favorite.svg" alt="like" />좋아요
              </div>
            </a>
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
    }).then((res) => {
      if (res.data.result) {
        verifylogin(res.data.token);
        document.querySelector(".write").innerHTML = `
        <a href="/write">
        <div class="writebtn" title="글쓰기">
          <img src="/public/image/pen.svg" alt="글쓰기" />
        </div>
      </a>
    `;
      } else {
        document.querySelector(".loginbox").innerHTML = `
          <div class="loginicon" onclick="loginModal()">로그인</div>`;

        document.querySelector(".write").innerHTML = `
    <div id="writeBtn" class="writebtn" onclick="loginModal()" title="글쓰기">
        <img src="/public/image/pen.svg" alt="글쓰기" />
      </div>
    `;
      }
    });
  } catch (e) {
    console.log("로그인 상태 확인 실패:", e);
    document.querySelector(".loginbox").innerHTML = `
      <div class="loginicon" onclick="loginModal()">로그인</div>`;

    document.querySelector(".write").innerHTML = `
    <div id="writeBtn" class="writebtn" onclick="loginModal()" title="글쓰기">
        <img src="/public/image/pen.svg" alt="글쓰기" />
      </div>
    `;
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
      url: "/logout",
    })
      .then((res) => {
        if (res.data.result === true) {
          document.getElementById("email").value = "";
          document.getElementById("pw").value = "";
          document.querySelector(".loginbox").innerHTML = `
          <div class="loginicon" onclick="loginModal()">로그인</div>`;
          window.location.reload();
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

window.addEventListener("DOMContentLoaded", () => {
  if (sessionStorage.getItem("openModal") === "true") {
    loginModal(); // 모달 열기
    sessionStorage.removeItem("openModal"); // 값 삭제
  }
});

const readyAlert = () => {
  Swal.fire({
    title: "기능 준비중입니다.",
    text: "조금만 기다려주세요",
    icon: "info",
  });
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
