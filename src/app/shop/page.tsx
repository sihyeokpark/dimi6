'use client'

import Head from 'next/head'

import styles from '@/styles/shop.module.css'

import Navigator from '../components/Navigator'
import { useEffect, useRef, useState } from 'react'
import { Inventory, Item } from '@prisma/client'

export default function shop() {
  const itemsList = useRef<HTMLDivElement>(null)
  const [itemArray, setItemArray] = useState<JSX.Element[]>([])

  useEffect(() => {
    getItems()
  }, [])

  async function buyItem(e: React.MouseEvent<HTMLElement>) {
    const itemId = e.currentTarget.getAttribute('itemID')
    if (itemId === null) return alert('아이템을 구매할 수 없습니다.')
    console.log(itemId)
    const res = await fetch('/api/item/buy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        itemId: Number(itemId),
        token: localStorage.getItem('token')
      })
    })
    const data = await res.json()
    if (res.status === 200) {
      alert(`아이템을 구매하였습니다.\n남은 돈: ${data.money}`)
    } else {
      alert(`구매에 실패하였습니다.\n${data.error}`)
    }
    getItems()
  }

  async function resetItems(element: HTMLDivElement | null) {
    while (element?.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  async function getItems() {
    await resetItems(itemsList.current)

    const res = await fetch('/api/item/get')
    const data = await res.json()
    if (res.status !== 200) return alert('아이템 목록을 가져올 수 없습니다.')

    const inventoryRes = await fetch('/api/item/inventory', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: localStorage.getItem('token')
      })
    })
    const inventoryData = await inventoryRes.json()
    console.log(inventoryData)

    const inventoryDictionary: {[key: number]: number} = {}
    inventoryData.item.forEach((item: Inventory) => {
      inventoryDictionary[item.itemId] = item.itemCount
    })
    
    const items = data.item
    console.log(items)
    items.forEach((item: Item, i: number) => {
      setItemArray(itemArray => [...itemArray, 
        <div key={i} className={styles.item}>
          {/* <img src='img/logo.png' className={styles.itemImage}/> */}
          <h2>{item.name}</h2>
          <p>{item.description}</p>
          <p><b>{inventoryDictionary[i] ?? 0}개 보유중</b></p>
          <div className={styles.flex}>
            <img src='img/coin-small.svg' height={20}></img>
            <p><b>{item.price}p</b></p>
          </div>
          <button itemID={i.toString()} onClick={buyItem}>구매하기</button>
        </div>])
    })
  }

  return (
    <>
      <div className={styles.center}>
        <main className={styles.main}>
          <h1>교환소</h1>
          <div ref={itemsList} className={styles.items}>
            {
              itemArray
            }
          </div>
        </main>
      </div>
    </>
  )
}