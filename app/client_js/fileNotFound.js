const back_button = document.getElementById("back_button");
back_button.addEventListener("click", goBack);
function goBack() {
  window.history.back();
}
