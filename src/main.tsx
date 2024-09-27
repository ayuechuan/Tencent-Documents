import axios from 'axios';
import './index.css';
import ReactDOM from 'react-dom/client';
import { GlobalConfigProvider } from 'tdesign-react/esm/config-provider/type';
import 'tdesign-react/esm/style/index'; // 少量公共样式
import 'tdesign-react/dist/tdesign.css'; // 全局引入所有组件样式代码
import './theme.less';
import './index.less';
import sync, { cancelSync, flushSync, getFrameData } from 'framesync';


export class Bootstrap {
  private readonly root = document.getElementById('root')!;
  private reactDomRootElement!: ReactDOM.Root;
  private lang = 'zh-CN';

  constructor() {
    this.lang = this.getLang();
    console.log(this.lang);

    const entries = import.meta.glob('../public/locales/**.json', { eager: true });
    for (const key in entries) {
      if (key.includes(this.lang)) {
        console.log('0000', key, (entries[key] as any).default);
      }
    }

    // 创建 PerformanceObserver 实例
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (entry.entryType === 'paint') {
          if (entry.name === 'first-contentful-paint') {
            console.log('首次内容绘制时间（First Contentful Paint）:', entry.startTime / 1000);
          } else if (entry.name === 'first-paint') {
            console.log('白屏时间（First Paint）:', entry.startTime / 1000);
          }
        }
      });
    });

    // 开始监听页面性能
    observer.observe({ entryTypes: ['paint'] });
  }

  public async render(): Promise<void> {
    try {
      // this.formatParamsToken();
      // this.rewriteLog();
      // this.isDebug();
      // this.initConfig();
      this.longtask();
      // this.anmation();
      this.mount();
      // this.server();
      // this.delayload();
    } catch (error) {
      throw error;
    }
  }

  /**
   * 延迟加载函数
   */
  public delayload() {
    // import html2canvas from 'html2canvas';
    requestIdleCallback((idleRequest) => {
      if (idleRequest.timeRemaining() > 0) {
        import('html2canvas').finally(() => {
          console.log('空闲加载完成！');

        })
      }
    })
  }

  public anmation() {
    // let count = 0;

    // const process = sync.render(() => {
    //   count++;
    //   console.log(count);

    //   if (count >= 10) cancelSync.render(process);
    // }, true);


    sync.update(() => {
      console.log('2update');
    })

    sync.read(() => {
      console.log('1read');
    })
    sync.read(() => {
      console.log('100read');
    })
    sync.render(() => {
      console.log('4render');
    })
    sync.preRender(() => {
      console.log('3render');
    })
    const frameData = getFrameData();
    console.log('frameData', frameData);
    sync.postRender(() => {
      console.log('5---');
    })

    flushSync.update();

    const instance = this.framesync((delta: any) => {
      console.log('delta', delta);
    });
    instance.start();
    setTimeout(() => {
      instance.stop();
    }, 0)

  }

  public frame() {
    const promise = new Promise<boolean>((resolve) => {
      let v = 0

      sync.update(() => {
        if (v === 2) flushSync.update()
      }, true)

      sync.update(() => {
        v++
        if (v > 6) resolve(true)
      }, true)
    })
    // flushSync.update()
    return promise;
  }

  public framesync(update: any) {
    const passTimestamp = ({ delta }: any) => update(delta)

    return {
      start: () => sync.update(passTimestamp, true),
      stop: () => cancelSync.update(passTimestamp),
    }
  }

  public async mount() {
    this.reactDomRootElement = ReactDOM.createRoot(this.root);
    const locales = await this.loadLocales();
    const App = import.meta.glob('./App.tsx', { eager: true })["./App.tsx"] as typeof import('./App');
    console.log('App', App);
    // ReactDOM.createRoot(document.getElementById('roots')!).render(<>10000000000</>);
    this.reactDomRootElement.render(
      <App.default locales={locales}></App.default>
    );
  }

  public unMount(): void {
    this.reactDomRootElement.unmount();
  }

  public async loadLocales(): Promise<GlobalConfigProvider> {
    const lang = this.lang;
    //  intl 项目国际化配置
    return axios.get(`${import.meta.env.BASE_URL}/locales/zh.json`)
      .then(async () => {
        //  tdesign-react 项目国际化配置
        let locales = {} as GlobalConfigProvider;
        switch (lang) {
          case 'zh-CN':
            locales = (await import('tdesign-react/esm/locale/zh_CN')).default;
            break;
          case 'en-US':
            locales = (await import('tdesign-react/esm/locale/en_US')).default;
            break;
          default:
            locales = (await import('tdesign-react/esm/locale/zh_CN')).default;
            break;
        }
        return locales;
      })
  }

  //  获取当前语言
  public getLang(): string {
    const langTemp = this.getCookie('lang') || navigator.language.toLowerCase() || 'zh-cn';
    const { length, 0: lang, [length - 1]: area } = langTemp.split('-');
    if (length !== 2) {
      switch (langTemp) {
        case 'en':
          return 'en-US'
        default:
          return 'zh-CN'
      }
    } else {
      return `${lang}-${area.toUpperCase()}`
    }
  }

  private getCookie(key: string): string {
    const reg = new RegExp(`(^| )${key}=([^;]*)(;|$)`);
    const arr = document.cookie.match(reg);
    if (arr) {
      return unescape(arr[2]);
    }
    return '';
  }

  public formatParamsToken(): void {
    const url = new URL(location.href)
    // 解析 URL 参数
    const urlParams = new URLSearchParams(url.search);
    const token = urlParams.get('token');
    if (!token) {
      return;
    }
    // 将 token 写入 Cookie
    document.cookie = `token=${token}; path=/;`;
    // 删除指定的参数
    url.searchParams.delete('token');
    // 获取修改后的 URL
    const modifiedUrl = url.toString();
    // 使用 history.pushState 修改浏览器历史记录，但不刷新页面
    window.history.pushState({ path: modifiedUrl }, '', modifiedUrl);
  }


  public isDebug(): void {
    //  开发环境 vite
    if (location.search.includes('debug') || import.meta.env.MODE === 'development') {
      console.info(`%c Current code version: ${import.meta.env.VITE_VERSION}`, 'color:#40E0D0;font-size:19px');
    } else {
      const consoles = window.console as Console;
      for (const item in consoles) {
        if (Reflect.has(consoles, item)) {
          consoles[item as keyof Console] = (() => { }) as never;
        }
      }
    }
  }

  public longtask(): void {
    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      for (const element of entries) {
        console.log("检测耗时任务===", element.duration);
      }

    })

    observer.observe({
      entryTypes: ['longtask']
    })
  }


  /**
   * 初始化项目配置 | 第三方依赖配置 
   */
  private initConfig() {

  }

  private renderConole(e: string, size?: number): string {
    return (
      void 0 === size && (size = 12),
      "display:inline-block;background-color:" +
      e +
      ";color:#fff;padding:2px 4px;font-size:" +
      size +
      "px;"
    );
  }

  public rewriteLog(): void {
    // const { location, console } = window;
    // const isDev = process.env.NODE_ENV === "development";
    // const isDug = location.href.includes("debug");
    const basename = import.meta.env.BASE_URL;

    const uppercaseName = basename.slice(0, 1).toUpperCase() + basename.slice(1);
    console.log(
      "%c",
      "font-size:40px;background:#fff;background:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCI+PGRlZnM+PHBhdGggZD0iTTE0LjQuOTgzbDExLjQzIDEwLjA3LS4yNDUuMDA1aC03LjAyOUwxNi4yNDEgMjMuOTZoLTUuOTUzTDEyLjYgMTEuMDU4SDcuOTMyTDMuNzI2IDYuNTY5bDkuNjgtLjAxNi45OTQtNS41N3oiIGlkPSJhIi8+PC9kZWZzPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEgMykiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PHBhdGggZD0iTTIyLjM1NyAwSDQuNjExYS41MDMuNTAzIDAgMCAwLS40OTcuNDExTC4wMDggMjMuMzc3YS41LjUgMCAwIDAgLjQ5Ny41ODRoOS43ODNsLjc3NS0uMjM3aDQuNTQzbC42MzUuMjM3aDcuNTM2YS41MDMuNTAzIDAgMCAwIC40OTctLjQxMWwzLjM3OC0xOC44OUwyMi4zNTcgMHoiIGZpbGw9IiMyQTY1RjUiLz48cGF0aCBkPSJNMjIuMzU3IDBsNS4yOTUgNC42NmgtNS41MjZhLjUuNSAwIDAgMS0uNDk3LS41ODRMMjIuMzU3IDB6IiBmaWxsPSIjMDBEQ0ZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48dXNlIGZpbGw9IiNGRkYiIHhsaW5rOmhyZWY9IiNhIi8+PC9nPjwvc3ZnPg==);background-size:contain;background-repeat:no-repeat;"
    );
    console.log(`%c${uppercaseName} | 表格`, this.renderConole("#2a65f5", 14));
    console.log(
      "%c数据版本%c" + "11111",
      this.renderConole("#e07800"),
      this.renderConole("rgba(69, 77, 90, 0.6)")
    );
    console.log(
      "%c代码版本%c" + "22222",
      this.renderConole("#e07800"),
      this.renderConole("rgba(69, 77, 90, 0.6)")
    );
    console.log(
      "%c分支版本%c" + "33333",
      this.renderConole("#e07800"),
      this.renderConole("rgba(69, 77, 90, 0.6)")
    );
    console.log(
      "%c温馨提示：请勿在此控制台输入来源不明的代码，或随意调试本程序代码，以免造成不好的使用体验！",
      this.renderConole("#e02424", 14)
    );
    console.log(
      `Powered by %c${uppercaseName}%cv0.1.0%c\n\nGitHub: https://github.com/ayuechuan\n\n获取帮助: `,
      "background-color: #1A55ED; padding: 7px; color: #fff;",
      "background-color: #FCBF23; color: #000; padding: 7px;",
      ""
    );
    window.console.groupCollapsed("查看日志");
  }


};

const bootstrap = new Bootstrap();
bootstrap.render();



