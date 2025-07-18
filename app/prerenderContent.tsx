import "../css/main.css";

export default function Page() {
  return (
    <div>
      Download your file{" "}
      <a
        href="${buildUrl}"
        className="text-blue-500 hover:text-blue-300 duration-300 transition-all"
      >
        Here
      </a>
    </div>
  );
}
