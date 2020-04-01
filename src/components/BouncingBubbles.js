import React, { useRef, useEffect } from 'react';
import styles from './BouncingBubbles.scss';

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
    const bubbles = bubbleList.map((bubble) => ({
      ...bubble,
      x: Math.floor(Math.random() * canvas.offsetWidth),
      y: Math.floor(Math.random() * canvas.offsetHeight),
      xVel: Math.random() < 0.5 ? 1 : -1,
      yVel: Math.random() < 0.5 ? 1 : -1,
      radius: Math.floor(Math.random() * 20) + 30,
    }));
    const checkCollision = (bubble) => {
      let [left, top, right, bottom] = [0, 0, 0, 0];
      if (bubble.x + bubble.radius >= canvas.width) {
        right = 1;
      }
      if (bubble.x - bubble.radius <= 0) {
        left = 1;
      }
      if (bubble.y + bubble.radius >= canvas.height) {
        bottom = 1;
      }
      if (bubble.y - bubble.radius <= 0) {
        top = 1;
      }
      return { top, left, right, bottom };
    };
    const updateBubbles = () => {
      bubbles.forEach((bubble) => {
        const collision = checkCollision(bubble);
        if (collision.left || collision.right) {
          bubble.xVel = -1 * bubble.xVel;
        }
        if (collision.top || collision.bottom) {
          bubble.yVel = -1 * bubble.yVel;
        }
        bubble.x += bubble.xVel;
        bubble.y += bubble.yVel;
      });
    };
    const renderBubbles = () => {
      ctx.shadowColor = 'rgba(0,0,0,0.1)';
      ctx.shadowBlur = 15;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 5;
      ctx.fillStyle = 'white';
      bubbles.forEach((bubble) => {
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, 2 * Math.PI);
        ctx.fill();
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
