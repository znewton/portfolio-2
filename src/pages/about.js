import React from 'react';
import Head from 'next/head';
import content from '../content/about.json';
import Card from '../components/Card';

const About = () => (
  <main>
    <Head>
      <title>About | znewton - Portfolio</title>
    </Head>
    <h1>About</h1>
    {(content.sections || []).map((section, i) => (
      <Card key={section.id || i} {...section} />
    ))}
  </main>
);

export default About;
