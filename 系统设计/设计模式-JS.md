适用于 ES2015 的设计模式

[reference](https://www.patterns.dev/posts/singleton-pattern) 

# 单例模式 Singleton Pattern
Share a single global instance throughout our application.

Singletons是只实例化一次，但可以全局访问的类。这个single instance 可以在整个应用里共享，非常适合在应用中管理全局状态。

在JS中，一个Singleton类：
```javascript
let counter = 0;
let instance;

class Counter {
    constructor() {
        if (instance) {
            throw new Error('You can only create one instance!');
        }
        instance = this;
    }
    getInstance() {
        return instance;
    }

    getCount() {
        return counter;
    }

    increment() {
        return ++counter;
    }

    decrement() {
        return --counter;
    }
}

const singletonCounter = Object.freeze(new Counter()); // 使用Object.freeze，确保使用该singleton的代码不改变Singleton的属性。
export default singletonCounter;
```
要确保Counter类只有一个实例被创建。
在其他文件中使用该singleton时，直接导入并使用。

## Tradeoffs
只创建一个实例，可以省很多内存空间，只需要为一个实例创建内存空间。但是Singleton被视为anti-pattern的，全局变量容易被污染。

### React中的状态管理
React中，不使用Singletons，而是通过状态管理工具Redux或React Context依赖全局状态，尽管他们的全局状态行为看起来和singleton类似，但这些工具提供了 read-only state，而不是Singleton这样的mutable state可变状态。使用Redux时，只有村函数reducers可以在组件通过despatcher发送action后更新状态。
尽管全局状态并没有消失，但至少可以确保组件不能直接更新状态，全局状态在我们有意识改变的时候才改变。

# 代理模式 Proxy Pattern
Intercept and control interactions to target objects.

通过Proxy对象，我们获得更多的对某个对象的交互的控制。一个Proxy对象可以在我们和某个对象交互的时候决定行为，如get或set值的时候。

proxy意味着someone else's stand-in。不直接和目标对象交互，而是和代表这个对象的proxy object对话。
```javascript
const person = {
    name: "John",
    age: 24,
    nationality: "American",
}
const personProxy = new Proxy(person, {});
const personProxy1 = new Proxy(person, {
    get(obj, prop) => {
        console.log(`The value of ${prop} is ${obj[prop]}`);
        return obj[prop];
    },
    set(obj, prop, value) => {
        obj[prop] = value;
    }
});
personProxy1.name;
personProxy1.age = 43;
```
Proxy的第二个参数代表handler。在handler对象中，我们可以基于交互的类型定义特定行为。尽管有很多方法可添加到Proxy handler，最常用的还是 get 和 set：
- get: 尝试access某个属性时触发
- set：尝试modify某个属性时触发

Proxy非常适合用于添加Validation：
```javascript
const personProxy = new Proxy(person, {
  get: (obj, prop) => {
    if (!obj[prop]) {
      console.log(
        `Hmm.. this property doesn't seem to exist on the target object`
      );
    } else {
      console.log(`The value of ${prop} is ${obj[prop]}`);
    }
  },
  set: (obj, prop, value) => {
    if (prop === "age" && typeof value !== "number") {
      console.log(`Sorry, you can only pass numeric values for age.`);
    } else if (prop === "name" && value.length < 2) {
      console.log(`You need to provide a valid name.`);
    } else {
      console.log(`Changed ${prop} from ${obj[prop]} to ${value}.`);
      obj[prop] = value;
    }
  },
});
```

## Reflect
JS提供一个内置对象 Reflect，让我们在使用Proxy的时候处理目标对象更容易。
Reflect对象上方法和Proxy的handler对象的方法同名。

我们可以用 **Reflect.get()**和**Reflect.set()**代替obj[prop]获取对象和obj[prop]=value设置对象属性，方法的参数也和proxy的handler的方法参数一样。
```javascript
const personProxy1 = new Proxy(person, {
    get(obj, prop) => {
        console.log(`The value of ${prop} is ${Reflect.get(obj, prop)}`);
        return Reflect.get(obj, prop);
    },
    set(obj, prop, value) => {
        Reflect.set(obj, prop, value);
    }
});
```

## Tradeoffs
Proxy提供了有力的工具来控制一个对象的行为，有多种用途，如：validation， formatting, notifications或debugging

过度使用 proxy对象或在每个handler方法调用时有heavy operations，很容易会影响应用的性能。对性能要求高的代码要尽量少用proxy。

# Provider Pattern
Make data available to multiple child components

应用中，通过props传递值给多个组件，会引起prop drilling(钻孔)
- We pass props far down the component tree, sometimes pass it through multiple layers
- Refactoring the code relies on the props becomes almost impossible, if we want to rename the prop, we have to rename it in many components.
- Knowing where certain data comes from is difficult.

optimal if we could skip all the layers of components that don't need to use this data

We need to have sth that gives the components that need access to the value of data direct access to it, without relying on prop drilling.


## Provider Pattern
Rather than passing the data down each layer through props, we can wrap all components in a **Provider**

Provider is a higher order component provided to us by the Context object. We can create a Context object, using createContext method.

```javascript
const DataContext = React.createContext() // // use createContext to create a Context object
 
function App() {
  const data = { ... }
 
  return (
    <div>
      <DataContext.Provider value={data}>
        <SideBar />
        <Content />
      </DataContext.Provider>
    </div>
  )
}

const SideBar = () => <List />
const List = () => <ListItem />
const Content = () => <div><Header /><Block /></div>
 
 
function ListItem() {
  const { data } = React.useContext(DataContext); // use useContext to get access to the data
  return <span>{data.listItem}</span>;
}
 
function Text() {
  const { data } = React.useContext(DataContext);
  return <h1>{data.text}</h1>;
}
 
function Header() {
  const { data } = React.useContext(DataContext);
  return <div>{data.title}</div>;
}
```
Using the useContext hook, this hook receives the context that data has a reference with, DataContext in this case. The useContext hook lets us read and write data to the context object.

The components that aren't using the data value won't have to deal with data at all. 

### Usage
- Sharing global data, a common usecase is sharing a theme UI state with many components.

Some libraries provide built-in providers, which values we can use in the consuming components, such as style-components.

### Tradeoffs
Props:
- The Provider pattern/ Context API makes it possible to pass data to many components, without having to manually pass it through each component layer.
- It reduces the risk of accidentally introducing bugs when refactoring code
- We no longer have to deal with prop-drilling, which could be seen as an anti-pattern.
Previously, it could be difficult to understand the dataflow of the application, as it wasn't always clear where certain prop values originated. With the Provider pattern, we no longer have to unnecessarily pass props to component that don't care about this data.
- Keeping some sort of global state is made easy with the Provider pattern

Cons:
- In some cases, Provider pattern can result in performance issues. All components that consume the context re-render on each state change.
In larger applications, passing a frequently updated value to many components can affect the performance negatively.

To make sure that components aren't consuming providers that contain unnecessary values which may update, you can create several providers for each separate usecase.

# Prototype Pattern
Share properties among many objects of the same type.

prorotype chain --> access a property through __proto__

## Object.create
```javascript
const dog = {
  bark() {
    return `Woof!`;
  },
};
 
const pet1 = Object.create(dog); // pass dog as pet1's prototype, we can access the bark property. 
```
The Object.create method lets us create a new object, to which we can explicitly pass the value of its prototype.

Object.create is a simple way to let objects directly inherit properties from other objects, by specifying the newly created object's prototype.

The new object can access the new properties by walking down the prototype chain.

## Pros
The prototype pattern allows us to easily let objects access and inherit properties from other objects. Since the prototype chain allows us to access properties that aren't directly defined on the object itself, we can avoid duplication of methods and properties, thus reducing the amount of memory used.

# Container/Presentational Pattern
Encourage the seperation of concerns.

Presentational components can be pure functions which are responsible for the UI. Easily be made resusable, as they simply display data without altering the data. They don't alter the application logic.

Testing presentational components is easy, as they are usually pure functions. 

Container components responsible for the state and data of the application.

## Cons
The Container/Presentational pattern makes it easy to separate application logic from rendering logic. However, Hooks make it possible to achieve the same result without having to use the Container/Presentational pattern, and without having to rewrite a stateless functional component into a class component.Note that today, we don't need to create class components to use state anymore.

Although we can still use the Container/Presentational pattern, even with React Hooks, this pattern can easily be an overkill in smaller sized application.
- Container/Presentational Pattern
```javascript
// Presentatinal Component
import React from "react";

export default function DogImages({ dogs }) {
  return dogs.map((dog, i) => <img src={dog} key={i} alt="Dog" />);
}

// Container Component
import React from "react";
import DogImages from "./DogImages";

export default class DogImagesContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      dogs: []
    };
  }

  componentDidMount() {
    fetch("https://dog.ceo/api/breed/labrador/images/random/6")
      .then(res => res.json())
      .then(({ message }) => this.setState({ dogs: message }));
  }

  render() {
    return <DogImages dogs={this.state.dogs} />;
  }
}
```

- React Hooks

```javascript
// for data and logic
export default function useDogImages() {
  const [dogs, setDogs] = useState([]);
 
 // create a custom hook that fetches the images, and returns the array of dogs.
  useEffect(() => {
    fetch("https://dog.ceo/api/breed/labrador/images/random/6")
      .then((res) => res.json())
      .then(({ message }) => setDogs(message));
  }, []);
 
  return dogs;
}

// for Rendering 
import React from "react";
import useDogImages from "./useDogImages";

export default function DogImages() {
  const dogs = useDogImages(); // useDogImages hook separated the application logic from the view. Simply using the returned data from the useDogImages hook, without modifying that data within the DogImages component.

  return dogs.map((dog, i) => <img src={dog} key={i} alt="Dog" />);
}
```

The introduction of Hooks made it easy for developers to add statefulness without needing a container component to provide that state.

 It saves us the extra layer that was necessary in order to wrap the presentational component within the container component.

# Observer Pattern
