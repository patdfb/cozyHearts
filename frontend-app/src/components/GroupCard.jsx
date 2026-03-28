export default function GroupCard({ name, photo, onClick, futureEvents=[] }) {
  const visibleFutureEvents = Array.isArray(futureEvents) ? futureEvents.slice(0, 2) : []

  return (
    <div className="w-full py-4 flex flex-row gap-3">

        <img src={photo} alt={name} className="w-1/3 h-34 object-cover object-center rounded-xl"/>
            
        <div className="w-2/3 h-34 flex flex-col gap-3">
            <p className="w-full text-left text-xl text-black">
                {name}
            </p>

            {visibleFutureEvents.length > 0 ? (
              <ul className="w-full text-left text-sm text-text-light">
                {visibleFutureEvents.map((event, index) => (
                  <li key={`${typeof event === 'string' ? event : event.name}-${index}`} className="truncate">
                    {typeof event === 'string' ? event : event.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="w-full text-left text-sm text-text-light">Não existem eventos futuros</p>
            )}
            
            {/* TO DO - onclick é suposto ir pra página de mais detalhes do grupo / chat de grupo */}
            <button
            className={'mt-auto w-full max-w-64 self-center bg-button text-white font-bold rounded-4xl text-xl h-9'}
            onClick={onClick}
            >
                Mais Detalhes
            </button>
        </div>

    </div>
  )
}


