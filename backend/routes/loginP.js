import express from 'express'
import {sendRequest} from '../middleware/dbQueryes.js'
import {getLinkFile,getFile} from '../middleware/YOSfunctions.js'

const route = express.Router()

route.get('/', (req, res) => {
  if(req.session&&!req.session.user&&!req.session.objectes){
	  res.render('login')
  }
  else{
    res.redirect('/list')
  }
})

route.post('/', async (req, res) => {
  const data = await sendRequest(`SELECT * FROM hack.users WHERE tel_number='${req.body.tel}'`)
  if (data.length && data[0].pass == req.body.password) {
	  req.session.user=JSON.stringify(data[0])
	  const objectes = await sendRequest(`SELECT * FROM hack.objects`)
	  for(let i=0;i<objectes.length;i++){
      if(objectes.length>0&&objectes[i]&&objectes[i].image_link!=null){
        objectes[i].image_link=await getLinkFile(objectes[i].image_link)
      }
    }
    req.session.objectes=JSON.stringify(objectes)
    res.redirect('/list')
  }
  else {
    res.redirect('/')
  }
})
export default route