/**
 * @Author zhiyuan.xu
 * @Date 2020/12/22
 * @Version 1.0.0
 * @Last Modified by zhiyuan.xu
 * @Last Modified Time 2020/12/22
 */
import React from 'react';
import { Form } from 'antd'
import { getCpvSettingData, ComMap } from '../com-setting/cpvSetting';
import {doubleHandle} from "./util";

const cpvDisPatch = (pid, vid, value, ChangeCpvFormData) => {
    ChangeCpvFormData && ChangeCpvFormData(pid, vid, value)
}

// 防抖
const doubleDis = doubleHandle(cpvDisPatch, 400)

const onValuesChange = (props, changedValues, allValues) => {
    const rightData = props.rightData;
    const pId = rightData.pId;
    const vId = rightData.data.id;
    doubleDis(pId, vId, changedValues, props.ChangeCpvFormData)
};

class CpvForm extends React.Component {

    constructor() {
        super();
        this.getCpvSettingData = getCpvSettingData();
    }
    componentDidMount() {
        this.props.setCpvFormValue(this.props.form, this.props.rightData.pId, this.props.rightData.data.id)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.rightData) {
            // 切换了id
            if (prevProps.rightData.data.id !== this.props.rightData.data.id) {
                this.props.setCpvFormValue(this.props.form, this.props.rightData.pId, this.props.rightData.data.id)
            }
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return <Form className={'form'}>
            {
                this.getCpvSettingData.map((item, index) => {
                    const Com = ComMap[item.name];
                    return <Form.Item key={`211as${index}`} label={ item.label } className={'form-item'}>
                        {getFieldDecorator(item.name, item.Decorator)(
                            <Com />
                        )}
                    </Form.Item>
                })
            }
        </Form>
    }
}

export default CpvForm
// export default Form.create({ name: 'CpvForm', onValuesChange })(CpvForm);
