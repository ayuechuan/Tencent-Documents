import './App.css'
import 'tdesign-react/esm/index'

import { useVcosole } from '@hooks/useVconsole'
import nprogress from 'nprogress'
import { Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'tdesign-react/esm/config-provider'
import { GlobalConfigProvider } from 'tdesign-react/esm/config-provider/type'

import Routes from '@/router'

import { ContextMenuProvider } from './contexts/contextMenuRight'
import { WebWorkerProvider } from './providers'

function useVconolseController() {
  const [vc] = useVcosole()
  useEffect(() => {
    console.log('VConsole ?', vc)
    if (vc) {
      vc.show()
    }
  }, [])
}

const App = ({ locales }: { locales: GlobalConfigProvider }) => {
  useVconolseController()
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL as string}>
      <Suspense fallback={<SuspenseFallback />}>
        <ConfigProvider
          globalConfig={{
            classPrefix: import.meta.env.VITE_PUBLIC_PREFIX,
            ...locales,
          }}
        >
          <WebWorkerProvider>
            {/* <ContextMenuProvider> */}
            <Routes />
            {/* </ContextMenuProvider> */}
          </WebWorkerProvider>
        </ConfigProvider>
      </Suspense>
    </BrowserRouter>
  )
}

function SuspenseFallback() {
  useEffect(() => {
    nprogress.configure({ showSpinner: false })
    nprogress.start()

    return () => void nprogress.done()
  }, [])

  return null
}

export default App

// export class ImageCache {
//   db: IDBDatabase | null = null;
//   version = 1;
//   assets = {};

//   constructor(props: any) {
//     this.version = props.version || 1;
//     this.assets = {};
//     this.db = null;
//   }

//   init() {
//     return new Promise<void>(resolve => {
//       const request = indexedDB.open('INDEXED.image.cache', this.version);

//       request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
//         (event.target as IDBOpenDBRequest).result.createObjectStore('cache');
//       };

//       request.onsuccess = () => {
//         this.db = request.result;

//         this.db.onerror = () => {
//           console.error('Error creating/accessing db');
//         };
//         resolve();
//       };
//     });
//   }

//   putImage(key: string, url: string) {
//     return new Promise<void>((resolve, reject) => {
//       if (!this.db) {
//         return reject('DB not initialized. Call the init method');
//       }

//       const db = this.db;

//       fetch(url)
//         .then(res => res.blob())
//         .then(blob => {
//           const transaction = db.transaction(['cache'], 'readwrite');
//           transaction.objectStore('cache').put(blob, key);
//           resolve();
//         });
//     });
//   }

//   putBlob(key: string, blob: Blob) {
//     return new Promise<void>((resolve, reject) => {
//       if (!this.db) {
//         return reject('DB not initialized. Call the init method');
//       }

//       const db = this.db;

//       const transaction = db.transaction(['cache'], 'readwrite');
//       transaction.objectStore('cache').put(blob, key);
//       resolve();
//     });
//   }

//   getImage(key: string): Promise<string | null> {
//     return new Promise<string | null>(resolve => {
//       const transaction = this.db?.transaction(['cache'], 'readwrite');
//       if (!transaction) {
//         resolve(null)
//       }
//       transaction!.objectStore('cache').get(key).onsuccess = event => {
//         const blob = (event.target as IDBRequest).result;
//         if (!blob) {
//           resolve(null);
//           return;
//         }
//         resolve(URL.createObjectURL(blob));
//       };
//     });
//   }

//   async clearImage(key: string) {
//     if (!key) {
//       return;
//     }
//     const image = await this.getImage(key)
//     if (image) {
//       const db = this.db;
//       const transaction = db?.transaction(['cache'], 'readwrite');
//       transaction?.objectStore('cache').delete(key);
//     }
//   }

//   clearAll() {
//     const db = this.db;
//     const transaction = db?.transaction(['cache'], 'readwrite');
//     transaction?.objectStore('cache').clear()
//   }
// }

// const BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII';
// const cache = new ImageCache({ version: 1 });
// await cache.init();
// await cache.putImage('trophy', BASE64);
// await cache.putImage('trophy11', BASE64);
// // await cache.putBlob('blob', blobInstance)
// // somewhere else
// // it will return string by URL.createObjectURL()
// // get blob easily by: let blob = await fetch(url).then(r => r.blob());
// const image = await cache.getImage('trophy')
