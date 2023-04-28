const express = require("express")
const cors = require("cors")
const morgan = require("morgan")

const Person = require("./mongo")

morgan.token("req-body", (req) => JSON.stringify(req.body))

const app = express()
app.use(cors())
app.use(express.json())

// use Morgan middleware with the custom format string
app.use(
	morgan(
		":method :url :status :res[content-length] - :response-time ms :req-body"
	)
)

app.get("/api/persons", (req, res) => {
	Person.find({}).then((persons) => {
		res.json(persons)
	})
})

app.post("/api/persons", (req, res) => {
	const newPerson = new Person(req.body)
	console.log(newPerson)
	newPerson.save().then(() => {
		Person.find({}).then((persons) => {
			res.json(persons)
		})
	})
})

app.get("/api/persons/:id", async (req, res) => {
	const id = req.params.id
	const person = await Person.findOne({_id: id}).then((returnedPerson) => {
		return returnedPerson
	})
	if (person) {
		res.json(person)
	} else {
		res.status(404).send("Id of the person not found")
	}
})

app.delete("/api/persons/:id", async (req, res) => {
	const id = req.params.id
	await Person.deleteOne({_id: id})
	res.status(204).end()
})

// app.post("/info", (req, res) => {
// 	const person = req.body
// 	console.log(person)
// 	res.send(
// 		`<p>Phonebook has info for ${person.length}</p><p>${new Date()}</p>`
// 	)
// })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`)
})
