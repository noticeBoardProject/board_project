const editArticle = (boardId) => {
  const title = titleValue.value;

  if (!title) {
    titleValue.classList.add("infoColor");
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
      method: "patch",
      url: `/main/editBoard/${boardId}`,
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
