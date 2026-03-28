export default function Button({ name, onClick }) {
  return (
    <button
      className="w-full bg-button hover:bg-button-selected text-white font-bold rounded-4xl text-xl h-9 mx-1"
      onClick={onClick}
    >
      {name}
    </button>
  )
}


