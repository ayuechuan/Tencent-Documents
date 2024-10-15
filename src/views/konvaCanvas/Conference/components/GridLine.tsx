import { Circle, Layer, Rect } from "react-konva";


const WIDTH = 100;
const HEIGHT = 100;
const stageWidth = window.innerWidth;
const stageHeight = window.innerHeight;
const rows = 100; // 行数
const cols = 10; // 列数
const dotRadius = 5; // 小圆点半径
const spacing = 50; // 小圆点之间的间距



export function GridLine() {
  const [stagePos] = useState({ x: 0, y: 0 });

  const startX = Math.floor((-stagePos.x - window.innerWidth) / WIDTH) * WIDTH;
  const endX =
    Math.floor((-stagePos.x + window.innerWidth * 2) / WIDTH) * WIDTH;

  const startY =
    Math.floor((-stagePos.y - window.innerHeight) / HEIGHT) * HEIGHT;
  const endY =
    Math.floor((-stagePos.y + window.innerHeight * 2) / HEIGHT) * HEIGHT;

  const gridComponents = [];
  var i = 0;
  for (var x = startX; x < endX; x += WIDTH) {
    for (var y = startY; y < endY; y += HEIGHT) {
      if (i === 4) {
        i = 0;
      }

      gridComponents.push(
        <Rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width={WIDTH}
          height={HEIGHT}
          fill={'transparent'}
          stroke="#EEE"
        />
      );

      // gridComponents.push(
      //   <Circle
      //     key={`dot-${x}-${y}`}
      //     x={x}
      //     y={y}
      //     radius={dotRadius}
      //     fillRadialGradientStartPoint={{ x: 0, y: 0 }}
      //     fillRadialGradientStartRadius={0}
      //     fillRadialGradientEndPoint={{ x: 0, y: 0 }}
      //     fillRadialGradientEndRadius={dotRadius}
      //     fillRadialGradientColorStops={[0, '#9B55FD', 1, '#fff']}
      //   />
      // )
    }
  }




  return (
    <Layer>
      {gridComponents}
    </Layer>
  )
}