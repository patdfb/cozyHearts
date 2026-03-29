export default function InterestCard({ name, photo, onClick, exclude=true, description, buttonText}) {

  const getButtonText = () => {
    if (buttonText) return buttonText;
    return exclude ? 'Excluir Interesse' : 'Mais Detalhes';
  };

  return (
    <div className="w-full py-4 flex flex-row gap-3">

        <img src={photo} alt={name} className="w-1/3 h-34 object-cover  object-center rounded-xl"/>

        <div className="w-2/3 h-34 flex flex-col gap-3">
            <p className="w-full text-left text-xl text-black">
                {name}
            </p>

              <p className="w-full text-left text-sm line-clamp-2 text-text-light">{description}</p>

            {/* TO DO - onclick é suposto ir pra página de mais detalhes do grupo / chat de grupo */}
            <button
            className={`mt-auto w-full max-w-64 self-center ${exclude ? 'bg-error' : 'bg-button'} text-white font-bold rounded-4xl text-xl h-9`}
            onClick={onClick}
            >
                {getButtonText()}
            </button>
        </div>

    </div>
  )
}


