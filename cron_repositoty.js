// cron_repositoty.js

class CronRepository {
    constructor(dao) {
        this.dao = dao;
    }

    makeYesterdaySummary() {
        return this.dao.run("insert into tbsummary SELECT strftime('%Y-%m-%d',ctime) as cdate, strftime('%H',ctime) AS chour, (cast(strftime('%M',ctime) as integer) / 30) * 30 as cminute , round(AVG(temp),1) AS avgtemp , round(AVG(humid),1) as avghumid from tbth2 Where strftime('%Y-%m-%d',ctime) = strftime('%Y-%m-%d', date('now','-1 day')) group by cdate, chour, cminute;", []);
    }

}
module.exports = CronRepository