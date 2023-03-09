import { Collection, Db, MongoClient } from 'mongodb';
const url = (port = 27017) => `mongodb://127.0.0.1:${port}`;
let client: MongoClient;

declare global {
	var DBO: {
		db: Db;
		pages: Collection;
	};
}

export async function init(port?: number) {
	client = new MongoClient(url(port));
	await client.connect();
	console.log('connect mongoDB success on:', port);
	const db = client.db('key-value-list');
	global.DBO = {
		db: db,
		pages: db.collection('pages'),
	};
}

export async function closeDb() {
	await client.close();
}
