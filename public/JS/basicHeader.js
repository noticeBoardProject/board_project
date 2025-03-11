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
        console.log("로그인하지 않음");
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
            <a href="/mywrite">
              <div class="mywritebtn">
                <img src="/public/image/mywrite.svg" alt="mywrite" />내 글
              </div>
            </a>
            <a href="/mylike">
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

const loginModal = () => {
  sessionStorage.setItem("openModal", true);
  window.location.href = "http://localhost:3000/";
};

// 글쓰기랑 수정페이지에 쓸js
// 제목
const titleValue = document.getElementById("title");

// 카테고리
let selectValue;

// 파일
const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");

// 셀렉트 박스 바뀐 값 확인
const changeSelect = () => {
  document.querySelector(".cateinfo").innerText = "";
  const category = document.getElementById("category");
  selectValue = category.options[category.selectedIndex].value;
};

// 토스트 에디터
const editor = new toastui.Editor({
  el: document.querySelector("#content"),
  height: "500px",
  initialEditType: "markdown",
  placeholder: "내용을 입력해 주세요.",
  previewStyle: "vertical",
});

// 선택한 파일을 저장할 배열
let selectedFiles = [];

const selectFile = (event) => {
  // 선택한 파일들을 배열로 변환
  const files = Array.from(event.target.files);

  files.forEach((file) => {
    if (selectedFiles.length < 3) {
      selectedFiles.push(file);
    }
  });

  updatePreview();

  // 3개 선택 시 파일 추가 버튼 숨기기
  if (selectedFiles.length >= 3) {
    document.querySelector(".btn-upload").style.display = "none";
  }
  fileInput.value = ""; // 선택된 파일 초기화
};

fileInput.addEventListener("change", selectFile);

// 미리보기 업데이트
const updatePreview = () => {
  fileList.innerHTML = ""; // 기존 미리보기 초기화

  selectedFiles.forEach((file, index) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      fileList.innerHTML += `
        <div class="image-wrapper">
          <img class="preview-image" id="image${index}" src=${e.target.result} />
          <button class="remove-btn" onclick="removeFile(${index})">X</button>
        </div>`;
    };

    reader.readAsDataURL(file);
  });
};

// 선택한 파일 삭제
const removeFile = (index) => {
  // 배열에서 파일 삭제
  selectedFiles.splice(index, 1);

  updatePreview();

  // 파일이 3개 미만이면 다시 파일 추가 버튼 보이기
  if (selectedFiles.length < 3) {
    document.querySelector(".btn-upload").style.display = "block";
  }
};

const checktitle = () => {
  if (titleValue.value) {
    titleValue.classList.remove("infoColor");
  }
};
