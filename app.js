const express = require("express")
const morgan = require("morgan")

const app = express()

morgan.token('req-body', (req) => JSON.stringify(req.body));

// use Morgan middleware with the custom format string
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'));

let persons = [
	{
		id: 1,
		name: "Arto Hellas",
		number: "040-123456",
	},
	{
		id: 2,
		name: "Ada Lovelace",
		number: "39-44-5323523",
	},
	{
		id: 3,
		name: "Dan Abramov",
		number: "12-43-234345",
	},
	{
		id: 4,
		name: "Mary Poppendieck",
		number: "39-23-6423122",
	},
]

app.get("/api/persons", (req, res) => {
	res.json(persons)
})

app.post("/api/persons", (req, res) => {
	const person = {
		id: Math.floor(Math.random() * 100),
		name: "John Smith",
		number: "94238 782",
	}
	res.status(200).json({ success: true });
	console.log(person);
	persons.push(person)
	// console.log(persons)
})

app.get("/api/persons/:id", (req, res) => {
	const id = Number(req.params.id)
	const person = persons.find((person) => person.id === id)

	if (person) {
		res.json(person)
	} else {
		res.status(404).send("Id of the person not found")
	}
})

app.delete("/api/persons/:id", (req, res) => {
	const id = Number(req.params.id)
	persons = persons.filter((person) => person.id !== id)

	res.status(204).end()
})

app.post("/info", (req, res) => {
	const person = req.body
	console.log(person)
	res.send(
		`<p>Phonebook has info for ${person.length}</p><p>${new Date()}</p>`
	)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`)
})
