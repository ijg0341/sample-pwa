import React, {useEffect, useState} from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Button} from "@/components/ui/button.tsx";
import {TReportFormData} from "@/model/model.tsx";


interface TProps {
  isOpen: boolean
  close: ()=>void
  onComplete: (data: TReportFormData)=>void
}

const AddForm:React.FC<TProps> = ({ isOpen, onComplete }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<Blob>()
  const [currentTime, setCurrentTime] = useState('')

  const fileUploadHandler = (e:React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0]
    const blob = new Blob([file], {type: file.type})
    setFile(blob)
    e.target.value = null
  }

  useEffect(() => {
    setTitle('')
    setDescription('')
    setFile(undefined)
    setCurrentTime('')
  }, [isOpen]);


  return(
    <Dialog open={isOpen} >
      <DialogContent>
        <DialogHeader >
          <DialogTitle>하자 등록하기</DialogTitle>
          <DialogDescription>
            내용 기입 후 사진과 함께 저장해주세요.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-10 items-center gap-4">
            <Label htmlFor="title" className="text-left col-span-2 whitespace-nowrap" >
              제목
            </Label>
            <Input
              id="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="col-span-8"
              placeholder={"제목을 입력해주세요"}
            />
          </div>
          <div className="grid grid-cols-10 items-center gap-4">
            <Label htmlFor="file" className="text-left col-span-2 whitespace-nowrap">
              사진
            </Label>
            {file ? <img src={URL.createObjectURL(file)} alt={'image'}/> :  <Input
              type={'file'}
              id="file"
              onChange={fileUploadHandler}
              className="col-span-8"
            />}
          </div>
          <div className="grid grid-cols-10 items-center gap-4">
            <Label htmlFor="date" className="text-left col-span-2 whitespace-nowrap">
              발생일시
            </Label>
            <Input
              type={'date'}
              id="date"
              onChange={e => setCurrentTime(e.target.value)}
              value={currentTime}
              className="col-span-8"
              placeholder={"발생일 입력해주세요"}
            />
          </div>
          <div className="grid grid-cols-10 items-start gap-4">
            <Label htmlFor="desc" className="text-left col-span-2 whitespace-nowrap">
              내용
            </Label>
            <Textarea
              id="desc"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="col-span-8  h-40 resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onComplete({
            title, description, file, currentTime
          })} type="submit">등록하기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddForm