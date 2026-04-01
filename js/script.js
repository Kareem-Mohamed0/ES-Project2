let spinner = document.querySelector(".loading-spinner");
spinner.classList.remove("d-none");
setTimeout(() => {
  spinner.classList.add("d-none");
}, 300);

//---------------------------
const signUpMessage = document.querySelector(".signUp-Message");
const closeBtn = document.querySelector(".signUp-Message i");
closeBtn.addEventListener("click", () => {
    signUpMessage.style.transform = "translateY(-100%)";
    setTimeout(() => {
        signUpMessage.style.display = "none";
    }, 500);
});
