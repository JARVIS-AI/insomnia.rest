import React from 'react';
import Link from '../components/link';
import BlogPostLink from '../components/blog-post-link';
import {links} from '../config';

export default ({data: {allFile: {edges}}}) => (
  <React.Fragment>
    <header className="container header--big">
      <div className="row">
        <div className="col-12">
          <h1>Welcome to the Blog!</h1>
          <p>
            <a href={links.rss}
               className="button"
               type="application/rss+xml"
               target="_blank"
               title="RSS">
              Subscribe via RSS
            </a>
          </p>
        </div>
      </div>
    </header>
    {edges
      .sort((a, b) => {
        const tsA = new Date(a.node.childMarkdownRemark.frontmatter.date_iso).getTime();
        const tsB = new Date(b.node.childMarkdownRemark.frontmatter.date_iso).getTime();
        return tsB - tsA;
      })
      .map(({node: {childMarkdownRemark: {frontmatter, excerpt}}}) => (
        <article key={frontmatter.slug} className="article--preview container">
          <header className="row">
            <div className="col-12">
              <BlogPostLink frontmatter={frontmatter}>
                <h1>{frontmatter.title}</h1>
              </BlogPostLink>
              <div className="meta">
                <time dateTime={frontmatter.date}>
                  {frontmatter.date}
                </time>
                {frontmatter.series && frontmatter.series[0] && (
                  <React.Fragment>
                    &nbsp;–&nbsp;
                    <Link to={`/series/${frontmatter.series[0]}`}
                          title={`This post is part of the ${frontmatter.series[0]} series`}>
                      {frontmatter.series[0]}
                    </Link>
                  </React.Fragment>
                )}
              </div>
            </div>
          </header>
          <section>
            <div className="row">
              <div className="col-12 article--preview__content">
                <p>{excerpt}</p>
              </div>
            </div>
            <div className="row article--preview__footer">
              <div className="col-8">
                {(frontmatter.tags || []).map(tag => (
                  <Link key={tag} className="button tags__tag" to={`tags/${tag}`}>
                    {tag}
                  </Link>
                ))}
              </div>
              <div className="col-4 article--preview__read-more">
                <BlogPostLink frontmatter={frontmatter}>
                  Continue Reading &raquo;
                </BlogPostLink>
              </div>
            </div>
            <div className="row">
              <div className="col-12 article--preview__separator"/>
            </div>
          </section>
        </article>
      ))}
  </React.Fragment>
);

export const pageQuery = graphql`
  query BlogIndexQuery {
    allFile(filter: {sourceInstanceName: {eq: "blog"}}) {
      edges {
        node {
          childMarkdownRemark {
            excerpt(pruneLength: 240)
            frontmatter {
              date(formatString: "MMMM DD, YYYY")
              tags
              series
              slug
              title
            }
          }
        }
      }
    }
  }
`;
