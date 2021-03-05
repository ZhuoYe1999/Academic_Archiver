import React from 'react'
import { Link } from 'react-router-dom'
import { List } from 'antd';

import './index.css'

export default item => (
  <List.Item>
    <div className='paper-item'>
      <Link to={`/paperDetail?id=${item._id}`}>
        <p className='title'>{item.title}</p>
        <p className='author'>{item.author}</p>
        <p className='paper-intro'>{item.intro}</p>
      </Link>
    </div>
  </List.Item>
)