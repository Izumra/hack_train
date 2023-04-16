import express from 'express'
import {sendRequest} from '../middleware/dbQueryes.js'
import {getLinkFile,getFile} from '../middleware/YOSfunctions.js'
import axios from 'axios'

const route = express.Router()

route.get('/',async (req, res) => {
	if(req.query.id&&req.session.objects[+req.query.id]!=null){
		let object = req.session.objects[+req.query.id]
		let docs= null
		axios.post(`https://app.izumra.ru/api/card?session=${req.session.sess}&object_name=${req.session.objects[+req.query.id].object_name}`)
		.then(async(result)=>{
			docs=result.data.documents
			console.log(object,docs)
			let cords=object.cords.split(', ')
			let shir=cords[0]
			let dolg=cords[1]
			let files=[]
			if(docs&&docs.length>0){
				for(let i=0;i<docs.length;i++){
					let file=docs[i].title.toLowerCase()
					if(file.indexOf(".jpg")!=-1||file.indexOf(".jpeg")!=-1||file.indexOf(".png")!=-1||file.indexOf(".gif")!=-1){
						files.push(images[i].title)
					}
				}
			}
			if(files.length>0){
				for(let i=0;i<files.length;i++){
					files[i]=await getLinkFile(files[i])
				}
			}
			if(data.length&&data[0]){
				res.render('card',{object:data,shirota:shir,dolgota:dolg,fileses:files})
			}
		})
		.catch(err=>console.log(err))
	}
	else res.redirect('/list')
})

export default route