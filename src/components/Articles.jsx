import React, { Component } from 'react';
import { Link, navigate } from '@reach/router';
import * as api from '../api';
import './Articles.css';
import PostArticle from './PostArticle';
import formatDate from './utils/formatDate';
import ProfilePic from './ProfilePic';
import Like from './Like';
import { Row, Col, Grid } from 'react-bootstrap';

class Articles extends Component {
  state = {
    articles: [],
    loading: true,
    error: ''
  };
  render() {
    const selectedTopic = this.props.topic_slug;
    if (this.state.loading)
      return (
        <div className="loading">
          <i className="fa fa-spinner fa-pulse" aria-hidden="true" />
        </div>
      );
    return (
      <div className="articles">
        <h1 className="topic-title">
          {selectedTopic && `${selectedTopic} Articles`}
        </h1>
        <PostArticle
          topics={this.props.topics}
          topic={this.props.topic_slug}
          postArticle={this.postArticle}
          user={this.props.user}
        />
        <Grid>
          {this.state.articles.map(article => {
            return (
              <Row key={article._id}>
                <Col xs={12} md={8} xsOffset={0} mdOffset={2}>
                  <article className="article">
                    <div className="article-info">
                      <ProfilePic user={article.created_by} />
                      <p className="topic">
                        nc/
                        {article.belongs_to}
                      </p>
                      <p className="name">
                        Posted by {article.created_by.name}
                      </p>
                      <p>|</p>
                      <p>{formatDate(article.created_at)}</p>
                    </div>

                    <Link to={`/article/${article._id}`}>
                      <h2>{article.title}</h2>
                      <div className="body">
                        {article.body
                          .split(' ')
                          .slice(0, 60)
                          .join(' ')}
                          {article.body.split(' ').length > 60 && 
                          <i className="fa fa-ellipsis-h ellipsis" aria-hidden="true"></i>}
                      </div>
                      {article.body.split(' ').length > 60 && (
                        <div className="see-more">
                          <button>...Read more</button>
                        </div>
                      )}
                    </Link>
                    <div className="art-interactions">
                      <Link key={article._id} to={`/article/${article._id}`}>
                        <span className="comments">
                          {`${
                            article.comment_count
                          } ${(article.comment_count === 1 && `Comment`) ||
                            `Comments`}`}
                        </span>
                      </Link>
                      <Like
                        likeCount={article.votes}
                        target_id={article._id}
                        type={'article'}
                      />
                    </div>
                  </article>
                </Col>
              </Row>
            );
          })}
        </Grid>
      </div>
    );
  }
  componentDidMount() {
    this.fetchArticles();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.topic_slug !== this.props.topic_slug) {
      this.fetchArticles();
    }
  }
  fetchArticles = () => {
    const selectedTopic = this.props.topic_slug;
    api
      .getArticles(selectedTopic)
      .then(newArticles => {
        newArticles.sort(function(a, b) {
          return new Date(b.created_at) - new Date(a.created_at);
        });
        this.setState({
          articles: newArticles,
          loading: false
        });
      })
      .catch(err => {
        navigate('/error', {
          replace: true,
           state: {
            errCode: err.response.status,
            errMsg: err.response.data.msg
          }
        });
      });
  };
  postArticle = (article, topic) => {
    const newArticle = { ...article, created_by: this.props.user._id };
    const selectedTopic = topic.length > 0 ? topic : this.props.topic_slug;
    api.postArticle(newArticle, selectedTopic).then(postedArticle => {
      this.setState({
        articles: [postedArticle, ...this.state.articles]
      });
    });
  };
}

export default Articles;
