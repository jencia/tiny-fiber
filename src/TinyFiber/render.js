import workLoop from './workLoop'

export default function render (element, container) {
    // 构建 RootFiber
    const workInProgressRoot = {
        stateNode: container,
        props: {
            children: [element]
        }
    }
    
    // render 阶段
    requestIdleCallback(deadline => {
        workLoop(deadline, workInProgressRoot)
    })
}
