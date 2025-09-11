/**
 * @Author zhiyuan.xu
 * @Date 2020/12/25
 * @Version 1.0.0
 * @Last Modified by zhiyuan.xu
 * @Last Modified Time 2020/12/25
 */
import { forwardRef } from 'react';
import { Input, Radio } from 'antd';
const { TextArea } = Input;

export const getSettingData = (data) => {
    return [
        {
            name: 'alias',
            label: '选项编码',
            Decorator: {}
        },
        {
            name: 'developKey',
            label: 'developKey',
            Decorator: {}
        },
        {
            name: 'desc',
            label: '选项说明',
            Decorator: {}
        },
        {
            name: 'required',
            label: '是否必填',
            Decorator: {
                rules: [{ required: true, message: '请选择是否必填!' }],
                initialValue: false
            }
        },
        {
            name: 'descColor',
            label: '选项说明是否高亮',
            Decorator: {
                rules: [{ required: true, message: '请选择是否高亮!' }],
                initialValue: '#a5a3a3'
            }
        },
        {
            name: 'hide',
            label: '选项是否隐藏',
            Decorator: {
                rules: [{ required: false }],
                initialValue: 0
            }
        }
    ]
}

export const ComMap = {
    alias:forwardRef((props, ref) => <Input ref={ref} {...props} placeholder="请填写选项编码值" />),
    developKey: forwardRef((props, ref) => <Input ref={ref} {...props} placeholder="请填写developKey" />),
    desc: forwardRef((props, ref) => <TextArea ref={ref} {...props} placeholder={'请填写选项说明'} />),
    required: forwardRef((props, ref) => <Radio.Group ref={ref} {...props}>
        <Radio value={true}>是</Radio>
        <Radio value={false}>否</Radio>
    </Radio.Group>),
    descColor: forwardRef((props, ref) => <Radio.Group ref={ref} {...props}>
        <Radio value={'#ff7700'}>是</Radio>
        <Radio value={'#a5a3a3'}>否</Radio>
    </Radio.Group>),
    hide: forwardRef((props, ref) => <Radio.Group ref={ref} {...props}>
        <Radio value={1}>是</Radio>
        <Radio value={0}>否</Radio>
    </Radio.Group>)
}
