const editArticle = (boardId) => {
  const title = titleValue.value;

  if (!title) {
    titleValue.classList.add("infoColor");
  } else {
    const content = editor.getMarkdown();
    const categoryId = document.getElementById("category").value; // 카테고리 id 가져오기

    const formData = new FormData();
    console.log("삭제할 이미지 리스트:", deletedExistingFiles);

    // 삭제할 기존 이미지 리스트
    deletedExistingFiles.forEach((img) => {
      console.log("삭제 요청 이미지:---------------------------", img); // 디버깅용
      formData.append("deleteImages[]", img);
    });

    selectedFiles.forEach((item) => {
      formData.append("image[]", item);
    });

    formData.append("categoryId", categoryId);
    formData.append("title", title);
    formData.append("content", content);

    axios({
      headers: { "Content-Type": "multipart/form-data" },
      method: "patch",
      url: `/board/edit/${boardId}`,
      data: formData,
    })
      .then((res) => {
        alert("게시글이 수정되었습니다.");
        window.location.href = "http://localhost:3000/";
      })
      .catch((e) => {
        console.log(e);
      });
  }
};