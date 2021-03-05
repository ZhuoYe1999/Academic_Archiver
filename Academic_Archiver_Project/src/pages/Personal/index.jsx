import React, { useState, useContext, useEffect } from 'react'
import { Tabs, Icon, Tag, Input, Tooltip, message } from 'antd'
import axios from 'axios';
import Uploaded from './components/uploaded'
import Saved from './components/saved'
import Liked from './components/liked'
import Commented from './components/commented'
import UserContext from '../../context/user'
import './index.css'

const { TabPane } = Tabs;

export default () => {
  const initUser = useContext(UserContext)

  const [user, setUser] = useState({ ...initUser })
  function handleTabChange(e) {
    console.log(e)
  }
  function show(type) {
    setUser(user => ({
      ...user,
      [type]: true
    }))
  }
  function hide(type) {
    setUser(user => ({
      ...user,
      [type]: false
    }))
  }

  function handleChange(tags) {
    setUser(user => ({
      ...user,
      tags,
    }))
  }

  function handleLogout() {
    axios.get('http://localhost:3232/api/user/logout')
      .then((res) => {
        if (res.data.code === 200) {
          window.location = '/login'
        } else {
          message.error('logout!')
        }
      })
  }

  useEffect(() => {
    if (!Object.keys(user).length) return
    axios.post('http://localhost:3232/api/user/updateUser', { ...user })
      .then(res => {

      })
  }, [user])

  useEffect(() => {
    setUser({ ...initUser })
  }, [initUser])

  console.log(user)

  return (
    <div className='m-personal'>
      <div className='user-info'>
        <img className='avatar' src='https://pbs.twimg.com/profile_images/1132241670010003456/ikRzj4EZ_400x400.jpg' />
  <p className='user-name'>{user.username}</p>
        {}
        <p>Email: {user.email} {user.emailVisible ?
          <Icon type="eye" onClick={() => hide('emailVisible')} /> : <Icon type="eye-invisible" onClick={() => show('emailVisible')} />}</p>
        {}
        <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
          Tags：<EditableTagGroup tags={user.tags} handleChange={handleChange} />
          {user.tagsVisible ? <Icon type="eye" onClick={() => hide('tagsVisible')} /> : <Icon type="eye-invisible" onClick={() => show('tagsVisible')} />}
        </div>
        <button className='logout' onClick={handleLogout}>Logout</button>
      </div>
      <div className='tabs'>
        <Tabs defaultActiveKey="1" onChange={handleTabChange} type="card">
          <TabPane tab="Uploaded" key="1" className='tab-pane'>
            <Uploaded status='uploaded' />
          </TabPane>
          <TabPane tab="Saved" key="2">
            <Saved status='saved' />
          </TabPane>
          <TabPane tab="Liked" key="3">
            <Liked status='liked' />
          </TabPane>
          <TabPane tab="Commented" key="4">
            <Commented status='commented' />
          </TabPane>
        </Tabs>
      </div>
    </div>
  )
}

class EditableTagGroup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tags: props.tags || [],
      inputVisible: false,
      inputValue: '',
    };
  }

  static getDerivedStateFromProps(props, state) {
    return {
      tags: props.tags || [],
    }
  }

  handleClose = removedTag => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    this.props.handleChange(tags)
    this.setState({ tags });
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    let { tags } = this.state;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    this.props.handleChange(tags)
    this.setState({
      tags,
      inputVisible: false,
      inputValue: '',
    });
  };

  saveInputRef = input => (this.input = input);

  render() {
    const { tags, inputVisible, inputValue } = this.state;
    return (
      <div>
        {tags.map((tag, index) => {
          const isLongTag = tag.length > 20;
          const tagElem = (
            <Tag key={tag} closable={true} onClose={() => this.handleClose(tag)}>
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </Tag>
          );
          return isLongTag ? (
            <Tooltip title={tag} key={tag}>
              {tagElem}
            </Tooltip>
          ) : (
              tagElem
            );
        })}
        {inputVisible && (
          <Input
            ref={this.saveInputRef}
            type="text"
            size="small"
            style={{ width: 78 }}
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {!inputVisible && (
          <Tag onClick={this.showInput} style={{ background: '#fff', borderStyle: 'dashed' }}>
            <Icon type="plus" /> New Tag
          </Tag>
        )}
      </div>
    );
  }
}