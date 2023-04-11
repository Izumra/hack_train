import express from 'express'
import {sendRequest} from '../middleware/dbQueryes.js'
import {getLinkFile,getFile} from '../middleware/YOSfunctions.js'
import { redisClient } from '../../server.js'

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
  if(req.query.session){
    let sess=await redisClient('sess:'+req.query.session)
    if(sess!=null)sess=await JSON.parse(sess)
    if(sess&&sess.user){
      req.session.id=req.query.session
      res.redirect('/list')
    }
    res.redirect('/')
  }
  else res.status(400).json('Данные сессии не были переданы в параметры запроса')
})
export default route