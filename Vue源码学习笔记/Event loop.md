# Javascript中的Event Loop
## 浏览器环境下JS引擎的事件循环

事件队列（Task Queue）
JS引擎遇到一个异步事件后，不会一直等待其返回结果，而是将这个事件挂起，继续执行栈中的其他任务。当一个异步时间返回结果后，js将这个事件加入与当前执行栈不同的另一个队列，即事件队列中。
被放入事件队列中的时间不会立刻执行其回调，而是等待当前执行栈中的所有任务都执行完毕，主线程处于闲置状态时，主线程会去查找事件队列是否有任务。如果有，主线程会从中取出排在第一个的事件，并把这个事件对应的回调放入执行栈中，然后执行其中的同步代码。
如此反复，就形成了一个循环，称为“事件循环”。

不同的异步任务分为两类。微任务（micro task）和宏任务(macro task)。
异步事件返回结果后放到任务队列中时，根据异步事件的类型，会被对应地放到macro task 或 micro task中。在当前执行栈为空时，主线程会查看微任务队列是否有事件存在，依次执行微任务队列中的事件对应的回调之后，再去宏任务队列中执行.

## 异步更新队列
当状态发生变化时，Vue是异步执行DOM更新的。当某个响应式数据发生变化时，它的setter函数会让dep通知所有订阅者（Watcher）(调用dep.notify()),触发订阅者（watcher）更新。
```javascript
// /src/core/observer/dep.js
notify () {
    // stabilize the subscriber list first
    const subs = this.subs.slice()
    if (process.env.NODE_ENV !== 'production' && !config.async) {
      // subs aren't sorted in scheduler if not running async
      // we need to sort them now to make sure they fire in correct
      // order
      // 如果未运行异步，则subs不会在调度程序中排序,需要立即对其进行排序,确保它们以正确的顺序触发
      subs.sort((a, b) => a.id - b.id)
    }
    //触发订阅者更新
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
```

```javascript
// /src/core/observer/watcher.js
/**
   * Subscriber interface.
   * Will be called when a dependency changes.依赖更改时调用
   */
  update () {
    /* istanbul ignore else */
    if (this.lazy) {
      this.dirty = true
    }
    // 同步，则直接运行run渲染视图 
    else if (this.sync) {
      this.run()
    } else {
    // 异步，则加入到观察者队列中，在下一个tick时调用
      queueWatcher(this)
    }
  }

```
Vue执行的是异步更新DOM更新，异步执行update时，会调用queueWatcher()函数。

```javascript
// /src/core/observer/scheduler.js
/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
 // 将一个watcher对象推入watcher队列中，如果在队列中已经有id相同的watcher则跳过，除非它是在队列被刷新时推入的
export function queueWatcher (watcher: Watcher) {
  const id = watcher.id
  if (has[id] == null) {
    has[id] = true
    if (!flushing) {
      queue.push(watcher)
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      // 如果已经刷新了，根据watcher的id将watcher插入queue中的合适位置;如果已经超出它的id，则下一步立即执行
      let i = queue.length - 1
      while (i > index && queue[i].id > watcher.id) {
        i--
      }
      queue.splice(i + 1, 0, watcher)
    }
    // queue the flush
    if (!waiting) {
      waiting = true

      if (process.env.NODE_ENV !== 'production' && !config.async) {
        flushSchedulerQueue()
        return
      }
      nextTick(flushSchedulerQueue)
    }
  }
}
```