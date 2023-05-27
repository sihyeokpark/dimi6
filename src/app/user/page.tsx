'use client'

import Head from 'next/head'
import { useRouter } from 'next/navigation'
import base64url from 'base64url'
import { useRef, useEffect, useState, RefObject } from 'react'

import styles from '@/styles/admin.module.css'

import Navigator from '../components/Navigator'

export default function admin() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(false)

  const currentPassword = useRef<HTMLInputElement>(null)
  const newPassword = useRef<HTMLInputElement>(null)
  const newPasswordAgain = useRef<HTMLInputElement>(null)

  useEffect(() => {
    verify()
  }, [])

  async function verify() {
    const token = localStorage.getItem('token')
    console.log(token)
    if (token === undefined) {
      alert('로그인을 해주세요.')
      setIsLogin(false)
      router.push('/')
    }
    const res = await fetch('/api/user/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: token
      })
    })
    if (res.status === 200) setIsLogin(true)
    else {
      alert('로그인을 해주세요.')
      setIsLogin(false)
      router.push('/')
    }
  }

  async function changePassword() {
    if (!isLogin) return false
    if (newPassword.current?.value !== newPasswordAgain.current?.value) {
      alert('새로운 비밀번호가 일치하지 않습니다.')
      return false
    }
    const name = JSON.parse(base64url.decode(localStorage.getItem('token')!.split('.')[1])).name
    console.log(name)
    const data = await (await fetch('/api/user/changePassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        currentPassword: currentPassword.current?.value,
        newPassword: newPassword.current?.value
      })
    })).json()
    if (data.StatusCode == 200) {
      alert('성공적으로 비밀번호를 변경했습니다.\n' + data.message)
    } else {
      alert('오류가 발생했습니다.\n' + data.error)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key == 'Enter') changePassword()
  }

  return (
    <>
      <div className={styles.center}>
        <main className={styles.main}>
          <h1>유저 페이지</h1>
          {isLogin && (
            <div>
              <section className={styles.section}>
                <h2>비밀번호 변경</h2>
                <input ref={currentPassword} type='password' placeholder='현재 비밀번호'></input>
                <input ref={newPassword} type='password' placeholder='새로운 비밀번호'></input>
                <input ref={newPasswordAgain} type='password' placeholder='새로운 비밀번호 다시' onKeyDown={handleKeyDown}></input>
                <button onClick={changePassword}>비밀번호 변경하기</button>
              </section>
            </div>
          )}
        </main>
      </div>
    </>
  )
}