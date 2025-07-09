const download_button = document.getElementById("download_button");
download_button.addEventListener("click", submitDownloadRequest);

const currentUserString = localStorage.getItem("userString");

async function submitDownloadRequest() {
  try {
    const buildUrl = `/download/${"dd"}/${"id"}?usr=${currentUserString}&ttp=5503&${generateRandomString(10)}`;
  } catch (e) {}
}
