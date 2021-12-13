import express from 'express';
import cors from 'cors';
import path from 'path';

import dotEnv from 'dotenv';

dotEnv.config({ path: path.join(__dirname, '../.env') });

const PORT = process.env.PORT;
const MAX_AGE = process.env.CORS_AGE;

const app = express();
app.use(express.json());

// Getting CORS configuration from .env file

const CORS_HOSTS = String(process.env.CORS_HOSTS).split(' ');
const CORS_PORTS =
  process.env.CORS_PORTS && String(process.env.CORS_PORTS).split(' ');

let whitelist = CORS_HOSTS.map((host) =>
  CORS_PORTS && CORS_PORTS.length
    ? CORS_PORTS.map((port) => `${host}:${port}`)
    : host
);

whitelist = whitelist.flat(1);

const corsOptionsDelegate = (req, callback) => {
  let corsOptions = {
    maxAge: MAX_AGE
  };
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions.origin = true;
  } else {
    corsOptions.origin = false;
  }
  callback(null, corsOptions);
};

app.use(cors(corsOptionsDelegate));

app.disable('x-powered-by');

app.listen(PORT, () => console.log('Express server is running on port', PORT));
