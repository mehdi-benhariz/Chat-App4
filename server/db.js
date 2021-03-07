const mongoose = require("mongoose")

const db = mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log(`database connected`))
  .catch((err) => console.error(err));

module.exports = mongoose;