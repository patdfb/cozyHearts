import Title from '../components/Title'
import EventCard from '../components/EventCard'

function EventsNearMe() {
  return (
    <>
      <section id="center" className="flex min-h-dvh w-full flex-col">
        <Title name="Eventos perto de mim"/>
        <div className="px-4">
            <EventCard name={"Teste"} date={"3 de abril 2026"} time={"12:00"} place={"aaaa"} organizer={"bbbbbb"} onClick={() => {}} subscribe={true}/> {/* TO DO ligar ao backend, com as infos daqui*/}
            <EventCard name={"Teste"} date={"3 de abril 2026"} time={"12:00"} place={"aaaa"} organizer={"bbbbbb"} canceledReason={"mau tempo"} onClick={() => {}} onCancelSubscription={() => {}}/> {/* TO DO ligar ao backend, com as infos daqui*/}
        </div>
      </section>
    </>
  )
}  {/* TO DO BACKEND o mesmo mas apenas os que são perto ig */}

export default EventsNearMe
