import express from 'express'

const route = express.Router()

route.get('/', (req, res) => {
	if(req.session&&req.session.user&&req.session.objects){
		res.render('list',{user:req.session.user,objects:req.session.objects})
	}
	else res.render('404')
})

export default route