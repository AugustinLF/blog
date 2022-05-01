import React from 'react';
import { Link, graphql, PageProps } from 'gatsby';

import Bio from '../components/bio';
import Layout from '../components/layout';
import Seo from '../components/seo';

type PageQuery = {
    site: { siteMetadata: { title: string } };
    blogPosts: {
        edges: Array<{
            node: {
                excerpt: string;
                fields: { slug: string };
                frontmatter: { date: any; title: string; description: string };
            };
        }>;
    };
};

class BlogIndex extends React.Component<PageProps<PageQuery>> {
    render() {
        const { data } = this.props;
        const siteTitle = data.site.siteMetadata.title;
        const posts = data.blogPosts.edges;

        return (
            <Layout title={siteTitle}>
                <Seo
                    title="All posts"
                    keywords={[`blog`, `javascript`, `react`, 'development']}
                />
                <Bio />
                {posts.map(({ node }) => {
                    const title = node.frontmatter.title || node.fields.slug;
                    return (
                        <div key={node.fields.slug}>
                            <h3
                                style={{
                                    marginBottom: '0.4375rem',
                                }}
                            >
                                <Link
                                    style={{
                                        boxShadow: `none`,
                                        color: 'initial',
                                    }}
                                    to={node.fields.slug}
                                >
                                    {title}
                                </Link>
                            </h3>
                            <small>{node.frontmatter.date}</small>
                            <p
                                dangerouslySetInnerHTML={{
                                    __html:
                                        node.frontmatter.description ||
                                        node.excerpt,
                                }}
                            />
                        </div>
                    );
                })}
            </Layout>
        );
    }
}

export default BlogIndex;

export const pageQuery = graphql`
    query PageQuery {
        site {
            siteMetadata {
                title
            }
        }
        blogPosts: allMarkdownRemark(
            sort: { fields: [frontmatter___date], order: DESC }
            filter: { frontmatter: { type: { eq: "blogPost" } } }
        ) {
            edges {
                node {
                    excerpt
                    fields {
                        slug
                    }
                    frontmatter {
                        date(formatString: "MMMM DD, YYYY")
                        title
                        description
                    }
                }
            }
        }
    }
`;
