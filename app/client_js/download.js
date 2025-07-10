/** Set dl button action */
const download_button = document.getElementById("download_button");
download_button.addEventListener("click", submitDownloadRequest);
/** Vars */
const currentJS = document.currentScript.src;
const currentJSURL = new URL(currentJS);
const currentJSURLParams = new URLSearchParams(currentJSURL.search);
const fileMessage = document.getElementById("errordiv");
const cfTurnstile33 = document.getElementById("cf-turnstile");
const currentUserString = localStorage.getItem("userString");
let turnstileResponse;
if (captchaEnabled) {
  turnstileResponse = turnstile.getResponse(widgetId: string);
  console.log(turnstileResponse);
}

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
