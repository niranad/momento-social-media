import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';
import customEnv from 'custom-env';

customEnv.env(true);

const { MONGO_URI, PORT, NODE_ENV } = process.env;

export const dbOptions = {
  useNewUrlParser: true,
  UseUnifiedTopology: true,
};

const app = express();

app.set('port', PORT);
app.set('env', NODE_ENV);
app.set('x-powered-by', false);
app.set('etag', 'strong');

app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());
app.use((err, req, res, next) => {
  if (NODE_ENV !== 'production' && res.status !== 404) {
    return res.status(500).send({ error: err.message });
  }
});

app.use('/posts', postRoutes);
app.use('/users', userRoutes);

// export app for integration testing
export default app;

mongoose.connect(MONGO_URI, dbOptions).then(() => {
  let db = mongoose.connection;
  db.on('error', (err) => {
    if (NODE_ENV.match(/^dev/i)) {
      console.log(`Database connection error: ${err}`);
    }
  });
  db.on('disconnected', () => {
    if (NODE_ENV.match(/^dev/i)) {
      console.log('Database disconnected. Will try to reconnect.');
    }
    mongoose.connect(MONGO_URI, dbOptions)
  });
}).catch((err) => {
  console.log(err);
})
