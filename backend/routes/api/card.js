import express from 'express'
import { sendRequest } from '../../middleware/dbQueryes.js'
import { sendFile, getLinkFile,deleteFile } from '../../middleware/YOSfunctions.js'
import multer from 'multer'
import path from 'path'
import { redisClient } from '../../../server.js'

const upload=multer({dest:'documents/'})

const api=express.Router()

api.post('/remove_doc',async (req,res)=>{
    if(req.query.document&&req.query.document.split(', ').length==1&&req.query.session){
        let user=await redisClient.get('sess:'+req.query.session)
        if(user!=null)user=await JSON.parse(user)
        console.log(user)
        if(user!=null){
            if(user.user&&user.user.id_role&&user.user.id_role==1){
                let file=await sendRequest('SELECT * FROM hack.documents WHERE title=$1',[req.query.document])
                if(file&&file.length&&file.length>0){
                    let data=await deleteFile(req.query.document)
                    await sendRequest('DELETE FROM hack.documents WHERE title=$1 AND id_user_owner=$2',[req.query.document,user.user.id_role])
                    res.status(200).json({mes:'Объект успешно удален',files:data})
                }
                else res.status(404).json('Файлы не найдены')
            }
            else{
                let file=await sendRequest('SELECT * FROM hack.documents WHERE title=$1 AND id_user_owner=$2',[req.query.document,user.user.id_role])
                if(file&&file.length&&file.length>0){
                    let data=await deleteFile(req.query.document)
                    await sendRequest('DELETE FROM hack.documents WHERE title=$1 AND id_user_owner=$2',[req.query.document,user.user.id_role])
                    res.status(200).json({mes:'Объект успешно удален',files:data})
                }
                else res.status(400).json("Невозможно удалить данный файл")
            }
        }
        else res.status(404).json('Сессия пользователя не была наййдена, мозможно истек срок ее действия')
    }
    else if (req.query.document&&req.query.document.split(', ').length>1&&req.query.session){
        let user=await redisClient.get('sess:'+req.query.session)
        if(user!=null)user=await JSON.parse(user)
        console.log(user)
        if(user!=null){
            let objects=req.query.document.split(', ')
            let fileses=[]
            if(user.user.id_role==1){
                for(let i=0;i<objects.length;i++){
                    let files=await sendRequest('SELECT * FROM hack.documents WHERE title=$1',[objects[i]])
                    if(files&&files.length>0){
                        let data=await deleteFile(objects[i])
                        await sendRequest('DELETE FROM hack.documents WHERE title=$1',[objects[i]])
                        fileses.push(data)
                    }
                }
                if(fileses.length>0)res.status(200).json({mes:'Объекты успешно удалены',files:fileses})
                else res.status(404).json('Объекты для удаления не найдены')
            }
            else if(user.user.id_role){
                for(let i=0;i<objects.length;i++){
                    let files=await sendRequest('SELECT * FROM hack.documents WHERE title=$1 AND id_user_owner=$2',[objects[i],user.user.id_role])
                    if(files&&files.length>0){
                        let data=await deleteFile(objects[i])
                        await sendRequest('DELETE FROM hack.documents WHERE title=$1 AND id_user_owner=$2',[objects[i],user.user.id_role])
                        fileses.push(data)
                    }
                }
                if(fileses&&fileses.length>0)res.status(200).json({mes:'Объекты успешно удалены',files:fileses})
                else res.status(400).json("Невозможно удалить данные файлы")
            }
        }
        else res.status(400).json("Вы не авторизованы")
    }
    else if(!req.query.session) res.status(400).json('Не было передано идентификатора сессии')
    else res.status(400).json('Не был передан документ для удаления')
})

api.post('/delete',async(req,res)=>{
    if(req.query.object_name&&req.query.session){
        let session= await redisClient.get('sess:'+req.query.session)
        if(session!=null)session=await JSON.parse(session)
        if(session!=null&&session.user&&session.user.id_role==1){
            let data=await sendRequest('SELECT * FROM hack.objects WHERE object_name=$1',[req.query.object_name])
            if(data.length&&data.length>0){
                let datagroups=await sendRequest('SELECT * FROM hack.job_group WHERE id_objects=$1',[data[0].id_objects])
                if(datagroups.length&&datagroups.length>0){
                    let groups=[]
                    for(let i=0;i<datagroups.length;i++){
                        let datausers=await sendRequest('SELECT * FROM hack.users WHERE id_conference=$1',[datagroups[i].id_conference])
                        if(datausers.length&&datausers.length>0){
                            await sendRequest('UPDATE hack.users SET id_conference=$1 WHERE id_conference=$2',[1,datagroups[i].id_conference])
                            groups.push(datausers)
                        }
                    }
                    let data=await sendRequest('SELECT * FROM hack.documents WHERE id_objects=$1',[data[0].id_objects])
                    if(data.length&&data.length>0){
                        for(let i=0;i<data.length;i++){
                            await deleteFile(data[i])
                        }
                        await sendRequest('DELETE FROM hack.documents WHERE id_objects=$1',[data[0].id_objects])
                    }
                    if(groups.length&&groups.length>0){
                        for(let i=0;i<groups.length;i++){
                            await sendRequest('DELETE FROM hack.question WHERE id_user=$1',[groups[i].id_user])
                        }
                    }
                    await sendRequest('DELETE FROM hack.sup_params WHERE id_objects=$1',[data[0].id_objects])
                    await sendRequest('DELETE FROM hack.job_group WHERE id_objects=$1',[data[0].id_objects])
                    await sendRequest('DELETE FROM hack.objects WHERE object_name=$1',[data[0].object_name])
                    res.status(200).json('Объект успешно удален') 
                }
                else{
                    await sendRequest('DELETE FROM hack.documents WHERE id_objects=$1',[data[0].id_objects])
                    await sendRequest('DELETE FROM hack.sup_params WHERE id_objects=$1',[data[0].id_objects])
                    await sendRequest('DELETE FROM hack.job_group WHERE id_objects=$1',[data[0].id_objects])
                    await sendRequest('DELETE FROM hack.objects WHERE object_name=$1',[data[0].object_name])
                    res.status(200).json('Объект успешно удален без рабочих групп и вопросов, решаемых этими группами') 
                }
            }
            else res.status(404).json('Объект не был найден')
        }
        else res.status(404).json('У вас нет прав на удаление данного объекта недвижимости')
    }
    else res.status(400).json('Не было передано название удаляемого объекта недвижимости или сессия пользователя')
})

api.post('/',async(req,res)=>{
    let client=await redisClient.get('sess:'+req.query.session)
    if(client)client=JSON.parse(client)

    if(req.query.object_name&&req.query.session&&client){
        let data=await sendRequest('SELECT * FROM hack.objects WHERE object_name=$1',[req.query.object_name])
        if(client.user.id_role!=1){
            let groups=await sendRequest('SELECT * FROM hack.job_group WHERE id_objects=$1',[data[0].id_objects])
            if(groups){
                for(let i=0;i<groups.length;i++){
                    if(client.user.id_conference==groups[i].id_conference){
                        data=await sendRequest('SELECT * FROM hack.objects WHERE object_name=$1',[req.query.object_name])
                        continue
                    }
                    else data=null
                }
            }
        }
        if(data&&data.length>0){
            let docs=await sendRequest('SELECT * FROM hack.documents WHERE id_objects=$1',[data[0].id_objects])
            if(docs){
                for(let i=0;i<docs.length;i++){
                    docs[i].title=getLinkFile(data[i].title)
                }
                if(data[0].image_link!=null)data[0].image_link=getLinkFile(data[0].image_link)
            }
            res.json({object:data[0],documents:docs})
        }
        else res.status(404).send('Объект не был найден на сервере или у вас нет прав на взаимодействие с эти объектом')
    }
    else if(req.query.session&&client){
        let data=await sendRequest('SELECT * FROM hack.objects')
        if(client.user.id_role!=1){
            for(let i=0;i<data.length;i++){
                let groups=await sendRequest('SELECT * FROM hack.job_group WHERE id_objects=$1',[data[i].id_objects])
                if(groups){
                    for(let j=0;j<groups.length;j++){
                        if(client.user.id_conference==groups[j].id_conference)continue
                        else data[i]=null
                    }
                }
            }
        }
        if(data.length>0){
            for(let i=0;i<data.length;i++){
                if(data[i]&&data[i].image_link!=null)data[i].image_link=getLinkFile(data[i].image_link)
            }
            res.json(data)
        }
        else res.status(404).send('На сервере нет ни одного объекта или у вас нет прав доступа к этому объекту')
    }
    else res.status(400).json('Не было передано идентификатора сессии или идентификатор недействительный')
})

api.post('/change',upload.fields([{name:'avatar',maxCount:1},{name:'documents'}]),express.json(),async(req,res)=>{
    if(req.query.session){
        let user=await redisClient.get('sess:'+req.query.session)
        if(user)user=await JSON.parse(user) 
        if(user&&user.user.id_role==1){
            if(req.query.req_object){
                let data=await sendRequest('SELECT * FROM hack.objects WHERE object_name=$1',[req.query.req_object])
                if(data&&data.length>0){
                    if(req.files['avatar']?.length>0||req.files['documents']?.length>0){
                        if(req.files['avatar']?.length>0){
                            let avatar=req.files['avatar'][0].originalname
                            await sendFile(req.files['avatar'][0])
                            await sendRequest('UPDATE hack.objects SET image_link=$1 WHERE id_objects=$2',[req.files['avatar'][0].filename+path.extname(req.files['avatar'][0].originalname),data[0].id_objects])
                        }
                        for(let i=0;i<req.files.documents.length;i++){
                            await sendFile(req.files['documents'][i])
                            await sendRequest('INSERT INTO hack.documents(title,id_objects)values($1,$2)',[req.files['documents'][i].filename+path.extname(req.files['documents'][i].originalname),data[0].id_objects])
                        }
                    }
                    let params=''
                    for(let i=0;i<Object.values(req.body).length;i++){
                        if(Object.keys(req.body)[i]!='sup_params')params+=Object.keys(req.body)[i]+'='+'\''+Object.values(req.body)[i]+'\''+', '
                    }
                    await sendRequest(`UPDATE hack.objects SET ${params.slice(0,params.length-2)} WHERE object_name=$1`,[req.query.req_object])
                    if(req.body.sup_params){
                        let req_params=JSON.parse(req.body?.sup_params)
                        for(let i=0;i<req.params?.length;i++){
                            let param=await sendRequest('SELECT * FROM hack.sup_params WHERE title=$1 AND id_objects=$2',[req_params[i].title,data[0].id_objects])
                            if(param){
                                await sendRequest(`UPDATE hack.sup_params SET ${param[0].value+'='+req_params[i].value} WHERE title=$1 AND object_name=$2`,[req_params[i].title,data[0].id_objects])
                            }
                            else await sendRequest(`INSERT into hack.sup_params(title,value,id_objects) values($1,$2,$3)`,[req_params[i].title,req_params[i].value,data[0].id_objects])
                        }
                    }
                    res.status(201).send('Дополнительные параметры были успешно добавлены')
                }
                else res.status(400).send('Данного объекта нет в базе данных')
            }
            else res.status(404).send('Ошибка: НЕ было передано название объекта для изменений')
        }
    }
    else res.status(400).json('Не было передано идентификатора сессии')
})

api.post('/addObject',upload.fields([{name:'avatar',maxCount:1},{name:'documents'}]),express.json(),async(req,res)=>{
    if(req.query.session){
        let user=await redisClient.get('sess:'+req.query.session)
        if(user)user=await JSON.parse(user) 
        if(user&&user.user.id_role==1){
            if(req.body&&req.body.object_name&&req.body.district&&req.body.region&&req.body.address&&req.body.type_of_object&&req.body.state_of_object&&req.body.square&&req.body.owner_of_object&&req.body.fact_user&&req.files['avatar']&&req.files['documents']&&req.files['avatar'].length!=0&&req.files['documents'].length!=0&&req.body.sup_params&&req.body.cords){
                let avatar=req.files.avatar[0].originalname
                await sendFile(req.files['avatar'][0])
                await sendRequest('INSERT INTO hack.objects(object_name,district,region,address,type_of_object,state_of_object,square,owner_of_object,fact_user,image_link,cords)values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)',[req.body.object_name,req.body.district,req.body.region,req.body.address,req.body.type_of_object,req.body.state_of_object,req.body.square,req.body.owner_of_object,req.body.fact_user,avatar,req.body.cords])
                let data=await sendRequest('SELECT * FROM hack.objects WHERE object_name=$1',[req.body.object_name])
                let params=JSON.parse(req.body.sup_params)
                for(let i=0;i<Object.values(params);i++){
                    await sendRequest('INSERT INTO hack.sup_params(title,value,id_objects)values($1,$2,$3)',[params[i].title,params[i].value,data[0].id_objects])
                }
                for(let i=0;i<req.files.documents.length;i++){
                    await sendFile(req.files['documents'][i])
                    await sendRequest('INSERT INTO hack.documents(title,id_objects)values($1,$2)',[req.files['documents'][i].filename+path.extname(req.files['documents'][i].originalname),data[0].id_objects])
                }
                res.status(201).send('Объект успешно добавлен')
            }
            else if(!req.body.object_name||!req.body.district||!req.body.region||!req.body.address||!req.body.type_of_object||!req.body.state_of_object||!req.body.square||!req.body.owner_of_object||!req.body.fact_user||!req.files['avatar']||!req.files['documents']||req.files['avatar']?.length==0||req.files['documents']?.length==0||!req.body.cords){
                res.status(400).send('Не все обязательные параметры были переданы')
            }
            else if(!req.body.sup_params){
                let avatar=req.files.avatar[0].originalname
                await sendFile(req.files['avatar'][0])
                await sendRequest('INSERT INTO hack.objects(object_name,district,region,address,type_of_object,state_of_object,square,owner_of_object,fact_user,image_link,cords)values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)',[req.body.object_name,req.body.district,req.body.region,req.body.address,req.body.type_of_object,req.body.state_of_object,req.body.square,req.body.owner_of_object,req.body.fact_user,avatar,req.body.cords])
                let data=await sendRequest('SELECT * FROM hack.objects WHERE object_name=$1',[req.body.object_name])
                for(let i=0;i<req.files.documents.length;i++){
                    await sendFile(req.files['documents'][i])
                    await sendRequest('INSERT INTO hack.documents(title,id_objects)values($1,$2)',[req.files['documents'][i].filename+path.extname(req.files['documents'][i].originalname),data[0].id_objects])
                }
                res.status(201).send('Объект успешно добален')
            }
            else res.status(400).send('Данные не были переданы в запрос')
        }
        else if(user&&user.user.id_role!=1)res.status(400).json('У данного пользователя нет прав на добавление объектов') 
        else res.status(400).json('Сессия не была найдена') 
    }
    else if(user&&user.user.id_role!=1)res.status(400).json('У данного пользователя нет прав на добавление объектов') 
    else res.status(400).json('Не было передано данных сессии пользователя')   
})

export default api