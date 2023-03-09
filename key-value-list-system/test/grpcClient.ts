import { loadProto } from '../src/libs/loadProto';
import grpc, { credentials } from '@grpc/grpc-js';

/**
 * Should be use when server start ! (這是 grpc 的客戶端測試, 非單元測試)
 */
xdescribe('grpc client', function () {
	let protoObj: grpc.GrpcObject;
	let client: any;
	before(async () => {
		protoObj = await loadProto('./docs/grpc.proto');
		const service = protoObj.Setter as grpc.ServiceClientConstructor;
		client = new service('localhost:50051', credentials.createInsecure());
	});
	after(async () => {});
	it('Should access createHead', async () => {
		const call = client.CreateHead();
		call.on('data', function (response: any) {
			// console.log(response);
		});
		call.write({ key: 'meme', articles: ['test head', 'article2'] });
		call.end();
	});
	it('Should access createPage', async () => {
		const call = client.createPage();
		call.on('data', function (response: any) {
			// console.log(response);
		});
		call.write({ articles: ['test page', 'article2'] });
		call.end();
	});
	it('Should access updatePage', async () => {
		const call = client.updatePage();
		call.on('data', function (response: any) {
			// console.log(response);
		});
		call.write({
			key: '640a385e547161f1716f66d5',
			articles: ['test page', 'article5566'],
		});
		call.end();
	});
	it('Should access movePage', async () => {
		const call = client.movePage();
		call.on('data', function (response: any) {
			// console.log(response);
		});
		call.write({
			key: 'meme',
			from: '640a385e547161f1716f66d5',
			to: '640a385e547161f1716f66d5',
		});
		call.end();
	});
});
