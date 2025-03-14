const passCheck = document.querySelector(".passCheck");
const changebtn = document.querySelector(".changebtn");
const password = document.getElementById("password");
let passwordCheck = document.getElementById("passwordCheck");
let readyPass = [1, 1];

const cate1 = document.querySelector(".cate1");
const cate2 = document.querySelector(".cate2");
const myProfile = document.querySelector(".myProfile");
const editMyInfo = document.querySelector(".editMyInfo");

cate1.addEventListener("click", () => {
  cate2.classList.remove("actives");
  cate1.classList.add("actives");
  myProfile.style.display = "block";
  editMyInfo.style.display = "none";
});
cate2.addEventListener("click", () => {
  cate1.classList.remove("actives");
  cate2.classList.add("actives");
  editMyInfo.style.display = "block";
  myProfile.style.display = "none";
});

// JWT 토큰 가져오기 (쿠키에서 추출)
const getToken = () => {
  const cookies = document.cookie.split(";");
  const tokenCookie = cookies.find((item) => item.trim().startsWith("token="));

  return tokenCookie;
};

// 비밀번호 유효성 확인
const checkPw = () => {
  let reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
  const pass = document.querySelector(".pass");
  readyPass[1] = 0;

  if (reg.test(password.value)) {
    readyPass[0] = 1;
    pass.innerHTML = ``;
    if (password.value === passwordCheck.value) {
      readyPass[0] = 1;
      readyPass[1] = 1;
    }
  } else if (password.value.length === 0) {
    readyPass[0] = 1;
    pass.innerHTML = ``;
  } else {
    readyPass[0] = 0;
    pass.innerHTML = `비밀번호는 8자 이상이어야 하며, 숫자/대문자/소문자/특수문자를 모두 포함해야 합니다.`;
  }
  checkWrite();
};

// 비밀번호 같은지 확인
const checkSame = () => {
  if (password.value !== passwordCheck.value) {
    readyPass[1] = 0;
    passCheck.innerHTML = `비밀번호를 다시 확인해주세요.`;
    if (passwordCheck.value.length === 0) {
      passCheck.innerHTML = ``;
    }
  } else {
    readyPass[1] = 1;
    passCheck.innerHTML = ``;
  }
  checkWrite();
};

// 비밀번호를 입력했다면 잘 작성했는지 확인해서 버튼 비활성화/활성화
const checkWrite = () => {
  const count = readyPass.filter((x) => x === 1);
  if (count.length === 2) {
    changebtn.disabled = false;
  } else {
    changebtn.disabled = true;
  }
};

// '출생 연도' 셀렉트 박스 option 목록 동적 생성
const birthYearEl = document.querySelector("#birth-year");
const birthMonthEl = document.querySelector("#birth-month");
const birthDayEl = document.querySelector("#birth-day");
// option 목록 생성 여부 확인
isYearOptionExisted = false;
isMonthOptionExisted = false;
isDayOptionExisted = false;

// 연도
birthYearEl.addEventListener("focus", function () {
  // year 목록 생성되지 않았을 때 (최초 클릭 시)
  if (!isYearOptionExisted) {
    isYearOptionExisted = true;
    for (var i = 1940; i <= 2025; i++) {
      // option element 생성
      birthYearEl.innerHTML += `<option value=${i}>${i}</option>`;
    }
  }
});

// 월
birthMonthEl.addEventListener("focus", function () {
  // month 목록 생성되지 않았을 때 (최초 클릭 시)
  if (!isMonthOptionExisted) {
    isMonthOptionExisted = true;
    for (var i = 1; i <= 12; i++) {
      // option element 생성
      birthMonthEl.innerHTML += `<option value=${i}>${i}</option>`;
    }
  }
});

// 일
birthDayEl.addEventListener("focus", function () {
  // day 목록 생성되지 않았을 때 (최초 클릭 시)
  if (!isDayOptionExisted) {
    isDayOptionExisted = true;
    for (var i = 1; i <= 31; i++) {
      // option element 생성
      birthDayEl.innerHTML += `<option value=${i}>${i}</option>`;
    }
  }
});

// 회원 정보 수정 요청
const mypageForm = document.getElementById("mypage-form");
mypageForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // 기본 폼 제출 방지

  const birthYear = document.getElementById("birth-year").value;
  const birthMonth = document
    .getElementById("birth-month")
    .value.padStart(2, "0");
  const birthDay = document.getElementById("birth-day").value.padStart(2, "0");
  const birthdate = `${birthYear}-${birthMonth}-${birthDay}`;

  const updateUser = {
    password: document.getElementById("password").value,
    address: document.getElementById("address").value,
    gender: document.querySelector('input[name="gender"]:checked').value,
    birthdate,
  };

  try {
    const res = await axios({
      method: "PATCH",
      url: "/mypage/update",
      data: updateUser,
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    // console.log("업데이트할 내용:", res);
    alert("내 정보를 업데이트 했습니다.");
  } catch (error) {
    console.log("정보 업데이트 오류", error);
  }
});

//회원탈퇴
const deleteMember = () => {
  Swal.fire({
    title: "탈퇴하시면 지금까지 작성한 게시물과 좋아요가 다 삭제됩니다.",
    text: "그래도 탈퇴하시겠습니까?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "네",
    cancelButtonText: "아니요",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await axios.delete("/delete/member");
        Swal.fire({
          title: "탈퇴 완료",
          text: "그동안 이용해주셔서 감사합니다.",
          icon: "success",
        });
        console.log("회원탈퇴", response.data);
      } catch (e) {
        console.log("회원탈퇴 실패", e);
      }
    }
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
