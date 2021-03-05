import React, { useState } from 'react'
import { Comment, Form, Button, List, Input } from 'antd';
import moment from 'moment'
import axios from 'axios'
import './index.css'


const { TextArea } = Input;

const CommentList = ({ comments }) => (
  <List
    dataSource={comments}
    header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
    itemLayout="horizontal"
    renderItem={props => {
      console.log(props)
      return (
        <div className='comment-item'>
          <p>{props.name} <span className='comment-item-time'>{moment(props.createTime).format("dddd, MMMM Do YYYY, h:mm:ss a")}</span></p>
          <p>{props.content} </p>
        </div>
      )
    }}
  />
);

const Editor = ({ onChange, onSubmit, submitting, value }) => (
  <div>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
        Add Comment
      </Button>
    </Form.Item>
  </div>
);


export default class App extends React.Component {
 
  state = {
    comments: this.props.comments || [],
    submitting: false,
    value: '',
  };

  handleSubmit = () => {
    if (!this.state.value) {
      return;
    }

    this.setState({
      submitting: true,
    });

    const newComment = {
      paperId: this.props.paperId,
      name: this.props.name,
      content: this.state.value,
      createTime: +new Date()
    }

    axios.post('http://localhost:3232/api/paper/comment', {
      ...newComment
    }).then(res => {
      if (res.data.code === 200) {
        this.setState({
          submitting: false,
          value: '',
          comments: [
            ...this.state.comments,
            { ...newComment },
          ],
        });
      }
    })


  };

  handleChange = e => {
    this.setState({
      value: e.target.value,
    });
  };

  render() {
    const { comments, submitting, value } = this.state;
    console.log(comments)
    return (
      <div className='m-comment'>
        {comments.length > 0 && <CommentList comments={comments} />}
        <Comment
          author={this.props.name}
          content={
            <Editor
              onChange={this.handleChange}
              onSubmit={this.handleSubmit}
              submitting={submitting}
              value={value}
            />
          }
        />
      </div>
    );
  }
}