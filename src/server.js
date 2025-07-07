import 'dotenv/config';
import express from 'express';

const app   = express();
const port  = 3000;

app.use(cors());
app.use(express.json());

app.listen(port, () => {
    console.log('App running on port ' + port)
});