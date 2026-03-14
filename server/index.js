const express = require('express')
const mongoose = require('mongoose')
const app = express();
require('dotenv').config();
const cors = require('cors')
app.use(cors({
    origin: true,
    credentials: true
}))
app.use(express.json())
const mongoURL = process.env.URI
const ConnectToMongo = async ()=>{
    try {
        await mongoose.connect(mongoURL);
        console.log("Connection to mongo successfull")
        console.log("---------------------------")
    } catch (error) {
        console.log("Error in Connection",error)
    }
}
ConnectToMongo();

app.use('/api/image', express.static('./uploads'));
app.use('/api/user',require('./routes/userroute'))
app.use('/api/category',require('./routes/categoryroute'))
app.use('/api/subcategory',require('./routes/subcategoryroute'))
app.use('/api/product',require('./routes/productroute'))
app.use('/api/admin',require('./routes/adminroute'))
app.use('/api/cart',require('./routes/cartroute'))
app.use('/api/address',require('./routes/addressroute'))
app.use('/api/order',require('./routes/orderroute'))

const portno = process.env.PORTNO || 5000;
app.listen(portno,"0.0.0.0",()=>{
    console.log(`Server is running on port ${portno}`)
});