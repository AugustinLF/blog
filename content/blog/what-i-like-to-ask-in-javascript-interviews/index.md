---
title: What I like to ask in JavaScript interviews
date: '2018-08-24T22:12:03.284Z'
description: Interviewing is super interesting. But not easy. Here are some things that helped
originalPost: https://medium.com/@AugustinLF/what-i-like-to-ask-in-javascript-interviews-414253027719
---

About a year ago, I started interviewing junior developers for front-end positions. We work with a “modern” stack (react, graphql, node and so on), but knew it would be hard to find people with this experience. Training people to use React is not a problem, but we still do expect a certain understanding of JavaScript. We met people who use JavaScript, but never dug into the language. Some are just discovering the language, many come from other languages and learnt to use JS on the fly.

This article should interest you if you’re starting to interview people (since these are relatively standard questions), or if you’re a junior developer preparing for interviews.

## Focus on commonly used APIs

I like to start by asking “What is a Promise?”. Often, the person will start talking about HTTP calls, fetch or REST. That can be a sign of someone using but not understanding exactly their purpose. I expect people to have some form of understanding of the tool they use, and not being able to make the difference between the tool and what its uses are, is not good. I also ask the interviewee if they know other patterns/features that can used instead of promises (e.g. callbacks, async/await, observables). What I like with this follow up, is that it indicates that the interviewee follows the evolution of JavaScript. For instance, I don’t think that knowing how to use observables is important, but knowing that they exist and how they work is at least a sign of curiosity.

Depending on how the previous questions went, I can go easier, or not. If the person failed to answer, following up with an easier one have several benefits. If the person cannot answer either, it’s a strong sign that the person is just discovering JavaScript. On the other hand, most of the time, they will find answers, which will make they more confident. Starting an interview with a stream of questions you cannot answer is hard for the morale.

As an easy question, I ask to cite some functions of the prototype of Array (some, reduce, map, etc.) and how they work, features of ES2015/2016 (I often also ask if an object assigned with a const is mutable and the difference between an arrow function and a normal one (hint, it’s the `this`)).

I have several “harder” questions, and most of them are related to “how the language work”, rather than “what is this obscure JS API”. There are so many ways to write JS, so many libraries, and so many APIs, that I don’t think that knowing them (or not) is important. There was a thread on Twitter a bit ago of famous senior developers telling what were the basic APIs that they would google everyday when coding. For me, it’s slice and splice. I cannot remember the difference, and how they arguments work. But does it really matter? I can check it in thirty seconds.

I also used to ask for languages quirks, but I’m less and less convinced it’s important (e.g. `0.1 + 0.1 + 0.1 !== 0.3`, `typeof null === 'object'`). No strong feeling about that.

## How JS and the DOM work

Now comes the time to check if the interviewee understands how the language work. What is the scope of a function (this can be introduced with a question regarding closures)? What is its context (or what is the role of the function bind)? How does inheritance work in JavaScript, and how does the prototype chain works? What is event delegation/propagation? How does the event loop works? The first time I was asked the previous question, I didn’t exactly know where to go or what to explain. The interviewer then asked me what happens when there’s a why infinite loop (a while true). Here what we want to understand, is that it blocks the main thread, and also blocks the UI, preventing any user interaction.

These questions are framework agnostic, and these show that the interviewee wants to understand why JavaScript works this way. I believe that this is one of the strongest sign of the “potential” of a junior developer, and how good they’ll be at learning new things. Having specific experience, side-projects, being aware of the latest libraries is good, but mostly indicates free-time(not everyone can afford to work on their free-time, and I don’t expect that from my coworkers).

If you think I’m missing something, or if you know other questions, I’m all ear!
