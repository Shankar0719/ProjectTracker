require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5004;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI).then(
    ()=>{
        console.log('DB connected');
        app.listen(PORT, ()=>{
            console.log('Server on port:', PORT);
        });
    }
)
.catch((err)=>{
    console.log('DB error:', err);
});