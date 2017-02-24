class CommentList extends React.Component {  
  render() {
    var commentNodes = this.props.data.map((comment) => {
      return (<Comment author={comment.author}>
      {comment.text}
      </Comment>)
    });
    return (<div className="commentList">
    {commentNodes}
    </div>)
  }
}

class CommentForm extends React.Component {  
  handleSubmit(e) {
    e.preventDefault();
    var author = React.findDOMNode(this.refs.author).value.trim();
    var text = React.findDOMNode(this.refs.text).value.trim();
    if (!text || !author) {
      return;
    }
    this.props.onCommentSubmit({author: author, text: text});
    React.findDOMNode(this.refs.author).value = '';
    React.findDOMNode(this.refs.text).value = '';
    return;
  }

  render() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit.bind(this)}>
      <input type="text" placeholder="Your name" ref="author" />
      <input type="text" placeholder="Your comment" ref="text" />
      <input type="submit" value="Post" />
      </form>
    )
  }
}

class CommentBox extends React.Component {  
  constructor() {
    this.state = { data: [] }
  }

  loadCommentsFromServer() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: (data) => {
        this.setState({data: data});
      },
      error: (xhr, status, err) => {
        console.error(this.props.url, status, err.toString());
      }
    });
  }

  handleCommentSubmit(comment) {
    var comments = this.state.data;
    var newComments = comments.concat([comment]);
    this.setState({data: newComments});
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: (data) => {
        this.setState({data: data});
      },
      error: (xhr, status, err) => {
        console.error(this.props.url, status, err.toString());
      }
    });
  }

  componentDidMount() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer.bind(this), this.props.pollInterval);
  }

  render() {
    return <div className="commentBox">
    <h1>Comments
    <CommentList data={this.state.data} />
    <CommentForm onCommentSubmit={this.handleCommentSubmit.bind(this)}/>
    </div>
  }
}

class Comment extends React.Component {  
  render() {
    return <div className="comment">
    <h2 className="commentAuthor">{this.props.author}
    {this.props.children}
    </div>
  }
}

React.render(, content);