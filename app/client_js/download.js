const currentJS = document.currentScript.src;

const currentJSURL = new URL(currentJS);
const currentJSURLParams = new URLSearchParams(currentJSURL.search);
const fileUuid = currentJSURLParams.get("file");
const downloadUuid = currentJSURLParams.get("dl");

const download_button = document.getElementById("download_button");
download_button.addEventListener("click", submitDownloadRequest);

const currentUserString = localStorage.getItem("userString");

async function submitDownloadRequest() {
  try {
    const buildUrl = `/download/${downloadUuid}/${"id"}?usr=${currentUserString}&fu=${fileUuid}`;
  } catch (e) {}
}
