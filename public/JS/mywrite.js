const eachContent = document.querySelectorAll(".eachContent");
const contentwrap = document.querySelectorAll(".contentwrap");
const reorderBtn = document.querySelector(".reorder");
const gridBtn = document.querySelector(".gridorder");
const contentbox = document.querySelectorAll(".contentbox");
const imgbox = document.querySelectorAll(".imgbox");

// 정렬 버튼
reorderBtn.addEventListener("click", () => {
  eachContent.forEach((item) => {
    item.classList.add("reorderstyle");
    item.classList.remove("griddirection");
  });

  contentwrap.forEach((item) => {
    item.classList.remove("gridstyle");
  });

  contentbox.forEach((item) => {
    item.classList.add("heightset");
    item.classList.remove("gridcontentbox");
  });

  imgbox.forEach((item) => {
    item.classList.remove("imgboxwidthset");
  });

  if (reorderBtn.src.includes("reorderDisabled.svg")) {
    reorderBtn.src = "/public/image/reorderAbled.svg";
    gridBtn.src = "/public/image/gridDisabled.svg";
  }
});

gridBtn.addEventListener("click", () => {
  eachContent.forEach((item) => {
    item.classList.remove("reorderstyle");
    item.classList.add("griddirection");
  });

  contentwrap.forEach((item) => {
    item.classList.add("gridstyle");
  });

  contentbox.forEach((item) => {
    item.classList.remove("heightset");
    item.classList.add("gridcontentbox");
  });

  imgbox.forEach((item) => {
    item.classList.add("imgboxwidthset");
  });

  if (gridBtn.src.includes("gridDisabled.svg")) {
    gridBtn.src = "/public/image/gridAbled.svg";
    reorderBtn.src = "/public/image/reorderDisabled.svg";
  }
});

// 로드되면 해당 스타일 추가
window.onload = () => {
  const eachContent = document.querySelectorAll(".eachContent");
  eachContent.forEach((item) => {
    item.classList.add("reorderstyle");
  });
  contentbox.forEach((item) => {
    item.classList.add("heightset");
  });
};
