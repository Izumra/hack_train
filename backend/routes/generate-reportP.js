import express from 'express'

const route = express.Router()

route.get('/', (req, res) => {
	res.render('generate-report')
})

export default route