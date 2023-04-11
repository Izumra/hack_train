import express from 'express'
import { sendRequest } from '../../middleware/dbQueryes.js'
import { redisClient } from '../../../server.js'

const api = express.Router()

api.post('/', express.json(), async (req, res) => {
    const data = await sendRequest(`SELECT * FROM hack.users WHERE tel_number='${req.body.tel}'`)
    if (data.length && data[0].pass == req.body.password) {
      req.session.user=data[0]
      const objectes = await sendRequest(`SELECT * FROM hack.objects`)
	    req.session.objectes=objectes
      res.status(200).json({user:data[0],objects:objectes,session:req.session.id})
    }
    else {
      res.status(404).json('Пользователь не зарегестрирован в системе')
    }
})
export default api