const emailForm = document.getElementById("findEmail-form");
const passwordForm = document.getElementById("resetPassword-form");

// 아이디 찾기 요청
emailForm.addEventListener("submit", async function(event){
    event.preventDefault();

    const username = document.getElementById("username").value;
    const phone = document.getElementById("phone").value;

    try{
        const res = await axios({
            method: "POST",
            url: "/findEmail",
            data: { username, phone },
        })
        document.getElementById("emailFind").innerHTML = res.data.message;
    } catch (error) {
        console.log("아이디 찾기 중 오류 발생:", error);
        document.getElementById("emailFind").innerHTML = "아이디 찾기 실패";
    }
})

// 비밀번호 재발급 요청
passwordForm.addEventListener("submit", async function(event){
    event.preventDefault();

    const username = document.getElementById("username2").value;
    const email = document.getElementById("email").value;

    try{
        const res = await axios({
            method: "POST",
            url: "/resetPassword",
            data: { username, email },
        })
        document.getElementById("passwordResult").innerHTML = res.data.message;
    } catch (error) {
        console.log("비밀번호 재발급 중 오류 발생:", error);
        document.getElementById("passwordResult").innerHTML = "비밀번호 재발급 실패";
    }
})
