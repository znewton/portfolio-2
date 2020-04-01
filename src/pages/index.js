import React from 'react';
import Head from 'next/head';
import BouncingBubbles from '../components/BouncingBubbles';
import content from '../content/index.json';

const Index = () => (
  <main>
    <Head>
      <title>znewton - Portfolio</title>
    </Head>
    <BouncingBubbles bubbleList={content.bubbles || []} />
  </main>
);

export default Index;
