const passCheck = document.querySelector(".passCheck");
const changebtn = document.querySelector(".changebtn");
const password = document.getElementById("password");
let passwordCheck = document.getElementById("passwordCheck");
let readyPass = [1, 1];

// JWT 토큰 가져오기 (쿠키에서 추출)
const getToken = () => {
  const cookies = document.cookie.split(";");
  const tokenCookie = cookies.find((item) => item.trim().startsWith("token="));

  return tokenCookie;
};

// DB에서 내 정보 가져오기
const getUserInfo = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "/mypage/info",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    // console.log("가져온 정보:", res.data);

    if (res.data.result) {
      // 정보가 있을 경우
      const user = res.data.user;

      document.getElementById("email").value = user.email;
      document.getElementById("username").value = user.username;
      document.getElementById("nickname").value = user.nickname;
      document.getElementById("address").value = user.address;
      document.getElementById("phone").value = user.phone;

      // 성별 선택
      if (user.gender === "male") {
        document.getElementById("gender-male").checked = true;
      } else if (user.gender === "female") {
        document.getElementById("gender-female").checked = true;
      }
    } else {
      alert("내 정보를 불러오는데 실패했습니다.");
    }
  } catch (error) {
    console.error("내 정보 불러오기 오류:", error);
  }
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

// 회원 정보 수정 요청
document
  .getElementById("mypage-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault(); // 기본 폼 제출 방지

    const updateUser = {
      password: document.getElementById("password").value,
      username: document.getElementById("username").value,
      nickname: document.getElementById("nickname").value,
      address: document.getElementById("address").value,
      phone: document.getElementById("phone").value,
    };

    try {
      const res = await axios({
        method: "PATCH",
        url: "/mypage/update",
        data: updateUser,
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      console.log("업데이트할 내용:", res);

      alert("내 정보를 업데이트 했습니다.");
    } catch (error) {
      console.log("정보 업데이트 오류", error);
    }
  });

// 페이지 로드 시 내 정보 불러오기
getUserInfo();
