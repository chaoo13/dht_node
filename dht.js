// const sqlite3 = require('sqlite3').verbose();
const Promise = require('bluebird');
const AppDao = require('./AppDao');
const CronDao = require('./CronDao');
const ThRepository = require('./th_repositoty');
const CronRepository = require('./cron_repositoty');
const express = require('express');
var cron = require('node-cron');
const app = express();
const port = 3000;
const dao = new AppDao('/home/pi/dmt/db/dhtSQL.db');
const cronDao = new CronDao('/home/pi/dmt/db/dhtSQL.db');
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
	console.log('App listening at ${port}');
});

cron.schedule('0 9 * * *', ()=> {
	console.log('running crontab');
	cronRepo.makeYesterdaySummary();
})
// var rowId;

// function main() {
// 	const dao = new AppDao('/home/pi/dmt/db/dhtSQL.db');
// 	const thRepo = new ThRepository(dao);
	
// 	thRepo.getLastTenTh().then((th)=>{
// 		console.log("First ten")
// 		var rowId;
// 		rowId = th[0].rowid ;
// 		console.log("RowId: " + rowId);
// 		th.forEach((row) => {
// 			console.log(row.temp + ", " + row.humid + ", " + row.rowid);
// 		});
// 		return rowId
// 	}).then(function (rowId){
// 		setInterval(getNextTh, 5000, [rowId]);		
// 	});
	
	
// }

// SELECT strftime('%H',ctime) AS hour, AVG(temp) AS average from tbth2 Where Date(ctime) = Date('2021-03-30') group by hour;
// SELECT '2021-03-30', strftime('%H',ctime) AS hour, cast(strftime('%M',ctime) as integer) / 30 as minute , AVG(temp) AS average from tbth2 Where Date(ctime) = Date('2021-03-30') group by hour, minute;
// SELECT '2021-03-30', strftime('%H',ctime) AS hour, (cast(strftime('%M',ctime) as integer) / 30) * 30 as minute , round(AVG(temp),1) AS avgtemp , round(AVG(humid),1) as avghumid from tbth2 Where Date(ctime) = Date('2021-03-30') group by hour, minute;

// function waiting(){
// 	console.log("waiting....");
// }

// function getNextTh(rowId) {
// 	console.log("first call : " + rowId);
// 	const dao = new AppDao('/home/pi/dmt/db/dhtSQL.db');
// 	const thRepo = new ThRepository(dao);
// 	thRepo.getLastTenAfterRowid(rowId).then((th)=>{
// 		rowId = th[0].rowid ;
// 		th.forEach((row) => {
// 			console.log(row);
// 		});
// 	});
// 	return rowId;
// }


// main()
