const currentJS = document.currentScript.src;

const currentJSURL = new URL(currentJS);
const currentJSURLParams = new URLSearchParams(currentJSURL.search);
const fileUuid = currentJSURLParams.get("file");
const downloadUuid = currentJSURLParams.get("dl");
const captchaEnabled = currentJSURLParams.get("captcha");
const fileMessage = document.getElementById("errordiv");

let turnstileResponse;
if (captchaEnabled === "true") {
  turnstileResponse = turnstile.getResponse(widgetId: string);
  console.log(turnstileResponse);
}

const download_button = document.getElementById("download_button");
download_button.addEventListener("click", submitDownloadRequest);

const currentUserString = localStorage.getItem("userString");

async function submitDownloadRequest() {
  console.log("Requesting...");
  try {
    const downloadAuthUrl = await getDownloadAuthUrl();
    if (!downloadAuthUrl.success) {
      fileMessage.innerText = "Request failed";
      return;
    }
    const buildUrl = `/download/${downloadUuid}/${downloadAuthUrl}?usr=${currentUserString}&fact=${fileUuid}`;
  } catch (e) {
    fileMessage.innerText = e.message;
    return;
  }
}

async function getDownloadAuthUrl() {
  try  {
    const req = await fetch(`/_dlurl/${currentUserString}/${fileUuid}?captcha=${captchaEnabled}&turnstile=${turnstileResponse}`);
    const res = await req.json();
    return {
      key: res.key,
      success: res.success
    }
  } catch (e) {
    fileMessage.innerText = e.message;
    return {
      key: null,
      success: false
    }
  }
}
