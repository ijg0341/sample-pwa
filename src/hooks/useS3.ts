import {useEffect, useState} from "react";
import AWS from "aws-sdk";

const useS3 = (bucketName) => {
  const [s3, setS3] = useState(null)

  const uploadImage = (file, onComplete)=>{
    if(!file){
      alert('업로드 파일을 선택해주세요.')
      return
    }
    const uploadParams = {
      Bucket:bucketName,
      Key: `${file.name}`,
      Body: file,
    }

    s3.upload(uploadParams).promise()
      .then(() => onComplete())
      .catch(err => console.log(err))
  }

  const getImages = (onComplete)=>{
    s3.listObjectsV2({Bucket:bucketName}).promise()
      .then((data)=>{
        onComplete(data.Contents)
      })
      .catch((error)=>{
        console.log('catch')
        console.error(error)
      })
  }

  const removeImage =  (value, onComplete) =>{
    const params = {
      Bucket:bucketName,
      Key: value,
    }
    s3.deleteObject(params).promise()
      .then(() => onComplete())
      .catch((err) => console.error(err));
  }

  useEffect(() => {
    if(AWS){
      setS3(new AWS.S3({
        region: 'ap-northeast-2',
        credentials:{
          accessKeyId: import.meta.env.VITE_S3_ACCESS_KEY,
          secretAccessKey: import.meta.env.VITE_S3_SECRET_ACCESS_KEY,
        }
      }))
    }


  },[AWS])

  return({
    s3,
    uploadImage,
    removeImage,
    getImages
  })
}


export default useS3