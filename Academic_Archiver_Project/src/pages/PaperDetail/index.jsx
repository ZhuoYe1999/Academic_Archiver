import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Icon, message } from 'antd'
import { decodeURLParams } from '../../utils'
import Comment from './components/comment'

import './index.css'

export default () => {
  const { id } = decodeURLParams(window.location.search)
  const [detail, setDetail] = useState(null)

  useEffect(() => {
    axios.post('http://localhost:3232/api/paper/detail', {
      _id: id
    })
      .then((res) => {
        if (res.data.code === 200) {
          setDetail(res.data.data || {})
        }
      })
  }, [id])

  function handleLike() {
    const hasLiked = detail.author.liked.indexOf(id) >= 0
    if (hasLiked) return
    axios.post('http://localhost:3232/api/paper/like', { id }).then(res => {
      if (res.data.code === 200) {
        message.success('liked')
      }
    })
  }

  function handleDownLoad() {
    axios({
      method: 'get',
      url: detail.paper.url,
      responseType: 'arraybuffer'
    })
      .then(res => {
        var blob = new Blob([res.data], { type: 'application/pdf' });
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = detail.paper.url.split('/').pop()
        link.click();
      }).then(() => {
        const hasSaved = detail.author.saved.indexOf(id) >= 0
        if (hasSaved) return
        axios.post('http://localhost:3232/api/paper/download', { id }).then(res => {
          if (res.data.code === 200) {
            message.success('saved')
          }
        })
      })
  }


  if (!detail) return null

  const hasLiked = detail.author.liked.indexOf(id) >= 0

  return (
    <div className='paper-wrapper'>
      <div className='paper'>
        <p className='title'>{detail.paper.title}</p>
        <p className='intro'>{detail.paper.intro}</p>
        <div className='pdf'>
          <embed width='800' height="800" name="plugin" id="plugin" src={detail.paper.url} type="application/pdf" internalinstanceid="37" title="" />
        </div>
        <div className='actions'>
          <p>
            {hasLiked ?
              <Icon type="like" theme="filled" /> :
              <Icon type="like" onClick={handleLike} />}
          </p>
          <p>
            {}
            <Icon type="download" onClick={handleDownLoad} />
            {}
          </p>
        </div>
      </div>
      <div className='author'>
        <img src='https://pbs.twimg.com/profile_images/1132241670010003456/ikRzj4EZ_400x400.jpg' />
        <div>
          <p>Author： {detail.author.username}</p>
          {detail.author.emailVisible && <p>Email：{detail.author.email}</p>}
          {detail.author.tagsVisible && <p>Tags： {detail.author.tags.map(x => <span key={x} className='tag'>{x}</span>)}</p>}
        </div>
      </div>
      <Comment name={detail.author.username} paperId={id} comments={detail.paper.comment} />
    </div>
  )
}