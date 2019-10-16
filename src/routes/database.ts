import express, { Request, Response } from 'express';
import mysql from 'mysql';

import logger from '../logger';

export const router = express.Router();

const dbName = 'my_db';
const tableName = 'posts';

/**
 * login to the db will stay constant
 */
// create connection
const connection = mysql.createConnection({
	host: '127.0.0.1',  // can also use 'localhost'
	user: 'root',
	// password: 'password',
	database: dbName  // can't include if initially creating. but okay afterwards
});

// connection.connect(error => {
// 	if (error) {
// 		logger.error(error);
// 		throw error;
// 	}
// 	logger.info('MySql connected...');
// });

/**
 * open connection
 * a connection can also be implicitly established by invoking a query
 */
router.get('/establish', (req: Request, res: Response) => {
	const openConnection = mysql.createConnection({
		host: '127.0.0.1',  // can also use 'localhost'
		user: 'root',
	});

	// connect and create db using SQL command
	openConnection.connect((error, result) => {
		if (error) {
			logger.error(error);
			throw error
		}
		console.log('result: ',result)
		logger.info(`Connection opened with the following feedback: ${JSON.stringify(result)}.`)
		res.send('Connection opened.');
	})
});

/**
 * create db
 */
router.get('/createdb', (req: Request, res: Response) => {

	// SQL query
	const createDB = `CREATE DATABASE ${dbName}`

	// connect and create db using SQL command
	connection.query(createDB, (error, result) => {
		if (error) {
			logger.error(error);
			throw error
		}
		console.log('result: ',result)
		logger.info(`${dbName} DB created with the following feedback: ${JSON.stringify(result)}.`)
		res.send(`${dbName} DB created.`);
	})
});

/**
 * create table
 */
router.get('/createtable', (req: Request, res: Response) => {

	// SQL query (100% pure sql)
	const createTable = `CREATE TABLE ${tableName}(id int AUTO_INCREMENT, title VARCHAR(255), body VARCHAR(255), PRIMARY KEY (id))`  // create table called posts with id that's an integer that'll auto increment. it'll have a title & body that'll have a max of 255 characters. the primary key will be set to the id.

	connection.query(createTable, (error, result) => {
		if (error) {
			logger.error(error);
			throw error;
		}
		console.log('result: ',result)
		logger.info(`${tableName} table created with the following feedback: ${JSON.stringify(result)}.`)
		res.send(`${tableName} table created.`);
	})
});

/**
 * insert first post
 */
router.get('/addpost1', (req: Request, res: Response) => {
	const post = { title: 'Post one', body: 'This is the first post' };
	const addPost = `INSERT INTO ${tableName} SET ?`;  // ? represents a placeholder of what will be filled in during the query
	connection.query(addPost, post, (error, result) => {
		if (error){
			logger.error(error);
			throw error;
		}
		console.log('result: ',result)
		logger.info(`post added with the following feedback: ${JSON.stringify(result)}.`)
		res.send(`post added to ${tableName}.`);
	})
})

/**
 * insert more posts
 */
router.get('/addmoreposts', (req: Request, res: Response) => {
	try{
		const numbers = ['two', 'three', 'four', 'five'];
		for (const eachPost of numbers){
			const post = { title: `Post ${eachPost}`, body: 'This is another post.' };
			const addPost = `INSERT INTO ${tableName} SET ?`;  // ? represents a placeholder of what will be filled in during the query
			connection.query(addPost, post, (error, result) => {
				if (error){
					logger.error(error);
					throw error;
				}
				console.log('result: ',result)
				logger.info(`post ${eachPost} added with the following feedback: ${JSON.stringify(result)}.`)
			})
		}
		res.send(`posts added to ${tableName}.`);
	} catch (error) {
		logger.error(error);
		throw error;
	}
})

/**
 * fetch posts
 */
router.get('/getposts', (req: Request, res: Response) => {
	const getPosts = `SELECT * FROM ${tableName}`;  
	connection.query(getPosts, (error, result) => {
		if (error){
			logger.error(error);
			throw error;
		}
		console.log('result: ',result)
		logger.info(`posts fetched with the following feedback: ${JSON.stringify(result)}.`)
		res.send(`posts fetched from ${tableName}.`);
	})
})

/**
 * fetch single post
 */
router.get('/getpost/:id', (req: Request, res: Response) => {
	const getSinglePost = `SELECT * FROM ${tableName} WHERE id = ${req.params.id}`;  
	connection.query(getSinglePost, (error, result) => {
		if (error){
			logger.error(error);
			throw error;
		}
		console.log('result: ',result)
		logger.info(`post fetched with the following feedback: ${JSON.stringify(result)}.`)
		res.send(`post fetched from ${tableName}.`);
	})
})

/**
 * update single post
 */
router.get('/updatepost/:id', (req: Request, res: Response) => {
	const newTitle = 'Updated title'
	const updateSinglePost = `UPDATE ${tableName} SET title = '${newTitle}' WHERE id = ${req.params.id}`;  // note the quotes for SET
	connection.query(updateSinglePost, (error, result) => {
		if (error){
			logger.error(error);
			throw error;
		}
		console.log('result: ',result)
		logger.info(`post updated with the following feedback: ${JSON.stringify(result)}.`)
		res.send(`post ${req.params.id} updated for ${tableName}.`);
	})
})

/**
 * delete single post
 */
router.get('/deletepost/:id', (req: Request, res: Response) => {
	const deleteSinglePost = `DELETE FROM ${tableName} WHERE id = ${req.params.id}`;  // note the quotes for SET
	connection.query(deleteSinglePost, (error, result) => {
		if (error){
			logger.error(error);
			throw error;
		}
		console.log('result: ',result)
		logger.info(`post ${req.params.id} deleted with the following feedback: ${JSON.stringify(result)}.`)
		res.send(`post ${req.params.id} deleted for ${tableName}.`);
	})
})

// // Terminating connections
// connection.end(function(err) {
//   // The connection is terminated now
// });

/**
 * close connection
 * don't terminate as that will cause issue down the road
 */
router.get('/terminate', (req: Request, res: Response) => {
	try {
		connection.end((error) => {
			if (error){
				logger.error(error);
				throw error;
			}
			logger.info(`${dbName} DB connection closed.`)
			res.send(`${dbName} DB connection closed.`);
		});
	} catch (error) {
		logger.error(error);
		throw error;
	}
})

/**
 * ping connection
 * not really needed
 */
router.get('/ping', (req: Request, res: Response) => {
	try {
		connection.ping((error) => {
			if (error){
				logger.error(error);
				logger.info('Server not running.')
				res.send('Server not running.');
			} else {
				logger.info('Server running.')
				res.send('Server running.');
			}
		});
	} catch (error) {
		logger.error(error);
		throw error;
	}
})

