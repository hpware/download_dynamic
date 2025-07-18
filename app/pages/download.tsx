import Layout from "../layouts/absolute";
import sql from "../pg";
import FileNotFound from "./FileNotFound";
import { v4 as uuidv4 } from "uuid";

const ENABLE_CAPTCHA = process.env.ENABLE_CAPTCHA;
const CF_SITEKEY =
  ENABLE_CAPTCHA === "true" ? process.env.CF_TURNSTILE_SITE_KEY : "";

const clientDownloadLimit = process.env.CLIENT_DOWNLOAD_LIMIT || null;
const LOCALE = process.env.LOCALE || "zh-tw";

function startDownload() {
  console.log(CF_SITEKEY);
}

function Page({ fileSQL }: { fileSQL: any }) {
  const genId = uuidv4();
  const returnContent = `const genId = "${genId}";
  const fileUuid = "${fileSQL.uuid}";
  const downloadUuid = "${fileSQL.download_uuid}";
  const captchaEnabled = ${ENABLE_CAPTCHA === "true" ? true : false};
  const clientDownloadLimit = ${clientDownloadLimit};
  const CF_SITEKEY = "${CF_SITEKEY}";
  `
    .replaceAll("\n", "")
    .replaceAll("  ", "");
  return (
    <div className="flex flex-col justify-center align-center text-center ">
      <header className="p-2 m-2">
        <h1 className="text-2xl">
          📥 Download <i>{fileSQL.file_name}</i>
        </h1>
        <h4>
          File uploaded at{" "}
          {new Date(fileSQL.created_at).toLocaleDateString(LOCALE)}
        </h4>
        <hr className="justify-center m-auto w-[80vw]" />
      </header>
      <main
        id="page"
        className="flex flex-col justify-center align-center text-center "
      >
        {ENABLE_CAPTCHA === "true" && (
          <div
            className="cf-turnstile"
            data-sitekey={CF_SITEKEY}
            id="cf_turnstile"
          ></div>
        )}
        <button
          className="p-2 bg-green-600 text-white m-auto w-fit hover:cursor-pointer hover:bg-green-600/50 duration-200 transform-all rounded flex flex-row"
          id="download_button"
          onClick={startDownload}
        >
          Create download link&nbsp;&nbsp;🔗
        </button>
        {/**Error Display*/}
        <span id="errordiv" className="text-red-600">
          {"  "}
        </span>
        <span className="text-gray-500">
          <i>
            Note: This download link will expire after 12 hours.
            {clientDownloadLimit !== "none" &&
              ` And each client can only create ${clientDownloadLimit} links per day`}
          </i>
        </span>
      </main>
      {/** SEND GENID TO THE CLIENT */}
      <script
        dangerouslySetInnerHTML={{
          __html: returnContent,
        }}
      ></script>
    </div>
  );
}

export default async function Export({ pathname }: { pathname: string }) {
  const findFile = await sql`
    SELECT * FROM file
    WHERE file_name = ${pathname}
    `;
  if (findFile.length === 0) {
    return (
      <Layout
        page={<FileNotFound />}
        title="Cannot find this file!"
        scriptTags={[
          "/__client_js/userinfo.js",
          `/__client_js/fileNotFound.js`,
        ]}
      />
    );
  }
  return (
    <Layout
      page={<Page fileSQL={findFile[0]} />}
      title={`Download ${findFile[0].file_name} 📥`}
      scriptTags={[
        "https://challenges.cloudflare.com/turnstile/v0/api.js",
        "/__client_js/userinfo.js",
        `/__client_js/download.js`,
      ]}
    />
  );
}
