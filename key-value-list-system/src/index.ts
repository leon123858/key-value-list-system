/**
 * Import Core Object
 */
import express from 'express';
import cors from 'cors';
import { apiRoute } from './routers';
import { init as initDb } from './libs/initDb';

/**
 * Init Core Object
 */

const app: express.Application = express();

/**
 * Set global variable
 */

const port: number = 3000;

/**
 * use middleware in first
 */

app.use(cors());

/**
 * Basic router
 */

app.get('/', async (_req, res) => {
	res.send('You can get API document for this system in ./docs/openapi.yaml');
});

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
