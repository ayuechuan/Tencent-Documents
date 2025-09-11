import { Suspense } from 'react'
import { RouteObject, useRoutes } from 'react-router-dom'

import { WarterText } from '@/views/CanvasEditor/WarterText'
import { NestedFlow } from '@/views/CombineFlowEditor'
import { CombineFlowEditor } from '@/views/FlowMix'
import { G6Chart } from '@/views/g6Flow'
// import { KonvaCanvas } from '@/views/konvaCanvas'
import { FormilyForm } from '@/views/smartSheetForm'
import { DraggableComponent } from '@/views/SmartGridTable'
import { CollectionTable } from '@/views/CollectionTable'
import { SmartSheetLayout } from '@/views/konvaCanvas'
import { AlbumPainting } from '@/views/konvaCanvas/AlbumPainting'
import { Board } from '@/views/konvaCanvas/Board'
import { SmartTable } from '@/views/konvaCanvas/SmartTable'
import { Conference } from '@/views/konvaCanvas/Conference'
import { ConferenceProvider } from '@/views/konvaCanvas/Conference/store/context'
import { useNavigate as useReactRouterNavigate } from 'react-router-dom';
import path from 'path'
import { GroupKonva } from '@/views/konvaCanvas/group'
import { App } from '../views/Form/App'
import axios from 'axios'
import { useGlobaEventBus } from '@/hooks/use-globa-event-bus'

const Home = lazy(() => import('@/views/Home'))
const About = lazy(() => import('@/views/About'))
const Form = lazy(() => import('@/views/hookForm/index'))

const routes = [
  {
    path: '/home',
    element: (
      <Suspense fallback={<>...</>}>
        <Home />
      </Suspense>
    ),
  },
  { path: '/about', element: <About /> },
  { path: '/flow', element: <CombineFlowEditor /> },
  { path: '/canvas', element: <WarterText /> },
  { path: '/g6', element: <G6Chart /> },
  { path: '/form', element: <FormilyForm /> },
  { path: '/table', element: <DraggableComponent /> },
  { path: '/form1', element: <Form /> },
  { path: '/login', element: <>123</> },
  { path: '/123', element: <CollectionTable /> },
  {
    path: '/konva',
    element: <SmartSheetLayout />,
    // element: null,
    children: [
      { index: true, element: <Navigate to={'/konva/conference'} replace /> },
      { path: 'album', element: <AlbumPainting /> },
      { path: 'board', element: <Board /> },
      { path: 'table', element: <SmartTable /> },
      { path: 'group', element: <App /> },
      {
        path: 'conference', element: <ConferenceProvider>
          <Conference />
        </ConferenceProvider>
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to={'/home'}></Navigate>
  }
];

enum AuthMethods {
  push = 'Push',
  sms = 'Sms',
  voice = 'Voice'
}

function ddd(key: `${AuthMethods}`) {}



export default function Router() {
  const router = useRoutes(routes);
  // useEffect(() => {
  //   const { signal, abort } = new AbortController();
  //   document.addEventListener('click',
  //     () => { console.log('确实点击了'); },
  //     { signal: AbortSignal.any([AbortSignal.timeout(5000), signal]) })
  //   return () => abort();
  // }, [])

  return router;
}

export class FileMangaerStore {
  public async searchInfolder(keyword?: string): Promise<void> {
    if (!keyword) {
      this.refresh();
      return;
    }
  }

  refresh() {
    console.log('刷新!');

  }
}

// // 提取路径的基础类型
// type ExtractPath<T> = T extends { path: infer P }
//   ? P extends string
//     ? P
//     : never
//   : never;

// // 递归提取所有路径，包括子路径
// type ExtractNestedPaths<T extends RouteObject[]> = T extends [infer R, ...infer Rest]
//   ? R extends RouteObject
//     ? Rest extends RouteObject[]
//       ? R['children'] extends RouteObject[]
//         ? | ExtractPath<R>
//           | `${ExtractPath<R>}/${ExtractNestedPaths<R['children']>}`
//           | ExtractNestedPaths<Rest>
//         : ExtractPath<R> | ExtractNestedPaths<Rest>
//       : ExtractPath<R>
//     : never
//   : never;

// // 定义 RoutePaths 类型
// export type RoutePaths = ExtractNestedPaths<typeof routes>;


// // 基础路径提取，包含子路径
// type PathWithChildren<T extends RouteObject> = T['children'] extends RouteObject[]
//   ? T['path'] extends string
//     ? | T['path']
//       | `${T['path']}/${ExtractPaths<T['children']>}`
//     : ExtractPaths<T['children']>
//   : T['path'];

// // 递归处理路由数组中的所有路径
// type ExtractPaths<T extends RouteObject[]> = T extends (infer R)[]
//   ? R extends RouteObject
//     ? PathWithChildren<R>
//     : never
//   : never;

// // 应用到路由配置数组上，生成所有路径的联合类型
// export type RoutePaths = ExtractPaths<typeof routes>;