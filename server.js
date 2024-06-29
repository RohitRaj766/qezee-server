const express = require('express');

const db = require('./config/db')
const bodyParser = require('body-parser');
const adminRouter = require('./routes/adminRoute');
const TotalQuiz = require('./model/quiz');

const app = express();
const PORT = 5000;
app.use(bodyParser.json())//req body

app.use('/admin',adminRouter)


app.listen(PORT || 3000,()=>{
    console.log(`Server Runing at ${PORT}`)
})