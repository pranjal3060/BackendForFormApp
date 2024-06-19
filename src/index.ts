import express from 'express';
import bodyParser from 'body-parser';
import apiRoutes from './routes/api';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use('/api', apiRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
