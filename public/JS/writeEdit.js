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

// 선택한 파일을 저장할 배열
let selectedFiles = [];

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

const checktitle = () => {
  if (titleValue.value) {
    titleValue.classList.remove("infoColor");
  }
};
