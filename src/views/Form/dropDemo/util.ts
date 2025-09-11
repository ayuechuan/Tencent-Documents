/**
 * @Author zhiyuan.xu
 * @Date 2020/12/28
 * @Version 1.0.0
 * @Last Modified by zhiyuan.xu
 * @Last Modified Time 2020/12/28
 */
import {getCpvSettingData} from '../com-setting/cpvSetting';
const selectModeList = [2, 7, 44];


export const doubleHandle = (fn, time) => {
    let timeout = null;
    return function () {
        if(timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            fn.apply(this, arguments);
        }, time);
    }
}

// 初始提交数据...
export const getFormData = (data, listData) => {
    let SubmitData = {};
    data.forEach((item) => {
        if (typeof item.Decorator.initialValue !== 'undefined') {
            SubmitData[item.name] = item.Decorator.initialValue
        } else {
            SubmitData[item.name] = ''
        }
    });
    SubmitData.name = listData.name;
    SubmitData.mode = listData.mode;
    if (selectModeList.includes(SubmitData.mode)) {
        SubmitData.cpvData = getCpvData(listData)
    }
    return SubmitData
}

// 提交的cpv数据
export const getCpvData = (listData, sort) => {
    const data = {};
    listData.defaultValue.map((item, index) => {
        data[item.id] = {};
        data[item.id].name = item.value;
        data[item.id].sort = sort || index;
        const cpvData = getCpvSettingData();
        cpvData.forEach((pv) => {
            if (typeof pv.Decorator.initialValue !== 'undefined') {
                data[item.id][pv.name] = pv.Decorator.initialValue;
            } else {
                data[item.id][pv.name] = ''
            }
        });
    })
    return data;
}

