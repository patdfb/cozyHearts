import { useNavigate } from 'react-router-dom'
import Title from '../../components/Title'
{/* TO DO - backend arranjar pls, acho que o route devia ser o id do evento ou algo assim, por isso esta página não está ligada a lado nenhum  */}
function EventDetails(name, date, time, place, organizer, description) {
  const navigate = useNavigate()

  return (
    <section id="center" className="relative flex min-h-dvh w-full flex-col pb-24">
      <Title name="Mais Detalhes" path="/myEvents" />

      <div className="px-4 pb-6 text-left text-text-light">
        <h1 className="mb-4 text-3xl font-bold leading-tight text-black">
          {name}
        </h1>

        <div className="mb-6 space-y-1 text-base">
          <p>
            <span className="font-semibold">Dia:</span> {date}
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

        <h2 className="mb-3 text-2xl font-bold text-black">Descrição</h2>
        <p className="mb-4 text-base leading-relaxed">
            {description}
        </p>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-20 border-t-4 border-button bg-background px-4 pb-4 pt-3">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate('/myEvents')}
            className="h-10 w-full rounded-4xl bg-button text-sm font-bold text-white"
          >
            Voltar
          </button>
          <button
            type="button"
            className="h-10 w-full rounded-4xl bg-error text-sm font-bold text-white"
          >
            Cancelar Inscrição
          </button>
        </div>
      </div>
    </section>
  )
}

export default EventDetails