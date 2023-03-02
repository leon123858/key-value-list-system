import { expect } from 'chai';
import { init, closeDb } from '../src/libs/initDb';

describe('connect mongo test', function () {
	it('Should init mongoDB when local mongo server exist', async () => {
		await init();
		expect(DBO.pages).is.not.undefined;
	});
	it('Should execute operation on mongo in memory', async () => {
		const response = await DBO.pages.insertOne({
			test: 'test for basic insert',
		});
		const result = await DBO.pages.findOne({ _id: response.insertedId });
		expect(result).eqls({
			_id: response.insertedId,
			test: 'test for basic insert',
		});
	});
	it('Should close mongoDB when local mongo server exist', async () => {
		expect(DBO.pages).is.not.undefined;
		await closeDb();
	});
});
