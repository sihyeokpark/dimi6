'use client'

import Head from 'next/head'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'

import styles from '@/styles/Login.module.css'

import Navigator from '../components/Navigator'

export default function login() {
  const router = useRouter()
  const name = useRef<HTMLInputElement>(null)
  const password = useRef<HTMLInputElement>(null)
  
  async function handleLogin() {
    const res = await fetch('/api/user/login', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name.current?.value,
        password: password.current?.value
      })
    })
    const data = await res.json()
    console.log(data)
    if (res.status == 200) {
      localStorage.setItem('token', data.token)
      console.log(localStorage.getItem('token'))
      router.push('/')
    } else {
      alert(`로그인에 실패했습니다.\nError ${data.error}`)
    }
  }

  function handleKeyDown1(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key == 'Enter') handleLogin()
  }

  function handleKeyDown2(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key == 'Enter') password.current?.focus()
  }

  return (
    <>
      <div className={styles.center}>
        <main className={styles.main}>
          <h1>로그인</h1>
          <input ref={name} type='text' placeholder='이름' onKeyDown={handleKeyDown2}></input>
          <input ref={password} type='password' placeholder='비밀번호' onKeyDown={handleKeyDown1}></input>
          <button onClick={handleLogin}>로그인</button>
        </main>
      </div>
    </>
  )
}