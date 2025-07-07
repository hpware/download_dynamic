import { SQL } from "bun";
export const db = new SQL({
  url: process.env.POSTGRES_URL,
  onconnect: (client) => {
    console.log("Connected to database");
  },
  onclose: (client) => {
    console.log("Connection closed");
  },
});
