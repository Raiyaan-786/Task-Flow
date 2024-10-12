import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,  // Allow credentials (cookies, etc.)
}));

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))
app.use(cookieParser())

// Routes 
import userRoutes from './routes/user.routes.js'
import taskRoutes from './routes/task.routes.js'
app.use('/api/auth',userRoutes);
app.use('/api' , taskRoutes)

export { app } ;