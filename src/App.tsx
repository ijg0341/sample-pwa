import './App.css'
import useIndxedDB from "./hooks/useIndexedDB.tsx";
import {useEffect, useState} from "react";
import * as React from "react";
import useS3 from "./hooks/useS3.ts";
import {Button} from "@/components/ui/button.tsx";
import AddForm from "@/components/common/AddForm.tsx";
import dayjs from 'dayjs'
import {ReportsDataSet, TReportFormData} from "@/model/model.tsx";
import {Card} from "@/components/ui/card.tsx";

function App() {
  const { IDB, write, getDatas, remove, update } = useIndxedDB('reports')
  const { s3, getImages: getS3, uploadImage } = useS3('brown-pwa-sample')
  const [data, setData] = useState<ReportsDataSet[]>([])
  const [serverData, setServerData] = useState()
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);


  const fatchData = async () => {
    const result = await getDatas()
    setData(result)
  }


  const onComplete = async (data: TReportFormData) => {
    await write({
      ...data,
      createAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      isServerUpload: false,
      tryCount: 0,
    })
  }

  const onUpload = async (data: ReportsDataSet) => {
    const file = new File([data.file], `${data.title}_${data.currentTime}_${data.id}`)
    await uploadImage(file, () => {
      update({...data, isServerUpload: true})
    })
  }

  const deleteHandler = async (id: number) => {
    await remove(id)
    fatchData()
  }

  const getServerData = () => {
    getS3((data) => {
      console.log(data)
    })
  }

  useEffect(() => {
    if(IDB){
      fatchData()
    }
  }, [IDB]);

  useEffect(() => {
    if(s3){
      getServerData()
    }

  }, [s3]);

  useEffect(() => {

  }, [data]);

  return (
    <>
      <div className={'max-w-96 min-w-20 m-auto h-full'}>
        <h1 className={'text-3xl text-gray-100 font-bold mt-5'}>하자 접수 작성</h1>
        <Button className={'mt-4 '} onClick={() => setIsAddFormOpen(true)}>등록하기</Button>
        <div className={'grid grid-cols-12 mt-12'}>
          {data.map((report, key) => (
            <Card key={key} className={'p-4 bg-white col-span-12 mt-3 text-right'}>
              <div className={'flex gap-3 '}>
                <div className={'w-full rounded-2xl'} style={{
                  backgroundImage: `url(${URL.createObjectURL(report.file)})`,
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: '50%',
                  minWidth: '100px',
                  maxWidth: '100px',
                  minHeight: '100px',
                  maxHeight: '100px'
                }}></div>
                <div className={'text-left min-w-0'}>
                  <p className={'text-1xl font-bold overflow-ellipsis overflow-hidden text-nowrap'}>{report.title}</p>
                  <p className={'text-xs text-gray-400'}>발생시간: {report.currentTime}</p>
                  <p className={'text-xs text-gray-600 mt-2 whitespace-pre-wrap break-words'}>
                    {report.description}
                  </p>
                </div>
              </div>
              {!report.isServerUpload ? <>
                <Button onClick={() => deleteHandler(report.id)} className={'mr-2 bg-rose-500'} size={'sm'}>삭제</Button>
                <Button onClick={() => onUpload(report)} className={'bg-cyan-600'} size={'sm'}>제출</Button>
              </> : <p className={'text-xs text-gray-400'}>제출완료</p>}
            </Card>
          ))}
        </div>

        <h1 className={'text-2xl text-gray-100 font-bold mt-20'}>제출 완료</h1>

        <AddForm
          isOpen={isAddFormOpen}
          close={() => setIsAddFormOpen(false)}
          onComplete={(data) => {
            onComplete(data);
            setIsAddFormOpen(false)
          }}
        />
      </div>


    </>
  )
}

export default App
