/**
 * @Author zhiyuan.xu
 * @Date 2020/12/25
 * @Version 1.0.0
 * @Last Modified by zhiyuan.xu
 * @Last Modified Time 2020/12/25
 */
import { Radio, Input } from 'antd';

export const getCpvSettingData = (data) => {
    return [
        {
            name: 'defaultType',
            label: '是否作为默认选项',
            Decorator: {
                rules: [{ required: true, message: '请选择是否需要默认选中' }],
                initialValue: 0
            }
        },
        {
            name: 'alias',
            label: '属性值编码',
            Decorator: {}
        },
        {
            name: 'desc',
            label: '属性值说明',
            Decorator: {}
        },
        {
            name: 'developKey',
            label: 'developKey',
            Decorator: {}
        },
        {
            name: 'showName',
            label: 'showName',
            Decorator: {}
        }
    ]
}

export const ComMap = {
    defaultType: (props) => <Radio.Group {...props}>
        <Radio value={0}>不作为默认值</Radio>
        <Radio value={1}>默认选中不可取消</Radio>
        <Radio value={2}>默认选中可取消</Radio>
    </Radio.Group> ,
    alias: (props) => <Input
        placeholder="输入属性编码值"
        {...props}
    />,
    desc: (props) => <Input
        placeholder="输入属性值说明"
        {...props}
    />,
    developKey: (props) => <Input placeholder={'请输入 developKey'} {...props} />,
    showName: (props) => <Input {...props} placeholder={'请输入 showName'} />
}

export const actionKeys = {
    changeValue: 'changeValue',
    addOne: 'addOne',
    addMany: 'addMany',
    sort: 'sort',
    delete: 'delete'
}
