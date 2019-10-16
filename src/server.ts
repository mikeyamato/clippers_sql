import express from "express";
import logger from './logger';

import { router } from './routes';

const app = express();

const port = 3000;

// app.get('/', (req, res) => {
//   res.send('The sedulous hyena ate the antelope!');
// });

app.use('/api/', router);

app.listen(port, err => {
  if (err) {
    logger.error(err);
    // return console.error(err);
  }
  logger.info(`server is listening on ${port}`);
  // return console.log(`server is listening on ${port}`);
});

// logger.error('test');
// logger.warn('test');
// logger.info('test');
// logger.http('test');
// logger.verbose('test');
// logger.debug('test');
// logger.silly('test');