import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import atividadesRoutes from './routes/atividades.js'
import usuariosRoutes from './routes/usuarios.js'
import interesesRoutes from './routes/interesses.js'
import gruposRoutes from './routes/grupos.js'

dotenv.config()

const app = express()

const staticAllowedOrigins = [
  'https://www.cozyhearts.pt',
  'https://cozyhearts.pt',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000'
]

const envAllowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

const allowedOrigins = new Set([...staticAllowedOrigins, ...envAllowedOrigins])
const allowedRegex = [
  /^https:\/\/[a-z0-9-]+\.amplifyapp\.com$/i,
  /^https:\/\/[a-z0-9.-]*cozyhearts\.pt$/i
]

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser clients and same-origin calls without Origin header.
    if (!origin) return callback(null, true)
    if (allowedOrigins.has(origin) || allowedRegex.some((re) => re.test(origin))) {
      return callback(null, true)
    }
    return callback(new Error('Not allowed by CORS'))
  },
  credentials: true
}))
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/atividades', atividadesRoutes)
app.use('/usuarios', usuariosRoutes)
app.use('/interesses', interesesRoutes)
app.use('/grupos', gruposRoutes)

app.get('/', (req, res) => res.json({ message: 'Cozy Hearts Backend is running!' }))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
