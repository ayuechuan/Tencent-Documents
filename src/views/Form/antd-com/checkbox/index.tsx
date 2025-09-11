/**
 * @Author zhiyuan.xu
 * @Date 2020/12/15
 * @Version 1.0.0
 * @Last Modified by zhiyuan.xu
 * @Last Modified Time 2020/12/15
 */

import { Checkbox } from 'antd';
import React from 'react'
import ViewValueCom from '../commonCompetent/viewCom';
const plainOptions = ['Apple', 'Pear', 'Orange'];

const Index = () => {
    return <Checkbox.Group options={plainOptions} defaultValue={['Apple']} />
}

export const ViewCheckBox = (props) => <ViewValueCom iconClassName={'select-border'} {...props} />

export default Index
