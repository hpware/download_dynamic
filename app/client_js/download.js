/** Set dl button action */
const download_button = document.getElementById("download_button");
download_button.addEventListener("click", submitDownloadRequest);
/** Vars */
const currentJS = document.currentScript.src;
const currentJSURL = new URL(currentJS);
const currentJSURLParams = new URLSearchParams(currentJSURL.search);
const fileMessage = document.getElementById("errordiv");
const currentUserString = localStorage.getItem("userString");

async function submitDownloadRequest() {
  console.log("Requesting...");
  try {
    let turnstileResponse;
    if (captchaEnabled) {
      const widget = document.querySelector(".cf-turnstile");
      const widgetId = widget.getAttribute("data-widget-id");
      turnstileResponse = turnstile.getResponse(widgetId);
      console.log(turnstileResponse);
    }
    const downloadAuthUrl = await getDownloadAuthUrl(turnstileResponse);
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

async function getDownloadAuthUrl(turnstileResponse) {
  try {
    const req = await fetch(
      `/_dlurl/${currentUserString}/${fileUuid}?captcha=${captchaEnabled}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          siteKey: CF_SITEKEY || null,
          turnstileRes: turnstileResponse || null,
          clientDownloadLimit: clientDownloadLimit || null,
        }),
      },
    );
    const res = await req.json();
    return {
      key: res.key,
      success: res.success,
    };
  } catch (e) {
    fileMessage.innerText = e.message;
    return {
      key: null,
      success: false,
    };
  }
}
