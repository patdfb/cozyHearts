export default function BigButton({ name, onClick }) {
  return (
    <button class="bg-green hover:bg-green/90 text-white font-bold rounded px-5 py-3" onClick={onClick}>
      {name}
    </button>
  )
}


