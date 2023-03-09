/**
 * Check the document for this page in docs/openapi.yaml
 */
import express from 'express';
import { linkPage, deleteHead } from '../libs/dbWrapper';
import {
	getHead,
	getPage,
	createHead,
	createPage,
	updatePageArticles,
} from '../libs/dbWrapper';
import { ObjectId } from 'mongodb';
const router = express.Router();

router.get('/get/head', async (req, res) => {
	if (!req.query?.key || req.query?.key == '') {
		res.status(400).json({ error: 'bad request' });
		return;
	}
	try {
		const result = await getHead(req.query.key as string);
		if (!result) {
			res.status(404).json({ error: 'not found' });
			return;
		}
		res.status(200).json({ nextPageKey: result } as { nextPageKey: string });
	} catch (err) {
		console.error(err);
		res.status(500).send('server error');
	}
});

router.get('/get/page', async (req, res) => {
	if (!req.query?.pageId) {
		res.status(400).json({ error: 'bad request' });
		return;
	}
	if (!ObjectId.isValid(req.query.pageId as string)) {
		res.status(400).json({ error: 'wrong pageId format' });
		return;
	}
	try {
		const result = await getPage(req.query.pageId as string);
		if (!result) {
			res.status(404).json({ error: 'not found' });
			return;
		}
		const { articles, nextPage } = result;
		const response: { nextPageKey?: string; articles: string[] } = nextPage
			? { articles, nextPageKey: nextPage.toString() }
			: { articles };
		res.status(200).json(response);
	} catch (err) {
		console.error(err);
		res.status(500).send('server error');
	}
});

router.post('/create/head', async (req, res) => {
	const { listKey, articles }: { listKey: string; articles: string[] } =
		req.body;
	if (
		typeof listKey !== 'string' ||
		listKey == '' ||
		!Array.isArray(articles)
	) {
		res.status(400).json({ error: 'bad request' });
		return;
	}
	try {
		const result = await createHead(articles, listKey);
		res.status(200).json({ pageKey: result.toString() } as { pageKey: string });
	} catch (err) {
		console.error(err);
		res.status(500).send('server error');
	}
});

router.post('/create/page', async (req, res) => {
	const { articles }: { articles: string[] } = req.body;
	if (!Array.isArray(articles)) {
		res.status(400).json({ error: 'bad request' });
		return;
	}
	try {
		const result = await createPage(articles);
		res.status(200).json({ pageKey: result.toString() } as { pageKey: string });
	} catch (err) {
		console.error(err);
		res.status(500).send('server error');
	}
});

router.put('/update/page', async (req, res) => {
	const { pageKey, articles }: { pageKey: string; articles: string[] } =
		req.body;
	if (typeof pageKey !== 'string' || !Array.isArray(articles)) {
		res.status(400).json({ error: 'bad request' });
		return;
	}
	if (!ObjectId.isValid(pageKey)) {
		res.status(400).json({ error: 'wrong pageId format' });
		return;
	}
	try {
		await updatePageArticles(pageKey, articles);
		res.status(200).json({ status: 'OK' });
	} catch (err) {
		if (err === 'target not exist') {
			res.status(404).send({ error: err });
			return;
		}
		console.error(err);
		res.status(500).send('server error');
	}
});

router.put('/move/page', async (req, res) => {
	const {
		sourceKey,
		targetKey,
		listKey,
	}: { sourceKey: string; targetKey: string; listKey: string } = req.body;
	if (
		typeof sourceKey !== 'string' ||
		typeof targetKey !== 'string' ||
		typeof listKey !== 'string' ||
		listKey === ''
	) {
		res.status(400).json({ error: 'bad request' });
		return;
	}
	if (!ObjectId.isValid(sourceKey) || !ObjectId.isValid(targetKey)) {
		res.status(400).json({ error: 'wrong pageId format' });
		return;
	}
	try {
		await linkPage(targetKey, sourceKey, listKey);
		res.status(200).json({ status: 'OK' });
	} catch (err) {
		console.error(err);
		res.status(500).send('server error');
	}
});

router.delete('/delete/head', async (req, res) => {
	const { listKey }: { listKey: string } = req.body;
	if (typeof listKey !== 'string' || listKey == '') {
		res.status(400).json({ error: 'bad request' });
		return;
	}
	try {
		await deleteHead(listKey);
		res.status(200).json({ status: 'OK' });
	} catch (err) {
		console.error(err);
		res.status(500).send('server error');
	}
});

export default router;
