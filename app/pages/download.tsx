import Layout from "../layouts/main";
import sql from "../pg";
import FileNotFound from "./FileNotFound";

const ENABLE_CAPTCHA = process.env.ENABLE_CAPTCHA;
const CF_SITEKEY =
  ENABLE_CAPTCHA === "true" ? process.env.CF_TURNSTILE_SITE_KEY : "";

const clientDownloadLimit = process.env.CLIENT_DOWNLOAD_LIMIT_HR || "none";

function Page({ fileSQL }: { fileSQL: any }) {
  return (
    <div className="flex flex-col">
      <h3>
        Download the file <i>{fileSQL.file_name}</i>
      </h3>
      {ENABLE_CAPTCHA === "true" && (
        <div
          className="cf-turnstile"
          data-sitekey={CF_SITEKEY}
          data-callback="/_cf_turnstile/srchk"
        ></div>
      )}
      <span>
        <button
          className="p-2 bg-gray-200 hover:cursor-pointer hover:bg-gray-400 duration-200 transform-all rounded"
          id="download_button"
        >
          Create download link
        </button>
      </span>
      {/**Error Display*/}
      <span id="errordiv" className="text-red-600"></span>
      <span className="text-gray-500">
        <i>Note: This download link will expire after 12 hours. {clientDownloadLimit !== "none" && `and each client can only create ${clientDownloadLimit} links per day`}</i>
      </span>>
    </div>
  );
}

export default async function Export({
  pathname,
  uuid,
}: {
  pathname: string;
  uuid: any;
}) {
  console.log(uuid);
  const findFile = await sql`
    SELECT * FROM file
    WHERE path = ${pathname}
    `;
  if (findFile.length === 0) {
    return (
      <Layout
        page={<FileNotFound />}
        title="Cannot find this file!"
        scriptTags={["/_client_js/userinfo.js", `/_client_js/fileNotFound.js`]}
      />
    );
  }
  return (
    <Layout
      page={<Page fileSQL={findFile[0]} />}
      title="Download a file"
      scriptTags={[
        "https://challenges.cloudflare.com/turnstile/v0/api.js",
        "/_client_js/userinfo.js",
        `/_client_js/download.js?file=${findFile[0].uuid}&dl=${findFile[0].download_uuid}&captcha=${ENABLE_CAPTCHA === "true" ? "true" : "false"}`,
      ]}
    />
  );
}
