import React, { useRef, useEffect } from 'react';
import Vector from 'victor';
import styles from './BouncingBubbles.scss';

const getBoundingBox = ({ pos, radius }) => ({
  top: pos.y - radius,
  bottom: pos.y + radius,
  right: pos.x + radius,
  left: pos.x - radius,
});

const detectBubbleCollision = (bubble1, bubble2) =>
  bubble1.pos.distance(bubble2.pos) <= bubble1.radius + bubble2.radius;

/**
 * Collision maths from https://en.wikipedia.org/wiki/Elastic_collision
 */
const applyVelocityOnCollision = (bubble1, bubble2) => {
  /**
   * @type {Array<Vector>}
   */
  const [v1, v2, x1, x2] = [bubble1.vel, bubble2.vel, bubble1.pos, bubble2.pos];
  const m1 = bubble1.radius;
  const m2 = bubble2.radius;

  bubble1.vel = v1.clone().subtract(
    x1
      .clone()
      .subtract(x2.clone())
      .multiplyScalar(
        v1.clone().subtract(v2.clone()).dot(x1.clone().subtract(x2.clone())) /
          Math.pow(x1.clone().subtract(x2.clone()).magnitude(), 2)
      )
      .multiplyScalar((2 * m2) / (m1 + m2))
  );
  bubble2.vel = v2.clone().subtract(
    x2
      .clone()
      .subtract(x1.clone())
      .multiplyScalar(
        v2.clone().subtract(v1.clone()).dot(x2.clone().subtract(x1.clone())) /
          Math.pow(x2.clone().subtract(x1.clone()).magnitude(), 2)
      )
      .multiplyScalar(1)
      .multiplyScalar((2 * m1) / (m1 + m2))
  );
};

const BouncingBubbles = ({ bubbleList = [] }) => {
  const canvasRef = useRef();
  useEffect(() => {
    /**
     * @type {HTMLCanvasElement}
     */
    const canvas = canvasRef.current;
    const parentComputedStyle = window.getComputedStyle(canvas.parentElement);
    canvas.width = canvas.offsetWidth;
    canvas.height = parseInt(parentComputedStyle.getPropertyValue('height'));
    const ctx = canvas.getContext('2d');
    let animationCallbackId;
    const getRandomLocation = () =>
      new Vector(0, 0).randomize(
        new Vector(0, 0),
        new Vector(canvas.offsetWidth, canvas.offsetHeight)
      );
    const numBubbles = bubbleList.length;
    const bubbles = bubbleList.map((bubble, i) => {
      const radius = 30 + numBubbles - i;
      console.log(bubble, i);
      const pos = getRandomLocation();
      const vx = Math.random();
      const vy = 1 - vx;
      const vel = new Vector(
        vx * (Math.random() > 0.5 ? 1 : -1),
        vy * (Math.random() > 0.5 ? 1 : -1)
      );
      return {
        ...bubble,
        pos,
        vel,
        radius,
      };
    });
    bubbles.forEach((bubble1, i) => {
      bubbles.forEach((bubble2, j) => {
        if (i === j) return;
        if (detectBubbleCollision(bubble1, bubble2)) {
          bubble2.pos = getRandomLocation();
        }
      });
    });

    const applyWallCollisions = () => {
      for (let i = 0; i < bubbles.length; i++) {
        const bubble = bubbles[i];
        const { top, right, left, bottom } = getBoundingBox(bubble);
        if (
          (right >= canvas.width && bubble.vel.x > 0) ||
          (left <= 0 && bubble.vel.x < 0)
        ) {
          bubble.vel.invertX();
        }
        if (
          (bottom >= canvas.height && bubble.vel.y > 0) ||
          (top <= 0 && bubble.vel.y < 0)
        ) {
          bubble.vel.invertY();
        }
      }
    };
    const applyBubbleCollisions = () => {
      const calcd = {};
      bubbles.forEach((bubble1, i) => {
        bubbles.forEach((bubble2, j) => {
          if (i === j || calcd[`${i},${j}`]) return;
          if (detectBubbleCollision(bubble1, bubble2)) {
            applyVelocityOnCollision(bubble1, bubble2);
            calcd[`${j},${i}`] = true;
          }
        });
      });
    };
    const updateBubbles = () => {
      applyWallCollisions();
      applyBubbleCollisions();
      bubbles.forEach((bubble) => {
        bubble.pos.add(bubble.vel);
      });
    };
    const renderBubbles = () => {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      bubbles.forEach((bubble) => {
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.shadowColor = 'rgba(0,0,0,0.1)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 5;
        ctx.arc(bubble.pos.x, bubble.pos.y, bubble.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.shadowColor = 'rgba(0,0,0,0.05)';
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 2;
        ctx.fillStyle = '#2e2e4b';
        ctx.font = `${bubble.radius - 6}px "Font Awesome 5 ${
          bubble.iconType || 'Pro'
        }"`;
        ctx.fillText(bubble.icon, bubble.pos.x, bubble.pos.y);
      });
    };
    const animate = () => {
      if (canvas.width !== canvas.offsetWidth)
        canvas.width = canvas.offsetWidth;
      if (canvas.height !== canvas.offsetHeight)
        canvas.height = canvas.offsetHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      updateBubbles();
      renderBubbles();

      animationCallbackId = window.requestAnimationFrame(animate);
    };
    animate();
    return () => {
      window.cancelAnimationFrame(animationCallbackId);
    };
  }, [canvasRef]);

  return <canvas ref={canvasRef} className={styles.BouncingBubbles} />;
};

export default BouncingBubbles;
