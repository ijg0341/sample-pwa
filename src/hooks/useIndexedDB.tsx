import {create} from "zustand";
import {useEffect} from "react";

interface Store {
  IDB: IDBDatabase | null
  initIDB: (IDB: IDBDatabase) => void
}

export interface LocalImage {
  id: number
  data: Blob
  create_at: string
  update_at: string
}

const useIndexedDBStore = create<Store>((set) => ({
  IDB: null,
  initIDB: (IDB: IDBDatabase) => set(() => ({ IDB }))
}))

const useIndexedDB = () => {
  const { IDB, initIDB } = useIndexedDBStore()

  const indexedDBOpenRequest =  () => {
    const request =  indexedDB.open('SampleDB')
    request.onupgradeneeded = function () {
      const db = this.result;
      db.createObjectStore('images', {keyPath: 'id', autoIncrement: true})
    }
    request.onerror = (e) => { console.error(e) }
    request.onsuccess = () => {
      initIDB(request.result)
    }
  }

  const write = (data: Partial<LocalImage>) => {
    if(!IDB) { return }

    const transaction = IDB.transaction(['images'], 'readwrite')
    // transaction.oncomplete =()=>console.log('success');
    // transaction.onerror =()=> console.log('fail');

    const objStore = transaction.objectStore('images')
    const request = objStore.add(data)

    return new Promise((res, rej) => {
      request.onsuccess = () => res(request.result)
      request.onerror = () => rej(request.error)
    })
  }

  const getDatas = () => {
    if(!IDB) { return }

    const transaction = IDB.transaction(['images'], 'readonly')
    const request = transaction.objectStore('images').getAll()

    return new Promise<LocalImage[]>((res, rej) => {
      request.onsuccess = () => res(request.result)
      request.onerror = () => rej(request.error)
    })
  }

  const remove = (id: number) => {
    if(!IDB) { return }

    const transaction = IDB.transaction(['images'], 'readwrite')
    const request = transaction.objectStore('images').delete(id)

    return new Promise<LocalImage[]>((res, rej) => {
      request.onsuccess = () => res(request.result)
      request.onerror = () => rej(request.error)
    })
  }

  const update = (data: Partial<LocalImage>) => {
    if(!IDB) { return }

    const transaction = IDB.transaction(['images'], 'readwrite')
    const request = transaction.objectStore('images').put(data)

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
