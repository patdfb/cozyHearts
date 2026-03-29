import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function Input({
  icon = null,
  nameIcon = null,
  name = '',
  placeholder = 'help',
  type = 'text',
}) {
  const [showPassword, setShowPassword] = useState(false)
  const isPasswordField = type === 'password'
  const resolvedType = isPasswordField && showPassword ? 'text' : type

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
              className={`h-20 w-full appearance-none rounded-4xl border-2 border-gray-200 bg-gray-200 py-2 leading-tight text-gray-700 text-3xl focus:border-button-selected focus:bg-white focus:outline-none ${icon ? 'pl-16' : 'pl-4'} ${isPasswordField ? 'pr-16' : 'pr-4'}`}
              type={resolvedType}
              placeholder={placeholder}
            />

            {isPasswordField ? (
              <button
                type="button"
                onClick={() => setShowPassword((previous) => !previous)}
                className="absolute inset-y-0 right-4 flex items-center text-gray-500"
                aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
              >
                {showPassword ? <EyeOff size={28} /> : <Eye size={28} />}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </form>
  )

}

