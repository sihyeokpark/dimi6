import Head from 'next/head'
import { useRouter } from 'next/router'
import { useRef } from 'react'

import styles from '@/styles/Login.module.css'

import Navigator from './components/Navigator'

export default function Home() {
  const router = useRouter()
  const name = useRef<HTMLInputElement>(null)
  const password = useRef<HTMLInputElement>(null)
  
  async function handleLogin() {
    const data = await (await fetch(`/api/login?name=${name.current?.value}&password=${password.current?.value}`)).json()
    console.log(data)
    if (data.StatusCode == 200) {
      localStorage.setItem('token', data.token)
      router.push('/')
    } else {
      alert('로그인에 실패했습니다.')
    }
  }

  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" as="style" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.6/dist/web/static/pretendard.css" />
      </Head>
      <Navigator></Navigator>
      <div className={styles.center}>
        <main className={styles.main}>
          <h1>로그인</h1>
          <input ref={name} type='text' placeholder='이름'></input>
          <input ref={password} type='password' placeholder='비밀번호'></input>
          <button onClick={handleLogin}>로그인</button>
        </main>
      </div>
    </>
  )
}