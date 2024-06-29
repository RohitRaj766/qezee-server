const express = require('express');


const app = express();
const PORT = 5000;

app.listen(PORT || 3000,()=>{
    console.log(`Server Runing at ${PORT}`)
})