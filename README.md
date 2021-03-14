## TinyFiber

为了学习 Fiber 架构底层原理而开发的简化版 Fiber 架构练习。

### 为什么需要 Fiber 架构

总的来说 Fiber 架构是为了解决递归调用引起的长时间占用主线程，导致渲染不及时，造成页面卡顿现象。

React 渲染页面是通过 Virtual DOM 比对找出 DOM 对象发生变化的部分，将发生变化的部分渲染到页面中，从而避免渲染整个 DOM 对象以提高性能。这种做法完全没有问题，问题是出在实现方式。

在还没有 Fiber 架构的时候，Virtual DOM 对比是采用递归调用的方式，递归调用的过程不能被终止，如果 Virtual DOM 的层级嵌套比较深，递归比对的过程就会长时间占用主线程，而 JavaScript 又是单线程，不能同时执行多个任务，而且 JavaScript 执行和 UI 渲染又是互斥的，UI 渲染一直处于等待状态，页面不能及时响应，在用户看来就是点了没反应，就有一种卡顿的感觉。

### Fiber 架构如何解决

1. 实现了一套类似 `requestIdleCallback` 的任务调度方案 `scheduler` (不直接使用 `requestIdleCallback` 是因为兼容性不好，而且不稳定)，给每个任务都设置优先级，高优先级任务优先执行，低优先级任务等浏览器有空闲时间再执行。
2. 将任务拆分为一个个小任务，即执行单元，采用单向链表存储。
3. 放弃递归调用的方式，使用循环模拟递归。每次循环执行一个执行单元，每次循环之前判断是否有更高优先级任务，有就去执行搞优先级任务，没有就继续执行下一个执行单元。

### Fiber 架构如何实现

目前只考虑初始渲染流程，主要分为三个阶段：

- 构建根节点 FiberRoot 和 RootFiber
- render 阶段，构建 workInProgress Fiber 树和 Fiber 链表结构
- commit 阶段，根据 Fiber 链表将各个 Fiber 对象渲染到真实 DOM 上

至于为什么存在 render 和 commit 两个阶段，需要了解下双缓存技术，React 的 DOM 渲染采用双缓存技术，即内存里存在 current Fiber 树和 workInProgress Fiber 树两棵树。current Fiber 树代表当前页面上展示的树，workInProgress Fiber 树是下次待更新的树。

进入 render 阶段是在内存中构建 workInProgress Fiber 树，构建的过程也在渲染，即创建 DOM 对象。render 阶段结束的时候所有 DOM 对象就已经创建完成了，也就是每个 Fiber 对应的真实 DOM 就已经创建好了。render 阶段是随时可被打断的，所以不用担心渲染过慢堵塞主线程。不过初始渲染是例外，为了更快的展示在界面，所有初始渲染任务都是最高优先级。

到了 commit 阶段就只是将创建好的 DOM 渲染到页面对应的位置，可以大大提升更新 DOM 的速度。双缓存技术主要是为了提升 commit 阶段的渲染速度，因为到了 commit 阶段，为了保证 DOM 元素不缺失，所有任务就会提升到最高优先级，要是渲染速度慢了就会堵塞主线程。