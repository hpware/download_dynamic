export default function Layout({
  page,
  title,
}: {
  page: React.ReactNode;
  title?: string;
}) {
  return (
    <html>
      <head>
        <title>{title || "Undefined"}</title>
      </head>
      <body>
        <div>{page}</div>
      </body>
    </html>
  );
}
