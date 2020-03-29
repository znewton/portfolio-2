import React from 'react';
import styles from './Card.scss';

const Card = ({ img = {}, header, subheader, body, footer, id }) => (
  <section className={styles.Card}>
    {header && (
      <header>
        <h2>
          <a
            href={`#${id || encodeURIComponent(header)}`}
            id={`${id || encodeURIComponent(header)}`}
            dangerouslySetInnerHTML={{ __html: header }}
          />
        </h2>
        {subheader && <p dangerouslySetInnerHTML={{ __html: subheader }} />}
      </header>
    )}
    {img.src && (
      <figure>
        <img loading="lazy" {...img} />
        {img.alt && <figcaption>{img.alt}</figcaption>}
      </figure>
    )}
    {body && <p dangerouslySetInnerHTML={{ __html: body }} />}
    {footer && <footer dangerouslySetInnerHTML={{ __html: footer }} />}
  </section>
);
export default Card;
