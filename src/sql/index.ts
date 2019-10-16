import mysql from 'mysql';


// create connection
const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'password',
	database: 'my_db'
});

// connect to db
connection.connect();

