import Konva from "konva";
import { Group, Layer, Stage, Image, Line, Circle, Arc, Rect, Shape } from "react-konva";
import { Html, Portal } from "react-konva-utils";
import { Container } from "./components/container";
import { createContext, PropsWithChildren } from "react";
import { autorun, makeAutoObservable, observable, reaction, toJS } from "mobx";
import { KonvaEventObject, NodeConfig, Node } from "konva/lib/Node";
import { Highlight } from './components/Highlight'
import { useMount } from "ahooks";
import { IRect, Vector2d } from "konva/lib/types";
import { FeatureLayer } from "./components/FeatureLayer";
import png2 from '@assets/14.jpg'
import { observer } from "mobx-react-lite";
import { GridLine } from "./components/GridLine";
import { MenuItem } from "@/components/menuItem/menuItem";
import { Tooltip } from "tdesign-react";
import { CursorIcon, GestureRanslationIcon } from "tdesign-icons-react";
import Plus from "tdesign-icons-react/lib/components/plus";
import Minus from "tdesign-icons-react/lib/components/minus";
import { haveIntersection } from "@/utils";
import { useConference } from "./store/context";

export const Conference = observer(() => {
  const store = useConference();
  const stageRef = useRef<Konva.Stage>(null);
  const childrensRef = useRef<any>([]);
  const layerRef = useRef<Konva.Layer>(null);
  const animationRef = useRef<any>(null);

  useEffect(() =>
    autorun((() => {
      console.log('---', (store.occupiedSeats).length, (store.unoccupiedSeats).length);
      childrensRef.current = stageRef.current?.find('.occupiedSeats,.freeSeats');
    }))
    , [])


  useMount(() => {
    store.layer = layerRef.current!;
    store.stage = stageRef.current!;
  })



  const handleWheel = (event: any) => {
    // 防止页面滚动
    event.evt.preventDefault();
    scale(event.evt.deltaY)
  };

  const scale = (deltaY: number) => {
    const position = stageRef.current!.getPointerPosition();
    // const scale = layerRef.current!.scaleX();
    const scale = stageRef.current!.scaleX();
    const scaleBy = deltaY > 0 ? 1.1 : 0.9;
    const targetScale = scale * scaleBy;
    animateScale(scale, targetScale, position);
  }

  const animateScale = (startScale: any, targetScale: any, position: any) => {
    const scaleDifference = targetScale - startScale;
    const animationSteps = 20; // 动画步数
    const stepSize = scaleDifference / animationSteps;


    let currentScale = startScale;
    let stepCount = 0;

    const animate = () => {
      stepCount++;
      currentScale += stepSize;

      // 设置新的缩放比例
      stageRef.current!.scale({ x: currentScale, y: currentScale });
      // layerRef.current!.scale({ x: currentScale, y: currentScale });

      // 重新计算偏移量，以确保以鼠标为中心缩放
      const offsetX = position.x - stageRef.current!.x();
      const offsetY = position.y - stageRef.current!.y();
      const newPosX = position.x - offsetX * (currentScale / startScale);
      const newPosY = position.y - offsetY * (currentScale / startScale);
      // stageRef.current!.position({ x: newPosX, y: newPosY });
      // stageRef.current!.batchDraw();

      // 检查是否完成动画
      if (stepCount < animationSteps) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        cancelAnimationFrame(animationRef.current);
      }
    };

    // 开始动画
    animate();
  };


  return (
    <div style={{ background: '#F8F8F8' }}>
      <MenuItem
        style={{ position: 'absolute', bottom: 30, left: 300, zIndex: 999, }}
        items={[
          {
            key: '1',
            label:
              <Tooltip
                content="移动"
                destroyOnClose
                showArrow
                overlayStyle={{
                  marginRight: 8
                }}
                placement="left"
                theme="default">
                <GestureRanslationIcon
                  style={{ width: '100%', height: 20 }}
                />
              </Tooltip>,
            className: store.draggable ? 'highlightItem' : '',
            onClick: (key: string) => void store.toggleDraggable()
          },
          {
            key: '2',
            label: <Tooltip
              content="放大"
              destroyOnClose
              showArrow
              overlayStyle={{
                marginRight: 8
              }}
              placement="left"
              theme="default">
              <Plus
                style={{ width: '100%', height: 20 }}
              />
            </Tooltip>, onClick: (key: string) => void scale(100)
          },
          {
            key: '3', label: <Tooltip
              content="缩小"
              destroyOnClose
              showArrow
              overlayStyle={{
                marginRight: 8
              }}
              placement="left"
              theme="default">
              <Minus
                style={{ width: '100%', height: 20 }}
              />
            </Tooltip>, onClick: (key: string) => void scale(-100)
          }
        ]}
        onClick={() => { }}
      />
      <div
        style={{ height: 50 }}
        onDragOver={(e) => e.preventDefault()}
      >
        <img
          alt="lion"
          src={'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAA+CAYAAABzwahEAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALESURBVHgB7Zo9bNNAFICfk5SkpUlZ6FBR4QEpSF0QygJTygRLCQsMCEjEQjcW2BiibiztFhbUCNElC4WFMZnSAaiyIFGpEhFIHcpCE36S0tS8Z3yVk2I7rjqcfe+TTs7Zz6d8vvP5TncADKME2rCBhmFk8aCDvHzH1NA0rTlMsKe4Jbzc7hr61s4+tHcNkJGpVMRMSBlT0esBuIqjdA4Pr1bWd6FU7wDKg8yQ+MK1UciciTUxO+sm7yX++Vm9q5fWOhAknt86SfKrKH7DKSbidAGl81ut/cBJE6V6lw45dDjlFBNxuV//tN2DIPL+6574qTvFuIq3O3K/00NwpBoPNSyuGiyuGixux/rwn00lNJiaCN6zscbsxAWnmL4hKwrreFjElBPj8mRcgzcfcay+1gWapMhMZjoKj7OjkJ6MAo46xQNoYirj8LVojz0Qt6SrG996+tNq52D0kz4dhQeX43AeC7tf+Smt/NzMCCxcHYPBCdXczAmYx/+PD4HkCyLeLr6M0vmbL378t2Aa+AOWRfKyQa9j5c44rHyglnl4bkE1X7k7Tq23gPJlOme2Bau280/e/nYsnK5lpmNmC5ANnImZNew0oaJm/3LdnLjcE+dEL6DTjVjjjoXTzZTSk/J1dlfOjUB1849rTHXTfHWzIt8n7gWJy0gyAdDymFANTrj4O64aLK4aLK4aLK4aLK4aLK4aLK4aLK4aLK4ayorHwCepeMS+UhFYfIs/mk2YSTbefdnzFe9L/OHqL3NJSUb8bkXzJU6Fy77XbVi4V1cNZcSTif6+SYg36BMla8d1HFiLnU2RN8Vx6bSBhxqtI4cVy+21yNubevH2xTjMXwqXPLXipetjNOhqYnZJnB/cCkLbtBdp8+7Gdg9aIfh00RIyytfwZ8G+jfvQS21tEsjCv40zExBsdjDR9u0aMAzDMAwTGv4Cfmnwxm+8LqoAAAAASUVORK5CYII='}
          draggable="true"
          onDragStart={() => {
            store.toggleDrop(true);
            function callback() {
              store.toggleDrop(false);
              document.body.removeEventListener('drop', callback)
            }
            document.body.addEventListener('drop', callback);
          }}
        />
      </div>
      <div
        onDrop={(event) => {
          event.preventDefault();
          //  给stageRef设置 position
          stageRef.current!.setPointersPositions(event);
          const pointer = stageRef.current?.getPointerPosition();
          let targetName = '';

          for (let i = 0; i < childrensRef.current.length; i++) {
            const group = childrensRef.current[i] as Konva.Group;
            const rect = group.getClientRect();
            if (haveIntersection(rect, pointer!) && group.attrs.name === 'freeSeats') {
              targetName = group.children[0].attrs.name;
              break;
            }
          }
          if (targetName) {
            store.add({ key: targetName, occupied: true });
          }
          store.changeHighlight({ x: 0, y: 0, width: 0, height: 0 })
        }}
        // onDragOver={(e) => e.preventDefault()}
        onDragEnter={(event) => event.preventDefault()}
        onDragOver={(event) => {
          stageRef.current!.setPointersPositions(event);
          event.preventDefault()
          const pointer = stageRef.current?.getPointerPosition();
          let templateConfig;
          for (let i = 0; i < childrensRef.current.length; i++) {
            const group = childrensRef.current[i] as Konva.Group;
            const rect = group.getClientRect();
            if (haveIntersection(rect, pointer!) && group.attrs.name === 'freeSeats') {
              const config = store.getCacheValue(group.children[0].attrs.name);
              templateConfig = {
                ...rect,
                ...config
              }
              break;
            }
          }
          store.changeHighlight(templateConfig || {
            x: 0,
            y: 0,
            width: 0,
            height: 0
          });
        }}
      >
        <Stage
          width={innerWidth - 200}
          height={innerHeight - 50}
          ref={stageRef}
          onWheel={(event) => void handleWheel(event)}
          onMouseMove={() => void store.onmouseMove()}
          onMouseDown={() => void store.onMouseDown()}
          onMouseUp={() => void store.onMouseUp()}
          onDragEnd={() => {
            childrensRef.current = stageRef.current?.find('.occupiedSeats,.freeSeats');
          }}
        >
          {/* <GridLine /> */}
          <Layer ref={layerRef}>
            <FeatureLayer />
            <Container />
            <Highlight />
          </Layer>
          <Layer name="controls-layer" visible={true} />
        </Stage>
      </div>
    </div>

  )
})











