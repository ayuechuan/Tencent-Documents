/**
 * @Author zhiyuan.xu
 * @Date 2020/12/23
 * @Version 1.0.0
 * @Last Modified by zhiyuan.xu
 * @Last Modified Time 2020/12/23
 */

import { Input } from 'antd';

const Text = () => {
    return <Input />
}

export const ViewText = () => {
    return <div className={'not-select-handle'}>
        <Input placeholder={'文本框'} />
    </div>
}


export default Text
