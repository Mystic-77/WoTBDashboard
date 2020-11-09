window.addEventListener('load', async event => {
    var mapdata = await fetch("/mapdata")
    .then(res => {
        console.log(res);
        return res.json();
    })
    .catch(err => {
        console.log(err);
    });

    console.log(mapdata);
      
      Plotly.setPlotConfig(mapdata.config)
      
      Plotly.newPlot('map', mapdata.data, mapdata.layout)
});