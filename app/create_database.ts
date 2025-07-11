import sql from "./pg";

export default async function createDB() {
  await sql`
  CREATE TABLE IF NOT EXISTS file (
    uuid text PRIMARY KEY,
    path text unique not null,
    download_uuid text not null,
    file_name text not null,
    file_type text not null,
    file_size text not null,
    uploader text not null,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    download_path text not null
  )
  `;

  await sql`
  CREATE TABLE IF NOT EXISTS strictdownloadlinkallow (
    uuid text PRIMARY KEY,
    key1 text unique not null,
    key2 text unique not null,
    matching_file text not null,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )
  `;
}

createDB();
