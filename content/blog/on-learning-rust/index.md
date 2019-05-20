---
title: On learning Rust
date: '2018-05-16T22:12:03.284Z'
description: First impressions after learning a bit of Rust.
originalPost: https://medium.com/@AugustinLF/on-learning-rust-69ba956a63e3
type: blogPost
---

I solely code in JavaScript, focusing on front end stuff. It gets a bit boring, so once in a while, I try a new language. I tried OCaml a year ago, and got really impressed by the powerful type inference, and really liked the functional features (pattern matching, pipe operator, maybes), but I found the developer experience underwhelming. People complain about npm and webpack, but I felt extremely powerless when trying to properly build an app (I was interested in learning OCaml, not makefiles and a compiler toolchain) with dependencies (which gets necessary quite rapidly since the standard library is pretty small). Moreover, the syntax is hard. I guess you get used to it, but it requires a lot of energy to understand what that code block means (I guess that ReasonML is an improvement there). So I got frustrated and stopped playing with it (the lack of “things to do with OCaml” probably didn’t help).

But recently I decided to give Rust a go. And I must admit that I’m extremely surprised. Rust, like OCaml is a pretty low level language (it is a system programming language). After six years without seeing any pointers, I can’t say that I was happy. But the Rust compiler, by being extremely safe actually makes that easy.

## The DX is good

In Rust you have one command. Cargo. You use it to install external packages (crates in the Rust world). You use it to build/link your code. It also runs your tests. You can also publish your own crates. After years of juggling between yarn, npm, Babel, webpack, rollup, jest and co, it is a pleasure. And it just works. And you don’t have this terrible experience of OCaml version not compatible with this package, and your Makefile not working (because you probably didn’t write one since school).

And the idea of writing your unit tests in the same file as your application code seems appealing. The language being a compiled one, since you add annotations for your tests, the related code won’t be compiled for when releasing your app.

```rust
pub fn add_two(a: i32) -> i32 {
    a + 2
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_adds_two() {
        assert_eq!(4, add_two(2));
    }
}
```

## The language is powerful

I felt like coding with an extra smart, but comprehensible language. Perhaps the [Rust Programming Language](https://doc.rust-lang.org/book/) (I used the second edition) does a better job than [Real World OCaml](https://realworldocaml.org/) to introduce you to the language, or perhaps going through OCaml first helped me (quite likely though), but I found the language easier to apprehend. For instance, the variant system seems much simpler.

Rust is immutable by default (thanks god), but offers an easy way to makes things mutable, and it’s at call site, which I find really elegant (compared to [flow](https://flow.org/) for instance, where you tag fields as read-only).

```rust
struct User {
    age: i16,
}
let mut mutableUser = User {
    age: 18
}
user.age = 17
```

Rust heavily borrows from functional languages. For instance here a pattern matching over variant:

```rust
enum Message {
    Quit,
    Write(i8),
}

fn handle_message(message: Message) {
    match message {
        Message::Quit => { println!("Quit"); },
        Message::Write(input) => { println!("{}", input); },
    }
}

handle_message(Message:Quit);
handle_message(Message::Write(7));
```

## The compiler is here to save you

Like with any other statically typed language, the Rust compiler is designed to prevent runtime errors, when they can be caught. At compile time (and it’s a good thing, the feedback is much faster, and it means less bugs in production). First of all, the compiler will catch the classic type mismatches. If it compiles, it probably works. And that’s something that I like.

When mixed with features like Options, it will also help you to properly handle your errors, the compiler will throw an error if you don’t handle all the errors.

```rust
let f = File::open("hello.txt");

let opened_file = match f {
    Ok(file) => file,
    Error(error) => {
        panic!("There was an error opening the file: {:?}", error);
    },
};
```

Rust offers tools to help you write code in “debug mode”. Indeed, when prototyping, or exploring a solution, proper error handling might hold you back, unwrap can help you go faster. The previous code can be replaced with `let f = File::open("hello.txt").unwrap();`, which would mean open the file, if doesn’t work, exit the program.

But where Rust really shines, compared to other languages, is its ownership system, which I believe is unique (or at least in mainstream languages). Rust doesn’t have a garbage collector and doesn’t ask you to deallocate manually your memory. It handles the memory by dropping the memory as soon as a variable goes out of scope. A consequence of that is that Rust doesn’t let you reuse a variable if you pass it to a function, you can’t pass it to a second one. This seems extremely inconvenient. Firstly, remember that when writing in functional style, with pure functions, it’s not that common to need to use the same variable twice. Secondly, Rust obviously offers an escape hatch, by using references.

But who says references, says bugs. And the beauty of the compiler is that it can prevent them. For instance, if you use a mutable reference to a variable, the compiler won’t allow you to use any references to this variable, to prevent data races.

A benefit of this strictness in the language is that it makes it much simpler to write parallel/concurrent programmes. Rust calls it “Fearless concurrency”. Its compiler will catch most of your parallel code bugs (on that, I’ll trust the Rust book, I have little experience with parallel Rust). And we know how hard it is to write parallel code.

## My critique to rust

Firstly, the language is extremely strict. It cares about correctness, probably more than you. Which means that there is code that you know will work, that won’t compile. So you’ll have to write your code in another way. I would call that a feature more than a problem, I don’t mind if a compiler. It wants me to write more idiomatic code, but not everyone would agree with me. This strictness can be a problem with the ownership system, because ownership is hard. Really hard. And not intuitive (it probably gets better with the time, but that’s a common complaint I read about Rust). However, you could also say that Rust puts the difficulty upfront (i.e. at compile time). Writing a valid and complex program is really hard, you just usually end up spending less time at the beginning, and more fixing bugs.

Another issue I have with Rust I that there is a lot of sigils, I know some people tend to like them, finding them more efficient to write, but I feel it makes the code less clear. For instance, this is the slice of a string `&s[0..i]`. This is a function with a lifetime parameter `fn first_word<'a>(s: &'a str) -> &'a str {}` . Nothing impossible to learn, but it’s definitely not easy for a beginner.

And I like the JavaScript system for modules, where you import things and use them, whereas in Rust like in OCaml, you open a module, and it enhances the curent namespace. It makes it harder for newcomer to understand where things come from.

Lastly, the compiler errors are not user friendly enough. They are precise, but could be easier to understand. It isn’t [Elm](http://elm-lang.org/)’s errors . Perhaps someone will make a better Rust errors, like [Facebook did with OCaml and Reason](https://github.com/reasonml-old/BetterErrors)?

```
error[E0369]: binary operation `>` cannot be applied to type `T`
 --> src/main.rs:5:12
  |
5 |         if item > largest {
  |            ^^^^^^^^^^^^^^
  |
  = note: an implementation of `std::cmp::PartialOrd` might be missing for `T`
```

## Closing thoughts

I’m just scratching the surface of Rust, didn’t built anything non trivial with it, but I feel it’s something worth learning. It’s intellectually interesting, but without the pain coming with OCaml. It’s extremely powerful, and the bonus is that it compiles to [web assembly](https://github.com/rustwasm/wasm-bindgen). So even if you’re just a front end dev like me, it might be useful! If you’d like to talk more about Rust (or any other stuff), hit me on Twitter, or if by any chance you’ll be at React-Europe 2018, don’t hesitate to chat!
