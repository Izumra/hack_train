import express from 'express'

const route = express.Router()

route.get('/', (req, res) => {
	if(req.session&&req.session.user&&req.session.objectes){
		res.render('list',{user:JSON.parse(req.session.user),objects:JSON.parse(req.session.objectes)})
	}
	else res.render('404')
})

export default route