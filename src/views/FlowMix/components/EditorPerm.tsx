import dayjs from 'dayjs'
import type { BaseTableProps, PrimaryTableProps, TableRowData } from 'tdesign-react'
import { Button, Dialog } from 'tdesign-react'
import { DatePicker, Input, MessagePlugin, Select, Table } from 'tdesign-react'

export const EditorPerm = () => {
  const [visible, setVisible] = useState(false)
  const initData: BaseTableProps['data'] = new Array(5).fill(null).map((_, i) => ({
    key: String(i + 1),
    firstName: ['刘德华', '吴彦祖', '王宝强'][i % 3],
    letters: [['可编辑'], ['可编辑'], ['所有者'], ['可编辑', '可读']][i % 4],
    createTime: dayjs().format('YYYY-MM-DD'),
  }))

  const [data, setData] = useState([...initData])

  const editableCellState: PrimaryTableProps['editableCellState'] = (cellParams) => cellParams.rowIndex !== 2

  const columns: BaseTableProps['columns'] = useMemo(
    () => [
      {
        title: '协作者',
        colKey: 'firstName',
        align: 'left',
      },
      {
        title: '申请事项',
        colKey: 'letters',
        cell: ({ row }) => row?.letters?.join('、'),
        width: 280,
        edit: {
          keepEditMode: true,
          component: Select,
          // props, 透传全部属性到 Select 组件
          // props 为函数时，参数有：col, row, rowIndex, colIndex, editedRow。一般用于实现编辑组件之间的联动
          props: ({ editedRow }: any) => ({
            multiple: true,
            minCollapsedNum: 1,
            options: [
              { label: '只读', value: '只读' },
              { label: '可编辑', value: '可编辑' },
              { label: '转让文档所有者身份', value: '转让文档所有者身份', show: () => editedRow.status !== 0 },
            ].filter((t) => (t.show === undefined ? true : t.show())),
          }),
          // abortEditOnEvent: ['onChange'],
          onEdited: (context: any) => {
            data.splice(context.rowIndex, 1, context.newRowData)
            setData([...data])
            console.log('Edit Letters:', context)
          },
          rules: [
            {
              validator: (val: any) => val.length > 0,
              message: '至少选择一种',
            },
          ],
        },
      },
      {
        title: '创建日期',
        colKey: 'createTime',
        // props, 透传全部属性到 DatePicker 组件
        edit: {
          component: DatePicker,
          props: {
            mode: 'date',
          },
          // 除了点击非自身元素退出编辑态之外，还有哪些事件退出编辑态
          abortEditOnEvent: ['onChange'],
          onEdited: (context: { rowIndex: number; newRowData: TableRowData }) => {
            data.splice(context.rowIndex, 1, context.newRowData)
            setData([...data])
            console.log('Edit Date:', context)
          },
          // 校验规则，此处同 Form 表单
          rules: () => [
            {
              validator: (val: string) => dayjs(val).isAfter(dayjs()),
              message: '只能选择今天以后日期',
            },
          ],
        },
      },
    ],
    [data],
  )

  return (
    <div style={{ marginRight: 15 }}>
      <Button type="button" onClick={() => setVisible(true)} style={{ width: 46, height: 32 }}>
        分享
      </Button>
      <Dialog
        header="分享协作"
        visible={visible}
        width={1000}
        onConfirm={() => void setVisible(false)}
        onClose={() => void setVisible(false)}
      >
        <Table rowKey="key" columns={columns} data={data} editableCellState={editableCellState} bordered={false} />
      </Dialog>
    </div>
  )
}
