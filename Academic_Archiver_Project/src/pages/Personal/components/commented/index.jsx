import React, { useState, useEffect } from 'react'
import { Button } from 'antd'
import axios from 'axios'

import Modal from './modal'
import PaperList from '../../../../components/paper-list'
import './index.css'

export default ({ status }) => {
  const [visible, setVisible] = useState(false)
  const [paperList, setPaperList] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(1)

  useEffect(() => {
    axios.post('http://localhost:3232/api/paper/list', {
      currentPage,
      status
    })
      .then((res) => {
        if (res.data.code === 200) {
          setPaperList(res.data.data.list || [])
          setTotal(res.data.total || 0)
        }
      })
  }, [currentPage])

  return (
    <div className=''>
      {/* <div className='action-upload'><Button onClick={() => setVisible(true)}>upload new paper</Button></div> */}
      <PaperList
        list={paperList}
        onPageChange={setCurrentPage}
        currentPage={currentPage}
        total={total}
      />
      {/* <Modal visible={visible} onCancel={() => setVisible(false)} onSubmit={() => setVisible(false)} /> */}
    </div>
  )
}