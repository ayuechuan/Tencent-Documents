/**
 * @Author zhiyuan.xu
 * @Date 2020/12/15
 * @Version 1.0.0
 * @Last Modified by zhiyuan.xu
 * @Last Modified Time 2020/12/15
 */
import Radio, { ViewRadioCom } from '../antd-com/radio/index';
import Checkbox, { ViewCheckBox } from '../antd-com/checkbox/index';
import Text, {ViewText} from "../antd-com/text/index";
import Textarea, { ViewTextarea } from '../antd-com/textarea/index'
import Picture, {ViewPicture} from "../antd-com/picture";
import Datepick, {ViewDatepick} from "../antd-com/datepick";
import InputNum, { ViewInputNum } from "../antd-com/numberinput";
import SelectCheckBox, { ViewSelectCheckBox } from "../antd-com/selectCheckbox";
import InputAndAdd, { ViewInputAndAdd } from "../antd-com/inputAndAdd";
import Organization, { ViewOrganization } from "../antd-com/organization";
import ProductionLine, { ViewProductionLine } from "../antd-com/productionLine";
import EmailInput, { ViewEmailInput } from "../antd-com/emailInput";
import Colony, { ViewColony } from '../antd-com/colony'
import SelectStaff, { ViewSelectStaff } from '../antd-com/selectStaff';
import Subject, { ViewSubject } from '../antd-com/subject';

const comDataMap = [{
    name: '基本组件',
    list: [
        {
        name: '常用组件',
        list: [
            {
                name: '文本',
                mode: '0',
                svg: () => (
                    <svg t="1608707393253" className="icon" viewBox="0 0 1024 1024" version="1.1"
                         xmlns="http://www.w3.org/2000/svg" p-id="1187" width="1em" height="1em"
                         fill="currentColor"
                    >
                        <path
                            d="M853.333333 170.666667H170.666667a42.666667 42.666667 0 0 0-42.666667 42.666666v128a42.666667 42.666667 0 0 0 85.333333 0V256h256v554.666667H384a42.666667 42.666667 0 0 0 0 85.333333h256a42.666667 42.666667 0 0 0 0-85.333333h-85.333333V256h256v85.333333a42.666667 42.666667 0 0 0 85.333333 0V213.333333a42.666667 42.666667 0 0 0-42.666667-42.666666z"
                            p-id="1188"></path>
                    </svg>
                )
            },{
                name: '长文本',
                mode: '26',
                svg: () => (
                    <svg t="1608707345560" className="icon" viewBox="0 0 1024 1024" version="1.1"
                         xmlns="http://www.w3.org/2000/svg" p-id="1057" width="1em" height="1em"
                         fill="currentColor"
                    >
                        <path
                            d="M896 160H128c-35.2 0-64 28.8-64 64v576c0 35.2 28.8 64 64 64h768c35.2 0 64-28.8 64-64V224c0-35.2-28.8-64-64-64z m0 608c0 16-12.8 32-32 32H160c-19.2 0-32-12.8-32-32V256c0-16 12.8-32 32-32h704c19.2 0 32 12.8 32 32v512z"
                            p-id="1058"></path>
                        <path
                            d="M224 288c-19.2 0-32 12.8-32 32v256c0 16 12.8 32 32 32s32-12.8 32-32V320c0-16-12.8-32-32-32z m608 480c19.2 0 32-12.8 32-32V608L704 768h128z"
                            p-id="1059"></path>
                    </svg>
                )
            }, {
                name: '单选',
                mode: '2',
                svg: () => (
                    <svg t="1608707307235" viewBox="0 0 1040 1024" version="1.1"
                         xmlns="http://www.w3.org/2000/svg" p-id="928"
                         fill="currentColor"
                         width="1em" height="1em">
                        <path
                            d="M509.92 176C325.504 176 176 325.504 176 509.92c0 184.416 149.504 333.92 333.92 333.92 184.416 0 333.92-149.504 333.92-333.92C843.84 325.504 694.32 176 509.92 176z m0 48c157.904 0 285.92 128 285.92 285.92 0 157.904-128.016 285.92-285.92 285.92C352 795.84 224 667.808 224 509.92 224 352 352 224 509.92 224z m0 96C405.024 320 320 405.024 320 509.92c0 104.88 85.024 189.92 189.92 189.92 104.88 0 189.92-85.04 189.92-189.92 0-104.896-85.04-189.92-189.92-189.92z"
                            p-id="929"></path>
                    </svg>
                )
            },
            {
                name: '多选',
                mode: '7',
                svg: () => (
                    <svg t="1608707414292" className="icon" viewBox="0 0 1024 1024" version="1.1"
                         xmlns="http://www.w3.org/2000/svg" p-id="1316" width="1em" height="1em"
                         fill="currentColor"
                    >
                        <path
                            d="M810.666667 128H213.333333c-46.933333 0-85.333333 38.4-85.333333 85.333333v597.333334c0 46.933333 38.4 85.333333 85.333333 85.333333h597.333334c46.933333 0 85.333333-38.4 85.333333-85.333333V213.333333c0-46.933333-38.4-85.333333-85.333333-85.333333z m-353.706667 567.04a42.496 42.496 0 0 1-60.16 0L243.626667 541.866667c-8.106667-8.106667-12.373333-18.773333-12.373334-29.866667s4.693333-22.186667 12.373334-29.866667a42.496 42.496 0 0 1 60.16 0L426.666667 604.586667l293.546666-293.546667a42.496 42.496 0 1 1 60.16 60.16l-323.413333 323.84z"
                            p-id="1317"></path>
                    </svg>
                )
            },
            {
                name: '数字控件',
                mode: '43',
                svg: () => (
                    <svg t="1608713995234" className="icon" viewBox="0 0 1024 1024" version="1.1"
                         xmlns="http://www.w3.org/2000/svg" p-id="4554" width="1em" height="1em"
                         fill="currentColor">
                        <path
                            d="M279.273 791.273h512a46.545 46.545 0 0 1 0 93.09h-512a46.545 46.545 0 0 1 0-93.09z m33.838-617.984v478.347H193.722V395.171c0-37.004-0.884-59.299-2.653-66.746a24.948 24.948 0 0 0-14.615-16.99c-8.006-3.863-25.786-5.771-53.341-5.771H111.29v-55.855c57.717-12.38 101.562-37.888 131.491-76.52h70.284z m303.71 396.8v81.547H354.163v-68.235c77.778-127.256 124.044-206.01 138.706-236.218 14.662-30.255 22.016-53.854 22.016-70.75 0-13.032-2.234-22.714-6.656-29.137-4.422-6.377-11.171-9.588-20.247-9.588a22.249 22.249 0 0 0-20.201 10.612c-4.469 7.121-6.656 21.178-6.656 42.263v45.522H354.164V318.65c0-26.763 1.397-47.942 4.143-63.348 2.746-15.5 9.542-30.72 20.387-45.661 10.798-14.988 24.902-26.298 42.217-33.978 17.361-7.68 38.167-11.544 62.37-11.544 47.477 0 83.317 11.776 107.707 35.328 24.296 23.552 36.445 53.341 36.445 89.368 0 27.368-6.842 56.32-20.48 86.853-13.731 30.534-54.04 95.325-121.018 194.42H616.82z m270.615-189.394c18.152 6.098 31.65 16.105 40.494 29.976 8.844 13.917 13.312 46.452 13.312 97.652 0 38.028-4.329 67.49-13.033 88.53-8.657 20.945-23.598 36.91-44.87 47.848-21.27 10.938-48.593 16.384-81.873 16.384-37.795 0-67.49-6.33-89.088-19.084-21.55-12.66-35.747-28.253-42.542-46.638-6.796-18.432-10.194-50.362-10.194-95.884v-37.841h119.39v77.73c0 20.667 1.21 33.84 3.723 39.425 2.42 5.585 7.913 8.424 16.337 8.424 9.31 0 15.36-3.537 18.34-10.612 2.932-7.121 4.421-25.6 4.421-55.575v-33.047c0-18.34-2.048-31.744-6.19-40.216a30.72 30.72 0 0 0-18.34-16.71c-8.052-2.653-23.738-4.189-46.964-4.561V357.05c28.393 0 45.894-1.07 52.597-3.258a22.947 22.947 0 0 0 14.475-14.15c2.933-7.307 4.422-18.711 4.422-34.257V278.76c0-16.757-1.722-27.741-5.12-33.048-3.49-5.352-8.844-8.005-16.151-8.005-8.285 0-13.964 2.792-16.99 8.378-3.025 5.632-4.56 17.64-4.56 35.933v39.284h-119.39V280.53c0-45.66 10.473-76.567 31.325-92.625 20.9-16.058 54.086-24.064 99.608-24.064 56.878 0 95.51 11.17 115.805 33.373 20.293 22.249 30.394 53.202 30.394 92.765 0 26.81-3.63 46.173-10.892 58.089-7.307 11.916-20.107 22.807-38.446 32.628z"
                            p-id="4555"></path>
                    </svg>
                )
            },
            {
                name: '下拉多选',
                mode: '44',
                svg: () => (
                    <svg t="1608727059561" className="icon" viewBox="0 0 1024 1024" version="1.1"
                         xmlns="http://www.w3.org/2000/svg" p-id="5308" width="1em" height="1em"
                         fill="currentColor">
                        <path d="M960 96v448H64v-448h896zM864 256h-256l128 160 128-160z" fill="#101A33" p-id="5309"></path>
                        <path d="M64 640h896v96H64zM64 832h896v96H64z" fill="#107CEE" p-id="5310"></path>
                    </svg>
                )
            },
            {
                name: '图片',
                mode: '15',
                svg: () => (
                    <svg t="1608710812775" className="icon" viewBox="0 0 1024 1024" version="1.1"
                         width="1em" height="1em"
                         fill="currentColor">
                        <path
                            d="M928 160H96c-17.7 0-32 14.3-32 32v640c0 17.7 14.3 32 32 32h832c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32z m-40 632H136v-39.9l138.5-164.3 150.1 178L658.1 489 888 761.6V792z m0-129.8L664.2 396.8c-3.2-3.8-9-3.8-12.2 0L424.6 666.4l-144-170.7c-3.2-3.8-9-3.8-12.2 0L136 652.7V232h752v430.2zM304 456c48.6 0 88-39.4 88-88s-39.4-88-88-88-88 39.4-88 88 39.4 88 88 88z m0-116c15.5 0 28 12.5 28 28s-12.5 28-28 28-28-12.5-28-28 12.5-28 28-28z"
                            p-id="2217"></path>
                    </svg>
                )
            },
            {
                name: '日期选择',
                mode: '38',
                svg: () => (
                    <svg t="1608711538016" className="icon" viewBox="0 0 1024 1024" version="1.1"
                         xmlns="http://www.w3.org/2000/svg" p-id="2959" width="1em" height="1em"
                         fill="currentColor">
                        <path
                            d="M479.857 608.429h64.286c19.286 0 32.143-12.858 32.143-32.143s-12.857-32.143-32.143-32.143h-64.286c-19.286 0-32.143 12.857-32.143 32.143s12.857 32.143 32.143 32.143z m0 122.142h64.286c19.286 0 32.143-12.857 32.143-32.142s-12.857-32.143-32.143-32.143h-64.286c-19.286 0-32.143 12.857-32.143 32.143s12.857 32.142 32.143 32.142zM833.43 171.286H704.857v-32.143C704.857 119.857 692 107 672.714 107s-32.143 12.857-32.143 32.143v32.143H383.43v-32.143c0-19.286-12.858-32.143-32.143-32.143s-32.143 12.857-32.143 32.143v32.143H190.57C119.857 171.286 62 229.143 62 293.429v501.428C62 865.571 119.857 923.43 190.571 917H833.43C904.143 917 962 859.143 962 794.857V293.43c0-70.715-57.857-122.143-128.571-122.143z m64.285 623.571c0 32.143-32.143 64.286-64.285 64.286H190.57c-32.142 0-64.285-25.714-64.285-64.286V422h771.428v372.857z m0-437.143H126.286V293.43c0-32.143 32.143-64.286 64.285-64.286h128.572v32.143c0 19.285 12.857 32.143 32.143 32.143s32.143-12.858 32.143-32.143v-32.143H640.57v32.143c0 19.285 12.858 32.143 32.143 32.143s32.143-12.858 32.143-32.143v-32.143H833.43c32.142 0 64.285 25.714 64.285 64.286v64.285zM287 730.571h64.286c19.285 0 32.143-12.857 32.143-32.142s-12.858-32.143-32.143-32.143H287c-19.286 0-32.143 12.857-32.143 32.143S267.714 730.57 287 730.57zM672.714 608.43H737c19.286 0 32.143-12.858 32.143-32.143S756.286 544.143 737 544.143h-64.286c-19.285 0-32.143 12.857-32.143 32.143s12.858 32.143 32.143 32.143z m-385.714 0h64.286c19.285 0 32.143-12.858 32.143-32.143s-12.858-32.143-32.143-32.143H287c-19.286 0-32.143 12.857-32.143 32.143s12.857 32.143 32.143 32.143zM672.714 730.57H737c19.286 0 32.143-12.857 32.143-32.142S756.286 666.286 737 666.286h-64.286c-19.285 0-32.143 12.857-32.143 32.143s12.858 32.142 32.143 32.142z"
                            p-id="2960"></path>
                    </svg>
                )
            },
            {
                name: '输入可多选',
                mode: '24',
                svg: () => (
                    <svg t="1608775565687" className="icon" viewBox="0 0 1024 1024" version="1.1"
                         xmlns="http://www.w3.org/2000/svg" p-id="8319" width="1em" height="1em"
                         fill="currentColor">
                        <path
                            d="M118.784 727.04h778.24V296.96h-778.24v430.08zM77.824 256h860.16v512H77.824V256zM194.56 409.6v204.8c0 12.288 8.192 20.48 20.48 20.48s20.48-8.192 20.48-20.48V409.6c0-12.288-8.192-20.48-20.48-20.48s-20.48 8.192-20.48 20.48z"
                            p-id="8320"></path>
                    </svg>
                )
            }
        ]
    }, {
        name: '业务组件',
        list: [
            {
                name: '组织',
                mode: '4',
                svg: () => (
                    <svg t="1608790977003" className="icon" viewBox="0 0 1024 1024" version="1.1"
                         xmlns="http://www.w3.org/2000/svg" p-id="9313"  width="1em" height="1em"
                         fill="currentColor"
                    >
                        <path
                            d="M870.4 616.96V512c0-15.36-12.8-25.6-25.6-25.6H537.6v-102.4h179.2c15.36 0 25.6-10.24 25.6-25.6V128c0-15.36-10.24-25.6-25.6-25.6H307.2c-15.36 0-25.6 10.24-25.6 25.6v230.4c0 15.36 10.24 25.6 25.6 25.6h179.2v102.4H179.2c-12.8 0-25.6 10.24-25.6 25.6v104.96c-58.88 12.8-102.4 64-102.4 125.44 0 71.68 56.32 128 128 128s128-56.32 128-128c0-61.44-43.52-112.64-102.4-125.44V537.6h281.6v130.56c-58.88 12.8-102.4 64-102.4 125.44 0 71.68 56.32 128 128 128s128-56.32 128-128c0-61.44-43.52-112.64-102.4-125.44V537.6h281.6v79.36c-58.88 12.8-102.4 64-102.4 125.44 0 71.68 56.32 128 128 128s128-56.32 128-128c0-61.44-43.52-112.64-102.4-125.44zM332.8 153.6h358.4v179.2H332.8V153.6z m-76.8 588.8c0 40.96-33.28 76.8-76.8 76.8s-76.8-35.84-76.8-76.8c0-33.28 20.48-61.44 51.2-71.68 5.12-2.56 7.68-2.56 12.8-2.56h25.6c5.12 0 7.68 2.56 12.8 2.56 30.72 10.24 51.2 38.4 51.2 71.68z m332.8 51.2c0 40.96-33.28 76.8-76.8 76.8s-76.8-35.84-76.8-76.8c0-43.52 33.28-76.8 76.8-76.8s76.8 33.28 76.8 76.8z m256 25.6c-43.52 0-76.8-35.84-76.8-76.8 0-33.28 20.48-61.44 51.2-71.68h51.2c30.72 10.24 51.2 38.4 51.2 71.68 0 40.96-33.28 76.8-76.8 76.8z"
                            p-id="9314"></path>
                    </svg>
                )
            },
            {
                name: '产线',
                mode: '5',
                svg: () => (
                    <svg t="1608791032923" className="icon" viewBox="0 0 1024 1024" version="1.1"
                         xmlns="http://www.w3.org/2000/svg" p-id="9500" width="1em" height="1em"
                         fill="currentColor"
                    >
                        <path
                            d="M241.654 685.114c-5.215 0.318-10.447 0.318-15.662 0h-0.138c-30.055-1.872-59.575-14.286-82.54-37.252-49.988-49.987-49.988-131.032 0-181.019 9.297-9.298 19.669-16.866 30.716-22.705L174 444l2.378-1.072a127.08 127.08 0 0 1 9.728-4.384L610 247.5l0.06 0.278c83.34-36.126 183.856-20.126 251.983 48.002 89.04 89.04 89.04 233.4 0 322.44-43.719 43.72-100.776 65.972-158.072 66.758l0.029 0.136H241.654zM233.824 637c44.182 0 80-35.817 80-80s-35.818-80-80-80c-44.184 0-80 35.817-80 80s35.816 80 80 80z m467-28c83.946 0 152-68.053 152-152s-68.054-152-152-152c-83.948 0-152 68.053-152 152s68.052 152 152 152zM192 719.555h656v80c0 8.837-7.163 16-16 16H176v-80c0-8.837 7.163-16 16-16z"
                            p-id="9501"></path>
                    </svg>
                )
            },
            {
                name: '邮件组',
                mode: '12',
                svg: () => (
                    <svg t="1608791694700" className="icon" viewBox="0 0 1024 1024" version="1.1"
                         xmlns="http://www.w3.org/2000/svg" p-id="10309" width="1em" height="1em"
                         fill="currentColor"
                    >
                        <path
                            d="M955.002556 790.966573c1.836835-5.389754 3.056616-11.0558 3.056616-17.036002L958.059172 278.446733c0-5.678326-1.13587-11.0558-2.797719-16.202007L664.164608 511.484254 955.002556 790.966573zM511.840364 571.592236l76.673264-62.379723 38.800701-31.57002 292.323788-250.218832c-4.802376-1.426489-9.779737-2.428306-15.023158-2.428306L119.108748 224.995357c-5.256724 0-10.246365 1.001817-15.053857 2.439562l292.493657 250.351861 38.812981 31.582299L511.840364 571.592236zM904.614959 827.380924c5.025457 0 9.80532-0.930185 14.425547-2.24718L625.362884 543.043017l-113.52252 92.378967-113.341395-92.234681L104.700597 825.146023c4.615111 1.303692 9.387811 2.233877 14.408151 2.233877L904.614959 827.3799zM68.461231 262.244726c-1.661849 5.14723-2.797719 10.523681-2.797719 16.202007L65.663512 773.929548c0 5.992481 1.220804 11.658528 3.056616 17.036002l290.972001-279.360546L68.461231 262.244726z"
                            p-id="10310"></path>
                    </svg>
                )
            },
            {
                name: '集群',
                mode: '41',
                svg: () => (
                    <svg t="1608792034572" className="icon" viewBox="0 0 1024 1024" version="1.1"
                         xmlns="http://www.w3.org/2000/svg" p-id="10911" width="1em" height="1em"
                         fill="currentColor"
                    >
                        <path
                            d="M512 542.72L286.72 412.16V151.04L512 20.48l225.28 130.56v261.12L512 542.72zM339.2 381.44L512 481.28l172.8-99.84V181.76L512 81.92l-172.8 99.84v199.68zM776.96 1006.08L551.68 875.52V614.4l225.28-130.56L1002.24 614.4v261.12L776.96 1006.08zM602.88 844.8l172.8 99.84L949.76 844.8V645.12l-172.8-99.84-172.8 99.84V844.8zM247.04 1006.08L21.76 875.52V614.4l225.28-130.56L473.6 614.4v261.12L247.04 1006.08zM74.24 844.8l172.8 99.84L421.12 844.8V645.12l-172.8-99.84-174.08 99.84V844.8z"
                            fill="#464646" p-id="10912"></path>
                    </svg>
                )
            },
            {
                name: '携程员工多选',
                mode: '22',
                svg: () => (
                    <svg t="1608793109965" className="icon" viewBox="0 0 1024 1024" version="1.1"
                         xmlns="http://www.w3.org/2000/svg" p-id="11729" width="1em" height="1em"
                         fill="currentColor"
                    >
                        <path
                            d="M558.545455 570.181818a174.545455 174.545455 0 0 1 174.312727 165.236364l0.232727 9.309091v69.818182a34.909091 34.909091 0 0 1-69.492364 4.747636l-0.325818-4.747636V744.727273a104.727273 104.727273 0 0 0-97.559272-104.494546L558.545455 640H279.272727a104.727273 104.727273 0 0 0-104.494545 97.559273L174.545455 744.727273v69.818182a34.909091 34.909091 0 0 1-69.492364 4.747636L104.727273 814.545455V744.727273a174.545455 174.545455 0 0 1 165.236363-174.312728l9.309091-0.232727h279.272728z m253.067636 5.632a174.545455 174.545455 0 0 1 130.699636 159.790546l0.232728 9.122909v69.818182a34.909091 34.909091 0 0 1-69.492364 4.747636l-0.325818-4.747636V744.727273a104.727273 104.727273 0 0 0-78.522182-101.282909 34.909091 34.909091 0 1 1 17.408-67.630546zM418.909091 151.272727a174.545455 174.545455 0 1 1 0 349.090909 174.545455 174.545455 0 0 1 0-349.090909z m253.021091 5.585455a174.545455 174.545455 0 0 1 0 338.245818 34.909091 34.909091 0 1 1-17.314909-67.677091 104.727273 104.727273 0 0 0 0-202.891636 34.909091 34.909091 0 1 1 17.314909-67.630546zM418.909091 221.090909a104.727273 104.727273 0 1 0 0 209.454546 104.727273 104.727273 0 0 0 0-209.454546z"
                            fill="#979797" p-id="11730"></path>
                    </svg>
                )
            },
            {
                name: 'subject',
                mode: '42',
                svg: () => (
                    <svg t="1608793578309" className="icon" viewBox="0 0 1024 1024" version="1.1"
                         xmlns="http://www.w3.org/2000/svg" p-id="11990" width="1em" height="1em"
                         fill="currentColor"
                    >
                        <path
                            d="M597.333333 725.333333H170.666667v85.333334h426.666666v-85.333334z m256-341.333333H170.666667v85.333333h682.666666v-85.333333zM170.666667 640h682.666666v-85.333333H170.666667v85.333333z m0-426.666667v85.333334h682.666666v-85.333334H170.666667z"
                            p-id="11991"></path>
                    </svg>
                )
            }
        ]
    }]
}, {
    name: '复合组件',
    list: [
    ]
}]

export const changeMapKey = {
    cpChange: 'CpChange',
    Select: 'Select',
    Text: 'Text',
    Textarea: 'Textarea',
    Picture: 'Picture',
    DatePick: 'DatePick',
    InputNum: 'InputNum',
    InputAndAdd: 'InputAndAdd',
    Organization: 'Organization',
    ProductionLine: 'ProductionLine',
    EmailInput: 'EmailInput',
    Colony: 'Colony',
    SelectStaff: 'SelectStaff',
    Subject: 'Subject'
}

export const ComMap = {
    '0': {
        name: '文本',
        Com: Text,
        ViewCom: ViewText,
        active: false,
        key: changeMapKey.Text,
        defaultValue: '',
        mode: 0
    },
    '26': {
        name: '长文本',
        Com: Textarea,
        ViewCom: ViewTextarea,
        active: false,
        key: changeMapKey.Textarea,
        defaultValue: '',
        mode: 26
    },
    '2': {
        name: '单选',
        Com: Radio,
        ViewCom: ViewRadioCom,
        active: false,
        key: changeMapKey.Select,
        defaultValue: [{
            value: '选项1',
            id: Math.random().toString(16).substring(2)
        }, {
            value: '选项2',
            id: Math.random().toString(16).substring(2)
        }, {
            value: '选项3',
            id: Math.random().toString(16).substring(2)
        }],
        mode: 2
    },
    '7': {
        Com: Checkbox,
        name: '多选',
        ViewCom: ViewCheckBox,
        active: false,
        key:changeMapKey.Select,
        defaultValue: [{
            value: '多选1',
            id: Math.random().toString(16).substring(2)
        }, {
            value: '多选2',
            id: Math.random().toString(16).substring(2)
        }, {
            value: '多选3',
            id: Math.random().toString(16).substring(2)
        }],
        mode: 7
    },
    '43': {
        Com: InputNum,
        name: '数字控件',
        ViewCom: ViewInputNum,
        key: changeMapKey.InputNum,
        active: false,
        defaultValue: 123,
        mode: 43
    },
    '44': {
        Com: SelectCheckBox,
        name: '下拉多选',
        ViewCom: ViewSelectCheckBox,
        key: changeMapKey.Select,
        active: false,
        defaultValue: [{
            value: '下拉选项1',
            id: Math.random().toString(16).substring(2)
        }, {
            value: '下拉选项2',
            id: Math.random().toString(16).substring(2)
        }, {
            value: '下拉选项3',
            id: Math.random().toString(16).substring(2)
        }],
        mode: 44
    },
    '15': {
        Com: Picture,
        name: '图片',
        ViewCom: ViewPicture,
        key:changeMapKey.Picture,
        active: false,
        defaultValue: '',
        mode: 15
    },
    '38': {
        Com: Datepick,
        name: '日期选择',
        ViewCom: ViewDatepick,
        key:changeMapKey.DatePick,
        active: false,
        defaultValue: '',
        mode: 38
    },
    '24': {
        Com: InputAndAdd,
        name: '输入可选择',
        ViewCom: ViewInputAndAdd,
        key: changeMapKey.InputAndAdd,
        active: false,
        defaultValue: '',
        mode: 24
    },
    '4': {
        Com: Organization,
        name: '组织',
        ViewCom: ViewOrganization,
        key: changeMapKey.Organization,
        active: false,
        defaultValue: '',
        mode: 4
    },
    '5': {
        Com: ProductionLine,
        name: '产线',
        ViewCom: ViewProductionLine,
        key: changeMapKey.ProductionLine,
        active: false,
        defaultValue: '',
        mode: 5
    },
    '12': {
        Com: EmailInput,
        name: '邮件组',
        ViewCom: ViewEmailInput,
        key: changeMapKey.EmailInput,
        active: false,
        defaultValue: '',
        mode: 12
    },
    '41': {
        Com: Colony,
        name: '集群',
        ViewCom: ViewColony,
        key: changeMapKey.Colony,
        active: false,
        defaultValue: '',
        mode: 41
    },
    '22': {
        Com: SelectStaff,
        name: '携程员工-多选',
        ViewCom: ViewSelectStaff,
        key: changeMapKey.SelectStaff,
        active: false,
        defaultValue: '',
        mode: 22
    },
    '42': {
        Com: Subject,
        name: 'Subject',
        ViewCom: ViewSubject,
        key: changeMapKey.Subject,
        active: false,
        defaultValue: '',
        mode: 42
    }
}

// writeData ===> to showData
export const getStateListData = (ListData) => {
    return Object.keys(ListData).map((key) => {
        const ListItem = ComMap[`${ListData[key].mode}`];
        ListItem.id = key;
        ListItem.sort = ListData[key].sort;
        const cpvData = ListData[key].cpvData;
                                                                                                                                                                                                                                                                                                           if (cpvData) {
            const pvList = Object.keys(cpvData).map((key) => {
                return {
                    value: cpvData[key].name,
                    id: key,
                    sort: cpvData[key].sort
                }
            })
            pvList.sort((a, b) => a.sort - b.sort);
            ListItem.defaultValue = pvList.map((item) => ({
                value: item.value,
                id: item.id
            }));
        }
        return ListItem;
    })
}

export default comDataMap;
