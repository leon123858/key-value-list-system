import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

before(async () => {
	console.log('Start Test');
	mongoServer = await MongoMemoryServer.create({ instance: { port: 27017 } });
});

after(async () => {
	await mongoServer.stop();
	console.log('End Test');
});
