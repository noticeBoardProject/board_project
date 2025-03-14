// 제목
const titleValue = document.getElementById("title");

// 카테고리
let selectValue;

// 파일
const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");

// 셀렉트 박스 변경 감지
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

// 이미지 관련 배열
let selectedFiles = []; // 새로 추가된 이미지들
let existingFiles = []; // 서버에서 불러온 기존 이미지들
let deletedExistingFiles = []; // 삭제할 기존 이미지 배열

document.addEventListener("DOMContentLoaded", () => {
  // EJS에서 전달한 이미지 데이터를 배열로 받음
  if (typeof existingImages !== "undefined" && existingImages.length > 0) {
    existingFiles = existingImages;

    // 기존 이미지 미리보기 업데이트
    updatePreview();
  }
});

const selectFile = (event) => {
  event.preventDefault(); // 새로고침 방지
  const files = Array.from(event.target.files);

  files.forEach((file) => {
    if (selectedFiles.length < 3) {
      selectedFiles.push(file);
    }
  });

  updatePreview();
  if (selectedFiles.length >= 3) {
    document.querySelector(".btn-upload").style.display = "none";
  }

  fileInput.value = ""; // 선택된 파일 초기화
};

fileInput.addEventListener("change", selectFile);

// 미리보기 업데이트
const updatePreview = () => {
  fileList.innerHTML = ""; // 기존 미리보기 초기화

  // 기존 이미지 미리보기
  existingFiles.forEach((file, index) => {
    // 동적으로 추가된 요소에는 이벤트 리스너 적용 안됨!!
    // fileList.innerHTML += `
    //   <div class="image-wrapper" data-index="${index}" data-type="existing">
    //     <img class="preview-image" src="/uploads/${file}" />
    //     <button class="remove-btn">X</button>
    //   </div>`;

    const wrapper = document.createElement("div");
    wrapper.className = "image-wrapper";
    wrapper.dataset.index = index;
    wrapper.dataset.type = "existing";

    const img = document.createElement("img");
    img.className = "preview-image";
    img.src = `/uploads/${file}`;

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "X";

    // 삭제 이벤트
    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      removeExistingFile(file);
      updatePreview(); // 삭제 후 미리보기 갱신
    });

    wrapper.appendChild(img);
    wrapper.appendChild(removeBtn);
    fileList.appendChild(wrapper);
  });

  // 새로 추가된 이미지 미리보기
  selectedFiles.forEach((file, index) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      // fileList.innerHTML += `
      //     <div class="image-wrapper" data-index="${index}" data-type="new">
      //       <img class="preview-image" id="image${index}" src=${e.target.result} />
      //       <button class="remove-btn">X</button>
      //     </div>`;
      const wrapper = document.createElement("div");
      wrapper.className = "image-wrapper";
      wrapper.dataset.index = index;
      wrapper.dataset.type = "new";

      const img = document.createElement("img");
      img.className = "preview-image";
      img.src = e.target.result;

      const removeBtn = document.createElement("button");
      removeBtn.className = "remove-btn";
      removeBtn.textContent = "X";

      // 삭제 이벤트
      removeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        removeFile(index);
        updatePreview(); // 삭제 후 미리보기 갱신
      });

      wrapper.appendChild(img);
      wrapper.appendChild(removeBtn);
      fileList.appendChild(wrapper);
    };
    reader.readAsDataURL(file);
  });
};

// 기존 이미지 삭제
const removeExistingFile = (fileName) => {
  console.log("삭제 시도 파일명:", fileName);
  const index = existingFiles.indexOf(fileName);

  if (index !== -1) {
    existingFiles.splice(index, 1);
    deletedExistingFiles.push(fileName);
  }
  console.log("삭제 후 deletedExistingFiles:", deletedExistingFiles);
};

// 새 이미지 삭제
const removeFile = (index) => {
  if (index >= 0 && index < selectedFiles.length) {
    selectedFiles.splice(index, 1); // 배열에서 파일 삭제
  }

  if (selectedFiles.length + existingFiles.length < 3) {
    document.querySelector(".btn-upload").style.display = "block";
  }
  console.log("삭제 후 selectedFiles:", selectedFiles);
};

// 제목 체크
const checktitle = () => {
  if (titleValue.value) {
    titleValue.classList.remove("infoColor");
  }
};

// 게시글 수정 요청
const editArticle = (boardId) => {
  Swal.fire({
    title: "게시글을 수정할까요?",
    text: "수정시 수정된 날짜도 같이 표시됩니다.",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "네",
    cancelButtonText: "아니요",
  }).then(async (result) => {
    if (result.isConfirmed) {
      const title = titleValue.value;
      if (!title) {
        titleValue.classList.add("infoColor");
        return;
      }

      const content = editor.getMarkdown();
      const categoryId = document.getElementById("category").value;
      const formData = new FormData();

      console.log("전송할 삭제 이미지 목록:", deletedExistingFiles);

      if (deletedExistingFiles.length > 0) {
        formData.append("deleteImages", deletedExistingFiles.join(","));
      }

      selectedFiles.forEach((file) => {
        formData.append("image[]", file);
      });

      formData.append("categoryId", categoryId);
      formData.append("title", title);
      formData.append("content", content);

      console.log(
        "최종 전송 formData:",
        Object.fromEntries(formData.entries())
      );

      axios({
        headers: { "Content-Type": "multipart/form-data" },
        method: "patch",
        url: `/board/edit/${boardId}`,
        data: formData,
      })
        .then((response) => {
          window.location.href = `http://localhost:3000/main/move/detail/${boardId}`;
        })
        .catch((error) => {
          console.error("게시글 수정 오류:", error);
        });
    }
  });
};
