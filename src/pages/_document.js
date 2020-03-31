import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

class Doc extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charset="UTF-8" />
          <meta name="description" content="A little about me, Zach Newton" />
          <meta
            name="keywords"
            content="Portfolio,About,React,Front-end,Experience,Software,Engineer,Seattle"
          />
          <meta name="author" content="Zach Newton" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default Doc;
