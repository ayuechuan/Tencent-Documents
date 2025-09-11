/**
 * @Author zhiyuan.xu
 * @Date 2020/12/23
 * @Version 1.0.0
 * @Last Modified by zhiyuan.xu
 * @Last Modified Time 2020/12/23
 */
import { InputNumber } from 'antd';


const InputNum = () => {
    return <InputNumber />
}

export const ViewInputNum = ({ defaultValue }) => {
    return <div className={'not-select-handle '}>
        <InputNumber defaultValue={defaultValue} />
    </div>
}

export default InputNum;
