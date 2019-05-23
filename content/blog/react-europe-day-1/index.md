---
title: React-Europe Day 1
date: '2019-05-23T18:00:00.284Z'
description: What happened at React-Europe doesn't stay at React-Europe
type: blogPost
---

## Keynote: Jared Palmer's State of React

Jared takes us on a tour about what happened in React recently, Suspense, hooks and so on. He starts by livecoding a transition from class to hooks. A problem with the current lifecycle methods, is that it's error prone. Let's take a a component fetching data in its `componentDidMount`. We have to make sure that we also update it properly in a `componentDidUpdate`.

Another great thing is suspense, that will solve all our spinner hell problems! We can get rid of a lot of code regarding loading state, error state. Indeed, by using suspense for data fetching, we can treat async code as synchronous. We read from the cache. When data is available, the UI can directly be rendered. When it's not, React will suspend rendering, to wait for your data.

Benefits of suspense:

-   Feels "Sync"
-   Easy to coordinate
-   Fast & pretty (no spinner hell)

There are several projects by the react team (they love f words):

-   [React Fire](https://github.com/facebook/react/issues/13525), update to react dom
-   React Fusion (compiler for react)
-   React Native Fabric (rewrite of the react-native application)
-   React Fusion is a unified event system

## Joshua Comeau: Saving the web 16 millisecond a time

Most of our focus on performance are about the loading of apps. But we don't pay enough attention about the rest, while we spend much more time using the app rather than loading it. Why are mobile apps so big (facebook app is 15 times bigger than Mario 64), and yet we feel that web apps are too big? And yet often the experience is not the same.

We need to make our apps more efficient. 16ms is the max amount time a frame can take to hit the 60 frames per second, which is what we want. Animation is costly, many css properties trigger layout and paint, which are the expensive steps done by your browser. Check [csstriggers.com](https://csstriggers.com/) for more detail about what you can and what you cannot do. Let's look at a simple accordion. You could use different css tricks to make it happen, but it'll probably won't have a good performance anyway. So you could perhaps do a different animation, that would still feel ok. Here, Joshua doesn't animate the height of the accordion tab, it's directly opens at 100%, but he slightly translates the content, to make it feel like it moves in. And obviously the perf is great.

Another example, is the like button of Twitter with all its particles. While its possible to do with js and css, you might have performance problem. A great solution is to use sprites, like in video games.

Heavy calculations done for canvas for instance, can be done in web workers. And while you don't have access to canvas in a web worker, there's offscreen web worker that can do that in some browsers.

## Alec Larson: react-spring

Be careful of not distracting your uses with animations. Your animation should guide your user's attention. If you animate last a non important thing, it'll catch the attention of the user, which is a distraction.

Instead of using bezier curves to animate, use springs, which look more closely to physic like. They'll feel more responsive, more realistic.

[`react-spring`](https://react-spring.io/) is a lib that exposes a hook to animate value. You can animate any prop, since you can animate numbers, arrays, strings (`rgb(0 -> 255, 0 -> 255, 0 -> 255);`).

This library exposes a lot of options to configure your animations, from control on the springs through tension, friction, or on the animations, with the possibilities to reset it, revert, or stop it.

## Ella van Durpe: Rich Content Editor in WordPress

The previous editor was `contentEditable` based, where DOM is the source of truth. It's hard to work with that, you'll get really quickly illogical html tags nesting.

They did the big rewrite, Gutenberg, 2,5 years using a modern stack. Everything becomes a block, and created the `<BlockText />` editor, without `contentEditable`. The markup is directly HTML, for sake of simplicity, portability. But hard to parse. So they use a higher level language, with comments, to delimit the code.

```html
<!-- wp:plugin/hours -->
<table></table>
<!-- wp:plugin/hours -->
```

The benefits of putting everything a blocks makes it easy to specify the API and interactions, to handle errors with react error boundaries.

The `<RichText />` does use `contentEditable`, since it handles a lot of things out of the box, like the way you can write chinese characters with your keyboard.

## Nik Graf: ReasonReact

He describes Reason as a practical type safe programming language. It looks a lot like JS, have OCaml semantics, and compiles to JS. There is a really good way to combine it with GraphQL for instance, where you have perfect type safety, it checks the fields you request against your schema, and directly makes the link between the generated types and the data you use in your codebase. It's also possible with TypeScript or Flow, but there are manual steps you need to do, running a compiler, and imports the types. In ReasonReact it's free and automatic.

The strength of the type checker forces some differences in the design. For instance you cannot use a string as a children of a react element in ReasonReact. The type of a node is not `ReactElement | string | number | boolean | null | ...` like in JS, but in ReasonReact you'll have to use `React.string` that converts a string to a ReactElement. That's because there's no implicit polymorphism, you have to convert your types explicitly.

Reason also uses name parameters for component props, instead of object (records) like in JS. This is done to facilitate the life of your compiler. And lets you write components that are strongly typed, where you don't have to add any annotation!

Of course, there's a great type inference for hooks. And everything you can make with hooks in js, you can make it in ReasonReact.

As we all know, incremental adoption is super important. And now it's finally easy to get a bridge between your TypeScript and Flow and Reason types, using `genType`.

## Bryan Phelps: Native React with Revery

Struggled a lot with hybrid apps using electron, cordova. It was not achieving perf goals. So not enough native? But what is native ? Does this means using platform-native ui code? Like react-native. Or using native code? An app which compiles entirely to native code. Bridging from JS to native code, there is a perf cost. In a browser, you don't have the choice (apart from using wasm). But on a native platform, you could. We write JS because it's faster to write, to iterate on, but it's not as efficient as native code. So, could we use a native language?

Here comes Reason. He built Revery, a framework on top of Reason to compile to pure native code. But it's also possible to compile to JavaScript, and run you flappy bird app in the browser!

It doesn't compile to mobile, _yet_.

## Paul Armstrong: Move fast with confidence

To be able to move fast, you have to have confidence, to know that things work well.

Write code, submit code for review, run automatic checks and a short-life staging, merge to master, send it to an internal staging (dogfooding the most recent twitter for employees), then move to production. How you can accelerate this process?

Writing code locally faster

-   TTD
-   Lint
-   Auto-format
-   Type checking

Context switching is costly. For instance, learning that your CI failed 15 minutes after you pushed is not ok. Because you'll lose so much time. So you should use precommit hooks, to run your linter only on the code you changed (thanks to `husky` and `lint-staged`). Run jest only on tests related to your files, using `--findRelatedTests`.

Another thing, is to lower the time of your builds. They used the node inspector (`node inspect-brk`) on their webpack build, and went from 12s to 5s.

Want to track the evolution of the size of your bundle? Paul released [https://buildtracker.dev/](https://buildtracker.dev/) to track that!

He shows a graph of the evolution of the number of type errors in their codebase. Once they more or less reached the 50% of type coverage, they have almost no type errors any more.

## Julien Verlaguet: Skip

Skip is a programming language, with:

-   Built-in caching
-   Safe parallelism
-   GC with predictable pause time

Skip wants to take the best features of react, and create a language with these benefits. They wanted it to be able to build things incrementally, like compiling!

In skip, everything is immutable by default. Like in Rust, you can add annotations to declare some variables as mutable. It lets you have immutability at function boundaries. Inside of your function, you can mutate it, but what gets out of your function is an immutable object. It makes memoization super powerful (built in the language), since the runtime will only have to do a lookup in a hashmap to see if the function was already called with these parameters.

Skip comes with a function called `localGC()`, which you can call for instance in a loop. That means that GC is predictable, you can control how long the GC will take. And by default, the compiler adds it where it thinks its efficient. But if you want to take control on your performance, you can take over the GC.

## DJ Fresh: Coders are the new rock start

The guy starts with showing a video of one of his shows. It is impressive. I don't know him, but he seems to be a pretty big deal. Now he's working in machine learning.

He made [dogsonacid.com](https://www.dogsonacid.com/), a forum which was the biggest music forum at the time. **A programmer is a type of artist**. It's a nice talk, I see it more as a motivational one!

## My battery is dying, sorry for the last folks :'(
