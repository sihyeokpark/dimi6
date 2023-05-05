import styles from '@/styles/Navigator.module.css'
import Link from 'next/link'

export default function Navigator() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <Link href="/"><img src='img/logo.png'></img></Link>
        {/* <a className={styles.logo}>Dimi6</a> */}
      </div>
      <div className={styles.right}>
        <Link href="/shop">Shop</Link>
        <Link href="/login">Login</Link>
        {/* <img src="./exon.png"></img> */}
      </div>
    </nav>
  )
}