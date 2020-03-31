import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/index.scss';

const App = ({ Component, pageProps }) => (
  <>
    <Header />
    <Component {...pageProps} />
    <Footer />
  </>
);

export default App;
