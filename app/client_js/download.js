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
    const req1 = await fetch(
      `/__dlaction/${currentUserString}/${fileUuid}?captcha=${captchaEnabled}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          turnstileRes: turnstileResponse || null,
        }),
      },
    );
    const res1 = await req1.json();
    if (!res1.success) {
      fileMessage.innerText = res1.fail_message;
      return;
    }
    const buildUrl = `/__download/${downloadUuid}/${res1.downloadAuthUrl}?usr=${currentUserString}`;
    window.location.href = buildUrl;
    //window.location.href = "#filedownloaded";
    return;
  } catch (e) {
    fileMessage.innerText = e.message;
    return;
  }
}
