const PORT = process.env.PORT || 8000

require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express();

const Message = require('./message.model');

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(cors())

app.get('/', async (req, res) => {
    const messages = await Message.find({ status: 'approved' });
    res.status(200).send({ status: 'success', data: messages }); 
})
app.get('/unverified', async (req, res) => {
    const messages = await Message.find({ status: 'unverified' });
    res.status(200).send({ status: 'success', data: messages }); 
})
app.post('/submit', async (req, res) => {
    if(req.body.status){
        res.status(400).send({ status: 'fail', data: 'Please wait for approval!!!' })
        return;
    }
    const message = await Message.create(req.body);
    res.status(201).send({ status: 'success', data: message })
})
app.patch('/verify/:messageId', async (req, res) => {
    const message = await Message.findById(req.params.messageId)

    if(!message){
        res.status(404).send({ status: 'fail', data: 'Message Not Found' });
    }

    message.status = 'approved';
    await message.save();

    res.status(200).send({ status: 'success', data: message });
})
app.delete('/delete/:messageId', async (req, res) => {
    const message = await Message.findById(req.params.messageId)

    if(!message){
        res.status(404).send({ status: 'fail', data: 'Message Not Found' });
    }

    await message.remove();
    res.status(200).send({ status: 'success', data: 'Message Deleted Successfully' });
})

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected To MONGODB')
    app.listen(PORT, () => {
        console.log(`Server running on PORT: ${PORT}`);
    })
})
.catch((err) => console.log('MONGODB error:', err))