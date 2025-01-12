import morgan from 'morgan';
import helmet from 'helmet';
import express, { NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import BaseRouter from './routes';
import { RouteError } from './common/classes';

// Init Auth service
require('./services/authorize');

// Init express
const app = express();

/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Security
if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
}

app.use(express.static('public'));

// Add APIs

app.use('/api', BaseRouter);

// app.use('/', (req: Request, res: Response) => {
//   res.sendFile('./public/welcome.html', { root: __dirname });
// });

// app.use('*', (req: Request, res: Response) => {
//   res.redirect('/');
// });

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error Handler:', err);
  if (err instanceof RouteError) {
    return res.status(err.status).json({
      error: err.message,
      details: err.message2 || null, // Include `message2` if available
    });
  }

  // Fallback for other error types
  // console.error('Unexpected Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
  });
});
// Export express instance
export default app;
