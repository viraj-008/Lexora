import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import bodyParser from 'body-parser'
import cookiesParser from 'cookie-parser'
import connectDB from './config/dbConnection'
import authRoutes from './routes/authRoute'
import ProductsRoutes from './routes/productRoute'
import cartRoute from './routes/cartRoute'

dotenv.config();

const PORT=process.env.PORT || 8080

const app = express();
const corsOption ={
    origin:process.env.FRONTEND_URL,
    credentials: true 
}

app.use(cors(corsOption));
app.use(express.json());
app.use(bodyParser.json())
app.use(cookiesParser())

connectDB()

app.use('/api/auth',authRoutes)
app.use('/api/product',ProductsRoutes)
app.use('/api/cart',cartRoute)

app.listen(PORT,()=>{
    console.log('server run on =>',PORT)
})