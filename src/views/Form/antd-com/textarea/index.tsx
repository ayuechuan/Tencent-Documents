/**
 * @Author zhiyuan.xu
 * @Date 2020/12/23
 * @Version 1.0.0
 * @Last Modified by zhiyuan.xu
 * @Last Modified Time 2020/12/23
 */
import { Input } from 'antd'
const { TextArea } = Input

const Textarea = () => {
    return <TextArea />
}

export const ViewTextarea = () => {
    return <div className={'not-select-handle '}>
        <TextArea />
    </div>
}


export default Textarea
