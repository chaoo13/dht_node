// th_repositoty.js

class ThRepository {
    

    constructor(dao) {
        this.dao = dao;
    }

    getSummary(qDate) { // qDate : yyyy-mm-dd
        return this.dao.all('Select cdate, chour, cminute, avgtemp, avghumid from tbsummary where cdate = ?', [qDate]);
    }    
    getLastTenTh() {
        return this.dao.all('Select rowid, temp, humid, ctime from (Select rowid, temp, humid, ctime from tbth2 order by ctime desc limit 10) a order by ctime asc', []);
    }

    getLastTenAfterRowid(rowId) {
        return this.dao.all('Select rowid, temp, humid, ctime from tbth2 where rowid > ? order by ctime asc limit 10', [rowId]);
    }

    makeYesterdaySummary() {
        return this.dao.run("insert into tbsummary SELECT strftime('%Y-%m-%d',ctime) as cdate, strftime('%H',ctime) AS chour, (cast(strftime('%M',ctime) as integer) / 30) * 30 as cminute , round(AVG(temp),1) AS avgtemp , round(AVG(humid),1) as avghumid from tbth2 Where strftime('%Y-%m-%d',ctime) = strftime('%Y-%m-%d', date('now','-1 day')) group by cdate, chour, cminute;", []);
    }

}
module.exports = ThRepository