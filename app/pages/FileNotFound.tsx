"use client";
export default function FileNotFound() {
  return (
    <div className="absolute inset-0 justify-center align-middle flex flex-col">
      <h1 className="text-xl">
        The file that you are trying to find does not exist.
      </h1>
      <button onClick={() => window.history.back}>Go Back</button>
    </div>
  );
}
