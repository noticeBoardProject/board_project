const clip = () => {
  //현재 url 변수
  let nowUrl = window.location.href;
  try {
    navigator.clipboard.writeText(nowUrl).then((res) => {
      alert("URL이 클립보드에 복사되었습니다.");
    });
  } catch {
    alert("주소가 복사에 실패하였습니다.");
  }
};
