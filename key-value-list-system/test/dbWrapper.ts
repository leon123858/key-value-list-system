import { expect } from 'chai';
import { init, closeDb } from '../src/libs/initDb';
import {
	getHead,
	getPage,
	createHead,
	createPage,
} from '../src/libs/dbWrapper';
import { ObjectId } from 'mongodb';
import { Page } from '../src/types/types';
import { linkPage, updatePageArticles } from '../src/libs/dbWrapper';

describe('dbWrapper', function () {
	before(async () => {
		await init();
	});
	after(async () => {
		await closeDb();
	});
	describe('get in dbWrapper', function () {
		it('Should not get not exist head/page', async () => {
			expect(await getHead('not-exist-key')).is.null;
			expect(await getPage(new ObjectId())).is.null;
		});
		it('Should error for wrong type parameters', async () => {
			await Promise.all(
				[
					{ func: getHead, param: {} },
					{ func: getPage, param: 'Wrong page id' },
				].map(async (v) => {
					try {
						await v.func(v.param as any);
					} catch {
						return;
					}
					throw 'Should error above';
				})
			);
		});
		it('Should get target head/page', async () => {
			const sampleId = new ObjectId();
			const samplePage: Page = {
				_id: sampleId,
				headKey: 'test',
				articles: ['AAA', 'BBB'],
				nextPage: null,
				prePage: null,
			};
			await DBO.pages.insertOne(samplePage);
			const result1 = (await getHead('test')) as string;
			expect(result1).eql(sampleId.toString());
			const result2 = await getPage(result1);
			expect(result2).eqls({
				...samplePage,
			});
		});
		it('Should get target head even when their is 2 head have same key', async () => {
			const sampleId = new ObjectId();
			const sampleHead: Page = {
				_id: sampleId,
				headKey: 'test',
				articles: ['AAA', 'BBB'],
				nextPage: null,
				prePage: null,
			};
			await DBO.pages.insertOne(sampleHead);
			const result = (await getHead('test')) as string;
			expect(typeof result == 'string').is.true;
		});
	});
	describe('set in dbWrapper', function () {
		it('Should create head/page success', async () => {
			expect(await getHead('set-head')).is.null;
			const newId = await createHead(['test'], 'set-head');
			expect(await getHead('set-head')).eql(newId.toString());
			expect((await getPage(newId))?.nextPage).is.null;
			const nextId = await createPage(['test2']);
			expect(await getPage(nextId)).eqls({
				_id: nextId,
				articles: ['test2'],
				headKey: null,
				nextPage: null,
				prePage: null,
			});
		});
		it('Should link page success', async () => {
			const headId = (await getHead('set-head')) as string;
			const nextId = await createPage(['test2']);
			await linkPage(headId, nextId, 'set-head');
			expect(await getPage(headId)).eqls({
				_id: new ObjectId(headId),
				articles: ['test'],
				headKey: 'set-head',
				nextPage: nextId,
				prePage: null,
			});
			expect(await getPage(nextId)).eqls({
				_id: nextId,
				articles: ['test2'],
				headKey: 'set-head',
				nextPage: null,
				prePage: new ObjectId(headId),
			});
		});
		it('Should update page success', async () => {
			const id = await createPage(['test']);
			await updatePageArticles(id, ['test2', 'test3']);
			expect((await getPage(id))?.articles).eqls(['test2', 'test3']);
		});
		it('Should update page error when target not exist', async () => {
			try {
				await updatePageArticles(new ObjectId(), ['test2', 'test3']);
			} catch {
				return;
			}
			throw 'Should error above';
		});
		it('Should revert when one of link page not exist', async () => {
			await linkPage(new ObjectId(), new ObjectId(), 'test-link');
			const id = await createHead(['link'], 'test-link');
			const origin = (await getPage(id)) as Page;
			await linkPage(id, new ObjectId(), 'test-link');
			expect(origin).eqls(await getPage(id));
			await linkPage(new ObjectId(), id, 'test-link');
			expect(origin).eqls(await getPage(id));
		});
		it('Should revert for wrong head key', async () => {
			const id = await createHead(['link'], 'test-link');
			const id2 = await createHead(['link2'], 'test-link2');
			const origin = (await getPage(id)) as Page;
			const origin2 = (await getPage(id2)) as Page;
			await linkPage(id, id2, 'test-link2');
			expect(origin).eqls(await getPage(id));
			expect(origin2).eqls(await getPage(id2));
		});
	});
});
