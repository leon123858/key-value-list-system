import {
	createHead,
	createPage,
	updatePageArticles,
	linkPage,
} from '../libs/dbWrapper';

const funcWrapper = (func: (request: any) => Promise<any>, call: any) => {
	let request: any;
	call.on('data', function (_request: any) {
		request = _request;
	});
	call.on('end', async function () {
		try {
			const result = await func(request);
			call.write(result);
		} catch (err) {
			call.write({ status: 'error', error: err });
		}
		call.end();
	});
};

const setterService = {
	CreateHead: (call: any) => {
		funcWrapper(async (req) => {
			const id = await createHead(req.articles, req.key);
			return { key: id.toString() };
		}, call);
	},
	CreatePage: (call: any) => {
		funcWrapper(async (req) => {
			const id = await createPage(req.articles);
			return { key: id.toString() };
		}, call);
	},
	UpdatePage: (call: any) => {
		funcWrapper(async (req) => {
			await updatePageArticles(req.key, req.articles);
			return { status: 'OK' };
		}, call);
	},
	MovePage: (call: any, callback: any) => {
		funcWrapper(async (req) => {
			const { key, from, to } = req;
			await linkPage(from, to, key);
			return { status: 'OK' };
		}, call);
	},
};

export default setterService;
