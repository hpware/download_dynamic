import sql from "./pg";

export default async function createDB() {
  await sql`
  CREATE TABLE IF NOT EXISTS file (
    uuid text PRIMARY KEY,
    path text unique not null,
    download_uuid text not null,
    file_name text not null,
    file_hash text not null,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
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

// In case of cli actions
createDB();
