// JWT 토큰 가져오기 (쿠키에서 추출)
const getToken = () => {
    const cookies = document.cookie.split(";");
    const tokenCookie = cookies.find((item) =>
      item.trim().startsWith("token=")
    );

    return tokenCookie;
};
  
// DB에서 내 정보 가져오기
const getUserInfo = async () => {
    try {
        const res = await axios({
            method: "GET",
            url: "/mypage/info",
            headers: {Authorization: `Bearer ${getToken()}`}
        });
        // console.log("가져온 정보:", res.data);

        if (res.data.result) { // 정보가 있을 경우
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

// 회원 정보 수정 요청
document.getElementById("mypage-form").addEventListener("submit", async (event) => {
  event.preventDefault(); // 기본 폼 제출 방지

  const updateUser = {
    password: document.getElementById("password").value,
    username: document.getElementById("username").value,
    nickname: document.getElementById("nickname").value,
    address: document.getElementById("address").value,
    phone: document.getElementById("phone").value
  };

  try {
    const res = await axios({
      method: "PATCH",
      url: "/mypage/update",
      data: updateUser,
      headers: {Authorization: `Bearer ${getToken()}`}
    })

    console.log("업데이트할 내용:", res);
    alert("내 정보를 업데이트 했습니다.");

  } catch (error) {
    console.log("정보 업데이트 오류", error);
  }
});

// 페이지 로드 시 내 정보 불러오기
getUserInfo();