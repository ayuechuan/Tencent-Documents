import ViewValueCom from "../commonCompetent/viewCom";

/**
 * @Author zhiyuan.xu
 * @Date 2020/12/23
 * @Version 1.0.0
 * @Last Modified by zhiyuan.xu
 * @Last Modified Time 2020/12/23
 */
import { Select } from 'antd';
const { Option } = Select;

const children = [];
for (let i = 10; i < 36; i++) {
    children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

const SelectCheckBox = () => <Select
        mode="multiple"
        style={{ width: '100%' }}
        placeholder="Please select"
        defaultValue={['a10', 'c12']}
    >
        {children}
    </Select>

export const ViewSelectCheckBox = (props) => <ViewValueCom iconClassName={'select-border'} {...props} />

export default SelectCheckBox
