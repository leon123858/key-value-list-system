/**
 * Import Core Object
 */
import express from 'express';
import cors from 'cors';
import path from 'path';
import bodyParser from 'body-parser';
import { apiRoute } from './routers';
import { init as initDb } from './libs/initDb';
import YAML from 'yamljs';
import swaggerUi from 'swagger-ui-express';
import { loadProto } from './libs/loadProto';
import grpc, { Server, ServerCredentials } from '@grpc/grpc-js';
import setterService from './services/setter';

/**
 * Init Core Object
 */

const app: express.Application = express();
const grpcServer: grpc.Server = new Server();
const swaggerDocument = YAML.load(path.join(__dirname, './openapi.yaml'));

/**
 * Set global variable
 */

const portOfExpress: number = 3000;
const portOfMongo: number = 27017;
const portOfGrpc: number = 50051;

/**
 * use middleware in first
 */

app.use(cors());
app.use(bodyParser.json());

/**
 * Main API
 */

app.use('/api', apiRoute);

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/**
 * error handle
 */

app.get('*', function (_req, res) {
	res.status(404).send('route not found');
});

/**
 * GRPC service
 */

function initGRPC(protoObj: grpc.GrpcObject) {
	const postListSetterService =
		protoObj.Setter as grpc.ServiceClientConstructor;

	grpcServer.addService(postListSetterService.service, setterService);
}

/**
 * Server Setup
 */
app.listen(portOfExpress, async () => {
	const [_, protoObj] = await Promise.all([
		initDb(portOfMongo),
		loadProto(path.join(__dirname, './grpc.proto')),
	]);
	initGRPC(protoObj);
	grpcServer.bindAsync(
		`0.0.0.0:${portOfGrpc}`,
		ServerCredentials.createInsecure(),
		() => {
			grpcServer.start();
			console.log('grpc server started on:', portOfGrpc);
		}
	);
	console.log(`express listening on => http://localhost:${portOfExpress}/`);
});
