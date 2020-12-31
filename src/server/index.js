const path = require('path');
const dotenv = require('dotenv');
const express = require('express');
const app = express();
const fetch = require("node-fetch");
dotenv.config();
let tripsData = [];

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('dist'));
console.log(__dirname);

app.get('/', (req, res)=> {
   res.sendFile(path.resolve('src/client/views/index.html'));
});
const port = 8081;
// designates what port the app will listen to for incoming requests
app.listen(port, () =>{
    console.log(`Example app listening on port ${port}!`);
});

app.post('/save', (req, res) =>{
   
    tripsData.push(req.body);
  
});

app.post('/post_pixabay', async (req, res) =>{
   
    const norm = req.body.textContent.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[’#!'$%\^&\*;:{}=\-–_`´~()]/g,"");       
    const url = `https://pixabay.com/api/?key=${process.env.API_KEY_PIXABAY}&q=${norm}&image_type=travel`;

    const response = await fetch(url);
    
    try{    
           
        const data = await response.json();   
        res.send(data);
    }catch(error){
        console.log(error);
    } 
});


app.post('/post_geonames', async (req, res) =>{
   
    const norm = req.body.textContent.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[’#!'$%\^&\*;:{}=\-–_`´~()]/g,"");       
    const url = `http://api.geonames.org/searchJSON?q=${norm}&maxRows=10&username=${process.env.API_GEONAME}`;

    const response = await fetch(url);
    
    try{    
           
        const data = await response.json();   
        res.send(data);
    }catch(error){
        console.log(error);
    } 
});

app.post('/post_wheatherbit', async (req, res) =>{
         
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?&lat=${req.body.textContent[0]}&lon=${req.body.textContent[1]}&key=${process.env.API_WEATHERBIT}`;

    const response = await fetch(url);
    
    try{    
           
        const data = await response.json();   
        res.send(data);
    }catch(error){
        console.log(error);
    } 
});

app.get('/get', (req, res) =>{
   
    res.send(tripsData);
  
});

