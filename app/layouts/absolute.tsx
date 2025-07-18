import "../css/main.css";

const COPYRIGHT_OWNER =
  process.env.COPYRIGHT_OWNER === undefined
    ? "Respected Owners"
    : process.env.COPYRIGHT_OWNER;
export default function Layout({
  page,
  title,
  scriptTags,
  jsCode,
}: {
  page: React.ReactNode;
  title?: string;
  scriptTags?: any;
  jsCode?: string;
}) {
  return (
    <html>
      <head>
        <title>{title || "Undefined"}</title>
        <link rel="stylesheet" href="/__style.css" />
        <link rel="favicon" href="/favicon.svg" />
        <meta charSet="UTF-8" />
      </head>
      <script
        dangerouslySetInnerHTML={{
          __html: `
          /**
            * COPYRIGHT ${new Date().getFullYear()} ${COPYRIGHT_OWNER}
            * THIS PLATFORM / SOFTWARE IS LICENSED UNDER THE MIT LICENSE.
            * Writen using Bun & Postgres.
            * If you want to self host it, you can learn more about it here: https://yhw.tw/ljads_selfhost
          */
          `,
        }}
      ></script>
      <body className="min-h-screen bg-[#f5fbff] max-w-screen flex-wrap text-wrap">
        <div className="absolute inset-0 flex flex-col justify-center text-center m-6 p-6  max-w-screen flex-wrap text-wrap">
          <div className="text-center justify-center flex flex-col m-2 px-12 py-6 bg-gray-200/50 rounded-lg backdrop-blur-xl shadow shadow-black/30 max-w-screen flex-wrap text-wrap">
            <main>{page}</main>
            <footer>
              <span className="text-xs ml-2">
                &copy; {new Date().getFullYear()} {COPYRIGHT_OWNER}
              </span>
            </footer>
            {scriptTags &&
              scriptTags.map((url: any, index: number) => (
                <script key={index} src={url}></script>
              ))}
            {jsCode && (
              <script dangerouslySetInnerHTML={{ __html: jsCode }}></script>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
