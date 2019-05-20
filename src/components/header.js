import { Link } from 'gatsby';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const Header = ({ title }) => (
    <header
        css={css`
            height: 64px;
            background-color: #13ca91;
            color: white;
            align-items: stretch;
            padding: 0 1.3125rem;
            display: flex;
            justify-content: center;
        `}
    >
        <div
            css={css`
                width: 100%;
                max-width: 49rem;
                display: flex;
                align-items: center;
            `}
        >
            <h1
                css={css`
                    margin-right: auto;
                `}
            >
                <Link
                    css={css`
                        box-shadow: none;
                        text-decoration: none;
                        color: inherit;
                    `}
                    to="/"
                >
                    {title}
                </Link>
            </h1>
            <Link
                css={css`
                    box-shadow: none;
                    text-decoration: none;
                    color: inherit;
                `}
                to="/resume"
            >
                resume
            </Link>
        </div>
    </header>
);
export default Header;
