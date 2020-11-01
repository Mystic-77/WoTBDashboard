window.addEventListener('load',async event => {
    let graph1 = await fetch('/graph1').then(res => {
        return res.json();
    });
    let config = {
        responsive: true,
        displayModeBar: false
    };
    Plotly.newPlot('graph1', graph1.data, graph1.layout, config);

    let vehicleStats = await fetch('/graph234').then(res => {
        return res.json();
    });
    console.log(vehicleStats);
   let graph2 = vehicleStats.graph2;
   let graph3 = vehicleStats.graph3;
   let graph4 = vehicleStats.graph4;

    Plotly.newPlot('graph2', graph2.data, graph2.layout, config);
    Plotly.newPlot('graph3', graph3.data, graph3.layout, config);
    Plotly.newPlot('graph4', graph4.data, graph4.layout, config);
})


