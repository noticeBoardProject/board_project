const titleValue = document.getElementById("title");
let selectValue;

// 셀렉트 박스 바뀐 값 확인
const changeSelect = () => {
  const category = document.getElementById("category");
  selectValue = category.options[category.selectedIndex].value;
};

// 토스트 에디터
const editor = new toastui.Editor({
  el: document.querySelector("#content"),
  height: "500px",
  initialEditType: "markdown",
  initialValue: "내용을 입력해 주세요.",
  previewStyle: "vertical",
});

// 이미지 미리보기
const binCheckImg = (num) => {
  const form = document.forms["mainForm"];
  const imgpreview = document.getElementById(`select-${num}`);
  const fReader = new FileReader();

  // 파일 객체 가져오기 (파일이 선택되지 않았다면 undefined)
  const fileInput = form[`image${num}`];
  const file = fileInput?.files[0];

  if (!file) {
    // 파일이 선택되지 않았을 경우 기본 이미지 유지
    imgpreview.innerHTML = `<div class="preimgbox"><p>이미지를 선택하세요</p></div>`;
  } else {
    // 파일이 존재하면 읽기 진행
    fReader.readAsDataURL(file);
    fReader.onloadend = (event) => {
      const path = event.target.result;
      imgpreview.innerHTML = `<div class="preimgbox"><img class="preimg preimg${num}" src="${path}" alt="선택한 이미지" /></div>`;
    };
  }
};

// 카테고리 가져오기
const getCategory = () => {
  axios({
    method: "get",
    url: "/category",
  })
    .then((res) => {
      if (res.data.result) {
        const categorybox = document.getElementById("category");
        const category = res.data.category;
        // 아직 정확하지 않음(예시임)
        category.map((cate) => {
          categorybox.innerHTML = `<option value="${cate.id}">${cate.name}</option>`;
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
  const imageone = document.getElementById("imageone").files[0];
  const imagetwo = document.getElementById("imagetwo").files[0];
  const imagethree = document.getElementById("imagethree").files[0];
  const content = editor.getMarkdown();

  const formData = new FormData();
  formData.append("categoryId", categoryId);
  formData.append("title", title);
  formData.append("content", content);

  if (imageone) {
    formData.append("image[]", imageone);
  }
  if (imagetwo) {
    formData.append("image[]", imagetwo);
  }
  if (imagethree) {
    formData.append("image[]", imagethree);
  }

  axios({
    headers: { "Content-Type": "multipart/form-data" },
    method: "post",
    url: "/post/board",
    data: formData,
  })
    .then((res) => {
      window.location.href = "http://localhost:3000/";
    })
    .catch((e) => {
      console.log(e);
    });
};

// 카테고리 불러옴
getCategory();
