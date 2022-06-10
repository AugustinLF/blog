---
title: Going down the rabbit hole
date: '2022-06-10T18:21:00.284Z'
description: When to dig deep, and when to stop
type: blogPost
---

An essential part of growing as a junior developer is figuring out how to scope things. When tasked with fixing a bug or building a new feature, you need to figure out your responsibilities. What is out of scope? In any non-trivial software project you can spend weeks improving things without ever seeing the light at the end of the tunnel.

As you get more experienced, you learn to pick your battles. An important call to make is when complexity is getting out of hand. Let’s imagine you found an edge case in your tooling where some errors are swallowed and not visible to the devs. Something to fix! But as you start investigating, you realise that one of your dependencies is responsible for this problem and that another team maintains it. And you have no idea how it works.

Should you keep going? This error message is not your responsibility. You were looking for quick improvements to do between tickets. And you can’t afford to spend three days on that. Here, the responsible decision is to stop. Or is it?

I want to argue that you should go down the rabbit hole, once in a while. First of all, if you don’t do it, no one will. And while this error message is not the end of the world, there are hundreds of devs in your organisation and many of them will encounter this very same problem. The long term benefit is clear, but also think about indirect gains. You tend to learn a lot about systems and tools you’d usually not work from these rabbit holes and I’ve observed that a broad knowledge about the project I work on has been a critical factor in my productivity. I’m a UI engineer, but some bundler experience will never hurt.

So, where does that leave us? What’s the TL;DR? Learn how to scope, but do indulge yourself sometimes and pick up some new skills on the way. Without that, some stuff will never get done. Always make sure your team is ok with that and that you’re not putting anyone in a challenging position though. They’ll be the ones who’ll get you out of the rabbit hole if you go too deep.
