const mysql = require('mysql');
const con = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'nodeapi'
});
module.exports = con;
/*con.connect((err) => {
	if(err) {
		console.log('Error while connecting to db');
		return;
	}
	console.log('connected!');
});
con.query('SELECT * FROM users', (err,rows) => {
	if(err) throw err;
	var string = JSON.stringify(rows);
	var json =  JSON.parse(string);
	console.log(json[0].name);
}); */

