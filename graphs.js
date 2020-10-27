const fetch = require('node-fetch');

var appId = process.env.APP_ID;

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
    console.log(accountResponse);
    var accID = accountResponse.data[0].account_id;

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
    console.log(playerStats);
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
            // colors: ["#fab81b","#bc2515","#5a9445"]
            colors: ["#5a9445", "#bc2515", "#fab81b"]
        }
      }];
      
      var layout = {
        font: {
            color: "white"
        },
        plot_bgcolor: "#00000000",
        paper_bgcolor: "#00000000", 
        responsive: true
      };

      return {data, layout};
}

async function getStats(username,region)
{
    let accID = await graphs.getAccountId(username,region).then(res => {
        return res.json();
    }).catch(err => {
        console.log(err);
    });

    let stats = await graphs.getPlayerHomeStats(accID).then(res => {
        return res.json();
    }).catch(err => {
        console.log(err);
    });
    return stats;
}

module.exports = {
    getAccountId,
    getPlayerHomeStats,
    getGraph1Data,
    getStats
};