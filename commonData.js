const fetch = require('node-fetch');

var appId = process.env.APP_ID;

async function getPlayerTankStats(accID)
{
    var tankStats = await fetch(`https://api.wotblitz.asia/wotb/tanks/stats/?application_id=${appId}&account_id=${accID}&language=en`).then(res => {
        return res.json();
    }).catch(err => {
        console.log(err);
    });

    console.log(tankStats);
}

module.exports = {
    getPlayerTankStats
};