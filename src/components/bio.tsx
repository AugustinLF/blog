import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image';
/** @jsx jsx */
import { css, jsx } from '@emotion/react';

const Avatar = () => (
    <StaticImage
        src="./avatar.jpeg"
        alt="Picture of Augustin Le Fèvre"
        css={css`
            flex-shrink: 0;
            margin-right: 0.875rem;
        `}
        placeholder="blurred"
        layout="fixed"
        width={50}
        height={50}
        imgStyle={{
            borderRadius: `50%`,
        }}
    />
);

type BioQuery = {
    site: { siteMetadata: { author: string; social: { twitter: string } } };
};

function Bio() {
    return (
        <StaticQuery
            query={bioQuery}
            render={(data: BioQuery) => {
                const { author, social } = data.site.siteMetadata;
                return (
                    <div
                        style={{
                            display: `flex`,
                        }}
                    >
                        <Avatar />
                        <p style={{ marginTop: 0 }}>
                            I'm {author}. I work for{' '}
                            <a href="https://www.extia.fr/">Extia</a>, an IT
                            consulting company based in Paris, France. I mostly
                            do front-end development.
                            {` `}
                            <a href={`https://twitter.com/${social.twitter}`}>
                                Here's my Twitter.
                            </a>
                        </p>
                    </div>
                );
            }}
        />
    );
}

const bioQuery = graphql`
    query Bio {
        site {
            siteMetadata {
                author
                social {
                    twitter
                }
            }
        }
    }
`;

export default Bio;
