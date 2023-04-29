const mongoose = require("mongoose")

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		minLength: 3,
		required: true,
	},
	phone: {
		type: String,
		validate: {
			validator: function (v) {
				return /^(\d{2,3}-)?\d{7,8}$/.test(v)
			},
			message: (props) => `${props.value} is not a valid phone number!`,
		},
		required: true,
	},
})

personSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		delete returnedObject.__v
	},
})

module.exports = mongoose.model("Person", personSchema)
