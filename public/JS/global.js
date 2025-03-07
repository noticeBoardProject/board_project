let isPostcodeOpen = false; // 주소 검색 창 상태 변수

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
      searchBgColor: "#10c4c4", //검색창 배경색
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
const togglePassword = (id, toggle) => {
  const passwordField = document.getElementById(id);
  const toggleIcon = document.querySelector(toggle);
  passwordField.type = passwordField.type === "password" ? "text" : "password";
  toggleIcon.src =
    toggleIcon.src === "http://localhost:3000/public/image/visibilityoff.svg"
      ? "/public/image/visibility.svg"
      : "/public/image/visibilityoff.svg";
};
