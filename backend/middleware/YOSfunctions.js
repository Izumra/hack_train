import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand} from "@aws-sdk/client-s3";
import dotenv from 'dotenv'
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs, { createWriteStream } from 'fs'
import path from 'path'

dotenv.config()
const client= new S3Client({endpoint:"https://storage.yandexcloud.net",region:"ru-central1",credentials:{accessKeyId:process.env.YOSACCESSKEY,secretAccessKey:process.env.YOSSECRETKEY}})

const getFile=async(title)=>{
    const dataForGetFile={
        Bucket:process.env.YOSBUCKET,
        Key:title
    }
    try{
        const file=createWriteStream("documents/"+title)
        const getFile=await client.send(new GetObjectCommand(dataForGetFile))
        getFile.Body.pipe(file)
        return new Promise((resolve,reject)=>{
            file.on('finish',()=>resolve())
            file.on('error',(err)=>reject(err))
        })
    }
    catch(err){
        console.log(err)
    }
}
const getLinkFile=async(title)=>{
    const dataForGetLink={
        Bucket:process.env.YOSBUCKET,
        Key:title
    }

    try{
        const sendler=new GetObjectCommand(dataForGetLink)
        const link=await getSignedUrl(client,sendler,{ttl:360000})
        return link
    }catch(err){
        console.log(err)
    }
}

const sendFile=async(file)=>{
    const writeFile=fs.createReadStream(file.path)
    //const ext=path.extname(file.originalname)
    const sendData={
        Bucket:process.env.YOSBUCKET,
        Key:file.originalname,
        Body:writeFile,
        ContentType:file.mimetype
    }
    try{
        await client.send(new PutObjectCommand(sendData))
        fs.unlink('documents/'+file.filename,(err)=>{
            if(err)console.log(err)
        })
    }
    catch(err){
        console.log(err)
    }
}

const deleteFile=async(title)=>{
    const dataDeleteFile={
        Bucket:process.env.YOSBUCKET,
        Key:title
    }
    try{
        const data=await client.send(new DeleteObjectCommand(dataDeleteFile))
        console.log(data)
        return data
    }catch(err){
        console.log(err)
    }
} 
//for handing files from object storage
// getFile(data[i].image_link)
//     .then(()=>res.json(getUser[0]))
//     .catch((err)=>res.status(500).send(err))
export {getFile,sendFile,deleteFile,getLinkFile}