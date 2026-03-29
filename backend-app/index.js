import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import atividadesRoutes from './routes/atividades.js'
import usuariosRoutes from './routes/usuarios.js'
import interesseRoutes from './routes/interesse.js'

dotenv.config()

const app = express()

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true
}))
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/atividades', atividadesRoutes)
app.use('/usuarios', usuariosRoutes)
app.use('/interesses', interesseRoutes)

app.get('/', (req, res) => res.json({ message: 'Cozy Hearts Backend is running!' }))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
