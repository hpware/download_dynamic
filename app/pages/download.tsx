import Layout from "../layouts/main";

function Page({ pathname }: { pathname: string }) {
  return (
    <div className="flex flex-col">
      <h1 className="">{pathname}</h1>
      <hr />
      <h3>
        <i>Download the file</i>
      </h3>
      <p>You have done a basic bot check, you can now download the file :)</p>
      <button>Create download link</button>
      <span className="text-gray-500">
        <i>Note: This download link will expire after 12 hours.</i>
      </span>
    </div>
  );
}

export default function Export({ pathname }: { pathname: string }) {
  return (
    <Layout page={<Page pathname={pathname} title={`Download a file`} />} />
  );
}
