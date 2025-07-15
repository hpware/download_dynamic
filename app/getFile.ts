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
      ${process.env.LIMIT_TO_PER_CLIENT === "true" && `AND client_id = ${clientId}`}
      `;
    if (getDlStuff.length === 0) {
      throw new Error("Not allowed to download this file");
    }
    const getDlStuffDetails = await sql`
      SELECT * FROM file
      WHERE download_uuid = ${getDlStuff[0].matching_file}`;
    if (getDlStuffDetails.length === 0) {
      throw new Error("Oops! This file does not exist anymore!");
    }
    return getDlStuffDetails[0].file_name;
  } catch (e) {
    console.log(e);
  }
}
