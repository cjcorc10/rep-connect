import Link from 'next/link';
import styles from './nav.module.scss';

const Links = [
  { href: '/', label: 'Home' },
  // { href: '/reps/all', label: 'Reps' },
  { href: '/about', label: 'About' },
];

export default function Nav() {

  return (
    <nav className={styles.nav}>
      <ul className={styles.navList}>
        {Links.map((link) => (
            <div 
            key={link.href} className={styles.listItem}>
              <Link href={link.href}>{link.label}</Link>
            </div>
        ))}
      </ul>
    </nav>
  );
}
