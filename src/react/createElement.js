export default function createElement (type, props, ...children) {
    const childElement = [].concat(children)

        // 扁平化处理，防止出现二维数组
        .reduce((rs, child) => rs.concat(child), [])

        // 过滤布尔值和 null
        .filter(child => ![true, false, null, undefined].includes(child))

        // 转化文本内容
        .map(child => {
            if (child instanceof Object) {
                return child
            }
            return { type: 'text', props: { textContent: child } }
        })

    if (childElement.length > 0) {
        props.children = childElement
    }
    
    return { type, props }
}