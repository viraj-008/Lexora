import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import bodyParser from 'body-parser'
import cookiesParser from 'cookie-parser'
import connectDB from './config/dbConnection'

dotenv.config();

const PORT=process.env.PORT || 8080

const app = express();
const corsOption ={

    origin:process.env.FRONTEND_URL,
    Credential:true

}

app.use(cors(corsOption));
app.use(express.json());
app.use(bodyParser.json())
app.use(cookiesParser())

connectDB()

app.listen(PORT,()=>{
    console.log('server run on =>',PORT)
})