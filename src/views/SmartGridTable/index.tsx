import { useMount } from 'ahooks';
import './index.less';
import { Tooltip } from 'tdesign-react';
// export function SmartGridTable() {

//   const dividerRef = useRef<HTMLDivElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const handleRef = useRef<HTMLDivElement>(null);

//   const isDragging = useRef(false);


//   const handleMouseMove = useCallback((event: any) => {
//     if (dividerRef.current) {
//       // requestAnimationFrame(()=>{
//       //   const newX = event.clientX - containerRef.current!.getBoundingClientRect().left;
//       //   const newY = event.clientY - containerRef.current!.getBoundingClientRect().top;

//       //   // 更新 paneDivider 的水平位置
//       //   dividerRef.current!.style.left = `${newX}px`;

//       //   // 更新 dragHandle 的位置：x跟随paneDivider，y跟随鼠标
//       //   // handleRef.current!.style.left = `${newX - 10}px`; // 调整偏移量根据 dragHandle 的宽度
//       //   handleRef.current!.style.top = `${newY}px`; // dragHandle 的 Y 位置跟随鼠标
//       // })

//       const containerRect = containerRef.current!.getBoundingClientRect();
//       const newX = event.clientX - containerRect.left;
//       const limitedX = Math.max(0, Math.min(newX, containerRect.width));


//       dividerRef.current.style.left = `${limitedX}px`;
//       // handleRef.current!.style.left = `${limitedX - 10}px`;
//       handleRef.current!.style.top = `${event.clientY - containerRect.top}px`; // dragHandle 的 Y 位置跟随鼠标


//     }
//   }, []);


//   const handleMouseMove2 = useCallback((event: any) => {
//     if (dividerRef.current) {
//       // requestAnimationFrame(()=>{
//       //   const newX = event.clientX - containerRef.current!.getBoundingClientRect().left;
//       //   const newY = event.clientY - containerRef.current!.getBoundingClientRect().top;

//       //   // 更新 paneDivider 的水平位置
//       //   dividerRef.current!.style.left = `${newX}px`;

//       //   // 更新 dragHandle 的位置：x跟随paneDivider，y跟随鼠标
//       //   // handleRef.current!.style.left = `${newX - 10}px`; // 调整偏移量根据 dragHandle 的宽度
//       //   handleRef.current!.style.top = `${newY}px`; // dragHandle 的 Y 位置跟随鼠标
//       // })

//       const containerRect = containerRef.current!.getBoundingClientRect();
//       handleRef.current!.style.top = `${event.clientY - containerRect.top}px`; // dragHandle 的 Y 位置跟随鼠标


//     }
//   }, []);

//   const handleMouseUp = useCallback(() => {
//     document.removeEventListener('mousemove', handleMouseMove);
//     document.removeEventListener('mouseup', handleMouseUp);
//   }, [handleMouseMove]);

//   const handleMouseDown = useCallback(() => {
//     document.addEventListener('mousemove', handleMouseMove);
//     document.addEventListener('mouseup', handleMouseUp);
//   }, [handleMouseMove, handleMouseUp]);


//   const handleMouseEnter = () => {
//     isDragging.current = true;
//     window.addEventListener('mousemove', handleMouseMove);
//   };

//   const handleMouseLeave = () => {
//     isDragging.current = false;
//     window.removeEventListener('mousemove', handleMouseMove);
//   };

//   useEffect(() => {
//     // 清理事件监听器
//     return () => {
//       window.removeEventListener('mousemove', handleMouseMove);
//     };
//   }, []);


//   return (
//     <div className="container" ref={containerRef}>
//       <div className="paneDivider h-full  hover"
//         ref={dividerRef}
//         onMouseEnter={handleMouseMove2}
//         onMouseLeave={handleMouseMove2}
//         onMouseDown={handleMouseDown}>
//         <div className="line noevents"></div>
//         <div className="dragHandle"
//           style={{ position: 'absolute', top: '0', left: '50%', width: '20px', height: '20px', backgroundColor: 'blue' }}
//           ref={handleRef}></div>

//         {/* <div className="tooltip">锁定一列</div> */}
//       </div>
//     </div>
//   )
// }



export const DraggableComponent = () => {
  const dividerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isHovering = useRef(false);

  const handleMouseMove2 = useCallback((event: any) => {
    if (dividerRef.current) {
      requestAnimationFrame(()=>{
        const containerRect = containerRef.current!.getBoundingClientRect();
        const newX = event.clientX - containerRect.left;
        const limitedX = Math.max(0, Math.min(newX, containerRect.width));
        // dividerRef.current!.style.transform = `translateX(${limitedX}px)`;
        // dividerRef.current!.style.left = `${limitedX}px`;
        dividerRef.current!.style.transform = `translate3d(${limitedX}px, 0, 0)`;
      })
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    document.removeEventListener('mousemove', handleMouseMove2);
    document.removeEventListener('mouseup', handleMouseUp);
  }, []);

  const handleMouseDown = useCallback(() => {
    document.addEventListener('mousemove', handleMouseMove2);
    document.addEventListener('mouseup', handleMouseUp);
  }, []);

  const handleMouseMove = (event: any) => {
    if (isHovering.current) {
      requestAnimationFrame(()=>{
        const containerRect = containerRef.current!.getBoundingClientRect();
        // handleRef.current!.style.top = `${event.clientY - containerRect.top}px`; // dragHandle 的 Y 位置跟随鼠标
        
        //  用transform修改位置
        // handleRef.current!.style.transform = `translate(-50%,${event.clientY - containerRect.top-12}px)`;
        handleRef.current!.style.transform = `translate3d(-50%, ${event.clientY - containerRect.top-12}px, 0)`;
      })

    }
  };

  const handleMouseEnter = () => {
    isHovering.current = true;
  };

  const handleMouseLeave = () => {
    isHovering.current = false;
  };

  useEffect(() => {
    containerRef.current!.addEventListener('mousemove', handleMouseMove);

    // 清理事件监听器
    return () => {
      containerRef.current!.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div ref={containerRef} className="container">
      <div
        ref={dividerRef}
        className="paneDivider"
        style={{
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
      >
        <div
          ref={handleRef}
          className="dragHandle"
          style={{ position: 'absolute', left: '50%', width: '20px', height: '20px', backgroundColor: 'blue', transform: 'translate(-50%, -50%)' }}
        >
          <div className='drag_tooltip'>
            两列
          </div>
        </div>
      </div>
    </div>
  );
};