// commit 阶段，将 workInProgress Fiber 树渲染到真实 DOM 上
export default function commitRoot (workInProgressRoot) {
    // 获取第一个 Fiber
    let currentFiber = workInProgressRoot.firstEffect

    while (currentFiber) {
        // 渲染 DOM
        currentFiber.return.stateNode.appendChild(currentFiber.stateNode)

        // 指向下一个 Fiber
        currentFiber = currentFiber.nextEffect
    }
}
