/**
 * @Author zhiyuan.xu
 * @Date 2020/12/22
 * @Version 1.0.0
 * @Last Modified by zhiyuan.xu
 * @Last Modified Time 2020/12/22
 */
import React from 'react';
import { Form } from 'antd'
import { getSettingData, ComMap } from '../com-setting/cpSetting';
import { doubleHandle } from './util';

const cpDisPatch = (pid, value, ChangeCpFormData) => {
    ChangeCpFormData && ChangeCpFormData(pid, value)
}

// 防抖
const doubleDis = doubleHandle(cpDisPatch, 400)

const onValuesChange = (props, changedValues, allValues) => {
    const pId = props.rightData.data.id;
    doubleDis(pId, changedValues, props.ChangeCpFormData)
};

class CpForm extends React.Component {
   constructor() {
       super();
       this.ComData = getSettingData();
   }

    componentDidMount() {
        this.props.setPvFormValue(this.props.form, this.props.rightData.data.id)
    }

   componentDidUpdate(prevProps) {
       if (prevProps.rightData) {
           // 切换了id
           if (prevProps.rightData.data.id !== this.props.rightData.data.id) {
               this.props.setPvFormValue(this.props.form, this.props.rightData.data.id)
           }
       }
   }


    render() {
       const { getFieldDecorator } = this.props.form;
       return <Form>
           {
               this.ComData.map((item, index) => {
                   const Com = ComMap[item.name];
                   return <Form.Item key={`${index}asd`} label={item.label}>
                       {getFieldDecorator(item.name, item.Decorator)(
                           <Com />
                       )}
                   </Form.Item>
               })
           }
       </Form>
   }
}

// export default Form.create({ onValuesChange })(CpForm);
export default CpForm;
