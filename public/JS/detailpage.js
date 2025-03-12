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

// board 정보 가져오기
const mainElement = document.querySelector("main");
const boardId = mainElement.dataset.boardId;
let likeCount = parseInt(mainElement.dataset.likeCount);
let likedByUser = mainElement.dataset.likedByUser;

// 현재 좋아요 상태 요청(좋아요개수, 해당 사용자가 좋아요눌렀는지(true,false))
const getLikeStatus = async () => {
  const response = await axios.get(`/like/status/${boardId}`);
  likeCount = response.data.likeCount; // 좋아요개수
  likedByUser = response.data.likedByUser; // 해당 사용자가 좋아요 눌렀는지 확인(true, false)
  updateUI(likeCount, likedByUser);
};

// 해당 게시판 like 추가 요청 (likeCount도 늘어나야함)
const countFavorite = async (boardId) => {
  try {
    // 현재 좋아요 상태 호출
    getLikeStatus();

    if (likedByUser) {
      // 좋아요 취소
      await axios({
        method: "delete",
        url: `/like/delete/${boardId}`,
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
  document.querySelector(".heart").src = likedByUser
    ? "/public/image/fillheart.svg"
    : "/public/image/binheart.svg";
};

// 글 삭제
const deleteBoard = (boardId) => {
  Swal.fire({
    title: "게시물 삭제",
    text: "진짜로 삭제할건가요??",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "네",
    cancelButtonText: "아니요",
  }).then((result) => {
    if (result.isConfirmed) {
      axios({
        method: "delete",
        url: `/board/delete/${boardId}`,
      })
        .then((res) => {
          if (res.data.result) {
            Swal.fire({
              title: "삭제 완료",
              text: "삭제되었습니다!",
              icon: "success",
              confirmButtonText: "확인",
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.href = "http://localhost:3000/";
              }
            });
          } else {
            console.log("실패");
          }
        })
        .catch((e) => {
          console.log("삭제 실패", e);
        });
    }
  });
};

// 현재 좋아요 상태 호출
getLikeStatus();
