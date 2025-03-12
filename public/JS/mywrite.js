const eachContent = document.querySelector(".eachContent");
const contentwrap = document.querySelector(".contentwrap");
const reorderBtn = document.querySelector(".reorder");
const gridBtn = document.querySelector(".gridorder");

reorderBtn.addEventListener("click", () => {
  eachContent.classList.add("reorderstyle");
  contentwrap.classList.remove("gridstyle");

  if (reorderBtn.src.includes("reorderDisabled.svg")) {
    reorderBtn.src = "/public/image/reorderAbled.svg";
    gridBtn.src = "/public/image/gridDisabled.svg";
  }
});

gridBtn.addEventListener("click", () => {
  eachContent.classList.remove("reorderstyle");
  contentwrap.classList.add("gridstyle");

  if (gridBtn.src.includes("gridDisabled.svg")) {
    gridBtn.src = "/public/image/gridAbled.svg";
    reorderBtn.src = "/public/image/reorderDisabled.svg";
  }
});

window.onload = () => {
  const eachContent = document.querySelector(".eachContent");
  eachContent.classList.add("reorderstyle");
};
