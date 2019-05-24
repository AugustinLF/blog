---
title: React-Europe day 2
date: '2019-05-24T18:00:00.284Z'
description: Recap of the talks of the day 2 of React-Europe
type: blogPost
---

## John Watson: i18n at Facebook

He presents us [fbt](https://facebookincubator.github.io/fbt/), which does look elegant. It handles plural, genders out of the box. As some might know, gender and plural are hard. They impact so many things, like gender in verbs in certain languages, plural of nouns, pronouns. It's a bit hard for me to see the selling point when you compare it to usual i18n libraries, but it does look great.

A framework using placeholders like this one actually lets you use its capacities for other things, for instance, a `let's share this ${video | photo | ...}`.

## Ives van Hoorne: On CodeSandbox

They managed to implement support for any vscode theme in codesandbox. For that, they used the theme of `styled-components` without much difficulties, since a vscode theme is simply a json, and you'll have to put it in the context. The trick was supporting syntax-highlighter. The best solution for syntax highlighting uses `oniguruma`, a C library, but porting C to web is super complicated, but they managed with web assembly, building a lib called `onigasm`.

But what about extensions? So he checked how it works in vscode: they use another node process for the extensions. Another thing is that extensions don't directly have access to the UI, this is done itself by the vscode process. So, how could it work in codesandbox? CodeSandbox doesn't run vscode. A first idea was to create a bridge between CodeSandbox and the Extension Host (the other node process). But it's super complicated to do, even if it's probably the best solution. Another solution, running vscode in the CodeSandbox? But then you'll have to stub all the modules depending on node (`fs` and so on). But instead of that, Ives went a step higher, vscode is composed of services, and can be swapped out. So he decided to rewrite the services depending on native modules. To make it possible to be able to update the code of vscode, one of their constraints was to only add code, to be able to handle merge conflicts.

After finishing his internship at Facebook, he chose to go for CodeSandbox full-time, they raised a seed fund and grew the team to six people.

## Brandon Dail: Scheduling is the future

Everybody wants to use the CPU, so it's important to not have too much blocking computation.

Why not make React faster? Parkinson's Law: `work expands so as to fill the time available for its completion`. Or in finance, `the more money you make, the more money you spend`. Coming back to React, you have the same issue, we'll always have this spending problem. Making React faster might solve the problem on the short term, but not on the long term.

A scheduler helps us to make a budget for performance. Something faster doesn't necessarily means that the user will perceive it as faster. Some small things won't be noticed by the user, so that's not what needs to be optimised. User-blocking code, on the other hand, needs to be as fast as possible.

Facebook showcased at F8 a runtime tool that checks for accessibility issues. It's something that is by definition slow. This sort of computation not a priority, a scheduler will only run it if the CPU is not busy.

A scheduler does not only solve React problems, but UI problems in general. Which is why Facebook aims to publish the scheduler that react uses as an npm module, that react would depend upon.

A problem is that right now, the browser doesn't provide the good low level APIs for scheduling, so any user-land scheduler (like the react one) misses a lot of context from the browser.

Facebook proposed its first browser API, `navigator.scheduling.isInputPending`, which lets react check if it should yield back to the browser so it can process inputs, instead of having to yield periodically, even if it's not needed, which has a cost.

## Lightning talks

### Lisa Gagarina on "testing"

-   Use static analysis (typings, linters) to avoid having some useless tests
-   Get more value from snapshots by making them smaller, more focused. Use them for small static components. Use inline and diff snapshot. But you can use them for other things than react components.
-   Build up confidence with your tests. A test should not fail when you do a change that doesn't change anything for users. All tests should resemble what your users do, and don't touch the implementation. She uses `react-testing-library`, which makes writing good tests easier.
-   Use end-to-end tests

### Jonathan Yung on “Building and Maintaining Accessible Experiences at Scale”

If you remove all the style and icons, what is left for screen-readers? Text. And sometime there's no text. So you'll have to do more. Accessibility is not a problem of time and priority, but awareness. For an upload button without an icon, you'll have to use an `aria-label`. Facebook uses a runtime check to display nodes with problems with accessibility.

## Richard Threlkeld: Security and Data in React

It starts as a pretty technical talk about ways to authenticate users, from not sending passwords through the network thanks to fancy maths and prime numbers, to oauth or oidc. But what if someone tries to impersonate your app? Use [Proof Key for Code Exchange](https://www.oauth.com/oauth2-servers/pkce/), standard in native, starting to be used in SPAs. Honestly, it's super complicated to write notes about this talk, there are a lot of schemas, and it's a complicated topic, so I advise you to check the video when it'll be online!

Often you'll find that authorisations can look like a graph. For instance, only my friends can see my data. This is something that GraphQL is great for, it becomes super interesting and powerful to build authorisations through the graph of your schema. You can also use schema directives to have finer grained control on these authorisations. For instance, only the owner of this node should be able to access it.

TL;DR

-   securing our apps is hard
-   client environment and state are untrusted
-   authorisation rules & scenarios are complex

## Charly POLY: Build forms with GraphQL

Developed [Frontier](https://github.com/frontier-forms/frontier-forms). Based on `final-form`, it can also generate automatically all the fields, based on the shape of the inputs. It's an interesting take on coupling a form library and graphql schemas. Since you know what your schema is, it gets pretty straightforward to know how to generate a lot of things, from validation to rendering.

Personally, I'm always a bit sceptical of these types of libraries, which I feel brings a lot of friction for complex cases. But there obviously a market for these kind of libs. And perhaps (and I hope I'm wrong), that this library will become powerful enough to handle all sorts of edge cases.

## Mike Allanson: Lightning talk "Performance By Default: Make the Right Thing the Easy Thing"

How can you do that? Encourage your user to take the recommended way, and make the recommended way fast. Create layers of learning, which means that you don't have to understand everything to get started. Hide the complexity. See https://lengstorf.com/progressive-disclosure-of-complexity/.

## Lee Byron: On GraphQL

It's a super meta talk, about how the web evolved and how we can see a lot of similarities between the way things were built on the LAMP stack, and what we're doing now, showing a bit of the evolution of technologies at Facebook. But it's really hard to summarise, so you should watch the talk when it'll get out. It's mostly about how the web evolved with better abstractions, better syntax, and improved mental models.

For instance, about rendering views. We started with templates, which had the problem of evolving in weird hybrid program languages (PHP), or limited template languages (mustache). And this was prone to security errors (sql injections etc.). At Facebook, they created a library that let you build components. But it was much more verbose than writing directly html. So they added a syntaxic sugar around that, which looked like XML, XHP. It actually look a lot like React components, but in PHP.

Initially, React was built without JSX, but with the habits that people had at Facebook, they created JSX.

So now we got back to something that is pretty close to the comfort and ease of use of PHP, but without the drawbacks that existed at the time.

## Evan Bacon: On React Native and the web

Really impressive talk where he shows us how it's possible to ship expo apps built with react-native on the web. But it took a lot of work. It's not there yet to have real apps, but it's good enough to prototype on the web. And it generates a PWA with a new manifest at each build.

It should be available in a couple of weeks, he rebuilt a lot apps he could find just to test it out. All his games, an instagram clone, the React-Europe app. He made a PR to CodeSandbox so you'll be able to build expo apps in CodeSandbox.

## Ankita Kulkarni: Accessibility 360 - Web to Mobile

Remember that accessibility doesn't only concern people with permanent disabilities. Someone with a broken arm, or a parent holding a baby are not able to use both hands to navigate their phones.

We often talk about screen readers on the web, but there is also voice-over on mobile, don't forget that anything you do on the web to make your app accessible, you can do it also in `react-native`. Some props are different, you'll have `accessibilityLabel` for instance. You can also use eslint plugins for both native and web that ensures that you don't miss important properties.

Also don't forget to pay attention to animations, especially if your user configure their phone to _reduce motion_, you should reduce or disable your animations.

## Maël Nison: Yarn 2

Yarn brought a lot of things to the table. Guaranteed strictness through lockfiles. Workspaces, initially invented by lerna. Great developer experience (automatic conflict resolution, `yarn` vs `yarn run`).

Why a v2? The architecture had some legacy, because of big features added, and the fact it was based as a clone of npm. But they also wanted to make the architecture more accessible, so that the community can contribute.

What's coming?

-   Better logging (color, error codes)
-   `yarn dlx`, like `npx`
-   interactive mode, which for instance will suggest you to use the same version of a dep than another package of your workspace
-   constraints: eslint for your all your `package.json`. For instance, enforcing the same version of a dependency in different packages (thanks god, I've been waiting for that for so long)
-   zero-installs -> you should never have to run `yarn install`. Thanks to PNP and committing zip archives, switching branches will be so much easier. And no risks of `yarn install` failing in CI.

Yarn v2 will be dope.

## Tim Neutkens: Next.js

Tim presents us with a couple of new things coming in Next.js. Now in Next.js you can finally handle pages with url parameters, by default `pages/products/$id.js` will match to `/products/:id`. There is also the possibility to opt-out of SSR, AMP. Pages that don't need specific data will be automatically static. The great thing is that it's easy to compose all these strategies for pages in one Next app.

Now you can also create API endpoints directly in Next.js (WOW). It also supports TypeScript out of the box now.

In the future, the build should work like with yarn. Don't rebuild pages that did not change. So rebuilding an app of 100s of files should be almost instant.
