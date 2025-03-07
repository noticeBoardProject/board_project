const content = document.querySelector(".content");

// 기존 선택 카테고리 데이터 요청
// document.addEventListener("DOMContentLoaded", () => {
//   const savedCategory = localStorage.getItem("selectedCategory") || "all";
//   fetchCateData(savedCategory);
// });

// // 변경 감지
// window.addEventListener("categoryChange", () => {
//   const savedCategory = localStorage.getItem("selectedCategory") || "all";
//   fetchCateData(savedCategory);
// });

// const fetchCateData = (categoryId) => {
//   axios({
//     method: "get",
//     url: "boarddata",
//     params: { nowCategory: categoryId },
//   })
//     .then((res) => {
//       content.innerHTML = ""; // 기존 내용 초기화
//       const data = res.data;

//       if (data && data.length > 0) {
//         data.forEach((item) => {
//           content.innerHTML += `
//           <div class="article board">
//             <div>${item.id}</div>
//             <div>${item.category}</div>
//             <div class="titlebox">
//               <span class="title">${item.title}</span>
//               <img src="${img_url}" alt="테스트" />
//             </div>
//             <div>${item.nickname}</div>
//             <div>${item.updateAt}</div>
//             <div>${item.likeCount}</div>
//           </div>`;
//         });
//       } else {
//         content.innerText = "게시물이 없습니다.";
//       }
//     })
//     .catch((e) => {
//       console.log("에러", e);
//     });
// };
