
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

vue.nextTick实现原理
