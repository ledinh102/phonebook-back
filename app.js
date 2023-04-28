const express = require("express")
const cors = require("cors")
const morgan = require("morgan")

const Person = require("./mongo")

morgan.token("req-body", (req) => JSON.stringify(req.body))

const app = express()
app.use(cors())
app.use(express.json())

const errorHandler = (error, request, response, next) => {
	console.error(error.message)

	if (error.name === "CastError") {
		return response.status(400).send({ error: "malformatted id" })
	} else if (error.name === "ValidationError") {
		return response.status(400).send(error.message)
	}

	next(error)
}

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: "unknown endpoint" })
}

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

app.post("/api/persons", (req, res, next) => {
	const newPerson = new Person(req.body)
	console.log(newPerson)
	newPerson
		.save()
		.then((newPerson) => {
			res.json(newPerson)
		})
		.catch((err) => next(err))
})

app.get("/api/persons/:id", async (req, res, next) => {
	const id = req.params.id
	await Person.findOne({ _id: id })
		.then((returnedPerson) => {
			if (returnedPerson) res.json(returnedPerson)
			else res.status(404).send()
		})
		.catch((error) => next(error))
})

app.delete("/api/persons/:id", async (req, res, next) => {
	const id = req.params.id
	await Person.deleteOne({ _id: id })
		.then(() => {
			res.status(204).end()
		})
		.catch((err) => next(err))
})

app.put("/api/persons/:id", async (req, res, next) => {
	const body = req.body
	const id = req.params.id
	await Person.findByIdAndUpdate(
		id,
		{
			name: body.name,
			phone: body.phone,
		},
		{ new: true }
	)
		.then((returnedPerson) => {
			res.json(returnedPerson)
		})
		.catch((err) => next(err))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`)
})
