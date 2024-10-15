import { observer } from "mobx-react-lite";
import { Group, Image } from "react-konva";
import { useImage } from "react-konva-utils";
import { useConference } from "../store/context";

export const Highlight = observer(() => {
  const store = useConference();
  const [img1] = useImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAA+CAYAAABzwahEAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKqSURBVHgB7ZpNbtNAFIDf2K6QWilBKEKwoIz4EV1EKt2wYZPeIJwg5Cg5QbkBuQFwArJhw4YsumiEKBZZBCGoSKWmamN7+p5jW25aO3HVxTjzPskaj+fZypc44xm/AWAYIxDLBiqlGlhI0Jf/uPWFEO4ywQvFI+H34E2lOj8F8M5BS+6sg8AN6eLWWfQF5IqjdBOLD8HoEILhAShvCjpD4vbzHRCVmovV3Tz5ReI/g+FA+ihdJpz6a5L/iOJvsmKsrAaUfgtnk9JJE/5wQEUTHe5mxVg550t1cgxlRI3/xrsyKyZXHDT/Ty/BjX7xlYbFTYPFTYPF00QP/sfgOPH4t1SkPvPLzJh0BYUlFnu4NZNnuLMGwZ9fOFYfgDqbgM5YlRpYT+og1qvhZ42+ABe3Lg5fO+nYRDyS/gyTsfQO90Edz0Y/dBF7cwtgowL+/hdt5e37m2A924H5CZWFx+1HL2j2RvLtOD4t3kXp1rTfu/bCNPAnPJTXjXBWtt0AhdLXzS2o3dneRQmnjfJdOhb+x6Nfu+V//5Z5cWoTdCttVEE3RLUGwp9C1oSK7tJg9IN2W/GxuHMLx+XByTjz4nRyeJtrKG7dewDB0e/cmOBoREUjOScqpfKXmJDo2rlhB7xwQjXXzs9x02Bx02Bx02Bx02Bx02Bx02Bx02Bx02Bx0zBW3IGi4PutMmZX5iksbss6vpqsg26o8b9C8YXE/YOvaL4GWuIXW7ZSSDxMy5R/XUwI9+qmYY64c7lvisX79IgSjqYd1y0gZjk/N66H4pg67WPRsyiPvKJEbp+SeqqtYz18OkuirxB0F9tbr2jQ5WL1XXI8HRQt097DdLAEShl7HpQeTCGjfA/32ull3FeWbUeLBBowWzijXzK8GJTwp+XbPWAYhmEYZmW4ABgr4BF55Pg3AAAAAElFTkSuQmCC');

  const rect = {
    ...store.highlight,
    width: store.imageSize,
    height: store.imageSize
  }

  return (
    <Group
      name="slot"
      x={store.tableX}
      y={store.tableY}
      visible={!!store.highlight?.width}
    >
      <Image

        {...rect}
        strokeEnabled={false}
        fill="transparent"
        image={img1}
      />
    </Group>
  )
});
