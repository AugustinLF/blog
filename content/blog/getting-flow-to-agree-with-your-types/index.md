---
title: Getting Flow to agree with your types
date: '2018-10-17T22:12:03.284Z'
description: Quick tips to become more productive with Flow
originalPost: https://medium.com/@AugustinLF/making-flow-agree-with-your-types-be43594447c
type: blogPost
---

Flow is notoriously hard to use. I believe in the importance of strong static type-checkers. I have been using flow for about two years and don’t regret it, but flow requires too much understanding of how it works to make casual people happy using it. Most of the people I worked with, in different companies, on different (react) projects, think that flow is helpful. But they hate it. And they don’t intend to spend, as I did, countless hours following weird stack traces to understand what to do.

By the way, if you want to check the examples yourself, copy-paste them in https://flow.org/try, so you can play with the code to better understand why it works this way. And here is a [repo](https://github.com/AugustinLF/flow-examples) with all the examples.

## Quick wins

The first problem people encounter is refinement invalidation. The beauty of flow is that it is, most of the time, smart enough to understand the execution flow of your program. If you check that a variable is defined, it’ll know that next line, it will still be defined. At the condition that you didn’t call a function between the check and the use. In JavaScript, function calls are not pure, and can do a lot of unexpected things behind the scenes. And flow is pessimistic about that, considering that a console.log can change the value of the object you’re using. The solution here is usually to move the check closer to the use of the variable. Or use an invariant (more on that later). You’ll also have this problem with closures.

```javascript
// @flow
const func = (res: { data: ?string }) => {
    if (res.data) {
        console.log(res);

        // $FlowFixMe This doesn't error without the console.log
        const str: string = res.data;
    }
};
```

Refinement can be the source of other kind of issues. There are situations where flow cannot refine a variable’s type. It struggles when variables depend on each other, refining one will most of the time not help flow to understand the type of another. Predicate functions (e.g. lodash.isNil), if not specifically typed, won’t work. To make it work, you’ll have to use %check. Another common pain point is array.filter. Apart from filter(Boolean) which will successfully remove falsy values, it won’t help. Usually, array refinement will be easier to do with reduce. Or with a for loop.

When you believe that a type should be valid (a cat is an animal, right?), and flow complains, Flow is usually right there. This notion of type/subtype/supertype is harder than it seems. And often not intuitive. Indeed, when using a type instead of another one, you should just not consider the values of the type (e.g. the properties of an object), but all the operations you can do to both types. You cannot pass an object with a non nullable age to a function taking one with a nullable age. This function could delete the age property, and since we use references in JavaScript, this could lead to a bug.

Here you’ll have to use read-only types (aka covariance), which uses the `+` sign before the property, or the `$ReadOnly<>` type around the object.

```javascript
// @flow
type Person = {
    age: string,
};

const deleteAge = (maybeAgePerson: { age: ?string }) => {
    maybeAgePerson.age = null;
};
const printAge = (maybeAgePerson: { +age: ?string }) => {
    console.log(maybeAgePerson.age);
};
const person: Person = { age: 'one yo' };

// $FlowFixMe deleteAge can make age null, which breaks the Person contract
deleteAge(person);
printAge(person);
```

This also applies to arrays.

```javascript
// @flow
const people: Array<string> = ['jane', 'john'];
const deletePeople = (people: Array<?string>) => {
    people[0] = null;
};
const printPeople = (people: $ReadOnlyArray<?string>) => {
    console.log(people);
};
// deletePeople accepting maybe strings,
//we need to make sure that it won't modify the array
// $FlowFixMe
deletePeople(people);
printPeople(people);
```

If you need to rely on the non existence of some key, don’t forget the existence of exact types. On a non exact type, Flow will consider that a missing property can still be there, and will ignore your tentative to use it to refine your type.

```javascript
// @flow
type Success = {
    data: string,
    success: boolean,
};
type Error = {
    statusCode: number,
    error: Error,
};
// try with $Exact<Error>, it'll work!
const httpHandler = (res: Success | Error) => {
    if (res.success) {
        // $FlowFixMe what if you pass an Error which has a success property?
        const data: string = res.data;
    }
};
```

Using more advanced features of flow, such as unions, or composing types will often become necessary, but it’s also source of mistakes. To compose types, you’ll have two possibilities, intersections (`&`) and spread. For both cases, you need to know how these work with exact types. Indeed spreading a non exact type into a type will make its keys nullable, while an intersection of exact types is always impossible!

```javascript
// @flow
type Person = { age: number };
type SpreadPerson = { ...Person };
type ExactSpreadPerson = { ...$Exact<Person> };

const spreadPerson: SpreadPerson = { age: 1 };
const exactSpreadPerson: ExactSpreadPerson = { age: 1 };

// $FlowFixMe age is a maybe number (?number) in SpreadPerson
const age: number = spreadPerson.age;
const maybeAge: ?number = spreadPerson.age;
const correctAge: number = exactSpreadPerson.age;

type Intersection = {| a: number |} & {| b: string |};
// $FlowFixMe It's not possible to be exactly these two types
const a: Intersection = { a: 1, b: 'string' };
```

When using unions, quite often you’ll end up building your unions on the fly, some having maybe types. You’ll then check the existence of some property to determine which case you’re evaluating, but what you should aim for are tagged unions, using a unique property tagging the union. It’ll make your life easier. It’s often possible to do otherwise, but tagging your union is quite convenient (it’s for instance the way Redux works naturally).

```javascript
// @flow
type Action =
    | { type: 'ADD_TODO', payload: string }
    | { type: 'REMOVE_TODO', payload: number };
const reducer = (state: Object, action: Action) => {
    switch (action.type) {
        case 'ADD_TODO':
            const text: string = action.payload;
            break;
        case 'REMOVE_TODO':
            const int: number = action.payload;
            break;
        default:
            // Cool trick to ensure that you handled all the types of actions
            const empty: empty = action;
    }
};
```

I find it interesting to observe that this leads to code closer from what you’ll see in functional languages. In OCaml, Rust and co, you don’t create your unions/variants/enums (its mostly the same thing) on the fly, you explicitly create the variant. For instance, you don’t create a color and gives it props that make it the red color. The languages forces you to do so, and nothing prevent you from doing so in JS. It’ll be more explicit, and flow will automatically understand the types.

```javascript
// @flow
type Red = {
    color: 'red',
    intensity: 'light' | 'dark',
};
const createRedColor = (intensity: 'light' | 'dark'): Red => {
    return {
        color: 'red',
        intensity,
    };
};
```

See how in Rust we have something similar (but built in the language):

```rust
enum Color {
    Red(i64),
    RGB { r: i64, g: i64, b: i64 };
}

fn main() {
    let color = Color::Red(1);
}
```

## Impossible states

Flow doesn’t care about the implicit ways of using your API. If there are some combination of props to your component that don’t make sense, flow won’t be happy. Let’s say that a given prop of your component is required when another one is set. Most of the time, this requirement is not written, it is implicit, as is “don’t worry, you don’t check if this prop is defined , since this other on is”.

```javascript
// @flow
import React from 'react';

type Props = {
    withColor: boolean,
    color?: number,
};

const intensities = ['blue', 'red', 'green'];

const ColorRenderer = (props: Props) => {
    // There's no way for flow to know that when withColor is true, there is a color prop
    // $FlowFixMe
    const backgroundColor = props.withColor
        ? intensities[props.color]
        : 'black';
    return <div style={{ backgroundColor }} />;
};
```

I consider this a bad practice. Your codebase now only works if people are aware of this obscure knowledge. Good thing that flow doesn’t accept this kind of behaviour, right?

I can think of two ways to handle these cases. The first one, consists of making the impossible states impossible. See for [instance](https://blog.kentcdodds.com/make-impossible-states-impossible-cf85b97795c1) this blog post by the great Kent C. Dodds. This can consist of redefining your API (split your component in two, where one requires both properties). Use enums. Finite state machines are also a way to go when the impossible cases revolve around having a combination of some state values.

Sometimes, it’s too complex to handle this using the component API. Then, using invariants and throwing errors is a better solution than falling back to wrong typings (as a reminder, an [invariant](https://en.wikipedia.org/wiki/Invariant_%28computer_science%29) is a condition that is always true any given moment of the execution of the program).

```javascript
// @flow
const maybeString: ?string = 'a';

// It's not perfect, some wrong conditions will still mute the errors
// But it's better than nothing, and a wrong condition will trigger an error anyway
// so it's likely this won't happen
if (typeof maybeString !== 'string')
    throw new Error('maybeString should be defined');
console.log(`${maybeString}`);

const invariant = (condition: mixed, error: string) => {
    if (!condition) console.error(error);
};
const maybeNumber: ?number = 1;
invariant(typeof maybeNumber === 'number', 'maybeNumber should be defined');
const n: number = maybeNumber;
```

I really appreciate this pattern. It makes things explicit, and if you misuse your component, your error will be explicit! Moreover, it’s a great escape hatch for cases hard (or impossible) to type. When flow doesn’t agree with my typings, throwing an error will make him happy.

By the way, when you’re struggling with some typings, don’t be afraid of the error suppressing comment, `$FlowFixMe` (with a comment explaining the issue of course). I’ve stumbled many times on annotations lowering Flow’s understanding of your code (think of any, `*`, `Object` types, or weirder things with `$Shape`). Yes flow won’t complain, and your build will pass. But what is the point of that? This will kill other errors, that could be correct. And it won’t help the next person reading your code. On the other end, a `$FlowFixMe` (but please explain the reason why you put it), is both precise and explicit.

```javascript
// @flow
const arr = [1, 'a', 2, 'b'];

const wronglyTypedArray = arr.filter(el => typeof el === 'number');
// flow errors here because it doesn't know how the array should be refined
// It's tempting to put the error here, but it's not the smartest thing to do.
// $FlowFixMe
const result: number = wronglyTypedArray.reduce(
    (total, current) => total + current,
);

// flow doesn't understand the filter refinement. By forcing the cast here and muting the error
// we ensure that the rest of our program is correctly typed
// $FlowFixMe
const numArray: Array<number> = arr.filter(el => typeof el === 'number');
const total: number = numArray.reduce((total, current) => total + current);
```

## What about React?

I cannot recommend enough the [official doc](https://flow.org/en/docs/react/components/), which goes in details about typing a component’s props, its state, or how to use defaultProps. But just as reminder, type props with a default as always there, Flow will take care of making them optional on the call-site.

```javascript
// @flow
import * as React from 'react';

class TodoList extends React.Component<{ todos: Array<string> }> {
    static defaultProps = {
        todos: [],
    };
    render() {
        const { todos } = this.props;
        return (
            <ul>
                {todos.map((todo, index) => (
                    <li key={index}>{todo}</li>
                ))}
            </ul>
        );
    }
}
<TodoList />;
```

Another cool thing with Props is the possibility to use exact types. While it’ll prevent you from passing unimportant props (which, depending on the way you write your component, can be pretty painful), but it’ll prevent the case where you’ll make a typo with an optional prop. Indeed, passing a colour prop instead of color is not an error if color is an optional prop. But it’s nice to be able to catch this.

```javascript
// @flow
import React from 'react';

type Props = {|
    label: string,
    color?: string,
|};
const Text = ({ label, color }: Props) => <div style={{ color }}>{label}</div>;

// $FlowFixMe
<Text label="It's a text" colour="red" />;
```

Overall, there are not many differences between react and the rest of your application, react being JS without much magic (for your information, react typings are declared in the [flow repository](https://github.com/facebook/flow/blob/master/lib/react.js), and not in React’s one, which mean that to use the newest react features, you need to use the newest flow). However, some things are harder to type than others.

First of all, stay away from High Order Components (HOC) modifying props! I beg you! They are hard to type, especially when it comes to default props. But if you have some wrapped components, it is simpler to retype the component returned by the HOC. It’s cumbersome, but it is usually easy to do, and accurate.

```javascript
// @flow
import * as React from 'react';
const injectBreakpoint = BaseComponent =>
    class BreakPointInjector extends React.Component<*> {
        render() {
            return <BaseComponent {...this.props} breakpoint="medium" />;
        }
    };

type TodoProps = {
    content: string,
    breakpoint: string,
};
const Todo = ({ content, breakpoint }: TodoProps) => (
    <div>{breakpoint === 'medium' ? content.toUpperCase() : content}</div>
);
const WrappedTodo: React.ComponentType<{ content: string }> = injectBreakpoint(
    Todo,
);

// $FlowFixMe thanks to the annotation, flow works correctly
<WrappedTodo />;
```

This last statement is actually valid for all components created with a function that flow cannot infer, components returned by factories for instance, which is pretty common when using CSS-in-JS.

```javascript
// @flow
import * as React from 'react';

// This factory is simple enough for flow to understand how it works
// but usually, it's not the case
const createComponent: any = () => ({ color }: { color: string }) => (
    <div style={{ color }} />
);

const Div: React.ComponentType<{ color: string }> = createComponent();

// $FlowFixMe Flow understands that color is needed
<Div />;
```

On the other hand, render props are so much easier to type. Type the parameter of your render (or children) prop function, return a React.Node, and it’s done. Another benefit is that you don’t have to add the typing to the injected prop in your component props.

```javascript
// @flow
import * as React from 'react';

type Props = {
    children: (token: string) => React.Node,
};
const InjectViewer = ({ children }: Props) => children('super secure');

const Fetcher = (props: { token: string }) => <div />;

<InjectViewer>{token => <Fetcher token={token} />}</InjectViewer>;
```

When using createContext, where your context is not optional and where you cannot use a default context, it’s better to wrap your consumer into a component asserting that the context pass is always defined, and use a null value as default, than passing a weirdly shaped default value which will make flow happy, without making any sense (these famous empty strings).

```javascript
// @flow
import * as React from 'react';

type Viewer = { firstname: string };

// People often pass a "wrong" default to mute flow, an object with empty
// strings, it doesn't make sense
const defaultViewer: ?Viewer = null;
const ViewerContext = React.createContext(defaultViewer);

type ViewerConsumerProps = {
    children: (viewer: Viewer) => React.Node,
};
const ViewerConsumer = ({ children }: ViewerConsumerProps) => (
    <ViewerContext.Consumer>
        {viewer => {
            if (!viewer)
                throw new Error(
                    'This component cannot be rendered without a viewer provider',
                );
            return children(viewer);
        }}
    </ViewerContext.Consumer>
);

// Flow would complain if using directly ViewerContext.Consumer,
// saying that viewer can be undefined
const ViewerRenderer = () => (
    <ViewerConsumer>
        {viewer => <div>Hello {viewer.firstname}</div>}
    </ViewerConsumer>
);
```

And as a bonus example, use generics, they are not that hard (they’re beyond the scope of this article, and people have already written a lot of things about them).

```javascript
// @flow
import * as React from 'react';

type Props<T> = {
    children: (model: T) => React.Node,
    initialData: T,
    validate: (model: T) => boolean,
};
class Form<T> extends React.Component<Props<T>> {
    render() {
        const { children, initialData } = this.props;
        return children(initialData);
    }
}

type Model = {
    firstName: string,
};
const validate = model => {
    console.log(model.firstName);
    // $FlowFixMe
    console.log(model.lastName);
    return true;
};
const initialData = {
    firstName: '',
};
const form = (
    <Form validate={validate} initialData={initialData}>
        {data => (
            <div>
                <input value={data.firstName} />
                {/* $FlowFixMe */}
                <input value={data.lastName} />
            </div>
        )}
    </Form>
);
```

## When to use Flow

Apart from throw away projects, I believe that using a static type checker is necessary. I won’t discuss the difference with Typescript, I think that both are fine and work well enough. However, like any tool, it requires some investment, and for flow, it’s a continuous one.

In my opinion, embrace flow or drop it. I’ve seen teams passing more time circumventing the checker than thinking of their types. Too often, the development process becomes “I’ll write anything that silences flow”. Sadly, it just doesn’t make the error go away, it worsens the overall types of your codebase, which will force you to write more and more of these wrong types. And at the end, you spend your time muting flow errors, without getting any of its safety.

While the state I just described will more easily happen when gradually adopting flow, it is not necessary. But making it right requires discipline. And that’s hard to find in teams who don’t appreciate the tool.

Another thing that hinders teams is the overuse of helper functions and libraries like lodash, ramda or underscore for instance. While some of them publish typings, these aren’t perfect. And they’ll often silently lose the type of your code. On the other hand, since I believe that such libraries are most of the time non needed (if [Sebastian Markbåge](https://twitter.com/sebmarkbage) says it, then it’s true), it’s not a drawback.

Lastly, please don’t go for an overly defensive programming style because you’re not sure of your typings. Don’t have if checks everywhere because you’re not sure. Trust and enforce your types. Your type is written as nullable, but shouldn’t ? Don’t add an if check, remove the nullability. Sometimes it’ll force you to change something else, but I prefer to be too strict than not enough.

## Closing thoughts

Flow is a bit like this developer in your team that keeps pointing out things that you know you should do but you don’t want to. Don’t fight it.

But if you don’t understand why it complains, you can still reach me on Twitter!
