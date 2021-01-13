import express from 'express';
import methodOverride from 'method-override';
import cors from 'cors';
import http from 'http';
import { allowCrossDomain } from './routes/cors';
import baseRouter from './routes';
import registerRouter from './routes/registerRouter';
import downloadRouter from './routes/downloadRouter';
import { REGISTER_ROUTE, DOWNLOAD_ROUTE } from './config/routes';

// REST api
const app = express();

app.use('/', baseRouter);
app.use(REGISTER_ROUTE, registerRouter);
// app.use(DOWNLAOD_ROUTE, downloadRouter);

// enable CORS
// app.use(cors());
// // app.use(methodOverride());
// // app.use(allowCrossDomain);
app.options('*', (req, res) => {
    console.log('cors on app.js');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:1234');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-requested-with'); 
    res.setHeader("Access-Control-Allow-Credentials", 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS'); 
    res.send(200);
  });

// app.use(express.json({
//     type: ['application/json', 'text/plain']
// }));

// listen on port
const restPORT = process.env.PORT || 8000; // default port to listen, when running in Azure the PORT env variable is set to the correct port

app.listen(restPORT, () => console.log(`Server (REST) up & running on http://localhost:${restPORT}`));

// HTTP api
const httpPORT = process.env.PORT || 8080; // default port to listen, when running in Azure the PORT env variable is set to the correct port

const httpServer = http.createServer(downloadRouter(DOWNLOAD_ROUTE));

httpServer.listen(httpPORT, () => console.log(`Server (HTTP) up & running on http://localhost:${httpPORT}`));
