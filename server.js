const mongoose = require('mongoose')
const app = require('./App')

const PORT = process.env.PORT || 5000

// Establish Connection to Database
mongoose.connect(process.env.MONGO_URI, { useFindAndModify: false, useUnifiedTopology: true, useNewUrlParser: true }, (err) => {
    if (err) {
        console.error(err)
        return
    }
    console.log("Connected to Database");
    app.listen(PORT, () => {
        console.log(`Server Running on port ${PORT}`);
    })
})