require('dotenv').config();
const express = require('express');
const app = express();
const graphs = require('./graphs');
const fetch = require('node-fetch');


//register view engine
app.set('view engine', 'ejs');

app.use(express.static('public'));
//listen for requests
app.listen(8080)

//routing

app.get('/', (req,res)=>{
    // console.log(req);
    res.render('home',{stats: null});
});

var graph1;
app.get('/player',async (req,res)=>{
    // console.log(req);
    let username = req.query.username;
    let region = req.query.region;
    
    // let stats = graphs.getStats(username,region);
    let accID = await graphs.getAccountId(username,region)
    console.log("index file acc id :" + accID);
    let stats = await graphs.getPlayerHomeStats(accID);
    console.log("index file stats is : ");
    console.log(stats);

    graph1 = await graphs.getGraph1Data(stats);
    console.log(graph1);

    res.render('home', {stats,graph1});
});

app.get('/graph1', (req,res) => {
    console.log(graph1);
    if(graph1 != null)
    {
       res.send(graph1); 
    }
});