import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './Header.scss';

const HeaderLink = ({ href, children }) => {
  const { pathname } = useRouter();
  const isActive = pathname === href;
  return (
    <Link href={href}>
      <a className={isActive ? styles.ActiveLink : undefined}>{children}</a>
    </Link>
  );
};

const Header = () => (
  <nav className={styles.Header}>
    <div className={styles.HeaderContainer}>
      <HeaderLink href="/experience">Experience</HeaderLink>
      <HeaderLink href="/">
        <span>Zach</span>
        <span>Newton</span>
      </HeaderLink>
      <HeaderLink href="/about">About</HeaderLink>
    </div>
  </nav>
);

export default Header;
