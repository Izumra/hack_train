import express from 'express'
import {sendRequest} from '../middleware/dbQueryes.js'
import {getLinkFile,getFile} from '../middleware/YOSfunctions.js'
import axios from 'axios'

const route = express.Router()

route.get('/',async (req, res) => {
	if(req.query.id&&req.session.objects[req.query.id]!=null){
		let data = null
		axios.post(`https://app.izumra.ru/api/card?session=${req.session.sess}&object_name=${req.session.objects[req.query.id].object_name}`)
		.then(async(result)=>{
			console.log(result)
		})
		.catch(err=>console.log(err))
		// let shir=data.cords.split(', ')[0]
		// let dolg=data.cords.split(', ')[1]
		// let files=[]
		// const images= await sendRequest(`SELECT * FROM hack.documents WHERE id_objects=$1`,[req.query.id])
		// if(images&&images.length>0){
		// 	for(let i=0;i<images.length;i++){
		// 		let file=images[i].title.toLowerCase()
		// 		if(file.indexOf(".jpg")!=-1||file.indexOf(".jpeg")!=-1||file.indexOf(".png")!=-1||file.indexOf(".gif")!=-1){
		// 			files.push(images[i].title)
		// 		}
		// 	}
		// }
		// if(files.length>0){
		// 	for(let i=0;i<files.length;i++){
		// 		files[i]=await getLinkFile(files)
		// 	}
		// }
		// if(data.length&&data[0]){
		// 	res.render('card',{object:data,shirota:shir,dolgota:dolg,fileses:files})
		// }
	}
	else res.redirect('/list')
})

export default route