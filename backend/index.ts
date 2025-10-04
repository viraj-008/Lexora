import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import bodyParser from 'body-parser'
import cookiesParser from 'cookie-parser'
import connectDB from './config/dbConnection'
import authRoutes from './routes/authRoute'
import ProductsRoutes from './routes/productRoute'
import cartRoute from './routes/cartRoute'
import wishListRoutes from './routes/wishListRouts'
import addressRoutes from './routes/addressRoute'
import userRoutes from './routes/userRoutes'
import orderRoutes from './routes/orderRoutes'
import passport from './controllers/strategy/googlestrategy'


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
app.use('/api/wishlist',wishListRoutes)
app.use('/api/user/address',addressRoutes)
app.use('/api/user',userRoutes)
app.use(passport.initialize)
app.use('/api/order',orderRoutes)

app.listen(PORT,()=>{
    console.log('server run on =>',PORT)
})