

import HomeStyle from './index.module.scss'
import { useWebWorker } from '@/hooks/useWebWorker'
// import { useContextMenu } from '@/contexts/contextMenuRight'
import { FC, PropsWithChildren, Suspense, useState } from 'react';
import { Table, Tag, MessagePlugin, DialogPlugin, Space } from 'tdesign-react';
import { ErrorCircleFilledIcon, CheckCircleFilledIcon, CloseCircleFilledIcon } from 'tdesign-icons-react';
import { TableProps } from 'tdesign-react/esm/table';
import { ConfigContext } from 'tdesign-react/esm/config-provider';
import { useMount } from 'ahooks';
import { Button } from 'tdesign-react';
import 'tdesign-react/esm/message/style/index.js';
import * as comlink from 'comlink';
import { toggleDark } from '@/utils/theme';

const data: TableProps['data'] = [];
const total = 100;

function fetchMessage() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("⚛️")
    }, 1000,)
  });
}

// type SizeEnum = 'small' | 'medium' | 'large';
for (let i = 0; i < total; i++) {
  data.push({
    index: i + 1,
    applicant: ['贾明', '张三', '王芳'][i % 3],
    status: i % 3,
    channel: ['电子签署', '纸质签署', '纸质签署'][i % 3],
    detail: {
      email: ['w.cezkdudy@lhll.au', 'r.nmgw@peurezgn.sl', 'p.cumx@rampblpa.ru'][i % 3],
    },
    matters: ['宣传物料制作费用', 'algolia 服务报销', '相关周边制作费', '激励奖品快递费'][i % 4],
    time: [2, 3, 1, 4][i % 4],
    createTime: ['2022-01-01', '2022-02-01', '2022-03-01', '2022-04-01', '2022-05-01'][i % 4],
  });
}

const statusNameListMap = {
  0: { label: '审批通过', theme: 'success', icon: <CheckCircleFilledIcon /> },
  1: { label: '审批失败', theme: 'danger', icon: <CloseCircleFilledIcon /> },
  2: { label: '审批过期', theme: 'warning', icon: <ErrorCircleFilledIcon /> },
} as any;



const publicPath = import.meta.env.VITE_PUBLIC_PATH;
console.log('10086', publicPath);

function Home() {
  const navigate = useNavigate();
  const workerInstance = useWebWorker();
  // const contextMenu = useContextMenu();

  const [stripe] = useState(false);
  const [bordered] = useState(false);
  const [hover] = useState(false);
  const [tableLayout] = useState(false);
  // const [size, setSize] = useState<SizeEnum>('medium');
  const [showHeader] = useState(true);

  const config = useContext(ConfigContext);


  const props = {
    onRowContextMenu: (event: any) => { },
    onContextMenu: (event: any) => {},
    oncontextmenu: (event: any) => {}
  } as any

  const table = (
    <Table
      data={data}
      columns={[
        { colKey: 'applicant', title: '申请人', width: '100' },
        {
          colKey: 'status',
          title: '申请状态',
          cell: ({ row }) => (
            <Tag
              shape="round"
              theme={statusNameListMap[row.status].theme}
              variant="light-outline"
              icon={statusNameListMap[row.status].icon}
            >
              {statusNameListMap[row.status].label}
            </Tag>
          ),
        },
        { colKey: 'channel', title: '签署方式' },
        { colKey: 'detail.email', title: '邮箱地址', ellipsis: true },
        { colKey: 'createTime', title: '申请时间' },
      ]}
      rowKey="index"
      verticalAlign="top"
      // size={size}
      bordered={bordered}
      hover={hover}
      stripe={stripe}
      showHeader={showHeader}
      tableLayout={tableLayout ? 'auto' : 'fixed'}
      rowClassName={({ rowIndex }) => `${rowIndex}-class`}
      cellEmptyContent={'-'}
      resizable
      // 与pagination对齐
      pagination={{
        defaultCurrent: 2,
        defaultPageSize: 5,
        total,
        showJumper: true,
        onChange(pageInfo) {
          console.log(pageInfo, 'onChange pageInfo');
        },
        onCurrentChange(current, pageInfo) {
          console.log(current, pageInfo, 'onCurrentChange current');
        },
        onPageSizeChange(size, pageInfo) {
          console.log(size, pageInfo, 'onPageSizeChange size');
        },
      }}
      onPageChange={(pageInfo) => {
        console.log(pageInfo, 'onPageChange');
      }}
      onRowClick={({ row, index, e }) => {
        console.log('onRowClick', { row, index, e });
      }}
      {...props}
    />
  );
  const [count, setCount] = useState(0);


  useMount(() => {
    // const button = document.getElementById('startCalculation');
    // const resultElement = document.getElementById('result');
    // button.addEventListener('click', () => {
    //   let sum = 0
    //   for (let i = 0; i < 100000000; i++) {
    //     sum += i
    //   }
    //   resultElement.textContent = 'Sum: ' + sum;
    // })
  })


  // return <PostsTab></PostsTab>
  return (
    <div className={HomeStyle.home} >
      {count}
      <Button type='button'
        onClick={() => {
          setCount(count + 1)
        }}>确定1</Button>
      <div
      // onContextMenu={() => {
      //   contextMenu.handleItems([{
      //     label: '卸载',
      //     key: '1',
      //     onClick: () => {
      //       console.log('卸载');
      //     }
      //   },
      //   {
      //     label: '命名',
      //     key: '2',
      //     onClick: () => {
      //       console.log('命名');
      //     }
      //   }
      //   ])
      // }}
      >


        {/* <Space direction="vertical">
          <RadioGroup
            // value={size}
            variant="default-filled"
          // onChange={(size: SizeEnum) => setSize(size) as any}
          >
            <RadioButton value="small">小尺寸</RadioButton>
            <RadioButton value="medium">中尺寸</RadioButton>
            <RadioButton value="large">大尺寸</RadioButton>
          </RadioGroup>
          <Space>
            <Checkbox value={stripe} onChange={setStripe}>
              显示斑马纹
            </Checkbox>
            <Checkbox value={bordered} onChange={setBordered}>
              显示表格边框
            </Checkbox>
            <Checkbox value={hover} onChange={setHover}>
              显示悬浮效果
            </Checkbox>
            <Checkbox value={tableLayout} onChange={setTableLayout}>
              宽度自适应
            </Checkbox>
            <Checkbox value={showHeader} onChange={setShowHeader}>
              显示表头
            </Checkbox>
          </Space>

          {table}
        </Space> */}
      </div>

      {table}
      <Button type='button'
        onClick={() => {
          console.log('===');
          // navigate('/flow')
          navigate({ pathname: '/flow', search: '?sort=name&id=2' })
          // MessagePlugin.info('你确定选择吗?');
          DialogPlugin({
            header: 'Dialog-Plugin',
            body: 'Hi, darling! Do you want to be my lover?',
          });
        }}>确定</Button>
      <button onClick={() => {
        //  暗黑主题
        document.documentElement.setAttribute('theme-mode', 'dark')
        // (window as any).bootstrap.unMount();
        // setTimeout(() => {
        //   (window as any).bootstrap.mount();
        // })
      }}>卸载</button>

      <button onClick={async () => {
        const subscription = workerInstance.open();
        setTimeout(() => {
          subscription.unsubscribe();
        })
        const res = await workerInstance.worker!.blockingFunc(400, comlink.proxy((nums: number) => {
          console.log('结果', nums);
        }));
        const resa = await workerInstance.worker!.blockingFunc(400)
      }}> 开启 worker</button>

      <Button onClick={() => {
        let result = 0;
        for (let i = 0; i < 400; i++) {
          for (let j = 0; j < 1_000_000; j++) {
            result += Math.random();
          }
        }
        console.log('result', result);

      }}>耗时任务</Button>

      <Space>
        <Button type='button'>cut</Button>
        <Button type='button'>copy</Button>
        <Button type='button'>paste</Button>
      </Space>
      <br />
      <br />
      <button onClick={toggleDark as any}>换肤</button>
    </div>
  )
}

//  延迟函数
export function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(200)
    }, ms);
  });
}


export default Home;

