import beginWork from './beginWork'
import completeUnitOfWork from './completeUnitOfWork'

// 执行单元工作，模拟递归调用
export default function performUnitOfWork (unitOfWork) {
    // 从父节点到子节点
    let next = beginWork(unitOfWork)

    if (!next) {
        // 从子节点到父节点
        next = completeUnitOfWork(unitOfWork)
    }
    return next
}
