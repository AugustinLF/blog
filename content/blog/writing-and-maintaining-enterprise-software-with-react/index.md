---
title: Writing and maintaining enterprise software with React
date: '2018-05-14T22:12:03.284Z'
description: A couple of things I learnt writing software enterprise
originalPost: https://medium.com/@Extia/writing-and-maintaining-enterprise-software-with-react-c2fac282f385
type: blogPost
---

Three years ago we started working on Extia’s own software, to support the organisation in its digitalization. I could describe our stack, explain how to use React, Relay, but many people already did so, so I’d rather tell you things I wish I’d have known earlier.

## Splitting apps, why?

Extia is an IT service company, and our apps are tailored for its needs. While we do not cover vital functionalities such as accounting, billing and administrative support (there was already something built), our perimeter is still significative. Today, we provide services to our salesmen, our recruiters and our consultants. The initial strategy was to build an app that would do everything. Turns out, it was not the best choice, and halfway through it, we decided that new functionalities should be built in other apps.

I won’t hide you that there are real downsides to that. Mainly, more apps implies more complex user workflows, but that’s a problem discussed in every “monolithic vs micro-service” article.

While there were business benefits toward this approach, they are probably specific to our situation, and you won’t take much from it. However, there are also technical benefits. As you might know, the React ecosystem is moving quite fast, and that was especially true when we started. Redux didn’t exist, everybody was cloning starter kits and living through webpack configuration hell, css-in-js was not a thing, nobody had heard yet of GraphQL, flow was at the version 0.14, functional components did not exist, and we just discovered HOC, since mixins got deprecated. Consequently, our app carries its share of legacy. We want to be able to choose new libraries, and not to be stuck with old decisions.

Building a new app lets us contain our legacy choices, and reap the full benefits of the newest technologies, while continuing our migrations. A lot of technologies work really well if you go all-in. For instance, while REST/Redux and Relay can cohabit together, this creates unnecessary friction. It is the same with a classic className/scss approach, and a css-in-js one. Or even more blatant, you lose a lot of type safety if several sections of your app are not flow typed. While it is possible to migrate, and while codemods can do a lot of work, it is not always possible to do everything at once, when your app consists in several dozen of thousands of lines of JS.

I’d like to emphasize that while it’s easy to see this problem as being the consequence of changes of libs/technologies, I think it is software life, your coding habits, your architecture changes with the time, and even if you stick with your libs choice, you’ll encounter the same problems.

But it is easier to make changes across several smaller apps than in a big one. Moreover, you can often afford to change only one app, and not all at the same time. This is especially important when you’re talking of bumping dependencies (for instance, we’re actually in the process of phasing out some libs that don’t support React@16 in our initial app), but nothing prevents us from doing this upgrade in our smaller apps.

Lastly, it makes it easier to experiment with new stuff. We went with GraphQL in our second app, to see how it goes, without having to commit too fast.

## Splitting apps, how?

When we decided to create several apps instead of one, we took the decision to work with a monorepo (a single git repository, for all our apps). We share code between our apps (UI components, domain logic, helpers), and instead of publishing it as an npm module, we put them in our repo. Why?

-   If you want to upgrade shared code, you have to change all the call-sites? It might seem tedious, but it forces all your apps to be up to date.
-   It makes reviews easier, since you can see in the same PR the function changes, and the call sites changes (and it makes obvious the reason of the changes).
-   The developer experience is nice, you just open your editor at the root of your project, and code! No need for multi projects, linking modules, publishing, etc.
-   This is made possible by yarn workspaces feature (we initially used lerna since yarn workspaces didn’t exist yet, but removed it), and it is an enjoyable way to work.

But there are technical downsides. First of all, tooling is not great. Yarn support for workspaces is suboptimal, there are no easy/efficient ways to run commands in other workspaces. Not everything works well with the symlinks used by the workspaces, I had difficulties with both flow and webpack. Secondly, yarn workspaces are a rather new feature, and you will struggle to find examples/help.

## Maintaining apps for years

After working on the same front-end app for almost three years, I can give some advices.

**Don’t use a UI a library.** If you’re project lasts long enough, and your design needs are specific (our style guide is close to Material, but not exactly the same), it won’t save you time. And it might make upgrades complicated (we depend on react-mdl, which is now deprecated and does not support react 16). Most UI elements are simple enough for you to build, and since you‘ll probably want to have some form of shared signatures, consistency, or some slight customisation, you’ll still have to write code. We went through two different libraries, and finally decided to do everything ourselves (or almost, tooltips are not fun things to code). Yes it works, but I don’t feel like it’s more work. And it frees your designers. They tend to love that!

**Invest in your tooling and your DX.** Since our repo is not a simple/standard one, we did have to work on our build systems (for the libraries and the “legacy” app, our new ones run on next.js, and it’s perfect). There’s a significative difference between “it works”, and “it works smoothly, it doesn’t frustrate the developers and saves them times”. At some point, we had a broken hot reload. Another time, we used to rebuild all our libs before running each apps. And we use to do two builds for each (a babel one, and a bundled one with webpack), since that’s how most libraries get published. But we dug a bit, and figured out that actually the webpack build was not necessary (since we do bundle directly the apps). Also that it was quite easy to do incremental builds (there’s a gulp util, called gulp-newer, which lets you know if a source file is more recent than the built one). And so on.

Most people don’t enjoy spending hours configuring webpack/babel, but it’s worth it. You really don’t want piss of team members. And, by the way, if your test tooling is not good, they won’t write tests (and that would be a shame, wouldn’t it?).

## And then?

I really enjoy working on this app. We lived through the so called javascript fatigue, and yes, we rewrote a bunch of stuff, but that’s life. And I never regretted choosing React (when we started, it was not yet and obvious choice).
