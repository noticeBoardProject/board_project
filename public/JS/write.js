// 카테고리 가져오기
const getCategory = () => {
  axios({
    method: "get",
    url: "/board/category",
  })
    .then((res) => {
      if (res.data.result) {
        const categorybox = document.getElementById("category");
        const category = res.data.category;

        categorybox.innerHTML = `<option disabled selected>카테고리 선택</option>`;
        category
          .sort((a, b) => a.id - b.id) // 오름차순 정렬
          .map((cate) => {
            categorybox.innerHTML += `<option value="${cate.id}">${cate.name}</option>`;
          });
      } else {
        alert("카테고리 정보를 불러오지 못했습니다.");
      }
    })
    .catch((e) => {
      console.log(e);
    });
};

// 게시물 쓰기
const submitArticle = () => {
  const categoryId = selectValue;
  const title = titleValue.value;
  if (!categoryId || !title) {
    if (!categoryId) {
      document.querySelector(".cateinfo").innerText = "카테고리를 선택해주세요";
    }
    if (!title) {
      titleValue.classList.add("infoColor");
    }
  } else {
    const content = editor.getMarkdown();
    const formData = new FormData();
    selectedFiles.forEach((item) => {
      formData.append("image[]", item);
    });
    formData.append("categoryId", categoryId);
    formData.append("title", title);
    formData.append("content", content);

    axios({
      headers: { "Content-Type": "multipart/form-data" },
      method: "post",
      url: "/board/post",
      data: formData,
    })
      .then((res) => {
        alert("게시글이 작성되었습니다.");
        window.location.href = "http://localhost:3000/";
      })
      .catch((e) => {
        console.log(e);
      });
  }
};

// 카테고리 불러옴
getCategory();
