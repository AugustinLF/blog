---
title: The <TestProvider /> pattern
date: '2019-04-15T18:00:00.284Z'
description: How to make it easy to render your React components in your tests
---

When I started using React, the most common way to test components was to write unit tests using [shallow rendering](https://reactjs.org/docs/shallow-renderer.html). Shallow rendering renders only one level of components. It skips your components children. The main benefit of this approach is that it’s simple to write tests. You don’t have to worry about what is bellow in your tree. Don’t worry about your data fetching. And especially, don’t worry about the components connected to a redux store. But since, many people figured that such kind of testing was limited. It is bound to your implementation (read more about testing [implementation details](https://kentcdodds.com/blog/testing-implementation-details)). You add a component somewhere in your tree, and your tests break, even if nothing changed for your user. Moreover, it doesn’t assert that your user will see what they should see.

So we decided to move to integration tests. The biggest proponent of this is [Kent C. Dodds](https://kentcdodds.com/). He wrote about the [testing trophy](https://kentcdodds.com/blog/unit-vs-integration-vs-e2e-tests) (why integration tests matter), and even create a testing library, [react-testing-library](https://github.com/kentcdodds/react-testing-library), which prevents you from writing tests relying on the implementation of your code. If you’re still hesitating about integration testing, I can not recommend you enough his articles. But now that you’re convinced by the benefits of such testing, comes the hard question. But isn’t it harder to make integration tests than unit tests? Actually, not much more. When people write tests for component, they tend to write as little set-up as possible. Usually you’ll render your component. If the test break because somewhere in the tree a component is connected to Redux, then you’ll add a provider at the top. Or if you’re using [enzyme](https://github.com/airbnb/enzyme), you’ll [mock the context](https://airbnb.io/enzyme/docs/api/mount.html#arguments). But if the test doesn’t break, then there is no reason to add this provider. And I believe it’s not the best thing to do. I think it’s better to always add these providers (I say these, because depending on your app, you might need to add a router provider, something for your theme, your viewer, etc.). There are two reasons for that. The first one is that if adding all these providers is simple (teasing teasing), it’s more efficient than a try and retry approach. This can actually be even worse if you’re doing TDD, where adding a component will break all your previous tests. The second benefit is that it will make your test more resilient (which is one of the most underrated thing of a good test). Don’t you hate it when you’re adding a component somewhere in your app, and it breaks a dozen of tests simply because they don’t expect any connected component there? If all your tests are ready for any connected component, you won’t have bad surprises.

What if there was some way to make this set-up easy? Let me introduce you to:

## The TestProvider component

The concept is to put at the root of each components you will render in a test a single provider, that will inject everything you need, with sensible default, and an easy way to override any of the values put in the context.

Here is an example taken from a real world app I work with:

```javascript
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import configureStore from '../../application/configureStore';
import ResponsiveTestProvider from '../../components/src/utils/responsive/ResponsiveTestProvider.jsx';
import ReactAppContext from '../../context/ReactAppContext';
import ReactPageContext from '../../context/pageContext';
import appContext from './mockAppContext';
import pageContext from './mockPageContext';

const TestProvider = ({
    breakpoint,
    children,
    appContext,
    pageContext,
    initialState,
}) => {
    const defaultContext = { ...appContext, ...appContext };
    const defaultPageContext = { ...pageContext, ...pageContext };
    const store = configureStore(initialState);

    return (
        <BrowserRouter>
            <Provider store={store}>
                <ReactAppContext.Provider value={defaultContext}>
                    <ReactPageContext.Provider value={defaultPageContext}>
                        <ResponsiveTestProvider breakpoint={breakpoint}>
                            {children}
                        </ResponsiveTestProvider>
                    </ReactPageContext.Provider>
                </ReactAppContext.Provider>
            </Provider>
        </BrowserRouter>
    );
};
export default TestProvider;
```

Then, in your tests, using `react-testing-library`, you'll write:

```javascript
import {render} from 'react-testing-library';

import TestProvider from '...';
import MyComponent from './myComponent';

it('Should have a label, () => {
    const {getByText} = render(<TestProvider><MyComponent /></TestProvider>);

    expect(getByText('Submit')).toBeTruthy();
});
```

If you pay attention to the implementation of the TestProvider, you’ll observe that each value that is set in the context has a default, and can be overridden. For instance, we have a mock of the global context of our app:

```javascript
// mockAppContext.js
const mockAppContext = {
    abTestVersion: 'b',
    locale: 'fr-FR',
    cmsRelease: 'live',
    // …other stuff of course
};
export default mockAppContext;
```

But if we want to write a test where we simulate an Italian user, we’ll do `<MockProvider appContext={{locale: ‘it-IT’}}><MyComp /></MockProvider>`. And the great thing is that we did not have to set the properties `cmsRelease` and `abTestVersion`. And of course, this can work with any other property that your test might specifically need.

## Drawbacks to the TestProvider pattern

I don't believe having to use an extra `import` in each test file is a problem. It'll get automatic at some point, and you won't even think of it. A real issue could be the risk of slowing down your tests. While I don't think the extra rendering should be an issue, you should be wary of the extra imports. If, for instance your `<TestProvider />` imports the configuration of your redux store, it'll import all the files required by all your reducer. And through the game of transitive dependencies, it might actually require a lot of your app code. And that might slow things down (where I work, we observed that most of the time spent in our tests is through some imports). So be careful, perhaps don't require your store, but use a default dummy one, which could be sufficient for most of your tests. And when you'll need your real life set-up, import it in the test file.

Some might argue against such abstraction. I've read a lot that too much abstractions in your tests will make them harder to understand. While I agree that, to some extent, you want to avoid unnecessary abstraction, I don't believe that is the case here. The `<TestProvider />` will actually help the reader to focus on what matters in your test, while the setup boilerplate can be a distraction. If you're interested in reading more about abstraction and tests, I cannot recommend enough Kent C. Dodd's latest blog post, [AHA testing](https://kentcdodds.com/blog/aha-testing).

## Conclusion

The `<TestProvider />` is a way to write integration tests more easily, and focus on what matters in your tests (i.e. what you're testing), not fighting to be able to render your components in your tests. Actually, my initial intention, when I wrote my first `<TestProvide />`, was to convince my colleagues to write more integration tests. Full DOM rendering can be a pain, and I hope that this will make it easier for you.

And to finish, I would like to give a shout-out to Kent C. Dodds. He didn't inspire this pattern, but that's probably one of the few test practices I have that he did not inspire. So follow him, he will give you good advices.
