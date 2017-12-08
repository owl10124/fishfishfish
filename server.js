const express = require('express');
const http    = require('http');
const path    = require('path');
const app     = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, "/views/fishie.html"));
})

var server = app.listen(6262, () => {
    console.log("listening on port 6262");
})