import React from 'react';
import Head from 'next/head';
import content from '../content/experience.json';
import Card from '../components/Card';

const Experience = () => (
  <main>
    <Head>
      <title>Experience | znewton - Portfolio</title>
    </Head>
    <h1>Experience</h1>
    {(content.sections || []).map((section, i) => (
      <Card key={section.id || i} {...section} />
    ))}
  </main>
);

export default Experience;
