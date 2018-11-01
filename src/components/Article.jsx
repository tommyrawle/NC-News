import React, { Component } from 'react';
import * as api from '../api';
import './Article.css'
import ProfilePic from './ProfilePic';
import Like from './Like';
import formatDate from './utils/formatDate';
import Comments from './Comments';
import Back from './Back'


class Article extends Component {
  state = {
    article: {},
    loading: true
  };
  render() {
    const {article} = this.state;
    if (this.state.loading) return <h1>...loading</h1>;
    return (
      <div>
        <Back  />
        <div className="individual-article">
          <article className="article individual">
            <div className="article-info">
                  <p className="topic">
                    nc/
                    {article.belongs_to}
                  </p>
                  <p>|</p>
                  <p>{formatDate(article.created_at)}</p>
                  
                </div>
                <h1>{article.title}</h1>
            <div className="body">{article.body}</div>
            <div className="art-interactions">
                    <span className="comments">
                    {`${article.comment_count} ${(article.comment_count === 1 && `Comment`) || `Comments`}`}
                    </span>
                  <Like likeCount={article.votes} target_id={article._id} type={'article'}/>
            </div>
            
            <Comments user={this.props.user} articleAuthor={article.created_by} article_id={article._id} />
          </article>
          <article className="sidebar">
            <ProfilePic user={article.created_by} />
            <p>Posted by <strong><span className="primary-color">{article.created_by.username}</span></strong></p>
            <p className="primary-color">{article.created_by.name}</p>
          </article>
        </div>
      </div>
    );
  }
  componentDidMount() {
    this.fetchArticle(this.props.id);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      this.fetchArticle(this.props.id);
    }
  }
  fetchArticle = id => {
    api
      .getArticle(id)
      .then(newArticle => {
        this.setState({
          article: newArticle,
          loading: false
        });
      });
  };
}

export default Article;
