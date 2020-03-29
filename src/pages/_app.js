import React from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/index.scss';

const App = ({ Component, pageProps }) => (
  <>
    <Head>
      <title>znewton - Portfolio</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
    </Head>
    <Header />
    <Component {...pageProps} />
    <Footer />
  </>
);

export default App;
