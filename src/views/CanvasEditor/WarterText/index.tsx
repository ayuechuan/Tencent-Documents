import svg from '@assets/react.svg'
import { useMount } from 'ahooks'
import sync, { cancelSync } from 'framesync'

export function WarterText() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  useMount(() => {
    if (!canvas.current) {
      return
    }

    const node = canvas.current
    node.width = 1920
    node.height = 1080
    const context = node.getContext('2d') as CanvasRenderingContext2D
    const ctx = node.getContext('2d')!
    // 进度条的参数
    const progress = 0 // 当前进度
    const radius = 70 // 圆的半径
    const centerX = node.width / 2 // 圆心X坐标
    const centerY = node.height / 2 // 圆心Y坐标

    function drawProgressBar(percent: any) {
      // 清空Canvas
      ctx.clearRect(0, 0, node.width, node.height)

      // 绘制背景圆
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, false)
      ctx.fillStyle = '#e6e6e6'
      ctx.fill()

      // 计算当前进度的弧度
      const startAngle = -Math.PI / 2 // 从顶部开始
      const endAngle = startAngle + Math.PI * 2 * (percent / 100) // 结束角度

      // 绘制进度条
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, startAngle, endAngle, false)
      ctx.lineWidth = 15 // 线宽
      ctx.strokeStyle = '#4caf50' // 进度条颜色
      ctx.stroke()

      // 绘制进度文本
      ctx.fillStyle = '#000'
      ctx.font = '20px Arial'
      ctx.fillText(`${Math.round(percent)}%`, centerX - 20, centerY + 7) // 居中显示百分比
    }

    // const start = performance.now();
    // const id = sync.read(() => {
    //   console.log('执行===', progress);

    //   if (progress >= 100) {
    //     cancelSync.read(id);
    //   }
    //   drawProgressBar(Math.min(progress, 100));
    //   const end = performance.now();
    //   console.log(`Execution time: ${(end - start) / 1000} milliseconds`);
    //   progress += 0.81;

    // }, true);

    console.log(imgRef.current)
    const img = imgRef.current!
    let indexs = 0
    function rate() {
      indexs += 1
      context.clearRect(0, 0, 1920, 1080)

      // var ptrn = context.createPattern(img, 'repeat')!;
      // context.strokeStyle = ptrn;
      // context.rect(0,0,200,200)
      // context.stroke();

      ctx = node.getContext('2d')! //返回一个画布渲染上下文对象，使用该对象可以在canvas元素中绘制图形，参数“2d”表示二维绘图
      //保存
      ctx.save()

      ctx.fillStyle = 'yellow' //将绘制矩阵填充为分红
      ctx.strokeStyle = 'blue'
      ctx.fillRect(50, 25, 100, 50) //制定了要绘制的矩形位置、尺寸
      ctx.strokeRect(50, 25, 100, 50)
      ctx.fill()
      ctx.stroke()
      //保存
      ctx.save()

      ctx.fillStyle = 'red' //将绘制矩阵填充为分红
      ctx.strokeStyle = 'green'
      ctx.fillRect(180, 25, 100, 50) //制定了要绘制的矩形位置、尺寸
      ctx.strokeRect(180, 25, 100, 50)
      ctx.fill()
      ctx.stroke()
      //恢复
      ctx.restore()
      const ddd = ctx.strokeStyle
      console.log(ddd)

      ctx.fillRect(50, 100, 100, 50) //制定了要绘制的矩形位置、尺寸
      ctx.strokeRect(180, 100, 100, 50)
      // 在画布上设置一个裁剪区域，name下次画的东西，你只能在裁剪范围内才能看到
      // ctx.restore();
      ctx.beginPath()
      ctx.rect(50, 400, 100, 200)
      ctx.stroke()
      // ctx.clip()
      ctx.font = '40px microsoft yahei'
      ctx.fillText('测试4278758', 50, 450)
      ctx.strokeStyle = 'red'
      ctx.strokeText('测试4278758', 50, 450)

      var ctx = node.getContext('2d')!

      ctx.save()
      const path = new Path2D()
      const path2 = new Path2D(
        'M48.8820344,6.68631316 C45.4106986,3.87135976 41.298287,1.81606109 36.7978491,0.773466538 M30,0 C27.8875111,0 25.8260193,0.218345084 23.8368617,0.633698404 C17.0417632,2.05257373 11.0907689,5.77044119 6.83444861,10.936731',
      )
      path.bezierCurveTo(225, 225, 300, 300, 300, 333)
      path.roundRect(0, 0, 200, 200, 30)
      path.rect(70, 70, 50, 50)
      path.closePath()
      ctx.strokeStyle = '#000'
      ctx.fillStyle = 'rgba(255,0,0,0.25)'
      // path2.addPath(path)
      ctx.translate(500, 500)
      ctx.stroke(path2)
      ctx.restore()
      return
      // 移动上下文原点到图片的中心点
      const imgWidth = 200
      const imgHeight = 200
      const centerX = 300 + imgWidth / 2 // 图片的中心 x 坐标
      const centerY = 300 + imgHeight / 2 // 图片的中心 y 坐标
      context.save()
      context.translate(centerX, centerY) // 400, 400 是图片中心点的坐标
      context.rotate((indexs * Math.PI) / 180)
      // 使用 transform() 进行平移和旋转

      //  translate(centerX, centerY) rotate(indexs * Math.PI / 180)
      // context.transform(centerX, centerY, indexs * Math.PI / 180, centerX, centerY, indexs * Math.PI / 180);

      const angle = (indexs * Math.PI) / 180 // 角度转换为弧度
      // context.transform(
      //   Math.cos(angle), // a: 水平缩放
      //   Math.sin(angle), // b: 垂直倾斜
      //   -Math.sin(angle), // c: 水平倾斜
      //   Math.cos(angle), // d: 垂直缩放
      //   centerX, // e: 水平平移
      //   centerY  // f: 垂直平移
      // );
      // 绘制图片，左上角位置调整为 (-imgWidth / 2, -imgHeight / 2)
      context.drawImage(img, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight)
      // context.drawImage(img, -300, -300, imgWidth, imgHeight);
      context.restore()
    }

    sync.read(() => rate())
    return
    let i = 200
    const syncid = sync.read(() => {
      i += 5
      if (i >= 400) {
        cancelSync.read(syncid)
      }
      context.save()
      // 设置绘制样式
      context.strokeStyle = 'red'
      context.lineWidth = 2

      // 开始绘制路径
      // context.beginPath();
      context.moveTo(50, 150) // 起点
      context.quadraticCurveTo(150, 50, 250, 150) // 绘制二次贝塞尔曲线
      context.stroke()
      // context.closePath();
      context.restore()
      context.moveTo(200, 200)
      context.lineTo(i, 200)
      context.stroke()

      context.rect(300, 300, 200, 200)
      context.stroke()
    }, true)

    return

    function save() {
      context.save()
      context.beginPath()
    }

    function restore() {
      context.restore()
    }

    context.clearRect(0, 0, 600, 600)
    //  保存的原始
    context.save()
    context.fillStyle = 'red'
    context.fillRect(50, 50, 50, 50)
    // 保存的红色
    context.save()

    context.fillStyle = 'blue'
    context.fillRect(100, 100, 50, 50)

    context.restore()
    context.fillRect(150, 150, 50, 50)

    context.restore()
    context.fillRect(200, 200, 50, 50)

    function text(
      x: number,
      y: number,
      options: {
        value: string
        font: string
        style: string
      },
    ) {
      //  保存原始
      context.save()
      context.translate(x, y)
      context.rotate((-45 * Math.PI) / 180)
      //  文字 20px
      context.font = options.font
      //  字体透明度
      context.globalAlpha = 0.5
      context.fillStyle = options.style
      context.fillText(options.value, 0, 0)
      context.rotate((45 * Math.PI) / 180)
      context.restore()
    }

    // context.fillRect(0, 0, 50, 50);

    context.save()
    context.rect(0, 0, 50, 50)
    context.stroke()
    context.clip()
    //  字体颜色设置成白色
    context.fillStyle = 'white'
    context.font = '20px microsoft yahei'
    context.fillText('测试4278758', 0, 20)

    context.restore()
    context.fillStyle = 'white'
    context.font = '20px microsoft yahei'
    context.fillText('测试4278758', 50, 20)
  })

  return (
    <div>
      <canvas
        ref={canvas}
        style={{
          background: '#ccc',
        }}
        id="canvas"
      >
        不支持
      </canvas>
      <img ref={imgRef} src={svg} alt="" />
    </div>
  )
}
