require('dotenv').config();
const express = require('express');
const app = express();
const graphs = require('./graphs');
const fetch = require('node-fetch');
const { getPlayersVehicleStatistics } = require('./graphs');


//register view engine
app.set('view engine', 'ejs');

app.use(express.static('public'));
//listen for requests
app.listen(8080)

//routing

//home page routes
app.get(['/','/home'], (req,res)=>{
    // console.log(req);
    res.render('home',{stats: null});
});

var graph1, graph234;
app.get('/player',async (req,res)=>{
    // console.log(req);
    let username = req.query.username;
    let region = req.query.region;
    
    let stats = await graphs.getStats(username,region);
    graph1 = await graphs.getGraph1Data(stats);

    vehicleStats = await graphs.getPlayersVehicleStatistics(username,region);
    // console.log(vehicleStats);

    graph234 = await graphs.getGraph234Data(vehicleStats);

    res.render('home', {stats});
});

app.get('/graph1', (req,res) => {
    // console.log(graph1);
    if(graph1 != null)
    {
       res.send(graph1); 
    }
});

app.get('/graph234', (req,res) => {
    if(graph234 != null)
    {
        res.send(graph234);
    }
});

//table page routes

app.get('/table', (req, res) => {
    res.render('table');
});

//map page routes
app.get('/map', (req, res) => {
    res.render('table');
});

//tech tree page routes
app.get('/table', (req, res) => {
    res.render('table');
});