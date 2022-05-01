import path from 'path';
import { createFilePath } from 'gatsby-source-filesystem';
import type { GatsbyNode } from 'gatsby';

type PageNode = {
    fields: {
        slug: string;
    };
    frontmatter: {
        title: string;
    };
};
type CreatePageQuery = {
    allMarkdownRemark: {
        edges: Array<{
            node: PageNode;
        }>;
    };
};

export type BlogPostPageContext = {
    slug: string;
    previous: PageNode | null;
    next: PageNode | null;
};

export const createPages: GatsbyNode['createPages'] = ({
    graphql,
    actions,
}) => {
    const { createPage } = actions;

    const blogPost = path.resolve(`./src/templates/blog-post.tsx`);
    return graphql(
        `
            {
                allMarkdownRemark(
                    sort: { fields: [frontmatter___date], order: DESC }
                    limit: 1000
                    filter: { frontmatter: { type: { eq: "blogPost" } } }
                ) {
                    edges {
                        node {
                            fields {
                                slug
                            }
                            frontmatter {
                                title
                            }
                        }
                    }
                }
            }
        `,
    ).then((result) => {
        if (result.errors) {
            throw result.errors;
        }

        const queriedData = result.data as CreatePageQuery;

        // Create blog posts pages.
        const posts = queriedData.allMarkdownRemark.edges;

        posts.forEach((post, index) => {
            const previous =
                index === posts.length - 1 ? null : posts[index + 1].node;
            const next = index === 0 ? null : posts[index - 1].node;

            const context: BlogPostPageContext = {
                slug: post.node.fields.slug,
                previous,
                next,
            };

            createPage({
                path: post.node.fields.slug,
                component: blogPost,
                context,
            });
        });
    });
};

export const onCreateNode: GatsbyNode['onCreateNode'] = ({
    node,
    actions,
    getNode,
}) => {
    const { createNodeField } = actions;

    if (node.internal.type === `MarkdownRemark`) {
        const value = createFilePath({ node, getNode });
        createNodeField({
            name: `slug`,
            node,
            value,
        });
    }
};
