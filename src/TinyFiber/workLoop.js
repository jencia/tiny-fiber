import commitRoot from './commitRoot'
import performUnitOfWork from './performUnitOfWork'

// 循环构建 workInProgress Fiber 树
export default function workLoop (deadline, workInProgressRoot) {
    let workInProgress = workInProgressRoot

    // 有下一个任务 && 有空余时间
    while (workInProgress && deadline.timeRemaining() > 0) {
        workInProgress = performUnitOfWork(workInProgress)
    }

    if (!workInProgress) {
        // commit 阶段
        commitRoot(workInProgressRoot)
    }
}
