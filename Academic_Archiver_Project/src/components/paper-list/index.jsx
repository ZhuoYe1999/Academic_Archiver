import React from 'react'
import { List } from 'antd';
import PaperItem from '../paper-item'
import './index.css'

export default ({ list, currentPage, onPageChange, total }) => {
  return (
    <List
      className='paper-list'
      pagination={{
        onChange: onPageChange,
        total: total,
        current: currentPage,
        pageSize: 5,
      }}
      itemLayout="horizontal"
      dataSource={list}
      renderItem={PaperItem}
    />
  )
}