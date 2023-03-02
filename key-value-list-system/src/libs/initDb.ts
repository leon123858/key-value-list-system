import { Collection, Db, MongoClient } from 'mongodb';
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);

declare global {
	var DBO: {
		db: Db;
		pages: Collection;
	};
}

export async function init() {
	await client.connect();
	console.log('connect mongoDB success');
	const db = client.db('key-value-list');
	global.DBO = {
		db: db,
		pages: db.collection('pages'),
	};
}

export async function closeDb() {
	await client.close();
}
