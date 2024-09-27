

export class Watermark {
  constructor(private canvas?: HTMLCanvasElement) {}

  public register(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    return this;
  }

  get context(){
    return this.canvas!.getContext('2d')!;
  }

  protected fillText(x: number, y: number, options: {
    value: string,
    font: string,
    style: string
  }) {
    const { context } = this;
    context.save();
    context.translate(x, y)
    context.rotate(-45 * Math.PI / 180);
    //  文字 20px
    context.font = options.font;
    //  字体透明度
    context.globalAlpha = 0.5;
    context.fillStyle = options.style;
    context.fillText(options.value, 0, 0);
    context.rotate(45 * Math.PI / 180);
    context.restore();
  }

  protected clear() {
    const { context } = this;
    context.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
  }

  public draw(value?: string, description?: string, type: 'dense' | 'loose' = 'loose') {
    const { context } = this;
    this.clear();
    const textArray = [{
      value: value || `腾讯文档${parseInt(Math.random() * 10 + '')}`,
      font: '20px microsoft yahei',
      style: 'rgba(0,0,0,0.6)'
    }, {
      value: description || 'td.QQ.com',
      font: '18px microsoft yahei',
      style: 'rgba(0,0,0,0.3)'
    }] as any

    let ionicWidth = 1;
    for (const text of textArray) {
      text.width = context.measureText(text.value).width;
      if (ionicWidth < text.width) {
        ionicWidth = text.width;
      }
    }

    //  判断类型是紧凑型还是松散型以此设置上下左右的间距
    const scale = type === 'dense' ?
      { widthScale: 1.8, heightScale: 1.2 } :
      { widthScale: 8, heightScale: 2 };

    let index = 0;
    for (let i = 0; i < window.screen.width; i += ionicWidth * (scale.widthScale)) {
      for (let j = 0; j < window.screen.height; j += ionicWidth * (scale.widthScale)) {
        if (index === 0) {
          this.fillText(i + 20, j + ionicWidth + 40 * scale.heightScale, textArray[0]);
          this.fillText(i + 15 + 20, j + ionicWidth + 15 + 40 * scale.heightScale, textArray[1]);
        } else {
          this.fillText(i + ionicWidth + 55, j + ionicWidth + 10, textArray[0]);
          this.fillText(i + ionicWidth + 15 + 55, j + ionicWidth + 15 + 10, textArray[1]);
        }
        i++;
      }
    }
  }
}
