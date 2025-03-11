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

// 좋아요한 게시물인지 확인
window.onload = async () => {
  const boardId = window.boardData.boardId;

  try {
    const response = await axios.get(`/like/status/${boardId}`);
    // 해당 사용자가 좋아요 눌렀는지 확인(true, false)
    let likedByUser = response.data.likedByUser;
    document.querySelector("heart").src = likedByUser
      ? "/public/image/fillheart.svg"
      : "/public/image/binheart.svg";
    if (likedByUser) {
    }
  } catch (error) {
    console.error(error);
  }
};

// 해당 게시판 like 추가 요청(likeCount도 늘어나야함)
const countFavorite = async (boardId) => {
  try {
    // 좋아요 상태 요청
    const response = await axios.get(`/like/status/${boardId}`);
    // 좋아요개수
    let likeCount = response.data.likeCount;
    // 해당 사용자가 좋아요 눌렀는지 확인(true, false)
    let likedByUser = response.data.likedByUser;

    if (likedByUser) {
      // 좋아요 취소
      await axios({
        method: "delete",
        url: "/like/delete",
        data: { boardId },
      }).then((res) => {
        likeCount--;
        likedByUser = false;
      });
    } else {
      // 좋아요 추가
      await axios({
        method: "post",
        url: "/like/post",
        data: { boardId },
      }).then((res) => {
        likeCount++;
        likedByUser = true;
      });
    }

    updateUI(likeCount, likedByUser);
  } catch (e) {
    console.log("좋아요 실패", e);
  }
};

const updateUI = (likeCount, likedByUser) => {
  document.querySelector(".likecount").innerHTML = `좋아요수 ${likeCount}`;
  document.querySelector("heart").src = likedByUser
    ? "/public/image/fillheart.svg"
    : "/public/image/binheart.svg";
};

// 글 삭제
const deleteBoard = (boardId) => {
  axios({
    method: "delete",
    url: `/delete/board/${boardId}`,
  })
    .then((res) => {
      if (res.data.result) {
        window.location.href = "http://localhost:3000/";
      } else {
        console.log("실패");
      }
    })
    .catch((e) => {
      console.log("삭제 실패", e);
    });
};
