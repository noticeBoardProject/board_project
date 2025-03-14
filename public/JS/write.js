// 제목
const titleValue = document.getElementById("title");

// 카테고리
let selectValue;

// 파일
const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");

// 셀렉트 박스 바뀐 값 확인
const changeSelect = () => {
  document.querySelector(".cateinfo").innerText = "";
  const category = document.getElementById("category");
  selectValue = category.options[category.selectedIndex].value;
};

// 토스트 에디터
const editor = new toastui.Editor({
  el: document.querySelector("#content"),
  height: "500px",
  initialEditType: "markdown",
  placeholder: "내용을 입력해 주세요.",
  previewStyle: "vertical",
});

let selectedFiles = []; // 새로 추가된 이미지들

const selectFile = (event) => {
  // 선택한 파일들을 배열로 변환
  const files = Array.from(event.target.files);

  files.forEach((file) => {
    if (selectedFiles.length < 3) {
      selectedFiles.push(file);
    }
  });

  updatePreview();

  // 3개 선택 시 파일 추가 버튼 숨기기
  if (selectedFiles.length >= 3) {
    document.querySelector(".btn-upload").style.display = "none";
  }
  fileInput.value = ""; // 선택된 파일 초기화
};

fileInput.addEventListener("change", selectFile);

// 미리보기 업데이트
const updatePreview = () => {
  fileList.innerHTML = ""; // 기존 미리보기 초기화

  selectedFiles.forEach((file, index) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      fileList.innerHTML += `
        <div class="image-wrapper">
          <img class="preview-image" id="image${index}" src=${e.target.result} />
          <button class="remove-btn" onclick="removeFile(${index})">X</button>
        </div>`;
    };

    reader.readAsDataURL(file);
  });
};

const checktitle = () => {
  if (titleValue.value) {
    titleValue.classList.remove("infoColor");
  }
};

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

// 선택한 파일 삭제
const removeFile = (index) => {
  // 배열에서 파일 삭제
  selectedFiles.splice(index, 1);

  updatePreview();

  // 파일이 3개 미만이면 다시 파일 추가 버튼 보이기
  if (selectedFiles.length < 3) {
    document.querySelector(".btn-upload").style.display = "block";
  }
};
