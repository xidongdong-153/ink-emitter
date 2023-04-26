# ink-emitter
InkEmitter 可用于处理组件间的相互通信，不局限于框架。

## 安装
`npm install ink-emitter`


`pnpm install ink-emitter`

## 使用

### 引入 InkEmitter
项目中引入 ink-emitter
```typescript
import { inkEmitter } from 'ink-emitter';
```

### 发送数据
```typescript
inkEmitter.emit('event_name', payload);
```

### 接收数据
`receive` 方法接收事件
```typescript
const unsubscribe = inkEmitter.receive('event_name', (payload) => {
  // 处理接收到的数据
});

// 取消订阅
unsubscribe();
```
`receive` 方法接收多个事件
```typescript
const unsubscribe = inkEmitter.receive(['event1', 'event2'], (payload) => {
  // 处理接收到的数据
});

// 取消订阅
unsubscribe();
```

### 取消订阅

`unsubscribes` 方法接收事件
```typescript
inkEmitter.unsubscribes('event_name')
```

`unsubscribes` 方法接收多个事件
```typescript
inkEmitter.unsubscribes(['event1', 'event2'])
```

`clear` 方法清除所有事件
```typescript
inkEmitter.clear()
```

## API
### emit(event: EventNameOrArray, ...args: any[]): void
发送一个带有指定名称或者包含多个名称的数组和负载的事件。

### receive<T extends any[] = any[]> (event: EventNameOrArray, listener: EventCallback<T>): () => void
接收一个或多个事件。当事件被发送时，提供的监听器函数将被调用并接收事件的负载。此方法返回一个取消订阅的函数。

### unsubscribes (event: EventNameOrArray)
接收一个接收一个或多个事件，取消事件订阅。

### clear()
取消所有订阅事件。

## Example
**React Component**

``` typescript
const OneToTwoA = 'OneToTwoA'
const OneToTwoB = 'OneToTwoB'

type Message = {
  message: string
}
type MessageA = {
  title: string
  message: string
}

type UserInfo = {
  username: string
}

type AllMessage = Message | MessageA

const TestOne = function () {
  const handleClick = useCallback(() => {
    inkEmitter.emit(OneToTwoA, {
      message: 'TestOne' + Math.random().toFixed(2)
    })
    inkEmitter.emit(OneToTwoB, {
      title: 'TestTwo-Title' + Math.random().toFixed(2),
      message: 'TestTwo' + Math.random().toFixed(2)
    })
  }, [])

  return (
    <div>
      TestOne Com:
      <button onClick={handleClick}>click me</button>
    </div>
  )
}

function isMessageA (obj: Message | MessageA): obj is MessageA {
  return 'title' in obj
}

const TestTwo = function () {
  const [title, setTitle] = useState<any>('')

  useEffect(() => {
    inkEmitter.receive<[AllMessage, UserInfo]>(
      [OneToTwoA, OneToTwoB],
      (data, user) => {
        if (isMessageA(data)) {
          console.log('Title:', data.title)

          setTitle(() => data.title)
        }
        console.log('Message:', data.message)
      }
    )
  }, [])

  return (
    <div>
      TestTwo Com:
      <span> {title ? title : 'emit empty'} </span>
    </div>
  )
}
```
