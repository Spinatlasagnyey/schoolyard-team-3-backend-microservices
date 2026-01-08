// start.js setup from learnnode.com by Wes Bos
import Express, { Application, Request, Response, NextFunction } from 'express';
import * as Dotenv from 'dotenv';
Dotenv.config({ path: '.env' });
import IndexRouter from './routes/gateway.js';
import { errorHandler } from './middleware/errors/errorHandler.js';


const app = Express()
// support json encoded and url-encoded bodies, mainly used for post and update
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

app.use('/', IndexRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  try {
    //set header before response
    res.status(404).send('Sorry can\'t find that! Please explore more troubleshooting options.');
  } catch (err) {
    next(err);
  }
});
app.use(errorHandler);

const server = app.listen(5175, () =>
  console.log(`
🚀 Server ready at: http://localhost:5175
⭐️ See sample requests: https://github.com/prisma/prisma-examples/blob/latest/orm/express/README.md#using-the-rest-api`),
)