import Layout from "../layouts/main";

function Page({ pathname }: { pathname: string }) {
  return (
    <div>
      <h1 className="">{pathname}</h1>
      <hr />
      <h3>
        <i>Download the file</i>
      </h3>
      <button>Create download link</button>
      <span>Note: This download link will expire after 12 hours.</span>
    </div>
  );
}

export default function Export({ pathname }: { pathname: string }) {
  return <Layout page={<Page pathname={pathname} />} />;
}
