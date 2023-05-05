import { useState, useEffect } from 'react';

import styles from '@/styles/Navigator.module.css'
import Link from 'next/link'

export default function Navigator() {
  const [isLogin, setIsLogin] = useState(false)

  useEffect(() => {
    verify()
  }, [])

  async function verify() {
    const token = localStorage.getItem('token')
    if (token === '') return false
    const data = await (await fetch(`/api/verify?token=${token}`)).json()
    if (data.StatusCode == 200) setIsLogin(true)
    else setIsLogin(false)
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <Link href="/"><img src='img/logo.png'></img></Link>
        {/* <a className={styles.logo}>Dimi6</a> */}
      </div>
      <div className={styles.right}>
        <Link href="/shop">Shop</Link>
        { isLogin && <a href="/" onClick={() => localStorage.removeItem('token')}>Logout</a> }
        { !isLogin && <Link href="/login">Login</Link> }
        {/* <img src="./exon.png"></img> */}
      </div>
    </nav>
  )
}