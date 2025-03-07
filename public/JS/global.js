const checknick = document.querySelector(".checknick");
const checknick2 = document.querySelector(".checknick2");
let nickcontent = ""; // 닉네임 검사를 하고 바꿨을때 바뀌었는지 체크
let nickname = ""; // 새로 입력한 닉네임
let rightNickCheck = false; //닉네임을 잘 입력했는지 확인
let originNick = ""; //mypage에서 원래 사용하던 닉네임 저장
let change = false; //mypage에서 닉네임을 바꿨는지 확인

// 비밀번호 보이기
const togglePassword = (id, toggle) => {
  const passwordField = document.getElementById(id);
  const toggleIcon = document.querySelector(toggle);
  passwordField.type = passwordField.type === "password" ? "text" : "password";
  toggleIcon.src =
    toggleIcon.src === "http://localhost:3000/public/image/visibilityoff.svg"
      ? "/public/image/visibility.svg"
      : "/public/image/visibilityoff.svg";
};

// 닉네임 검사
const nickValidCheck = () => {
  change = true;
  duplecheckNick = false;
  const nickname = document.getElementById("nickname").value;
  const mixPattern = /^[A-Za-z가-힣]{1,12}$/;
  if (nickcontent.length !== nickname.length) {
    checknick2.innerText = ``;
  }
  if (mixPattern.test(nickname)) {
    checknick.innerText = "";
    rightNickCheck = true;
  } else {
    checknick.innerText =
      "닉네임은 특수문자/공백 사용불가입니다(영문,한글 포함 최대 12자)";
    if (nickname.length === 0) {
      checknick.innerText = "";
      checknick2.innerText = "";
    }
    rightNickCheck = false;
  }
};

// mypage와 회원가입 페이지 구분
const nickDupleCheck = (page) => {
  const mainForm = document.mainForm;
  nickname = mainForm.nickname.value;

  if (page === "mypage") {
    if (change === false) {
      originNick = nickname;
      checknick2.innerHTML = "원래 사용하시던 닉네임입니다.";
    } else {
      if (originNick !== nickname) {
        nickAxios();
      } else {
        checknick2.innerHTML = "원래 사용하시던 닉네임입니다.";
      }
    }
  } else {
    nickAxios();
  }
};

// 닉네임 중복 체크
const nickAxios = async () => {
  nickcontent = nickname; //내용저장
  console.log(nickname);
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
        "닉네임은 특수문자/공백 사용불가입니다(영문,한글 포함 최대 12자)";
    }
  }
};
