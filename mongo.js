const mongoose = require("mongoose")
require("dotenv").config()

const uri = process.env.MONGODB_URI

mongoose.set("strictQuery", false)

mongoose.connect(uri).then(() => {
	console.log("Connected to Mongo")
})

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		minLength: 3,
		required: true
	},
	phone: String,
})

personSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		delete returnedObject.__v
	},
})

const Person = mongoose.model("Person", personSchema)

module.exports = Person