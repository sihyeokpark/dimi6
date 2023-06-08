'use client'

import { useState, useEffect } from 'react'
import { useRecoilState } from 'recoil'
import Link from 'next/link'

import styles from '@/styles/Navigator.module.css'
import adminMembers from '../data/admin.json'
import { isLoginState, isAdminState } from '@/lib/recoil'

export default function Navigator() {
  const [isAdmin, setIsAdmin] = useRecoilState(isAdminState)
  const [isLogin, setIsLogin] = useRecoilState(isLoginState)

  useEffect(() => {
    verify()
  }, [])

  async function verify() {
    const token = localStorage.getItem('token')
    if (token === '') return false
    const res = await fetch('/api/user/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: token
      })
    })
    const data = await res.json()
    if (res.status == 200) {
      setIsLogin(true)
      if (adminMembers.indexOf(data.name) != -1) setIsAdmin(true)
      else setIsAdmin(false)
    }
    else setIsLogin(false)
    // getPoint()
  }

  // function toggleUserModal() {
  //   console.log(userModal.current!.style.visibility)
  //   if (userModal.current!.style.visibility == 'visible') userModal.current!.style.visibility = 'hidden'
  //   else userModal.current!.style.visibility = 'visible'
  // }

  // async function getPoint() {
  //   const data = await (await fetch(`/api/point/get?token=${localStorage.getItem('token')}`)).json()
  //   if (data.StatusCode == 200) {
  //     pointText.current!.innerText = data.point
  //   }
  // }

  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <Link href="/"><img src='/img/logo.png' className={styles.logo}></img></Link>
        {/* <a className={styles.logo}>Dimi6</a> */}
      </div>
      <div className={styles.right}>
        { isAdmin && <Link href='/admin'>관리자</Link> }
        { isLogin && <Link href="/notice">게시판</Link> }
        { isLogin && <Link href="/shop">교환소</Link> }
        { isLogin && <a href="/" onClick={() => {
          localStorage.removeItem('token')
          setIsLogin(false)
        }}>로그아웃</a> }
        { !isLogin && <Link href="/login">로그인</Link> }
        <Link href='/user'><img src="/img/user.png" className={styles.profile}></img></Link>
        {/* <div ref={userModal} className={styles.user}>
          <h2>1610 박시혁</h2>
          <div className={styles.flex}>
            <img src='img/coin-small.svg' height={20}></img>
            <p ref={pointText}></p>
          </div>
        </div> */}
      </div>
    </nav>
  )
}