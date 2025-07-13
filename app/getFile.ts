import fs from "fs";
import sql from "./pg";

export default async function GetFile(
  slug1: string,
  slug2: string,
  clientId?: string,
) {
  try {
    const getDlStuff = await sql`
      SELECT * FROM strictdownloadlinkallow
      WHERE matching_file = ${slug1}
      AND key1 = ${slug2}
      AND created_at < NOW() - INTERVAL '6 hours'
      ${process.env.LINK_CAN_BE_USED_ON_ONE_DEVICE === "true" && `AND key2 = ${clientId}`}
      `;
    if (getDlStuff.length === 0) {
      throw new Error("Not allowed to download this file");
    }
    const getDlStuffDetails = await sql`
      SELECT * FROM file
      WHERE uuid = ${getDlStuff[0].matching_file}`;
    if (getDlStuffDetails.length === 0) {
      throw new Error("Oops! This file does not exist anymore!");
    }
    return;
  } catch (e) {
    console.log(e);
  }
}
