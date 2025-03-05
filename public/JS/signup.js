const checkemail = document.querySelector(".checkemail");
const checkemail2 = document.querySelector(".checkemail2");
const pass = document.getElementById("pw");
let isPostcodeOpen = false; // 주소 검색 창 상태 변수
let duplecheck = false; // 중복확인

// 이메일 유효성 검사
// const emailValidCheck = () => {
//   const pattern = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/;

//   if (pattern.test(document.getElementById("email").value) === false) {
//     return false;
//   } else {
//     return true;
//   }
// };

// 주소 검색 창에서 주소 선택 시
const changeInputText = () => {
  if (isPostcodeOpen) return; // 이미 떠 있으면 실행하지 않음

  isPostcodeOpen = true; // 창이 열림 상태로 변경
  const width = 500; //팝업의 너비
  const height = 600; //팝업의 높이
  new daum.Postcode({
    width: width,
    height: height,
    theme: {
      searchBgColor: "#0B65C8", //검색창 배경색
      queryTextColor: "#FFFFFF", //검색창 글자색
    },
    oncomplete: (data) => {
      document.getElementById("address").value = data.address; // 선택한 주소
      isPostcodeOpen = false; // 창이 닫히면 상태 업데이트
    },
    onclose: () => {
      isPostcodeOpen = false; // 사용자가 닫았을 때 상태 업데이트
    },
  }).open({
    left: window.screen.width / 2 - width / 2,
    top: window.screen.height / 2 - height / 2,
  });
};

// 비밀번호 보이기
const togglePassword = () => {
  const passwordField = document.getElementById("pw");
  const toggleIcon = document.querySelector(".toggle-password");
  passwordField.type = passwordField.type === "password" ? "text" : "password";
  toggleIcon.src =
    toggleIcon.src === "http://localhost:3000/public/image/visibilityoff.svg"
      ? "/public/image/visibility.svg"
      : "/public/image/visibilityoff.svg";
};

// 이메일 중복 확인
document.querySelector(".checkbtn").addEventListener("click", () => {
  duplecheck = true;
  // 백엔드에 요청
});

// 이메일 빈값 확인
const checke = () => {
  if (emailinput.value.length === 0) {
    checkemail.innerHTML = ``;
    checkemail2.innerHTML = ``;
    duplecheck = false;
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

// 비밀번호 유효성 확인
const checkPw = () => {
  let reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
  const checkpw = document.querySelector(".checkpw");

  if (reg.test(pass.value)) {
    checkpw.innerHTML = ``;
  } else if (pass.value.length === 0) {
    checkpw.innerHTML = ``;
  } else {
    checkpw.innerHTML = `비밀번호는 8자 이상이어야 하며, 숫자/대문자/소문자/특수문자를 모두 포함해야 합니다.`;
  }
};

document.getElementById("phone").addEventListener("input", function (event) {
  let value = event.target.value.replace(/[^0-9]/g, ""); // 숫자만 입력 가능
  if (value.length > 11) value = value.substring(0, 11); // 최대 11자리 제한 (하이픈 제외)

  // 자동 하이픈 추가
  if (value.length >= 8) {
    event.target.value = value.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  } else if (value.length >= 4) {
    event.target.value = value.replace(/(\d{3})(\d{1,4})/, "$1-$2");
  } else {
    event.target.value = value;
  }
});

let phoneRegex = /^01[016789]-\d{3,4}-\d{4}$/;
let errorMsg = document.getElementById("checkphone");
let phoneInput = document.getElementById("phone");

document.getElementById("phone").addEventListener("input", () => {
  if (!phoneRegex.test(phoneInput.value)) {
    if (phoneInput.value === "") {
      errorMsg.textContent = "";
    } else {
      errorMsg.textContent = "올바른 휴대폰 번호를 입력해주세요.";
    }
  } else {
    errorMsg.textContent = "";
  }
});
