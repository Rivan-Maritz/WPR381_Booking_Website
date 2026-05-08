const express = require('express');
const path = require('path');
const PORT = 3000;

const app = express();

app.set('view engine','ejs');

app.use(express.static('public'));

app.get('/',(req,res) => {
    res.render("auth/login");
})

app.listen(PORT,() => {
    console.log(`Server is running on http://localhost:${PORT}`);
})