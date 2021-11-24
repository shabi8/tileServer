const express = require('express');
const app = express();
const converRouter = require('./routes/convert');


const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/convert', converRouter);

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});