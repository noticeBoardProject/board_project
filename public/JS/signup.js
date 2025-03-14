const checkemail1 = document.querySelector(".checkemail");
const checkemail2 = document.querySelector(".checkemail2");
const checknick = document.querySelector(".checknick");
const checknick2 = document.querySelector(".checknick2");
const pass = document.getElementById("pws");
let duplecheck = false; // 이메일 중복확인
let rightEmailCheck = false;
let duplecheckNick = false; // 닉네임 중복확인
let rightNickCheck = false;
let emailcontent = "";
let nickcontent = "";
let binCheck = [0, 0, 0, 0];

// 이메일 유효성 검사
const emailValidCheck = () => {
  duplecheck = false;
  const pattern = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/;
  const emailinput = document.getElementById("email").value;
  if (emailcontent.length !== emailinput.length) {
    checkemail2.innerText = ``;
  }
  if (pattern.test(emailinput) === false) {
    checkemail1.innerText = "올바른 메일 형식으로 입력해주세요";
    rightEmailCheck = false;
  } else {
    checkemail1.innerText = "";
    rightEmailCheck = true;
  }

  if (emailinput.length === 0) {
    checkemail1.innerText = ``;
    checkemail2.innerText = ``;
    rightEmailCheck = false;
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

// 비밀번호 유효성 확인
const checkPw = () => {
  let reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
  const checkpw = document.querySelector(".checkpw");

  if (reg.test(pass.value)) {
    checkpw.innerHTML = ``;
    binCheck[0] = 1;
  } else if (pass.value.length === 0) {
    checkpw.innerHTML = ``;
    binCheck[0] = 0;
  } else {
    checkpw.innerHTML = `비밀번호는 8자 이상이어야 하며, 숫자/대문자/소문자/특수문자를 모두 포함해야 합니다.`;
    binCheck[0] = 0;
  }
  checkWrite();
};

// 비밀번호 같은지 확인
const checkSame = () => {
  let passcheck = document.getElementById("passcheck");
  let checkpw2 = document.querySelector(".checkpw2");
  if (pass.value !== passcheck.value) {
    checkpw2.innerHTML = `비밀번호를 다시 확인해주세요.`;
    if (passcheck.value.length === 0) {
      checkpw2.innerHTML = ``;
    }
    binCheck[1] = 0;
  } else {
    checkpw2.innerHTML = ``;
    binCheck[1] = 1;
  }
  checkWrite();
};

// 이름 빈값 확인
const checkname = () => {
  const name = document.getElementById("name");

  if (name.value.length === 0) {
    binCheck[2] = 0;
  } else {
    binCheck[2] = 1;
  }
  checkWrite();
};

// 휴대폰 유효성 검사
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

// 휴대폰 번호
document.getElementById("phone").addEventListener("input", () => {
  let phoneRegex = /^01[016789]-\d{3,4}-\d{4}$/;
  let errorMsg = document.getElementById("checkphone");
  let phoneInput = document.getElementById("phone");

  if (!phoneRegex.test(phoneInput.value)) {
    if (phoneInput.value === "") {
      errorMsg.textContent = "";
    } else {
      errorMsg.textContent = "올바른 휴대폰 번호를 입력해주세요.";
    }
    binCheck[3] = 0;
  } else {
    errorMsg.textContent = "";
    binCheck[3] = 1;
  }
  checkWrite();
});

// 닉네임 검사
const nickValidCheck = () => {
  duplecheckNick = false;
  const nickname = document.getElementById("nickname").value;
  const engPattern = /^[A-Za-z]{1,12}$/; // 영문 최대 12자
  const korPattern = /^[가-힣]{1,6}$/; // 한글 최대 6자
  if (nickcontent.length !== nickname) {
    checknick2.innerText = ``;
  }
  if (engPattern.test(nickname) || korPattern.test(nickname)) {
    checknick.innerText = "";
    rightNickCheck = true;
  } else {
    checknick.innerText =
      "닉네임은 특수문자/공백 사용불가입니다(최대 글자수: 영문, 한글 포함 12자)";
    if (nickname.length === 0) {
      checknick.innerText = "";
      checknick2.innerText = "";
    }
    rightNickCheck = false;
  }
};

// 아이디(이메일) 중복 체크
const emailDupleCheck = async () => {
  const mainForm = document.mainForm;
  const email = mainForm.email.value;
  emailcontent = email; //값저장
  if (rightEmailCheck) {
    await axios({
      method: "get",
      url: "/DupleCheck/email",
      params: { email },
    })
      .then((res) => {
        // console.log("이메일 중복 체크 응답:", res.data);
        if (!res.data.result) {
          checkemail1.innerHTML = "중복된 아이디입니다.";
          checkemail2.innerHTML = "";
        } else {
          checkemail2.innerHTML = "사용 가능한 아이디입니다.";
          checkemail1.innerHTML = "";
          duplecheck = true;
        }
      })
      .catch((e) => {
        console.log("중복 요청 실패");
      });
  } else {
    if (email.length === 0) {
      checkemail1.innerText = `아이디를 입력해주세요.`;
    } else if (rightEmailCheck === false) {
      checkemail1.innerText = "올바른 메일 형식으로 입력해주세요";
    }
  }
};

// 다 썼는지 확인해서 버튼 비활성화/활성화
const checkWrite = () => {
  const count = binCheck.filter((x) => x === 1);
  if (count.length === 4) {
    document.querySelector(".signupbtn").disabled = false;
  } else {
    document.querySelector(".signupbtn").disabled = true;
  }
};

// 닉네임 중복 체크
const nickDupleCheck = async () => {
  const mainForm = document.mainForm;
  const nickname = mainForm.nickname.value;
  nickcontent = nickname; //내용저장
  if (rightNickCheck) {
    await axios({
      method: "get",
      url: "/DupleCheck/nickname",
      params: { nickname },
    })
      .then((res) => {
        if (!res.data.result) {
          checknick.innerHTML = "중복된 닉네임입니다.";
          checknick2.innerHTML = "";
        } else {
          checknick2.innerHTML = "사용 가능한 닉네임입니다.";
          checknick.innerHTML = "";
          duplecheckNick = true;
        }
      })
      .catch((e) => {
        console.log("중복 요청 실패");
      });
  } else {
    if (nickname.length === 0) {
      checknick.innerText = `닉네임을 입력해주세요.`;
    } else if (rightNickCheck === false) {
      checknick.innerText =
        "닉네임은 특수문자/공백 사용불가입니다(최대 글자수: 영문, 한글 포함 12자)";
    }
  }
};

// 회원가입
const signup = async () => {
  if (duplecheckNick && duplecheck) {
    // 입력값 가져오기
    const mainForm = document.mainForm;

    const birthYear = mainForm.birth1.value; // 연도
    const birthMonth = mainForm.birth2.value.padStart(2, "0"); // 월 (한 자리 수일 경우 0 추가)
    const birthDay = mainForm.birth3.value.padStart(2, "0"); // 일 (한 자리 수일 경우 0 추가)

    let birth = null;
    if (birthYear && birthMonth && birthDay) {
      birth = `${birthYear}-${birthMonth}-${birthDay}`; // YYYY-MM-DD 형식으로 합치기

      const dateCheck = new Date(birth);
      if (Number.isNaN(dateCheck.getTime())) {
        // 잘못된 날짜일 경우
        birth = null;
      }
    }

    const email = mainForm.email.value;
    const pw = mainForm.pw.value;
    const username = mainForm.name.value;
    const nickname = mainForm.nickname.value;
    const address = mainForm.address.value;
    const gender = mainForm.gender.value;
    const phone = mainForm.phone.value;
    // const phone = phones.replace(/-/g, "");

    // 회원가입 요청
    await axios({
      method: "post",
      url: "/signup",
      data: {
        email,
        password: pw,
        username,
        nickname,
        address,
        gender,
        birth,
        phone,
      },
    })
      .then((res) => {
        if (res.data.result) {
          sessionStorage.setItem("openModal", "true"); // 세션 스토리지에 저장
          window.location.href = "http://localhost:3000/";
        } else {
          alert(`회원가입 실패: ${res.data.message}`);
        }
      })
      .catch((error) => {
        console.log("회원가입 중 오류 발생", error);
      });
  } else {
    if (!duplecheckNick) {
      checknick.innerText = "중복검사가 필요합니다.";
    }
    if (!duplecheck) {
      checkemail1.innerText = "중복검사가 필요합니다.";
    }
  }
};

document.querySelector("form").addEventListener("submit", function (event) {
  event.preventDefault();
  signup();
});
