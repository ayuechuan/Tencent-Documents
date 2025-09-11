import domtoImage, { Options } from 'dom-to-image';
import EventEmitter from 'events';

type ExportStatus = 'pendding' | 'exporting' | 'end' | 'error';

export class ExportIamge {
  private readonly event = new EventEmitter();
  private exportStatus: ExportStatus = 'pendding';
  constructor(
    private readonly format: 'png' | 'jpeg' | 'webp' | 'avif',
    private readonly elementTag: string,
    private readonly bgcolor?: string
  ) { }

  public async run() {
    const element = document.getElementById(this.elementTag) || document.body;
    if (!element) {
      this.exportStatus = 'error';
      this.event.emit('isExporting', 'error');
      return;
    }

    if(this.exportStatus === 'exporting'){
      this.exportStatus = 'error';
      this.event.emit('isExporting', 'error');
      return;
    }

    try {
      this.exportStatus = 'exporting';
      this.event.emit('isExporting', 'exporting');
      const options: Options = {
        quality: 1,
        bgcolor: this.bgcolor === 'transparent' ? '' : undefined
      };

      let blob;
      switch (this.format) {
        case 'png':
          blob = await domtoImage.toBlob(element!, options);
          break;
        case 'jpeg':
          blob = await domtoImage.toJpeg(element!, options);
          break;
        case 'webp':
        case 'avif':
          blob = await domtoImage.toPng(element!, options);
          break;
      }

      if (blob) {
        // saveAs(blob, `cover.${format}`);
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      this.exportStatus = 'end';
      this.event.emit('isExporting', 'end');
    }
  }

  public subscirbe(callback: (isExporting: ExportStatus) => void) {
    this.event.on('isExporting', () => callback(this.exportStatus));
  }

  clear(){
    const timer = setTimeout(() => {
      
    }, timeout);
  }
}


const exportIamge = new ExportIamge('png', 'cover-preview', 'transparent');
exportIamge.subscirbe((isExporting) => {
  if (isExporting) {
    //. 进行中...
    return;
  }
});
//. 开始导出
exportIamge.run();
