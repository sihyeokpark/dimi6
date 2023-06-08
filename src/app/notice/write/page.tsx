'use client'

import { useRef } from 'react'
import { useRouter } from 'next/navigation'

import styles from '@/styles/notice.module.css'

export default function shop() {
  const router = useRouter()

  const postTitle = useRef<HTMLInputElement>(null)
  const postContent = useRef<HTMLTextAreaElement>(null)

  async function writePost() {
    const res = await fetch('/api/post/write', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: postTitle.current?.value,
        content: postContent.current?.value,
        token: localStorage.getItem('token')
      })
    })

    if (res.status === 200) {
      router.push('/notice')
    }
  }

  return (
    <>
      <div className={styles.center}>
        <main className={styles.main}>
          <h1>글쓰기</h1>

          <section className={styles.section}>
            <p>제목</p>
            <input ref={postTitle} className={styles.input}></input>
          </section>
          <section className={styles.section}>
            <p>내용</p>
            <textarea ref={postContent} className={styles.input}></textarea>
          </section>
          <button onClick={writePost}>글쓰기</button>
          
        </main>
      </div>
    </>
  )
}