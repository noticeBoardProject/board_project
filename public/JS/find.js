const emailForm = document.getElementById("findEmail-form");
const passwordForm = document.getElementById("resetPassword-form");

// 아이디 찾기 요청
emailForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const phone = document.getElementById("phone").value;

  try {
    const res = await axios({
      method: "POST",
      url: "/findEmail",
      data: { username, phone },
    });
    username.value = "";
    phone.value = "";
    document.getElementById("emailFind").innerHTML = res.data.message;
  } catch (error) {
    console.log("아이디 찾기 중 오류 발생:", error);
    document.getElementById("emailFind").innerHTML = "아이디 찾기 실패";
  }
});

// 비밀번호 재발급 요청
passwordForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const username = document.getElementById("username2").value;
  const email = document.getElementById("email").value;

  try {
    const res = await axios({
      method: "POST",
      url: "/resetPassword",
      data: { username, email },
    });
    document.getElementById("passwordResult").innerHTML = res.data.message;
  } catch (error) {
    console.log("비밀번호 재발급 중 오류 발생:", error);
    document.getElementById("passwordResult").innerHTML =
      "비밀번호 재발급 실패";
  }
});

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
