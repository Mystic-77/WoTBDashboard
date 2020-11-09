require('dotenv').config();
const express = require('express');
const app = express();
const graphs = require('./graphs');

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

var username, region;
var graph1, graph234, table;
app.get('/player',async (req,res)=>{
    // console.log(req);
    username = req.query.username;
    region = req.query.region;
    
    let stats = await graphs.getStats(username,region);
    graph1 = await graphs.getGraph1Data(stats);

    vehicleStats = await graphs.getPlayersVehicleStatistics(username,region);
    // console.log(vehicleStats);

    graph234 = await graphs.getGraph234Data(vehicleStats);
    table = await graphs.getPlayerTankStats();


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

app.get('/table', async (req, res) => {
    // table.forEach(element => {
    //     console.log(element.info.nation);
    // });
    res.render('table', {table});
});

//map page routes
app.get('/map', (req, res) => {
    res.render('map');
});

app.get('/mapdata', async (req, res) => {
    let mapdata = await graphs.getServerInfo();
    console.log(mapdata);
    res.send(mapdata);
});

//tech tree page routes
app.get('/techtree', (req, res) => {
    res.render('techtree');
});
