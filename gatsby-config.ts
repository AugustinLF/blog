import type { GatsbyConfig } from 'gatsby';

type FeedsQuery = {
    site: {
        siteMetadata: {
            title: string;
            description: string;
            siteUrl: string;
        };
    };
    allMarkdownRemark: {
        nodes: Array<{
            excerpt: string;
            html: string;
            fields: {
                slug: string;
            };
            frontmatter: {
                title: string;
                date: string;
            };
        }>;
    };
};

const config: GatsbyConfig = {
    siteMetadata: {
        title: `Augustin's blog`,
        author: `Augustin Le Fèvre`,
        description: `Somewhere to share things I learnt`,
        siteUrl: `https://augustinlf.com/`,
        social: {
            twitter: `gusguslf`,
        },
    },
    plugins: [
        'gatsby-plugin-image',
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: `${__dirname}/content/resume`,
                name: `resume`,
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: `${__dirname}/content/blog`,
                name: `blog`,
            },
        },
        {
            resolve: `gatsby-transformer-remark`,
            options: {
                plugins: [
                    {
                        resolve: `gatsby-remark-images`,
                        options: {
                            maxWidth: 590,
                        },
                    },
                    {
                        resolve: `gatsby-remark-responsive-iframe`,
                        options: {
                            wrapperStyle: `margin-bottom: 1.0725rem`,
                        },
                    },
                    `gatsby-remark-prismjs`,
                    `gatsby-remark-copy-linked-files`,
                    `gatsby-remark-smartypants`,
                    {
                        resolve: `gatsby-plugin-google-analytics`,
                        options: {
                            trackingId: 'UA-115794430-2',
                            anonymize: true,
                            respectDNT: true,
                        },
                    },
                ],
            },
        },
        `gatsby-transformer-sharp`,
        `gatsby-plugin-sharp`,
        {
            resolve: `gatsby-plugin-feed`,
            options: {
                query: `
                {
                  site {
                    siteMetadata {
                      title
                      description
                      siteUrl
                    }
                  }
                }
              `,
                feeds: [
                    {
                        serialize: ({
                            query: { site, allMarkdownRemark },
                        }: {
                            query: FeedsQuery;
                        }) =>
                            allMarkdownRemark.nodes
                                .filter(
                                    (node) => node.fields.slug !== '/resume/',
                                )
                                .map((node) => ({
                                    ...node.frontmatter,
                                    description: node.excerpt,
                                    date: node.frontmatter.date,
                                    url:
                                        site.siteMetadata.siteUrl +
                                        node.fields.slug,
                                    guid:
                                        site.siteMetadata.siteUrl +
                                        node.fields.slug,
                                    custom_elements: [
                                        { 'content:encoded': node.html },
                                    ],
                                })),
                        query: `
                    {
                      allMarkdownRemark(
                        sort: { order: DESC, fields: [frontmatter___date] },
                      ) {
                        nodes {
                          excerpt
                          html
                          fields {
                            slug
                          }
                          frontmatter {
                            title
                            date
                          }
                        }
                      }
                    }
                  `,
                        output: '/rss.xml',
                        title: "Augustin's blog's RSS Feed",
                    },
                ],
            },
        },
        // TODO need an icon
        // {
        //     resolve: `gatsby-plugin-manifest`,
        //     options: {
        //         name: `Augustin Le Fèvre's blog`,
        //         short_name: `Augustin's blog`,
        //         start_url: `/`,
        //         background_color: `#ffffff`,
        //         theme_color: `#663399`,
        //         display: `minimal-ui`,
        //         icon: `content/assets/gatsby-icon.png`,
        //     },
        // },
        `gatsby-plugin-remove-serviceworker`,
        `gatsby-plugin-react-helmet`,
        `gatsby-plugin-emotion`,
    ],
};

export default config;
