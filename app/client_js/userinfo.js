const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789=_-";
function generateRandomString(length) {
  let slug = "";
  for (let times = 0; times < length; times++) {
    slug += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return slug;
}

document.addEventListener("DOMContentLoaded", function () {
  const userString = generateRandomString(24);

  const currentUserString = localStorage.getItem("userString");

  if (!currentUserString || currentUserString.length !== 24) {
    localStorage.setItem("userString", userString);
  }
});
