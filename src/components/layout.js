import React from 'react';
import { Link } from 'gatsby';
import styled from '@emotion/styled';
import { Global, css } from '@emotion/core';

import { scaleText } from '../utils/typography';

const BlogTitle = styled.h1`
    margin-top: 0;
    font-size: ${scaleText(3)};
    margin-bottom: 24px;
`;

class Layout extends React.Component {
    render() {
        const { location, title, children } = this.props;
        const rootPath = `${__PATH_PREFIX__}/`;
        let header;

        if (location.pathname === rootPath) {
            header = (
                <BlogTitle>
                    <Link
                        style={{
                            boxShadow: `none`,
                            textDecoration: `none`,
                            color: `inherit`,
                        }}
                        to={`/`}
                    >
                        {title}
                    </Link>
                </BlogTitle>
            );
        } else {
            header = (
                <h3
                    style={{
                        marginTop: 0,
                    }}
                >
                    <Link
                        style={{
                            boxShadow: `none`,
                            textDecoration: `none`,
                            color: `inherit`,
                        }}
                        to="/"
                    >
                        {title}
                    </Link>
                </h3>
            );
        }
        return (
            <div
                style={{
                    marginLeft: `auto`,
                    marginRight: `auto`,
                    maxWidth: '49rem',
                    padding: '2.625rem 1.3125rem',
                }}
            >
                <Global
                    styles={css`
                        body {
                            font-family: sans-serif;
                            font-size: 16px;
                            line-height: 1.75;
                        }
                    `}
                />
                <header>{header}</header>
                <main>{children}</main>
                <footer>
                    © {new Date().getFullYear()}, Built with
                    {` `}
                    <a href="https://www.gatsbyjs.org">Gatsby</a>
                </footer>
            </div>
        );
    }
}

export default Layout;
