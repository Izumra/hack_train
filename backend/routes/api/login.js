import express from 'express'
import { sendRequest } from '../../middleware/dbQueryes.js'
import { redisClient } from '../../../server.js'
import { getLinkFile } from '../../middleware/YOSfunctions.js'

const api = express.Router()

api.post('/', express.json(), async (req, res) => {
    const data = await sendRequest(`SELECT * FROM hack.users WHERE tel_number='${req.body.tel}'`)
    if (data.length && data[0].pass == req.body.password) {
      req.session.user=data[0]
      if(data[0].id_role==1){
        let objectes = await sendRequest(`SELECT * FROM hack.objects`)
        for(let i=0;i<objectes.length;i++){
          if(objectes[i]&&objectes[i].image_link!=null)objectes[i].image_link=await getLinkFile(objectes[i].image_link)
        }
        req.session.objectes=objectes
        res.status(200).json({user:data[0],objects:objectes,session:req.session.id})
      }
      else{
        let objects=await sendRequest('SELECT * FROM hack.objects')
        for(let i=0;i<objects.length;i++){
            let groups=await sendRequest('SELECT * FROM hack.job_group WHERE id_objects=$1',[objects[i].id_objects])
            if(groups){
                for(let j=0;j<groups.length;j++){
                    if(data[i].id_conference==groups[j].id_conference)continue
                    else objects[i]=null
                }
            }
        }
        if(objects.length>0){
            for(let i=0;i<objects.length;i++){
                if(objects[i]&&objects[i].image_link!=null)objects[i].image_link=await getLinkFile(objects[i].image_link)
            }
            res.status(200).json({user:data[0],objects:objects,session:req.session.id})
        }
        else res.status(404).send('На сервере нет ни одного объекта или у вас нет прав доступа к этому объекту')
      }
    }
    else {
      res.status(404).json('Пользователь не зарегестрирован в системе')
    }
})
export default api