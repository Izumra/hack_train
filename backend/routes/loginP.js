import express from 'express'
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

route.post('/',express.json(), async (req, res) => {
  // if(redisClient){
  //   if(req.query.session){
  //     let sess=await redisClient('sess:'+req.query.session)
  //     if(sess!=null)sess=await JSON.parse(sess)
  //     if(sess&&sess.user){
  //       req.session.id=req.query.session
  //       res.redirect('/list')
  //     }
  //     res.redirect('/')
  //   }
  //   else res.status(400).json('Данные сессии не были переданы в параметры запроса')
  // }
  // else{
  //   if(req.body&&req.body.user&&req.body.objects){
  //     req.session.user=req.body.user
  //     req.session.objects=req.body.objects
  //   }
  //   else res.status(400).json('Тело запроса не полное или не было передано')
  // }
  if(req.body&&req.body.user&&req.body.objects){
    req.session.user=req.body.user
    req.session.objects=req.body.objects
  }
  else res.status(400).json('Тело запроса не полное или не было передано')
})
export default route