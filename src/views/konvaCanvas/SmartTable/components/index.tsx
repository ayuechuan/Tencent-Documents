import { Group, Text, Image } from "react-konva";
import { useImage } from "react-konva-utils";
import png from '@assets/8baded8a01fc77f3a9712d00977d3801_720.png';
export function TTTT() {

  const [img1] = useImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAA+CAYAAABzwahEAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKqSURBVHgB7ZpNbtNAFIDf2K6QWilBKEKwoIz4EV1EKt2wYZPeIJwg5Cg5QbkBuQFwArJhw4YsumiEKBZZBCGoSKWmamN7+p5jW25aO3HVxTjzPskaj+fZypc44xm/AWAYIxDLBiqlGlhI0Jf/uPWFEO4ywQvFI+H34E2lOj8F8M5BS+6sg8AN6eLWWfQF5IqjdBOLD8HoEILhAShvCjpD4vbzHRCVmovV3Tz5ReI/g+FA+ihdJpz6a5L/iOJvsmKsrAaUfgtnk9JJE/5wQEUTHe5mxVg550t1cgxlRI3/xrsyKyZXHDT/Ty/BjX7xlYbFTYPFTYPF00QP/sfgOPH4t1SkPvPLzJh0BYUlFnu4NZNnuLMGwZ9fOFYfgDqbgM5YlRpYT+og1qvhZ42+ABe3Lg5fO+nYRDyS/gyTsfQO90Edz0Y/dBF7cwtgowL+/hdt5e37m2A924H5CZWFx+1HL2j2RvLtOD4t3kXp1rTfu/bCNPAnPJTXjXBWtt0AhdLXzS2o3dneRQmnjfJdOhb+x6Nfu+V//5Z5cWoTdCttVEE3RLUGwp9C1oSK7tJg9IN2W/GxuHMLx+XByTjz4nRyeJtrKG7dewDB0e/cmOBoREUjOScqpfKXmJDo2rlhB7xwQjXXzs9x02Bx02Bx02Bx02Bx02Bx02Bx02Bx02Bx0zBW3IGi4PutMmZX5iksbss6vpqsg26o8b9C8YXE/YOvaL4GWuIXW7ZSSDxMy5R/XUwI9+qmYY64c7lvisX79IgSjqYd1y0gZjk/N66H4pg67WPRsyiPvKJEbp+SeqqtYz18OkuirxB0F9tbr2jQ5WL1XXI8HRQt097DdLAEShl7HpQeTCGjfA/32ull3FeWbUeLBBowWzijXzK8GJTwp+XbPWAYhmEYZmW4ABgr4BF55Pg3AAAAAElFTkSuQmCC');
  const [img2] = useImage('data:image/png;base64,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');

  // 假设桌子的大小和位置
  const tableX = 300;
  const tableY = 300;
  const tableWidth = 800;
  const tableHeight = 300;

  // 计算图片位置
  const imageSize = 80; // 图片大小
  const spacing = 20;    // 图片间距
  // 计算上方和下方座位的数量
  const imagesVerSide = Math.floor(tableWidth / (imageSize + spacing)); // 根据桌子的宽度动态计算
  const imagesHorSize = Math.floor(tableHeight / (imageSize + spacing)); // 根据桌子的高度动态计算

  const positions = [];

  // 计算上方图片位置
  for (let i = 0; i < imagesVerSide; i++) {
    positions.push({
      x: tableX + (imageSize * i) + spacing * (i + 1),
      y: tableY - imageSize,
      occupied: false // 默认设置为未占用
    });
  }

  // 计算下方图片位置
  for (let i = 0; i < imagesVerSide; i++) {
    positions.push({
      x: tableX + (imageSize * i) + spacing * (i + 1),
      y: tableY + tableHeight,
      occupied: false // 默认设置为未占用
    });
  }

  // 计算左侧图片位置
  for (let i = 0; i < imagesHorSize; i++) {
    positions.push({
      x: tableX - imageSize,
      y: tableY + (imageSize * i) + (spacing * (i + 1)),
      occupied: false // 默认设置为未占用
    });
  }

  // 计算右侧图片位置
  for (let i = 0; i < imagesHorSize; i++) {
    positions.push({
      x: tableX + tableWidth,
      y: tableY + (imageSize * i) + (spacing * (i + 1)),
      occupied: false // 默认设置为未占用
    });
  }

  // 示例：占用一些座位
  const occupiedSeats = [
    { x: 320, y: 220, occupied: true },
    { x: 420, y: 220, occupied: true },
    { x: 320, y: 600, occupied: true }, // 另一个占用的座位
  ];

  // 计算空闲座位
  function getSpareSeat(allPositions: {
    x: number,
    y: number,
    occupied: boolean
  }[], occupiedPositions: {
    x: number;
    y: number;
    occupied: boolean;
  }[]) {
    // 找出未占用的座位
    return allPositions.filter(pos => {
      return !occupiedPositions.some(occupied =>
        occupied.x === pos.x && occupied.y === pos.y
      );
    });
  }

  // 获取空闲座位
  const freeSeats = getSpareSeat(positions, occupiedSeats);
  console.log('freeSeats', freeSeats); // 输出所有空闲的座位位置





  return (
    <Group name="main" draggable>
      {occupiedSeats.map((pos, index) => (
        <Group name="occupiedSeats" key={index}>
          <Image
            key={index}
            x={pos.x}
            y={pos.y}
            height={imageSize}
            width={imageSize}
            image={img1}
            strokeEnabled={false}
            fill="#EEE"
          />
        </Group>
      ))}
      {freeSeats.map((pos, index) => (
        <Group name="freeSeats" key={index}>
          <Image
            key={index}
            x={pos.x}
            y={pos.y}
            height={imageSize}
            width={imageSize}
            image={img2}
            strokeEnabled={false}
            fill="#EEE"
          />
        </Group>
      ))}

      <Group id="桌子">
        <Image
          x={300}
          y={300}
          height={300}
          width={800}
          image={useImage(png)[0]}
          hitStrokeWidth={1}
          strokeWidth={0.1}
          fill="#FFF"
          stroke="grey"
        />
      </Group>
    </Group>
  )
}