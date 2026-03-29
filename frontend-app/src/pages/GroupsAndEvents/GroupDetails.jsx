import { useNavigate } from 'react-router-dom'
import Title from '../../components/Title'
import EventCard from '../../components/EventCard'

{/* TO DO- trocar a group data pela verdadeira informação com o backend */}

const groupData = {
  name: 'Crochet em Adaúfe',
  location: 'Adaúfe, Braga',
  image:
    'https://images.unsplash.com/photo-1612969308146-066de702f4fe?auto=format&fit=crop&w=800&q=80',
  description: [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  ],
  futureEvents: [
    {
      name: 'Reunião de Abril de Crochet em Adaúfe',
      date: '8 de abril 2026',
      time: '15:30 h',
      place: 'Centro de Dia',
      organizer: 'Universidade do Minho',
    },
    {
      name: 'Reunião de Maio de Crochet em Adaúfe',
      date: '8 de maio 2026',
      time: '15:30 h',
      place: 'Centro de Dia',
      organizer: 'Universidade do Minho',
    },
  ],
}

function GroupDetails() {
  const navigate = useNavigate()

  return (
    <section id="center" className="flex min-h-dvh w-full flex-col bg-background">
      <Title name={groupData.name} path="/myGroups" />

      <div className="px-4 pb-8 text-left text-text-light">
        <div className="mb-5 flex gap-4">
          <img
            src={groupData.image}
            alt={groupData.name}
            className="h-28 w-28 rounded-2xl object-cover object-center"
          />

          <div className="flex min-w-0 flex-1 flex-col justify-center">
            <p className="text-4xl font-bold leading-tight text-black">{groupData.name}</p>
            <p className="mt-1 text-2xl font-semibold text-text-light">Localidade: {groupData.location}</p>
            <p className="mt-1 text-xl text-text-light">....ver base de dados</p>
          </div>
        </div>

        <h2 className="mb-2 text-2xl font-bold text-black">Descrição</h2>
        <p className="mb-4 text-lg leading-relaxed">{groupData.description[0]}</p>
        <p className="mb-5 text-lg leading-relaxed">{groupData.description[1]}</p>

        <h2 className="mb-1 text-4xl font-bold text-black">Eventos Futuros</h2>
        {groupData.futureEvents.length > 0 ? (
          <div>
            {groupData.futureEvents.map((event) => (
              <EventCard
                key={event.name}
                name={event.name}
                date={event.date}
                time={event.time}
                place={event.place}
                organizer={event.organizer}
                onClick={() => navigate('/eventDetails')}
              />
            ))}
          </div>
        ) : (
          <p className="mt-4 text-center text-3xl font-semibold text-text-light">
            Não existem eventos futuros.
          </p>
        )}
      </div>
    </section>
  )
}

export default GroupDetails