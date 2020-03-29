import React from 'react';
import styles from './Footer.scss';

const Footer = () => (
  <footer className={styles.Footer}>
    <address>
      &copy; {new Date().getFullYear()} by Zach Newton
      <br /> Contact:{' '}
      <a href="mailTo:znewton13@gmail.com">znewton13@gmail.com</a>
      <br />
      GitHub: <a href="https://github.com/znewton">/znewton</a>
      <br />
      Seattle, WA 98144
    </address>
  </footer>
);

export default Footer;
