import './App.css'
import useIndxedDB, {LocalImage} from "./hooks/useIndexedDB.tsx";
import {useEffect, useState} from "react";
import dayjs from 'dayjs'
import * as React from "react";

// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker
//     .register("/sw.js")
//     .then(function (registration) {
//       console.log("Service Worker registered with scope:", registration.scope);
//     })
//     .catch(function (err) {
//       console.log("Service Worker registration failed", err);
//     });
// }

function App() {
  const { IDB, write, getDatas, remove, update } = useIndxedDB()
  const [data, setData] = useState<LocalImage[]>([])

  const getImages = async () => {
    const result = await getDatas()
    setData(result)
  }

  const addImages = async (data: Blob) => {
    await write({
      data: data,
      create_at: dayjs().format('YYYY-MM-DD HH:mm:ss')
    })
    getImages()
  }

  const updateImages = async (data: Partial<LocalImage>) => {
    try{
      await update(data)
      getImages()
    } catch (e){
      alert(e.message)
    }

  }

  const deleteImages = async (id: number) => {
    await remove(id)
    getImages()
  }

  const fileUploadHandler = (e:React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0]
    const blob = new Blob([file], {type: file.type})
    addImages(blob)

    e.target.value = null
  }

  useEffect(() => {
    if(IDB){
      getImages()
    }
  }, [IDB]);

  return (
    <>
      <h1>Offline Image Uploader</h1>
      <div className="card">
        <button>
          <input type={'file'} onChange={fileUploadHandler}/>
        </button>
      </div>
      <div>
        {data.map((images, key) => (
          <div key={key}>
            <img src={URL.createObjectURL(images.data)} width={'150px'}/>
            <button onClick={() => updateImages({...images, update_at: dayjs().format('YYYY-MM-DD HH:mm:ss')})}>update</button>
            <button onClick={() => deleteImages(images.id)}>delete</button>
            {images.id} {images.create_at} {images.update_at}
          </div>
        ))}
      </div>
      <p className="read-the-docs">
        앱으로 사용시 오프라인 상태에서 저장해놓은 사진을 주기적으로 서버에 업로드합니다.
      </p>
    </>
  )
}

export default App
