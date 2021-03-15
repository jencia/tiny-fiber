// 执行单元收尾工作（从子节点到父节点处理）
export default function completeUnitOfWork (unitOfWork) {
    let workInProgress = unitOfWork

    do {
        const returnFiber = workInProgress.return   // 获取父节点 Fiber
        const siblingFiber = workInProgress.sibling // 获取兄弟节点 Fiber

        // 构建 Fiber 链表结构
        if (returnFiber) {
            // 上移链头
            if (!returnFiber.firstEffect) {
                returnFiber.firstEffect = workInProgress.firstEffect
            }

            // 上移链尾
            if (!returnFiber.lastEffect) {
                returnFiber.lastEffect = workInProgress.lastEffect
            }

            // 存在 lastEffect 就不是链头，此时的 lastEffect 是上一个 Fiber
            if (returnFiber.lastEffect) {
                // 当前 Fiber 作为上一个 Fiber 的 nextEffect
                returnFiber.lastEffect.nextEffect = workInProgress
            } else {
                // 设置链头
                returnFiber.firstEffect = workInProgress
            }

            // 缓存最新 Fiber
            returnFiber.lastEffect = workInProgress
        }

        // 如果存在兄弟节点，就直接返回兄弟节点
        if (siblingFiber) {
            return siblingFiber
        }
        // 否则回到父节点
        workInProgress = returnFiber

        // 直到顶层节点无父节点跳出循环
    } while(workInProgress)

    return null
}
