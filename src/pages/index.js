import React from 'react';
import Head from 'next/head';
import BouncingBubbles from '../components/BouncingBubbles';
import content from '../content/index.json';

const Index = () => (
  <main>
    <Head>
      <title>znewton - Portfolio</title>
      <link
        rel="stylesheet"
        href="https://pro.fontawesome.com/releases/v5.13.0/css/solid.css"
        integrity="sha384-9mSry5MRUHIfL5zghm8hV6FRKJIMfpofq3NWCyo+Kko5c16y0um8WfF5lB2EGIHJ"
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        href="https://pro.fontawesome.com/releases/v5.13.0/css/brands.css"
        integrity="sha384-YJugi/aYht+lwnwrJEOZp+tAEQ+DxNy2WByHkJcz+0oxlJu8YMSeEwsvZubB8F/E"
        crossOrigin="anonymous"
      />
    </Head>
    <BouncingBubbles bubbleList={content.bubbles || []} />
  </main>
);

export default Index;
