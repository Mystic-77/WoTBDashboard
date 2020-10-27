window.addEventListener('load',async event => {
    let graph1 = await fetch('/graph1').then(res => {
        return res.json();
    });
    
    Plotly.newPlot('graph1', graph1.data, graph1.layout);
});


