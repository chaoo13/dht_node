const Promise = require('bluebird');
const AppDao = require('./AppDao');
const CronDao = require('./CronDao');
const ThRepository = require('./th_repositoty');
const CronRepository = require('./cron_repositoty');
const express = require('express');
var cron = require('node-cron');
const app = express();
const port = 3000;
const dao = new AppDao('/home/pi/dhtproject/db/dht.db');
const cronDao = new CronDao('/home/pi/dhtproject/db/dht.db');
const thRepo = new ThRepository(dao);
const cronRepo = new CronRepository(cronDao);
	
app.get('/', (req,res) => {
	thRepo.getLastTenTh().then(lastTen => {
		res.render('index.html', {lastTen: lastTen});
	});
});

app.get('/get/:rowId', (req,res) => {
	var rowId = req.params.rowId;
	// console.log(rowId);

	thRepo.getLastTenAfterRowid(rowId).then(lastTen => {
		// console.log(lastTen);
		return res.send(lastTen);
	});
});

app.get('/getsum/:qdate', (req,res) => {
	var qDate = req.params.qdate;
	// console.log(rowId);

	thRepo.getSummary(qDate).then(summary => {
		// console.log(lastTen);
		return res.send(summary);
	});
});

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.listen(port, ()=>{
	console.log("App listening at " + port);
});

cron.schedule('0 9 * * *', ()=> {
	console.log('running crontab');
	cronRepo.makeYesterdaySummary();
})



