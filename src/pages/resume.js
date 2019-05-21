import { graphql } from 'gatsby';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import Layout from '../components/layout';

const Resume = props => {
    const { resume, site } = props.data;
    const siteTitle = site.siteMetadata.title;
    return (
        <Layout title={siteTitle}>
            <div
                css={css`
                    & > p {
                        margin-top: 0px;
                    }
                `}
                dangerouslySetInnerHTML={{ __html: resume.html }}
            />
        </Layout>
    );
};

export default Resume;

export const pageQuery = graphql`
    query Resume {
        site {
            siteMetadata {
                title
            }
        }
        resume: markdownRemark(fields: { slug: { eq: "/resume/" } }) {
            id
            html
        }
    }
`;
