import React from 'react';
import { Helmet } from 'react-helmet';
import { StaticQuery, graphql } from 'gatsby';

type SeoProps = {
    description?: string;
    meta?: { name: string; content: string }[];
    keywords?: string[];
    title: string;
};

type DefaultSEOQuery = {
    site: {
        siteMetadata: {
            author: string;
            description: string;
            title: string;
        };
    };
};

const Seo = ({ description, meta = [], keywords = [], title }: SeoProps) => (
    <StaticQuery
        query={detailsQuery}
        render={(data: DefaultSEOQuery) => {
            const metaDescription =
                description || data.site.siteMetadata.description;
            return (
                // @ts-expect-error issue with Helmet not being accepted as valid JSX
                <Helmet
                    htmlAttributes={{
                        lang: 'en',
                    }}
                    title={title}
                    titleTemplate={`%s | ${data.site.siteMetadata.title}`}
                    meta={[
                        {
                            name: `description`,
                            content: metaDescription,
                        },
                        {
                            property: `og:title`,
                            content: title,
                        },
                        {
                            property: `og:description`,
                            content: metaDescription,
                        },
                        {
                            property: `og:type`,
                            content: `website`,
                        },
                        {
                            name: `twitter:card`,
                            content: `summary`,
                        },
                        {
                            name: `twitter:creator`,
                            content: data.site.siteMetadata.author,
                        },
                        {
                            name: `twitter:title`,
                            content: title,
                        },
                        {
                            name: `twitter:description`,
                            content: metaDescription,
                        },
                    ]
                        .concat(
                            keywords.length > 0
                                ? {
                                      name: `keywords`,
                                      content: keywords.join(`, `),
                                  }
                                : [],
                        )
                        .concat(meta)}
                />
            );
        }}
    />
);

export default Seo;

const detailsQuery = graphql`
    query DefaultSEO {
        site {
            siteMetadata {
                title
                description
                author
            }
        }
    }
`;
