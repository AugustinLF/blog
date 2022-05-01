import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image';

function Bio() {
    return (
        <StaticQuery
            query={bioQuery}
            render={data => {
                const { author, social } = data.site.siteMetadata;
                return (
                    <div
                        style={{
                            display: `flex`,
                        }}
                    >
                        <StaticImage
                            src="../../content/assets/avatar.jpeg"
                            alt={author}
                            style={{
                                marginRight: '0.875rem',
                                marginBottom: 0,
                                minWidth: 50,
                                borderRadius: `100%`,
                            }}
                            imgStyle={{
                                borderRadius: `50%`,
                            }}
                        />
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
    query BioQuery {
        # avatar: file(absolutePath: { regex: "/avatar.jpeg/" }) {
        #     childImageSharp {
        #         gatsbyImageData(layout: FIXED)
        #     }
        # }
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
