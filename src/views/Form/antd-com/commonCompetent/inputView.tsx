/**
 * @Author zhiyuan.xu
 * @Date 2020/12/24
 * @Version 1.0.0
 * @Last Modified by zhiyuan.xu
 * @Last Modified Time 2020/12/24
 */
import { Input } from 'antd';

const InputView = ({text}) => {
    return <div className={'not-select-handle'}>
        <Input placeholder={text || ''} />
    </div>
};

export default InputView;
