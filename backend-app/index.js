import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import atividadesRoutes from './routes/atividades.js'
import usuariosRoutes from './routes/usuarios.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/atividades', atividadesRoutes)
app.use('/usuarios', usuariosRoutes)

app.get('/', (req, res) => res.json({ message: 'Cozy Hearts Backend is running!' }))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
