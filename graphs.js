const fetch = require('node-fetch');


var appId = process.env.APP_ID;
var pVehicleStats, tanks;

async function getAccountId(username, region)
{
    var basicURL = `https://api.wotblitz.${region}/wotb/account/list/?application_id=${appId}`;
    var playerURL = `${basicURL}&search=${username}&language=en`;

    var accountResponse = await fetch(playerURL).then(res => {
        return res.json();
    })
    .catch(err => {
        console.log(err);
    });
    // console.log(accountResponse);
    accID = accountResponse.data[0].account_id;

    return accID;
}

async function getPlayerHomeStats(accID)
{
    console.log('account id is : ' + accID);
    var playerStatsURL = `https://api.wotblitz.asia/wotb/account/info/?application_id=${appId}&account_id=${accID}`;

    var playerStats = await fetch(playerStatsURL).then(res => {
        return res.json();
    })
    .catch(err => {
        console.log(err);
    });
    // console.log(playerStats);
    var stats = playerStats.data[accID].statistics.all;
    // console.log(stats);
    return stats;
}

async function getGraph1Data(stats)
{
    var battles = stats.battles;
    var wins = stats.wins;
    var losses = stats.losses;
    var data = [{
        values: [wins, losses, (battles-wins-losses)],
        labels: ['Victories', 'Defeats', 'Draw'],
        hole: .4,
        automargin: true,
        type: 'pie',
        marker: {
            colors: ["#5a9445", "#bc2515", "#fab81b"]
        }
      }];
      
      var layout = {
        font: {
            color: "white"
        },
        plot_bgcolor: "#00000000",
        paper_bgcolor: "#00000000"
      };

      return {data, layout};
}

async function getPlayersVehicleStatistics(username, region)
{
    let accID = await getAccountId(username,region);
    tanks = await getTankopedia();
    pVehicleStats = await fetch(`https://api.wotblitz.asia/wotb/tanks/stats/?application_id=${appId}&language=en&account_id=${accID}`).then(res => {
        return res.json();
    }).catch(err => {
        console.log(err);
    });

    let tierMap = new Map();
    let nationMap = new Map();
    let typeMap = new Map();

    pVehicleStats.data[accID].forEach(element => {
        let tank_id = element.tank_id;
        let info = tanks.data[tank_id];
        if(info !== undefined)
        {
            let battles = element.all.battles;
            let wins = element.all.wins;
            
            if(!tierMap.has(info.tier))
            {
                tierMap.set(info.tier, {wins, battles});
            }
            else
            {
                tierMap.set(info.tier, {wins: tierMap.get(info.tier).wins += wins,
                battles: tierMap.get(info.tier).battles += battles});
            }

            if(!nationMap.has(info.nation))
            {
                nationMap.set(info.nation, {wins, battles});
            }
            else
            {
                nationMap.set(info.nation, {wins: nationMap.get(info.nation).wins += wins,
                battles: nationMap.get(info.nation).battles += battles});
            }

            if(!typeMap.has(info.type))
            {
                typeMap.set(info.type, {wins, battles});
            }
            else
            {
                typeMap.set(info.type, {wins: typeMap.get(info.type).wins += wins,
                battles: typeMap.get(info.type).battles += battles});
            }
        }
    });

    tierMap = ([...tierMap.entries()].sort((a,b) => parseInt(a) - parseInt(b)));
    nationMap = ([...nationMap.entries()].sort((a,b) => a - b));
    typeMap = ([...typeMap.entries()].sort((a,b) => a - b));

    return {tierMap, nationMap, typeMap};
} 



async function getTankopedia()
{
    var tanks = await fetch(`https://api.wotblitz.asia/wotb/encyclopedia/vehicles/?application_id=${appId}&language=en&fields=tier%2Ctype%2Cnation%2Cname%2Cdescription%2Cis_premium%2Cnext_tanks`).then(res => {
        return res.json();
    }).catch(err => {
        console.log(err);
    });

    return tanks;
}


async function getStats(username,region)
{
    let accID = await getAccountId(username,region);

    let stats = await getPlayerHomeStats(accID);
    return stats;
}

async function getGraph234Data(vehicleStats)
{
    console.log(vehicleStats);
    // let layout = 

    let x2 = [], y2 = [];
    let g2min = 100, g2max = 0;
    vehicleStats.tierMap.forEach(element => {
        x2.push(element[0]);
        let wins = element[1].wins;
        let battles = element[1].battles;
        let vr = ((wins / battles) * 100).toPrecision(4);
        if(vr > g2max)
        {
            g2max = vr;
        }
        if(vr < g2min)
        {
            g2min = vr;
        }
        y2.push(vr);
    });
    let graph2 = {
        data: [{
            x: x2,
            y: y2,
            type: 'bar',
            marker: {
                color: 'orange',//'#5a9445',
                line: {
                    width: 1.5
                },
            }
        }],
        layout: {
            // title: "Winrate by Tier of tank",
            font: {
                color: "white"
            },
            xaxis: {
                title: "Tier",
                showgrid: false,
                showticklabels: true,
                dtick: true
            },
            yaxis: {
                title: 'Winrate',
                showgrid: false,
                range: [parseInt(g2min)-2, parseInt(g2max)+2]
            },
            plot_bgcolor: "#00000000",
            paper_bgcolor: "#00000000"
          }
    };
    // graph2.layout.yaxis.;
    // console.log(graph2.layout.yaxis.range);
    // console.log(graph2);

    let x3 = [], y3 = [];
    let g3min = 100, g3max = 0;
    vehicleStats.nationMap.forEach(element => {
        x3.push(element[0]);
        let wins = element[1].wins;
        let battles = element[1].battles;
        let vr = ((wins / battles) * 100).toPrecision(4);
        if(vr > g3max)
        {
            g3max = vr;
        }
        if(vr < g3min)
        {
            g3min = vr;
        }
        y3.push(vr);
    });
    
    let graph3 = {
        data: [{
            x: x3,
            y: y3,
            type: 'bar',
            marker: {
                color: '#5a9445',
                line: {
                    width: 1.5
                }
            }
        }],
        layout: {
            // title: 'Winrate by Nation',
            font: {
                color: "white"
            },
            xaxis: {
                title: 'Nation',
                showgrid: false,
                showticklabels: true,
                dtick: true
            },
            yaxis: {
                title: 'Winrate',
                showgrid: false,
                range: [parseInt(g3min)-2, parseInt(g3max)+2]
            },
            plot_bgcolor: "#00000000",
            paper_bgcolor: "#00000000"
          }
    };
    // graph3.layout.yaxis.range = [parseInt(g3min)-5, parseInt(g3max)+5];


    let x4 = [], y4 = [];
    let g4min = 100, g4max = 0;
    vehicleStats.typeMap.forEach(element => {
        x4.push(element[0]);
        let wins = element[1].wins;
        let battles = element[1].battles;
        let vr = ((wins / battles) * 100).toPrecision(4);
        if(vr > g4max)
        {
            g4max = vr;
        }
        if(vr < g4min)
        {
            g4min = vr;
        }
        y4.push(vr);
    });
    let graph4 = {
        data: [{
            x: x4,
            y: y4,
            type: 'bar',
            marker: {
                color: '#377369',
                line: {
                    width: 1.5
                }
            }
        }],
        layout: {
            // title: 'Winrate by Type of Tank',
            font: {
                color: "white"
            },
            xaxis: {
                title: 'Type of Tank',
                showgrid: false,
                showticklabels: true,
                dtick: true
            },
            yaxis: {
                title: 'Winrate',
                showgrid: false,
                range: [parseInt(g4min)-2, parseInt(g4max)+2]
            },
            plot_bgcolor: "#00000000",
            paper_bgcolor: "#00000000"
          }
    };
    // graph4.layout.yaxis.range = [parseInt(g4min)-5, parseInt(g4max)+5];

    // console.log(graph2,graph3,graph4);
    // console.log(keys1);
    return {graph2, graph3, graph4};
}

async function getPlayerTankStats()
{
    if(pVehicleStats != null)
    {
        pVehicleStats.data[accID].forEach(element => {
        let tank_id = element.tank_id;
        let info = tanks.data[tank_id];

        if(info !== undefined)
        {
            element.info = info;
        }
    });
    console.log("graphs stats vehicle test");
    console.log(pVehicleStats.data[accID]);
    return pVehicleStats.data[accID];
    }
    
}

module.exports = {
    getAccountId,
    getPlayerHomeStats,
    getGraph1Data,
    getGraph234Data,
    getStats,
    getPlayersVehicleStatistics,
    getPlayerTankStats
};