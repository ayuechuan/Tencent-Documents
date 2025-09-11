/**
 * @Author zhiyuan.xu
 * @Date 2020/12/23
 * @Version 1.0.0
 * @Last Modified by zhiyuan.xu
 * @Last Modified Time 2020/12/23
 */
import { DatePicker } from 'antd';
import locale from 'antd/es/date-picker/locale/zh_CN';

const Datepick = () => {
    return <DatePicker locale={locale} />
}

export const ViewDatepick = () => {
    return <div className={'not-select-handle'}>
        <DatePicker locale={locale}  />
    </div>
}


export default Datepick;
