const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Coffee shop server is running');
})

app.listen(port, () => {
    console.log(`Server is running in port : ${port}`);
})