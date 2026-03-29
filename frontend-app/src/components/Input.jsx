export default function Input({ icon = null, nameIcon = null, name = '', placeholder = 'help', value = '', onChange = () => {}, type = 'text' }) {

  return (
    <form className="w-auto max-w-sm mx-4">
      <div className=" md:flex md:items-center">
        <div className="md:w-1/3">
          <label className="block pr-4 font-bold text-gray-500 md:mb-0 md:text-right">
            <span>
              {nameIcon ? <span aria-hidden="true">{nameIcon}</span> : null}
              <span>{name}</span>
            </span>
          </label>
        </div>

        <div className="md:w-2/3">
          <div className="relative">
            {icon ? (
              <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-gray-400" aria-hidden="true">
                {icon}
              </span>
            ) : null}

            <input
              id="inline-full-name"
              className={`h-20 w-full appearance-none rounded-4xl border-2 border-gray-200 bg-gray-200 py-2 leading-tight text-gray-700 text-3xl focus:border-button-selected focus:bg-white focus:outline-none ${icon ? 'pl-16 pr-4' : 'px-4'}`}
              type={type}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
            />
          </div>
        </div>
      </div>
    </form>
  )

}

