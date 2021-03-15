// 执行单元开始工作（从父节点到子节点处理）
export default function beginWork (fiber) {
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
