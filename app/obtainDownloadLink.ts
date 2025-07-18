import { v4 as uuidv4 } from "uuid";
import generateRandomString from "./generateRandomString";
import sql from "./pg";

export async function getDownloadLink(
  turnstileRes: string,
  fileid: string,
  userid: string,
  captcha: boolean,
) {
  try {
    var captchaSuccess = false;
    if (captcha) {
      const CF_SECRET_KEY = process.env.CF_TURNSTILE_SECRET_KEY;
      const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
      const result = await fetch(url, {
        body: JSON.stringify({
          secret: CF_SECRET_KEY,
          response: turnstileRes,
        }),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const outcome = await result.json();
      const challengeTime = new Date(outcome.challenge_ts).getTime();
      const currentTime = new Date().getTime();
      if (outcome.success && currentTime - challengeTime < 3600000) {
        captchaSuccess = true;
      }
    } else {
      captchaSuccess = true;
    }
    if (!captchaSuccess) {
      return {
        success: false,
        fail_message: "Captcha request failed or captcha request expired",
        downloadAuthUrl: null as any,
      };
    }
    const randomString = generateRandomString(14);
    const storeToDB = await sql`
       INSERT INTO strictdownloadlinkallow (uuid, dlid, client_id, matching_file)
       VALUES (${uuidv4()}, ${randomString}, ${userid}, ${fileid})
       `;
    return {
      success: true,
      fail_message: null as any,
      downloadAuthUrl: randomString,
      storeToDB: storeToDB,
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      fail_message: `Server side error. If you are the owner, please submit a GitHub Issue to the repo. Error message: ${e?.message}`,
      downloadAuthUrl: null as any,
    };
  }
}
