const { URL, URLSearchParams } = require('url');
import Validate from '../services/validate';
import Authenticate from '../services/authenticate';
import Encode from '../services/encode';
import { captureRejectionSymbol } from 'events';

const _headers = {
    'Access-Control-Allow-Origin': 'http://localhost:1234',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
    'Content-Type': 'application/octet-stream',
    'Access-Control-Max-Age': 2592000, // 30 days
};

const _retrieveParamsFromURL = (url) => {
    let obj = {};
    url.searchParams.forEach((value, name, searchParams) => {
        obj[name] = value;
    });
    return obj;
};

class Download {
    static GET(req, res, reqUrl) {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });
        req.on('end', () => {
            const user = _retrieveParamsFromURL(reqUrl);
            console.log('Download.GET ');
            console.log(user);
            if (Validate.inputUser(user)) {
                if (Authenticate.AuthorizedUser(user)) {
                    console.log('-----------------------------');
                    res.writeHead(200, _headers);
                    Encode.Image(res);
    
                } else {
                    res.writeHead(403);
                    res.end(JSON.stringify({error:"Incorrect user name or password"}));
                }
            } else {
                res.writeHead(403);
                res.end(JSON.stringify({error:"Incorrect input structure"}));
            }
        });
    }
    static OPTIONS(req, res) {
        res.writeHead(200, _headers);
        res.end();
        return;
    }
}

const downloadRouter = (url) => {
    return (req, res) => {
        const domain = req.headers.origin ? req.headers.origin : 'http://localhost:3000';
        const reqUrl = new URL(domain + req.url);
        console.log(reqUrl.pathname);
        switch (reqUrl.pathname) {
            case url:
                switch (req.method) {
                    case 'GET':
                        console.log('GET METHOD DOWNLOAD!');
                        Download.GET(req, res, reqUrl);
                        break;
                    case 'OPTIONS':
                        console.log('OPTIONS METHOD DOWNLOAD!');
                        Download.OPTIONS(req, res);
                        break;
                    default:
                        res.writeHead(403);
                        res.end(JSON.stringify({error:"HTTP method not supported"}));
                }
                break;
            default:
                res.writeHead(404);
                res.end(JSON.stringify({error:"Resource not found"}));
        }
    };
};

export default downloadRouter;

