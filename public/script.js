function increaseFontSize() {
  document.body.style.fontSize =
    parseFloat(window.getComputedStyle(document.body).fontSize) * 1.1 + "px";
}

function decreaseFontSize() {
  document.body.style.fontSize =
    parseFloat(window.getComputedStyle(document.body).fontSize) * 0.9 + "px";
}
document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("increase-font")
    .addEventListener("click", increaseFontSize);
  document
    .getElementById("decrease-font")
    .addEventListener("click", decreaseFontSize);
});
