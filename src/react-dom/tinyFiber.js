let workInProgress = null

export function render (element, container) {
    // 构建 RootFiber
    workInProgress = {
        stateNode: container,
        props: {
            children: [element]
        }
    }
    
    // render 阶段
    requestIdleCallback(workLoop)

    // commit 阶段
    commitRoot()
}

// 循环构建 workInProgress Fiber 树
function workLoop (deadline) {
    // 有下一个任务 && 有空余时间
    while (workInProgress && deadline.timeRemaining() > 0) {
        workInProgress = performUnitOfWork(workInProgress)
    }
}

// 执行单元工作，模拟递归调用
function performUnitOfWork (unitOfWork) {
    // 从父节点到子节点
    let next = beginWork(unitOfWork)

    if (!next) {
        // 从子节点到父节点
        next = completeUnitOfWork(unitOfWork)
    }
    return next
}

// 执行单元开始工作（从父节点到子节点处理）
function beginWork (fiber) {
    if (!fiber.stateNode) {
        // 创建 DOM 元素，并存在 stateNode
        fiber.stateNode = document.createElement(fiber.type)
        // 设置 DOM 属性
        for (const propName in fiber.props) {
            if (propName !== 'children') {
                fiber.stateNode.setAttribute(propName, fiber.props[propName])
            }
        }
    }

    // 创建子元素 Fiber 对象
    if (fiber.props && fiber.props.children) {
        // 缓存上一个子节点 Fiber
        let previousFiber = null

        fiber.props.children.forEach((child, index) => {
            // 创建子节点 Fiber
            const childFiber = {
                type: child.type,
                props: child.props,
                return: fiber
            }

            if (index === 0) {
                // 子节点 Fiber
                fiber.child = childFiber
            } else {
                // 兄弟节点 Fiber，将当前 Fiber 存在上一个节点的 sibling 里
                previousFiber.sibling = childFiber
            }
            // 存储当前子节点 Fiber
            previousFiber = childFiber
        })
    }
    
    // 返回子节点 Fiber
    return fiber.child
}

// 执行单元收尾工作（从子节点到父节点处理）
function completeUnitOfWork (unitOfWork) {
    workInProgress = unitOfWork

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

// commit 阶段，将 workInProgress Fiber 树渲染到真实 DOM 上
function commitRoot () {
    // 获取第一个 Fiber
    let currentFiber = workInProgress.firstEffect

    while (currentFiber) {
        // 渲染 DOM
        currentFiber.return.stateNode.appendChild(currentFiber.stateNode)

        // 指向下一个 Fiber
        currentFiber = currentFiber.nextEffect
    }
}