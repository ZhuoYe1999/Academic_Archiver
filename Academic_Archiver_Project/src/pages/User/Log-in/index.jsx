import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import { Input, Button } from 'antd'
import axios from 'axios';
import RenderIf from '../../../components/render-if'

import UserHomeImg from '../../../assets/imgs/background1.png'


import './index.css'

const FormItem = ({ title, onChange, pw }) => (
  <section className='form-item'>
    <span className='form-item-title'>{title}</span>
    {
      pw ?
        <Input.Password onChange={e => onChange(e.target.value)} /> :
        <Input onChange={e => onChange(e.target.value)} />
    }

  </section>
)

export default () => {
  const [email, setEmail] = useState('')
  const [password, setPW] = useState('')
  const [errInfo, setErrInfo] = useState('')


  const handleLogin = () => {
    axios.post('http://localhost:3232/api/user/login', {
      email,
      password
    }).then((res) => {
      if (res.data.code === 200) {
        window.location.href = '/mainPage'
      } else {
        setErrInfo(res.data.msg)
      }
    })
  }
  return (
    <div className='g-login'>
      <img src={UserHomeImg} alt='home' className='home-img' />
      <div className='m-content'>

        <div className='m-form'>
          <h3 className='page-title'>Login Page</h3>
          <RenderIf condition={!!errInfo}>
            <p className='err-info'>{errInfo}</p>
          </RenderIf>
          <FormItem title='Email' onChange={setEmail} />
          <FormItem title='Password' onChange={setPW} pw />

          <div className='log-in'>
            <Button onClick={handleLogin}>Start</Button>
          </div>
          <div className='m-other'>
            <Link to="/signup">Signup</Link>
            <u>
              <Link to="/mainpage">Login as a guest?</Link>
            </u>
          </div>
        </div>

      </div>
    </div>
  )
}

