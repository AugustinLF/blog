import React from 'react';
import { graphql, PageProps } from 'gatsby';

import Layout from '../components/layout';
import Seo from '../components/seo';

type NotFoundPageQuery = {
    site: {
        siteMetadata: {
            title: string;
        };
    };
};

class NotFoundPage extends React.Component<PageProps<NotFoundPageQuery>> {
    render() {
        const { data } = this.props;
        const siteTitle = data.site.siteMetadata.title;

        return (
            <Layout title={siteTitle}>
                <Seo title="404: Not Found" />
                <h1>Not Found</h1>
                <p>
                    You just hit a route that doesn&#39;t exist... the sadness.
                </p>
            </Layout>
        );
    }
}

export default NotFoundPage;

export const pageQuery = graphql`
    query NotFoundPage {
        site {
            siteMetadata {
                title
            }
        }
    }
`;
