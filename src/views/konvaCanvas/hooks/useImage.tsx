export function useImage(url: any, crossOrigin?: any, referrerpolicy?: any) {
  const statusRef = useRef<any>('loading')
  const imageRef = useRef<any>()
  const [_, setStateToken] = useState(0)
  const oldUrl = useRef()
  const oldCrossOrigin = useRef()
  const oldReferrerPolicy = useRef()
  if (
    oldUrl.current !== url ||
    oldCrossOrigin.current !== crossOrigin ||
    oldReferrerPolicy.current !== referrerpolicy
  ) {
    statusRef.current = 'loading'
    imageRef.current = undefined
    oldUrl.current = url
    oldCrossOrigin.current = crossOrigin
    oldReferrerPolicy.current = referrerpolicy
  }

  useLayoutEffect(
    function () {
      if (!url) return
      const img = document.createElement('img')
      img.crossOrigin = 'Anonymous'
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')

      function onload() {
        statusRef.current = 'loaded'
        canvas.width = img.width
        canvas.height = img.height
        context!.drawImage(img, 0, 0)
        imageRef.current = canvas
        setStateToken(Math.random())
      }

      function onerror() {
        statusRef.current = 'failed'
        imageRef.current = undefined
        setStateToken(Math.random())
      }

      img.addEventListener('load', onload)
      img.addEventListener('error', onerror)
      crossOrigin && (img.crossOrigin = crossOrigin)
      referrerpolicy && (img.referrerPolicy = referrerpolicy)
      img.src = url

      return function cleanup() {
        img.removeEventListener('load', onload)
        img.removeEventListener('error', onerror)
      }
    },
    [url, crossOrigin, referrerpolicy],
  )
  return [imageRef.current, statusRef.current]
}