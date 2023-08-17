'use client'

import { useRouter } from 'next/navigation'
import { useRef, useEffect, useState } from 'react'

import styles from '@/styles/admin.module.css'

import { members } from '@/lib/classMembers'
import adminMembers from '@/data/admin.json'
import rules from '@/data/rule.json'

export default function admin() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [usedUsers, setUsedUsers] = useState<any>([])

  const name = useRef<HTMLSelectElement>(null)
  const money = useRef<HTMLInputElement>(null)
  const ruleSelect = useRef<HTMLSelectElement>(null)

  useEffect(() => {
    verify()
  }, [])

  async function verify() {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('관리자만 접근 가능합니다.')
      setIsAdmin(false)
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
    const data = await res.json()
    if (isAdmin || (res.status === 200 && adminMembers.indexOf(data.name) !== -1)) {
      setIsAdmin(true)
      setUsedUsers(await getFridayStudent())
    }
    else {
      alert('관리자만 접근 가능합니다.')
      router.push('/')
      setIsAdmin(false)
    }
  }

  async function send() {
    if (!isAdmin) return false
    const res = await fetch('/api/point/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: localStorage.getItem('token'),
        to: name.current?.value,
        money: money.current?.value
      })
    })
    const data = await res.json()
    if (res.status === 200) {
      alert('성공적으로 포인트를 전송했습니다.\n' + data.message)
    } else {
      alert('오류가 발생했습니다.\n' + data.error)
    }
  }

  function changePoint(e: React.ChangeEvent<HTMLSelectElement>) {
    money.current!.value = '-'+e.target.value.split('-')[1]
  }

  async function getFridayStudent() {
    const res = await fetch('/api/item/used?itemId=0', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = await res.json()
    if (res.status !== 200) {
      alert('오류가 발생했습니다.\n' + data.error)
    }
    return data
  }

  async function checkFridayStudent(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    console.log(usedUsers)
    const itemId = e.currentTarget.getAttribute('itemID') || -1 as number
    const res = await fetch('/api/item/accept', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: localStorage.getItem('token'),
        itemId: 0,
        userName: usedUsers[itemId].user,
        isAccpeted: e.currentTarget.value === 'true'
      })
    })
    const data = await res.json()
    if (res.status !== 200) {
      alert('오류가 발생했습니다.\n' + data.error)
    }
    setUsedUsers(await getFridayStudent())
  }

  return (
    <>
      <div className={styles.center}>
        <main className={styles.main}>
          {isAdmin && (
            <>
              <div className={styles.row}>
                <section className={styles.section}>
                  <h2>포인트 전송</h2>
                  <input ref={money} type='number' placeholder='1000'></input>
                  <select ref={ruleSelect} onChange={changePoint} className={styles.select}>
                    {rules.map((rule, index) => (
                      <option key={index+1} value={rule.name + ' ' + rule.point.toString()}>{`${rule.name} [${rule.point.toString()}]`}</option>
                    ))}
                  </select>
                  <select ref={name} className={styles.select}>
                    {members.map((member, index) => {
                      if (member === '') return
                      return (
                        <option key={index+1} value={member}>{`${index+1} ${member}`}</option>
                      )
                    })}
                  </select>
                  <button onClick={send}>전송</button>
                </section>
                <div className={styles.fridaySection}>
                  <h2>금요귀가권 신청자 목록</h2>
                  <table className={styles.friday}>
                    <thead>
                      <tr>
                        <th className={styles.friday}>번호</th>
                        <th className={styles.friday}>이름</th>
                        <th className={styles.friday}>신청 시간</th>
                        <th className={styles.friday}>상태</th>
                      </tr>
                    </thead>
                    <tbody>
                        {
                          usedUsers.map((user: any, index: number) => {
                            return (
                              <tr key={index} className={styles.friday}>
                                <td className={styles.friday}>{usedUsers[index].id}</td>
                                <td className={styles.friday}>{usedUsers[index].user}</td>
                                <td className={styles.friday}>{usedUsers[index].date.toString().replace('T', ' (').split('.')[0]+')'}</td>
                                <td className={styles.fridayButton}>
                                  {usedUsers[index].isPending ? (<>
                                    <button onClick={checkFridayStudent} itemID={index as unknown as string} value='true'>허용</button>
                                    <button onClick={checkFridayStudent} itemID={index as unknown as string} value='false'>거절</button>
                                  </>): usedUsers[index].isAccepted ? <button className='green' disabled>승인</button> : <button className='red' disabled>거절</button>}
                                </td> 
                              </tr>
                            )
                          })
                        }
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </>
  )
}