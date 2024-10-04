import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import authRoutes from './routes/authRoutes.js'
const app = express()
const PORT = process.env.PORT || 4080

mongoose.connect("mongodb://localhost:27017/authuserdetails")
.then(()=>console.log('MongoDb connected'))
.catch(err=>console.error('MongoDB connection error:',err));


app.use(express.json())
app.use(cors());
app.use('/',authRoutes);
app.listen(PORT,()=>{
    console.log(`Server running on PORT ${PORT}`)
})