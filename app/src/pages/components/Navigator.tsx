import styles from '@/styles/Navigator.module.css'

export default function Navigator() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <img src='./logo.png'></img>
        {/* <a className={styles.logo}>Dimi6</a> */}
      </div>
      <div className={styles.right}>
        <a>Home</a>
        <a>Point</a>
        <img src="./exon.png"></img>
      </div>
    </nav>
  )
}