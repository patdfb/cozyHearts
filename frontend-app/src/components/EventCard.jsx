export default function EventCard({
  name,
  date,
  time,
  place,
  organizer,
  canceledReason = null,
  onClick,
  subscribe = false,
  onSubscribe,
  onCancelSubscription,
}) {
  return (
    <article className="w-full py-4">
      <div
        className={`w-full rounded-2xl p-4 text-left ${
          canceledReason ? 'bg-error-container' : 'bg-container'
        }`}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <p className="text-xl font-bold text-black">{name}</p>
        </div>

        <div className="space-y-1 text-sm text-text-light">
          <p>
            <span className="font-semibold">Data:</span> {date}
          </p>
          <p>
            <span className="font-semibold">Hora:</span> {time}
          </p>
          <p>
            <span className="font-semibold">Local:</span> {place}
          </p>
          <p>
            <span className="font-semibold">Organizador:</span> {organizer}
          </p>
        </div>

        {canceledReason ? (
          <div className="mt-4 p-2 rounded-2xl bg-error text-center">
            <span className="rounded-full px-3 py-1 text-3xl font-semibold text-white">
              CANCELADO
            </span>
            <p className="mt-2 text-l text-white">"Razão:" {canceledReason}</p>
          </div>
        ) : (
          <div className="mt-4 flex gap-2">
            <button
              className="h-9 w-full rounded-4xl bg-button text-sm font-bold text-white"
              onClick={onClick}
              type="button"
            >
              Mais Detalhes
            </button>
            {subscribe ? (
              <button
                className="h-9 w-full rounded-4xl bg-button text-sm font-bold text-white"
                onClick={onSubscribe}
                type="button"
              >
                Inscrever
              </button>
            ) : (
              <button
                className="h-9 w-full rounded-4xl bg-error text-sm font-bold text-white"
                onClick={onCancelSubscription}
                type="button"
              >
                Cancelar Inscrição
              </button>
            )}
            
          </div>
        )} {/* TO DO colocar backend cancelar inscrição*/}
      </div>
    </article>
  )
}


