export default function FileNotFound() {
  return (
    <div className="justify-center align-middle flex flex-col">
      <h1 className="text-xl">
        Oops! The file that you are trying to find does not exist.
      </h1>
      <button
        id="back_button"
        className="p-2 text-center rounded justify-center m-2 bg-green-700 text-white hover:cursor-pointer"
      >
        Go Back
      </button>
    </div>
  );
}
