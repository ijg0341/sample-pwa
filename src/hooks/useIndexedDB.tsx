import {create} from "zustand";
import {useEffect} from "react";
import {ReportsDataSet} from "@/model/model.tsx";

interface Store {
  IDB: IDBDatabase | null
  initIDB: (IDB: IDBDatabase) => void
}

const useIndexedDBStore = create<Store>((set) => ({
  IDB: null,
  initIDB: (IDB: IDBDatabase) => set(() => ({ IDB }))
}))

const useIndexedDB = (objectStoreName: string) => {
  const { IDB, initIDB } = useIndexedDBStore()

  const indexedDBOpenRequest =  () => {
    const request =  indexedDB.open('SampleDB')
    request.onupgradeneeded = function () {
      const db = this.result;
      db.createObjectStore(objectStoreName, {keyPath: 'id', autoIncrement: true})
    }
    request.onerror = (e) => { console.error(e) }
    request.onsuccess = () => {
      initIDB(request.result)
    }
  }

  const write = (data: Partial<ReportsDataSet>) => {
    if(!IDB) { return }

    const transaction = IDB.transaction([objectStoreName], 'readwrite')
    const objStore = transaction.objectStore(objectStoreName)
    const request = objStore.add(data)

    return new Promise((res, rej) => {
      request.onsuccess = () => res(request.result)
      request.onerror = () => rej(request.error)
    })
  }

  const getDatas = () => {
    if(!IDB) { return }

    const transaction = IDB.transaction([objectStoreName], 'readonly')
    const request = transaction.objectStore(objectStoreName).getAll()

    return new Promise<ReportsDataSet[]>((res, rej) => {
      request.onsuccess = () => res(request.result)
      request.onerror = () => rej(request.error)
    })
  }

  const remove = (id: number) => {
    if(!IDB) { return }

    const transaction = IDB.transaction([objectStoreName], 'readwrite')
    const request = transaction.objectStore(objectStoreName).delete(id)

    return new Promise<ReportsDataSet[]>((res, rej) => {
      request.onsuccess = () => res(request.result)
      request.onerror = () => rej(request.error)
    })
  }

  const update = (data: Partial<ReportsDataSet>) => {
    if(!IDB) { return }

    const transaction = IDB.transaction([objectStoreName], 'readwrite')
    const request = transaction.objectStore(objectStoreName).put(data)

    return new Promise((res, rej) => {
      request.onsuccess = () => res(request.result)
      request.onerror = () => rej(request.error)
    })
  }

  useEffect(() => {
    if(IDB){ return }

    const indexedDB = window.indexedDB

    if(!indexedDB){
      window.alert('해당 브라우저에서는 indexedDB를 지원하지 않습니다.')
    } else {
      indexedDBOpenRequest()
    }

  }, [IDB]);

  return ({
    IDB,
    write,
    getDatas,
    remove,
    update
  })
}

export default useIndexedDB
