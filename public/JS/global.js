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
