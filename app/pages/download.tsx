import Layout from "../layouts/main";
import { useEffect } from "react";
import sql from "../pg";
import FileNotFound from "./FileNotFound";

function Page({ pathname }: { pathname: string }) {
  return (
    <div className="flex flex-col">
      <h1 className="">{pathname}</h1>
      <hr />
      <h3>
        <i>Download the file</i>
      </h3>
      <p>You have done a basic bot check, you can now download the file :)</p>
      <span>
        <button className="p-2 bg-gray-200 hover:cursor-pointer hover:bg-gray-400 duration-200 transform-all rounded">
          Create download link
        </button>
      </span>
      <span className="text-gray-500">
        <i>Note: This download link will expire after 12 hours.</i>
      </span>
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
    return <Layout page={<FileNotFound />} title="Cannot find this file!" />;
  }
  return <Layout page={<Page pathname={pathname} />} title="Download a file" />;
}
