import { graphql, PageProps } from 'gatsby';
/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import Layout from '../components/layout';

type ResumeQuery = {
    site: { siteMetadata: { title: string } };
    resume: { id: string; html: string };
};

const Resume = (props: PageProps<ResumeQuery>) => {
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
