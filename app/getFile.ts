import sql from "./pg";

export default async function GetFile(
  slug1: string,
  slug2: string,
  clientId: any,
) {
  try {
    const getDlStuff = await sql`
      SELECT * FROM strictdownloadlinkallow
      WHERE matching_file = ${slug1}
      AND dlid = ${slug2}
      AND created_at < NOW() - INTERVAL '6 hours'
      ${process.env.LIMIT_TO_PER_CLIENT === "true" ? sql`AND client_id = ${clientId}` : sql``}
      `;
    if (getDlStuff.length === 0) {
      return {
        error: true,
        error_text: "You are not allowed to download this file.",
        data: null,
      };
    }
    const getDlStuffDetails = await sql`
      SELECT * FROM file
      WHERE download_uuid = ${getDlStuff[0].matching_file}`;
    if (getDlStuffDetails.length === 0) {
      return {
        error: true,
        error_text: "Oops! This file does not exist anymore!",
        data: null,
      };
    }
    return {
      error: false,
      data: getDlStuffDetails[0].file_name,
    };
  } catch (e) {
    console.log(e);
  }
}
