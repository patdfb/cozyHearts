import Title from '../components/Title'

function Help() {
  return (
    <section id="center" className="flex min-h-dvh w-full flex-col pb-10">
      <Title name="Ajuda" path="/main" />

      <div className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-2xl rounded-3xl bg-container p-6 text-left">
          <p className="text-2xl font-semibold leading-relaxed text-black">
            Se precisar de ajuda com a APP, por favor envie email para{' '}
            <a
              href="mailto:cozyhearts@cozyhearts.pt"
              className="text-button-selected underline"
            >
              cozyhearts@cozyhearts.pt
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  )
}

export default Help
