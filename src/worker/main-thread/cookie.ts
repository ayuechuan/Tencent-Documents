import type { IMainThreadAction } from './index';
import BaseAction from '../common/base-action';
import { WorkerReponse } from '../common/payload-type';
import { CookieActionType } from '../common/action-type';

export default class Cookie extends BaseAction {
    protected threadAction: IMainThreadAction;

    protected addActionHandler(): void {
        this.controller.addActionHandler(CookieActionType.Cookie, this.getCookie.bind(this));
    }

    /**
     * 获取 cookie 处理器
     */
    private getCookie() {
        // const cookie = document.cookie;
        // return cookie;
        // 验证当前执行环境
        if (typeof document !== 'undefined') {
            console.error('错误：这个方法应该在 Worker 线程执行！');
            throw new Error('Method should run in worker thread');
        }
        return fibonacci(40);

    }
}

function fibonacci(n) {
    if (n <= 1) {
        return n;
    }
    return fibonacci(n - 1) + fibonacci(n - 2);
}
