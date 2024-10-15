import { Suspense } from 'react'
import { useRoutes } from 'react-router-dom'

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

const Home = lazy(() => import('@/views/Home'))
const About = lazy(() => import('@/views/About'))

export default function Router() {
  const router = useRoutes([
    {
      path: '/',
      element: <Navigate to={'/flow'} replace />,
    },
    {
      path: '/home',
      element: (
        <Suspense fallback={<>...</>}>
          <Home />
        </Suspense>
      ),
    },
    // element: <Homes /> },
    { path: '/about', element: <About /> },
    { path: '/flow', element: <CombineFlowEditor /> },
    { path: '/canvas', element: <WarterText /> },
    { path: '/g6', element: <G6Chart /> },
    // { path: '/konva', element: <KonvaCanvas /> },
    { path: '/form', element: <FormilyForm /> },
    { path: '/table', element: <DraggableComponent /> },
    { path: '/123', element: <CollectionTable /> },
    {
      path: '/konva',
      element: <SmartSheetLayout />,
      children: [
        { index: true, element: <Navigate to={'/konva/conference'} replace /> },
        { path: 'album', element: <AlbumPainting /> },
        { path: 'board', element: <Board /> },
        { path: 'table', element: <SmartTable /> },
        {
          path: 'conference', element: <ConferenceProvider>
            <Conference />
          </ConferenceProvider>
        }
      ]
    },
  ])
  return router
}
