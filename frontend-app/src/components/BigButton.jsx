export default function BigButton({ name, onClick }) {
  return (
    <button
      className="bg-button hover:bg-button-selected text-white font-bold rounded-4xl text-3xl h-24 mx-4"
      onClick={onClick}
    >
      {name}
    </button>
  )
}


