const express = require('express');

const db = require('./config/db')
const bodyParser = require('body-parser');
const adminRouter = require('./routes/adminRoute');
const userRouter = require('./routes/userRoute');

const app = express();
const PORT = 5000;
app.use(bodyParser.json());

app.use('/admin',adminRouter);
app.use('/user',userRouter);


app.listen(PORT || 3000,()=>{
    console.log(`Server Runing at ${PORT}`);
})