export default function Button({ name, onClick, selected = false }) {
  return (
    <button
      className={`w-full text-white font-bold rounded-4xl text-xl h-9 mx-1 ${
        selected ? 'bg-button-selected' : 'bg-button hover:bg-button-selected'
      }`}
      onClick={onClick}
    >
      {name}
    </button>
  )
}


