import express from 'express';
import db from './config/connection.js';
import router from './routes/index.js';

const PORT= 3001;
const app= express();

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(router);

db.once('open', () => {
    app.listen(PORT, () => {
        console.log('Server is running on port 3001.');
    })
})