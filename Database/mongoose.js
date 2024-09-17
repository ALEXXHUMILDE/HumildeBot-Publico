const mongoose = require("mongoose");
const config = require("../config.json")

mongoose.set('strictQuery', false);

async function connectDatabase() {
    await mongoose.connect(config.mongourl, {
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    console.log("[MongoDB] ¡Se ha conectado correctamente la Base de Datos!".bgGreen)
}

module.exports = connectDatabase;