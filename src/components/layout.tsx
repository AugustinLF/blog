/** @jsx jsx */
import { Global, css, jsx } from '@emotion/react';

import Header from './header';

type LayoutProps = {
    title: string,
    children: React.ReactNode,
    noTopPadding?: boolean

}
const Layout = ({ title, children, noTopPadding }: LayoutProps) => (
    <div>
        <Global
            styles={css`
                body {
                    font-family: sans-serif;
                    font-size: 16px;
                    line-height: 1.75;
                    margin: 0;
                }
            `}
        />
        <Header title={title} />
        <div
            css={css`
                margin-left: auto;
                margin-right: auto;
                max-width: 49rem;
                padding: 2.625rem 1.3125rem;
                ${noTopPadding ? 'padding-top: 0;' : ''}
            `}
        >
            <main>{children}</main>
            <footer style={{ marginTop: 'auto' }}>
                © {new Date().getFullYear()}, Built with
                {` `}
                <a href="https://www.gatsbyjs.org">Gatsby</a>
            </footer>
        </div>
    </div>
);

export default Layout;
