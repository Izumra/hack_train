import express from 'express'
import {sendRequest} from '../middleware/dbQueryes.js'
import {getLinkFile,getFile} from '../middleware/YOSfunctions.js'

const route = express.Router()

route.get('/',async (req, res) => {
	if(req.query.id){
		const data = await sendRequest(`SELECT * FROM hack.objects WHERE id_objects=$1`,[req.query.id])
		let shir=data[0].cords.split(', ')[0]
		let dolg=data[0].cords.split(', ')[1]
		let files=[]
		const images= await sendRequest(`SELECT * FROM hack.documents WHERE id_objects=$1`,[req.query.id])
		if(images&&images.length>0){
			for(let i=0;i<images.length;i++){
				let file=images[i].title.toLowerCase()
				if(file.indexOf(".jpg")!=-1||file.indexOf(".jpeg")!=-1||file.indexOf(".png")!=-1||file.indexOf(".gif")!=-1){
					files.push(images[i].title)
				}
			}
		}
		if(files.length>0){
			for(let i=0;i<files.length;i++){
				files[i]=await getLinkFile(files)
			}
		}
		if(data.length&&data[0]){
			res.render('card',{object:data[0],shirota:shir,dolgota:dolg,fileses:files})
		}
	}
	else res.redirect('/list')
})

export default route