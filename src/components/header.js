import { Link } from 'gatsby';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const MenuLink = ({ to, children }) => (
    <Link
        css={css`
            box-shadow: none;
            text-decoration: none;
            color: inherit;
        `}
        to={to}
    >
        {children}
    </Link>
);

const SubHeader = () => (
    <div
        css={css`
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0 1.3125rem;

            @media (min-width: 320px) and (max-width: 480px) {
                height: 48px;
                background-color: white;
                color: #13ca91;
            }
        `}
    >
        <MenuLink to="/resume">resume</MenuLink>
    </div>
);

const Header = ({ title }) => (
    <header
        css={css`
            align-items: stretch;
            display: flex;
            justify-content: center;
            color: white;
        `}
    >
        <div
            css={css`
                max-width: 49rem;
                background-color: #13ca91;
                display: flex;
                justify-content: center;
                flex-grow: 1;

                @media (min-width: 320px) and (max-width: 480px) {
                    flex-direction: column;
                }
            `}
        >
            <div
                css={css`
                    height: 64px;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    padding: 0 1.3125rem;
                `}
            >
                <h1>
                    <MenuLink to="/">{title}</MenuLink>
                </h1>
            </div>
            <SubHeader />
        </div>
    </header>
);
export default Header;
