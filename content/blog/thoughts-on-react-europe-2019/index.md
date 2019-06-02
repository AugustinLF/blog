---
title: Thoughts on ReactEurope 2019
date: '2019-05-25T18:00:00.284Z'
description: More about some talks I enjoyed at React Europe 2019
type: blogPost
---

ReactEurope just finished, it was a blast! I published two articles, quick recaps of [day 1](https://augustinlf.com/react-europe-day-1/) and [day 2](https://augustinlf.com/react-europe-day-2/). These are quickly written articles, thought to give you quick recap of the talks, so you can catch up with the news, or decide if you'd like to watch it. This article will reflect my thoughts on some selected talks.

## Talks I enjoyed

I'll give a brief summary about talks I particularly enjoyed, and where I learnt things.

### [Nik Graf](https://twitter.com/nikgraf): A Hitchhiker’s Guide to the new ReasonReact

[Link to the talk](https://www.youtube.com/watch?v=VxJnNeHpUzc).

Nik gave a really accessible and interesting talk about Reason and ReasonReact. I didn't check Reason for a while (a year or more?), and it's interesting to see how the syntax moved closer to JS, making the language easier to grasp for people coming from a JS background. I learnt a bit of OCaml, and while I found the language interesting, I need to admit that its syntax is really terse.

What struck me was the DX. The whole integration seemed to be on point, the typings read from graphql queries work great. In my opinion, the ease of adoption will be the deciding factor. When I tried ReasonML a year or so ago, the toolchain was still not there yet. But if you're telling me that tomorrow I can add Reason files in my codebase without any pain, I might do it. For instance, the use of [genType](https://github.com/cristianoc/genType) that makes a Reason/Flow or Reason/TypeScript bridge easy to use should be strong selling points.

### [Paul Armstrong](https://twitter.com/paularmstrong): Move fast with confidence

[Link to the talk](https://www.youtube.com/watch?v=ikn_dBSski8).

Paul showed how Twitter worked to improve the DX of the devs working on the web application. A key point was to help the devs get feedback faster, by helping them to spot errors that would fail the CI without having to run their whole test-suite. A strong helper was the use of precommit hooks, that would run the tests or the linter on the changed files.

Using Flow helped them to significantly decrease the number of type errors (`undefined is not a function` and other similar errors). Once they reached 50% of type coverage, they got rid of almost all of this category of runtime errors.

### [Brandon Dail](https://twitter.com/aweary): Scheduling is the Future

[Link to the talk](https://www.youtube.com/watch?v=Iyrf52cwxQI).

I love higher level talks. This one was not an exception. The main argument is that however you’ll make your framework or your code fast, it won’t be fast enough. It’s the same with money. The more you have, the more you spend. Making things faster works on the short term, but that’s it. At some point you’ll need to prioritize which code should use the CPU resources. And that is the role of a scheduler. That is one of the reason of the React’s rearchitecture, React Fiber. Indeed, a condition was to be able to interrupt rendering.

But this scheduling issue is not a React problem. It's a web problem! Which is why the React team intends to externalise the React's scheduler and publish it on NPM. This would let anybody gain _super scheduling powers_.

In an ideal world, the browser would expose a scheduling API, or more details for user-land schedulers to get smarter. Right now, there's no real way for a JS library to know what is the CPU busy with. It has access to `setTimeout`, `requestAnimationFrame` or other similar APIs, which makes scheduling possible, but it doesn't go as far as it could. However, there is work being done on that, to expose some sort of scheduling API.

A first example of that, proposed by Facebook dev teams is the `navigator.scheduling.isInputPending` API. As you may know, user inputs are one of the top most priorities for any UI framework. Many things can wait but any good scheduler would give total priority to any use input. With the current APIs exposed earlier, to avoid long blocking computation, the scheduler would have to regularly yield back to the browser to let it handle any user input. But yielding back, when not needed is costly. So they proposed this `isInputPending`, worked it out with the Chrome team and and implemented in Chrome. This lets the scheduler query the browser to know if there is currently an user input pending, and if positive, yield back.

### [Lee Byron](https://twitter.com/leeb): The Future of the Web

[Link to the talk](https://www.youtube.com/watch?v=NcAYsC_TKCA).

Lee likes to tell stories. If you only care about best practices, or new technologies, APIs, you won't learn anything. But if you're curious about the evolution of APIs, and how we ended up with things like JSX, colocation of data fetching and UI (Relay and GraphQL), this is the right talk! Facebook is a LAMP stack (Linux Apache MySQL PHP). So a lot of developers, who designed these libraries and framework we use now have been influenced by their use of PHP. Just check the video, it's nice, and the storytelling is good.

### [Maël Nison](https://twitter.com/arcanis): Yarn 2 - Reinventing package management

[Link to the talk](https://www.youtube.com/watch?v=SU0N4y8S1Qc).

When Yarn got released, it was game changer. Install times improved significantly, we got a deterministic resolution of packages versions. And it also pushed `npm` to adopt some of these features, making the ecosystem better by itself. But yarn continued to improve with new features, such as workspaces for monorepos (pioneered by lerna), or `Yarn PNP`, which help you to get rid of your `node_modules` by centralising all your modules globally on your machine. But Yarn intends to get better. To do so, it went through an architecture rewrite. First of all, it improved the codebase which was created before these features. But it also moved to TypeScript, to make Yarn more of a community project and encourage newer collaborators to work on the project.

This paves the way for new features. Logging improved, with the help of colours and error codes, which will help you to find online help more easily. `yarn dlx` will work like `npx`, which is a package that lets you use any global npm package without having to globally install it. You run `yarn dlx jest`. The first time it'll download it and run it. Second time, it'll read it from a cache and directly run it. No more need to mess up your global `$PATH`. Or an interactive mode when installing a module. `yarn add jest` will prompt you to choose a version. I'll suggest you the latest one, but also the one already installed in your app if you're using workspaces. I don't know for you, but I always have to check what is the version we're currently using in our packages, then copy/paste it. And if you don't pay attention, you'll risk of installing several versions of a package in your app, which is usually unideal.

Since having several versions of a package is bad, what if Yarn could prevent it? And it will! This new feature is called `constraints`, a set of rules you can add to your app configuration, that would for instance prevent Yarn from installing two versions of the same package. You can see it as an eslint for all of your `package.json`.

But the biggest change is the direction continuation of `PNP`, getting rid of `node_modules`. And getting rid of `yarn install`. Crazy right? The idea is to commit your dependencies. Today it's not doable because that would imply committing hundreds of thousand of files. But Yarn will now use `zip archives`, so you'll commit one file per module, which doesn't pose any scale problem. What does this imply? Your initial `git clone` will be a bit longer since you'll have to check out more files, but this won't have to be followed by a `yarn install`. So it'll be much faster. And more importantly, no need to run `yarn install` when switching branches. No need to run the famous `rm -rf node_modules && yarn install` command, because it won't screw up. No need to have several copies of the same repo on your machine for context switching. No need for the usual conversation:

-   master doesn't work on my machine, any idea why?
-   Did you run `yarn install`?
-   Huhhh, let me check
-   ...
-   Oh it's fine, it works

And who says no `yarn install` when checking it out, means no `yarn install` on your CI. So faster CI, and fewer point of failures.

Personally I am extremely positive about that. I think it'll make our lives much better. And I have faith in Maël. I heard him talk a few months ago when he released PNP, his vision about `node_modules`, installs seems to be on point.

### [Tim Neutkens](https://twitter.com/timneutkens): So you want to build a web app?

[Link to the talk](https://www.youtube.com/watch?v=WKJVXN2kMS8).

Final talk of the conf, Tim, lead maintainer of `next.js`. I've been looking for this talk, since I'm an active user of Next.js. And he did deliver! There are a lot of new features coming up. You might have seen with the latest release of `next.js`, that a significant features available now is to use the benefits of serverless. Each page now being a lambda function. Going forward with that, it will be possible to have parametrized routes (`/products/:productId`). This have been a major pain point for users for years, but now it'll be supported out of the box, while still using a file based routing. This `/products/:productId` page will be found in `./pages/products/$productId.js`. It will also get easier to have different rendering strategies for each page. If you want some pages to be static pages, some other to opt-out of SSR, or other to be `AMP` compatible, it'll be easy to do so. And now, pages without dynamic queries will automatically built as static pages.

Another important use of custom servers was co running an API on the same server. Still benefiting from the serverless architecture, it'll be possible to add API endpoints directly in your page folder. Which will be built though webpack without any effort from the user. A `GET /api/user` endpoint will be in `./pages/api/user.js`. The endpoint file being a simple lambda function, like the one you'll find with common frameworks.

Wznt other goodies? Next.js is now being rewritten in TypeScript, it has TypeScript support out of the box. Instead of creating a `./pages/home.js`, create a `./pages/home.ts`, or `./pages/home.tsx`. Another plan is to improve the efficiency of builds. If nothing changed, running `next build`, should be fast, right? It'll be instantaneous.

I actually got the opportunity to talk with him after the talk. A lot of effort has been spent recently on getting serverless to work with Next. Now it works but the main blocker is that a lot of people use custom servers. So Tim would like to help us to get rid of those. You'll notice that two of the new features help for that. Custom routes and API are two of the main reasons people use custom servers. So what are the others, and how could we get rid of them? This is one of his interrogations. Middlewares are another issue. I'm not totally sure if there's a plan for that, since he believes that most things done by middlewares can be simple done by requiring these functions where they're used, without having to load them upfront for all routes.

## Honorable mentions

These are talks that are harder to categorise, I'm not totally sure if what I can take from them, but that I enjoyed nonetheless!

### [Julien Vergalet](https://twitter.com/jverlaguet): Skip

[Link to talk](https://www.youtube.com/watch?v=zXqrxQ5AL6I).

Julien presents Skip, a programming language developed at Facebook, whose main features are:

-   Built-in caching
-   Safe parallelism
-   GC with predictable pause time

I enjoy language talks, but it's always harder to know what to do from them, since it's unlikely I'll end up designing one!

### [DJ Fresh](https://twitter.com/DJFreshUK): Coders are the new Rock Stars

I'm sorry I can't find the links to the talk right now :/

DJ Fresh is one of the founders of the Drum and Bass scene. He gave us a motivational talk, full of nice vibe, with a lot of humour and great storytelling. Not sure I learnt something that'll help me to get better as a programmer, but it was definitely an enjoyable talk.

### [Ives van Hoorne](https://twitter.com/CompuIves): On CodeSandbox

No link yet!

Ives announced at the beginning of his talk that this talk would be like last year. We got to hear about his life and what happened for CodeSandbox since last year, the balance between the internship and the side project, and a few of the features recently released, and the technical decisions behind them (and there's a bit of wasm!).

## To wrap it up

No surprise, React Europe 2019 was a blast. Perhaps fewer big woah demos, less big announcements than other years, but interesting!
