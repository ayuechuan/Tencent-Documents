import { observer } from 'mobx-react-lite';
import { Circle, Group, Image } from 'react-konva'
import { Portal, useImage } from 'react-konva-utils'
import { useConference } from '../store/context';

export const FeatureLayer = observer(() => {
  const store = useConference();
  const [img2] = useImage('data:image/png;base64,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');
  const [img1] = useImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAA+CAYAAABzwahEAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKqSURBVHgB7ZpNbtNAFIDf2K6QWilBKEKwoIz4EV1EKt2wYZPeIJwg5Cg5QbkBuQFwArJhw4YsumiEKBZZBCGoSKWmamN7+p5jW25aO3HVxTjzPskaj+fZypc44xm/AWAYIxDLBiqlGlhI0Jf/uPWFEO4ywQvFI+H34E2lOj8F8M5BS+6sg8AN6eLWWfQF5IqjdBOLD8HoEILhAShvCjpD4vbzHRCVmovV3Tz5ReI/g+FA+ihdJpz6a5L/iOJvsmKsrAaUfgtnk9JJE/5wQEUTHe5mxVg550t1cgxlRI3/xrsyKyZXHDT/Ty/BjX7xlYbFTYPFTYPF00QP/sfgOPH4t1SkPvPLzJh0BYUlFnu4NZNnuLMGwZ9fOFYfgDqbgM5YlRpYT+og1qvhZ42+ABe3Lg5fO+nYRDyS/gyTsfQO90Edz0Y/dBF7cwtgowL+/hdt5e37m2A924H5CZWFx+1HL2j2RvLtOD4t3kXp1rTfu/bCNPAnPJTXjXBWtt0AhdLXzS2o3dneRQmnjfJdOhb+x6Nfu+V//5Z5cWoTdCttVEE3RLUGwp9C1oSK7tJg9IN2W/GxuHMLx+XByTjz4nRyeJtrKG7dewDB0e/cmOBoREUjOScqpfKXmJDo2rlhB7xwQjXXzs9x02Bx02Bx02Bx02Bx02Bx02Bx02Bx02Bx0zBW3IGi4PutMmZX5iksbss6vpqsg26o8b9C8YXE/YOvaL4GWuIXW7ZSSDxMy5R/XUwI9+qmYY64c7lvisX79IgSjqYd1y0gZjk/N66H4pg67WPRsyiPvKJEbp+SeqqtYz18OkuirxB0F9tbr2jQ5WL1XXI8HRQt097DdLAEShl7HpQeTCGjfA/32ull3FeWbUeLBBowWzijXzK8GJTwp+XbPWAYhmEYZmW4ABgr4BF55Pg3AAAAAElFTkSuQmCC');
  const [img3] = useImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAA+CAYAAABzwahEAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALESURBVHgB7Zo9bNNAFICfk5SkpUlZ6FBR4QEpSF0QygJTygRLCQsMCEjEQjcW2BiibiztFhbUCNElC4WFMZnSAaiyIFGpEhFIHcpCE36S0tS8Z3yVk2I7rjqcfe+TTs7Zz6d8vvP5TncADKME2rCBhmFk8aCDvHzH1NA0rTlMsKe4Jbzc7hr61s4+tHcNkJGpVMRMSBlT0esBuIqjdA4Pr1bWd6FU7wDKg8yQ+MK1UciciTUxO+sm7yX++Vm9q5fWOhAknt86SfKrKH7DKSbidAGl81ut/cBJE6V6lw45dDjlFBNxuV//tN2DIPL+6574qTvFuIq3O3K/00NwpBoPNSyuGiyuGixux/rwn00lNJiaCN6zscbsxAWnmL4hKwrreFjElBPj8mRcgzcfcay+1gWapMhMZjoKj7OjkJ6MAo46xQNoYirj8LVojz0Qt6SrG996+tNq52D0kz4dhQeX43AeC7tf+Smt/NzMCCxcHYPBCdXczAmYx/+PD4HkCyLeLr6M0vmbL378t2Aa+AOWRfKyQa9j5c44rHyglnl4bkE1X7k7Tq23gPJlOme2Bau280/e/nYsnK5lpmNmC5ANnImZNew0oaJm/3LdnLjcE+dEL6DTjVjjjoXTzZTSk/J1dlfOjUB1849rTHXTfHWzIt8n7gWJy0gyAdDymFANTrj4O64aLK4aLK4aLK4aLK4aLK4aLK4aLK4aLK4ayorHwCepeMS+UhFYfIs/mk2YSTbefdnzFe9L/OHqL3NJSUb8bkXzJU6Fy77XbVi4V1cNZcSTif6+SYg36BMla8d1HFiLnU2RN8Vx6bSBhxqtI4cVy+21yNubevH2xTjMXwqXPLXipetjNOhqYnZJnB/cCkLbtBdp8+7Gdg9aIfh00RIyytfwZ8G+jfvQS21tEsjCv40zExBsdjDR9u0aMAzDMAwTGv4Cfmnwxm+8LqoAAAAASUVORK5CYII=');
  return (
    <Portal selector='.controls-layer'>
      <Group
        x={store.tableX}
        y={store.tableY}
        visible={store.moveingSourceGroup !== null}
      >
        <Image
          {...store.moveingSourceGroup}
          height={store.imageSize}
          width={store.imageSize}
          image={img2}
          strokeEnabled={false}
          fill="#F8F8F8"
        />
        <Circle
          {...{
            ...store.moveingSourceGroup,
            x: (store.moveingSourceGroup?.x || 0) + 10,
            y: (store.moveingSourceGroup?.y || 0) + 5
          }}
          radius={5}
          fill="red"
        />
      </Group>

      <Group
        x={store.tableX}
        y={store.tableY}
        visible={store.moveingTargetGroup !== null}
      >
        <Image
          {...store.moveingTargetGroup}
          height={store.imageSize}
          width={store.imageSize}
          image={img1}
          strokeEnabled={false}
          fill="#F8F8F8"
        />
        <Circle
          {...{
            ...store.moveingTargetGroup,
            x: (store.moveingTargetGroup?.x || 0) + 10,
            y: (store.moveingTargetGroup?.y || 0) + 5
          }}
          radius={5}
          //  填充绿色
          fill="green"
        />
      </Group>

      <Group visible={store.moveingSeat !== null}>
        <Image
          {...store.moveingSeat}
          height={store.imageSize}
          width={store.imageSize}
          image={img3}
          strokeEnabled={false}
        // fill="#F8F8F8"
        />
      </Group>
    </Portal>
  )
})
