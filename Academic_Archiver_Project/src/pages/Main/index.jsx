import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { Button, List, Input } from 'antd';
import axios from 'axios'

import PaperList from '../../components/paper-list'
import UserHomeImg from '../../assets/imgs/background1.png'

import './index.css'

const { Search } = Input;

export default () => {
  const [keyword, setKeyword] = useState('')
  const [paperList, setPaperList] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(1)

  useEffect(() => {
    axios.post('http://localhost:3232/api/paper/list/keyeword', {
      currentPage,
      keyword,
    })
      .then((res) => {
        if (res.data.code === 200) {
          setPaperList(res.data.data.list || [])
          setTotal(res.data.total || 0)
        }
      })
  }, [keyword, currentPage])


  return (
    <div className='g-main'>
      <img src={UserHomeImg} alt='home' className='home-img' />
      <div className='m-user'>
        <Link to='/personal'>
          <Button type="button" shape="circle" size="large">
            U
                </Button>
        </Link>
      </div>

      <div className='m-content'>

        <div className='m-form'>
          <h3 className='page-title'>Academic Archiver</h3>
          <div className='search-bar'>
            <Search
              placeholder="input keyword to search your academic paper..."
              enterButton="Search"
              size="large"
              onSearch={setKeyword}
            />
          </div>
          <div className='m-paperlist'>
            <PaperList
              list={paperList}
              onPageChange={setCurrentPage}
              currentPage={currentPage}
              total={total}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

