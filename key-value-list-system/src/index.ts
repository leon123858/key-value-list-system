/**
 * Import Core Object
 */
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { apiRoute } from './routers';
import { init as initDb } from './libs/initDb';
import YAML from 'yamljs';
import swaggerUi from 'swagger-ui-express';

/**
 * Init Core Object
 */

const app: express.Application = express();
const swaggerDocument = YAML.load('./docs/openapi.yaml');

/**
 * Set global variable
 */

const port: number = 3000;

/**
 * use middleware in first
 */

app.use(cors());
app.use(bodyParser.json());
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/**
 * Main API
 */

app.use('/api', apiRoute);

/**
 * error handle
 */

app.get('*', function (_req, res) {
	res.status(404).send('route not found');
});

/**
 * Server Setup
 */
app.listen(port, async () => {
	await initDb();
	console.log(`listening on => http://localhost:${port}/`);
});
