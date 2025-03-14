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
let existingFiles = []; // 서버에서 불러온 기존 이미지들
let deletedExistingFiles = []; // 삭제할 기존 이미지 배열

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

  // 기존 이미지 미리보기 (서버에서 가져온 이미지)
  existingFiles.forEach((file, index) => {
    fileList.innerHTML += `
      <div class="image-wrapper">
        <img class="preview-image" src="/uploads/${file}" />
        <button class="remove-btn" onclick="removeExistingFile(${index})">X</button>
      </div>`;
  });

  // 새로 추가된 이미지 미리보기
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

// 기존 이미지 파일 삭제
const removeExistingFile = (index) => {
  console.log("삭제 전 deletedExistingFiles:-----------------------------------", deletedExistingFiles);
  deletedExistingFiles.push(existingFiles[index]); // 삭제할 이미지 추가

  existingFiles.splice(index, 1); // 기존 이미지 배열에서 삭제
  console.log("삭제 후 deletedExistingFiles:----------------------------------", deletedExistingFiles);

  updatePreview(); // 미리보기 업데이트
};

// 새로운 이미지 파일 삭제
const removeFile = (index) => {
  // 배열에서 파일 삭제
  selectedFiles.splice(index, 1);

  updatePreview();

  // 파일이 3개 미만이면 다시 파일 추가 버튼 보이기
  if (selectedFiles.length + existingFiles.length < 3) {
    document.querySelector(".btn-upload").style.display = "block";
  }
};

const checktitle = () => {
  if (titleValue.value) {
    titleValue.classList.remove("infoColor");
  }
};

// 이미지 삭제 버튼 클릭 이벤트 확인
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-btn")) {
    const index = e.target.dataset.index;
    console.log(`이미지 삭제 버튼 클릭됨: ${index}`);
    removeExistingFile(index);
  }
});
