/**
 * @Author zhiyuan.xu
 * @Date 2020/12/15
 * @Version 1.0.0
 * @Last Modified by zhiyuan.xu
 * @Last Modified Time 2020/12/15
 */

import { Radio } from 'antd';
import ViewValueCom from '../commonCompetent/viewCom';

const RadioCom = () => {
    return <Radio.Group>
        <Radio value={1}>A</Radio>
        <Radio value={2}>B</Radio>
        <Radio value={3}>C</Radio>
        <Radio value={4}>D</Radio>
    </Radio.Group>
}

export const ViewRadioCom = (props) => <ViewValueCom iconClassName={'redio-border'} {...props} />

export default RadioCom;
