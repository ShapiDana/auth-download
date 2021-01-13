import cors from 'cors';

const whitelist = ['http://localhost:1234', 'http://localhost http://localhost:1234']
const corsOptions = {
    origin: (origin, callback) => {
        console.log(origin);
        if (whitelist.indexOf(origin) !== -1) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
    }
};

const corsOptionsDelegate = (req, callback) => {
  let corsOptions;

  if(whitelist.indexOf(req.header('Origin')) !== -1) {
      corsOptions = { origin: true };
  }
  else {
      corsOptions = { origin: false };
  }
  callback(null, corsOptions);
}

export const corsWithOptions = cors(corsOptionsDelegate);

// ## CORS middleware
export const allowCrossDomain = (req, res, next) => {
  console.log('allowCrossDomain');

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:1234');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-requested-with');
  
  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    console.log('OPTIONS');
    res.send(200);
  }
  else {
    console.log('not OPTIONS');

    next();
  }
};

