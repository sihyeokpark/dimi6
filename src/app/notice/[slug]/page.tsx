'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Post } from '@prisma/client'

import styles from '@/styles/post.module.css'


export default function shop(context: { params: { slug: string } }) {
  const router = useRouter()
  
  const [post, setPost] = useState<Post>()

  useEffect(() => {
    getPost()
  })

  async function getPost() {
    const res = await fetch(`/api/post/getOne?id=${context.params.slug}`)
    const data = await res.json()

    if (res.status === 200) {
      setPost(data)
    }
  }

  
  return (
    <>
      <div className={styles.center}>
        <main className={styles.main}>
          <h1>{post?.title}</h1>
          <p className={styles.date}>{post?.date.split('T')[0].replaceAll('-', '.')}</p>
          <p className={styles.content}>{post?.content}</p>
        </main>
      </div>
    </>
  )
}