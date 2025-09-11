/**
 * @Author zhiyuan.xu
 * @Date 2020/12/30
 * @Version 1.0.0
 * @Last Modified by zhiyuan.xu
 * @Last Modified Time 2020/12/30
 */
 const formTemplateItem = {
    "pCode": "",
    "developKey": "",
    "textname": "",
    "uuId": "",
    "alias": "",
    "mode": 26,
    "sort": 1,
    "isHidden": false,
    "rules": {
        "price": false,
        "calculate": false,
        "disabled": false,
        "multiple": false,
        "url": ""
    },
    "formVerification": {
        "required": {
            "value": true,
            "message": "",
            "type": "string"
        }
    },
    "data": {
        "v": [],
        "currentData": [],
        "cpvData": []
    },
    "layout": {
        "label": {
            "name": "使用场景",
            "highlight": "#a5a3a3",
            "description": "",
            "style": {}
        },
        "value": {
            "placeholder": "",
            "displayType": "",
            "style": {}
        }
    },
    "listeners": []
}


const JsonData = {
    "formStyle": {
        "formItemLayout": {
            "labelCol": {
                "xs": {
                    "span": 24
                },
                "sm": {
                    "span": 4
                }
            },
            "wrapperCol": {
                "xs": {
                    "span": 24
                },
                "sm": {
                    "span": 20
                }
            }
        }
    },
    "editFormStyle": {
        "formItemLayout": {
            "labelCol": {
                "xs": {
                    "span": 24
                },
                "sm": {
                    "span": 4
                }
            },
            "wrapperCol": {
                "xs": {
                    "span": 24
                },
                "sm": {
                    "span": 20
                }
            }
        }
    },
    "detailStyle": {
        "formItemLayout": {
            "labelCol": {
                "xs": {
                    "span": 24
                },
                "sm": {
                    "span": 4
                }
            },
            "wrapperCol": {
                "xs": {
                    "span": 24
                },
                "sm": {
                    "span": 20
                }
            }
        }
    },
    "submitError": {
        "1030002": "创建失败",
        "1030003": "修改失败",
        "2030001": "该申請人已经存在",
        "2030004": "没有权限修改"
    },
    "formTemplate": []
}

export const madeTemplateData = (data) => {
    const copyJsonData = {...JsonData};
    const formTemplateList = Object.keys(data).map((key) => {
        const TemplateItem = {...formTemplateItem};
        const Item = data[key];
        // cp 的替换
        TemplateItem.layout.label.name = Item.name;
        TemplateItem.uuId = key;
        TemplateItem.mode = Item.mode;
        TemplateItem.developKey = Item.developKey;
        TemplateItem.sort = Item.sort;
        TemplateItem.isHidden = Boolean(Item.hide);
        TemplateItem.layout.label.description = Item.desc;
        TemplateItem.layout.label.highlight = Item.descColor;
        TemplateItem.alias = Item.alias;
        // 单选
        if (Item.cpvData) {
            TemplateItem.data.cpvData = Object.keys(Item.cpvData).map((vKey) => {
                let vData = {};
                const SubVdata = Item.cpvData[vKey];
                vData.alias = SubVdata.alias;
                vData.code = SubVdata.code;
                vData.defaultType = SubVdata.defaultType;
                vData.desc = SubVdata.desc;
                vData.developKey = SubVdata.developKey;
                vData.propertyValueData = SubVdata.name;
                vData.showName = SubVdata.showName;
                vData.sort = SubVdata.sort;
                return vData;
            })
        }
        return TemplateItem;
    })
    copyJsonData.formTemplate =formTemplateList;
    return copyJsonData;
}

