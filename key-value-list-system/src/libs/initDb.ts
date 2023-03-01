import { Collection, MongoClient } from 'mongodb';
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

declare global {
	var DBO: {
		pages: Collection;
		heads: Collection;
	};
}

export async function init() {
	await client.connect();
	console.log('connect mongoDB success');
	const db = client.db('key-value-list');
	global.DBO = {
		pages: db.collection('pages') as Collection,
		heads: db.collection('heads') as Collection,
	};
}

export async function closeDb() {
	await client.close();
}
