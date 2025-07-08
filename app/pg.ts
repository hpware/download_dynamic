import { SQL } from "bun";
const db = new SQL({
  url: process.env.POSTGRES_URL,
  onconnect: (client) => {
    console.log("Connected to database");
  },
  onclose: (client) => {
    console.log("Connection closed");
  },
});

export default db;
