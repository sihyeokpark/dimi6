'use client'

import { useRef, useEffect } from 'react'
import { useSetRecoilState } from 'recoil'

import styles from '@/styles/Home.module.css'

import { isLoginState, isAdminState } from '@/lib/recoil'
import schedules from '@/data/schedule.json'

export default function Page() {
  const loginAlertText = useRef<HTMLHeadingElement>(null)
  const pText = useRef<HTMLHeadingElement>(null)
  const pointText = useRef<HTMLHeadingElement>(null)
  const noticeText = useRef<HTMLParagraphElement>(null)
  const breackfastText = useRef<HTMLParagraphElement>(null)
  const lunchText = useRef<HTMLParagraphElement>(null)
  const dinnerText = useRef<HTMLParagraphElement>(null)

  const setIsLogin = useSetRecoilState(isLoginState)
  const setIsAdmin = useSetRecoilState(isAdminState)

  useEffect(() => {
    verify()
    getMeal()
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
    if (res.status === 200) {
      setIsLogin(true)
      const data = await res.json()
      // noticeText.current!.innerText = `${data.name}님, 환영합니다.`
      getPoint()
    }
    else {
      loginAlertText.current!.innerText = '로그인이 필요합니다.'
      pointText.current!.innerText = ''
      pText.current!.innerText = ''
      setIsLogin(false)
      localStorage.removeItem('token')
    }
  }

  async function getMeal() {
    const data = await (await fetch('https://xn--299a1v27nvthhjj.com/api/' + new Date().toISOString().split('T')[0])).json()
    if (data.status === 'error') {
      breackfastText.current!.innerText = '급식이 존재하지 않습니다.'
      lunchText.current!.innerText = '급식이 존재하지 않습니다.'
      dinnerText.current!.innerText = '급식이 존재하지 않습니다.'
    } else {
      breackfastText.current!.innerText = (data.meal.breakfast ?? '급식이 존재하지 않습니다.').replaceAll('2종시리얼/유산균/우유,저지방우유,두유,무설탕두유중택1/', '').replaceAll('/', ', ') // 맨날 똑같은거 제외
      lunchText.current!.innerText = (data.meal.lunch ?? '급식이 존재하지 않습니다.').replaceAll('/', ', ')
      dinnerText.current!.innerText = (data.meal.dinner ?? '급식이 존재하지 않습니다.').replaceAll('/', ', ')
    }
    
  }

  async function getPoint() {
    const token = localStorage.getItem('token')
    const res = await fetch(`/api/point/get?token=${token}`)
    if (res.status === 200) {
      const data = await res.json()
      pointText.current!.innerText = data.point
    }
  }

  return (
    <>
      <div className={styles.center}>
        <main className={styles.main}>
          <div className={styles.title}>
            <p>한국디지털미디어고등학교</p>
            <h1>1학년 6반 포인트 시스템</h1>
          </div>
          {/* <div className={styles.notice}>
            <img src='img/megaphone.png' height={30}></img><p ref={noticeText}>로그인을 해주세요.</p>
          </div> */}
          <section className={styles.content}>
            <div className={styles.card}>
              <div className={styles.row}>
                <h1 ref={loginAlertText} className={styles.point}>포인트</h1>
                <h1 ref={pText} className={styles.moneyTitle}><span ref={pointText} className={styles.money}></span>p</h1>
              </div>
            </div>
            <div className={styles.card}>
              <h1>이벤트</h1>
              <p><b>8월 31일</b> 박종휘의 생일</p>
              <p><b>10월 1일</b> 최지윤의 생일</p>
              <p><b>10월 22일</b> 박시혁의 생일</p>
              <p><b>11월 5일</b> 주한결의 생일</p>
            </div>
            <div className={styles.card}>
              <h1>오늘의 제제쌤</h1>
              <p>좋은 제자에게는 좋은 코치가 있다. </p>
            </div>
          </section>
          <div className={styles.flex}>
            <section className={styles.meal}>
              <div className={styles.sectionTitle}>
                <h1>급식표</h1>
              </div>
              <div className={styles.mealDiv}>
                <h1>아침</h1>
                <p className={styles.blue}><b>오전 07시 40분</b></p>
                <div className={styles.mealCard}>
                  <p ref={breackfastText}></p>
                </div>
              </div>
              <div className={styles.mealDiv}>
                <h1>점심</h1>
                <p className={styles.blue}><b>오후 01시 00분</b></p>
                <div className={styles.mealCard}>
                  <p ref={lunchText}></p>
                </div>
              </div>
              <div className={styles.mealDiv}>
                <h1>저녁</h1>
                <p className={styles.blue}><b>오후 06시 53분</b></p>
                <div className={styles.mealCard}>
                  <p ref={dinnerText}></p>
                </div>
              </div>
            </section>
            <section className={styles.schedule}>
              <div className={styles.sectionTitle}>
                <h1>시간표</h1>
              </div>
              <table className={styles.schedule}>
                <thead>
                  <tr>
                    <th className={styles.schedule}>월</th>
                    <th className={styles.schedule}>화</th>
                    <th className={styles.schedule}>수</th>
                    <th className={styles.schedule}>목</th>
                    <th className={styles.schedule}>금</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    schedules.map((schedule, i) => (
                      <tr key={i} className={styles.schedule}>
                        <td className={styles.schedule}>{schedule[0]}</td>
                        <td className={styles.schedule}>{schedule[1]}</td>
                        <td className={styles.schedule}>{schedule[2]}</td>
                        <td className={styles.schedule}>{schedule[3]}</td>
                        <td className={styles.schedule}>{schedule[4]}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </section>
          </div>
        </main>
      </div>
    </>
  )
}

