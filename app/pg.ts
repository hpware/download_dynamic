import { SQL } from "bun";
const db = new SQL({
  url: process.env.POSTGRES_URL,
});

export default db;
