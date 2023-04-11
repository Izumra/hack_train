import express from 'express'
import {sendRequest} from '../middleware/dbQueryes.js'
import {getLinkFile,getFile} from '../middleware/YOSfunctions.js'

const route = express.Router()

route.get('/',async (req, res) => {
	if(req.query.id){
		let data=await sendRequest('SELECT * FROM hack.documents WHERE id_objects=$1',[req.query.id])
		for(let i=0;i<data.length;i++){
			data[i].link=await getLinkFile(data[i].title)
		}
		res.render('documents')
	}
	else{
		res.redirect('/list')
	}
})

route.post('/',express.json(),async (req,res)=>{
	if(req.body.id)console.log(id)
})

export default route