import React, { useRef, useEffect } from 'react';
import Vector from 'victor';
import styles from './BouncingBubbles.scss';
import { createPopper } from '@popperjs/core';

const getBubbleRadius = (bubble) =>
  bubble.radius * (!bubble.hasFocus ? 1 : 1.5);

const getBoundingBox = ({ pos, radius }) => ({
  top: pos.y - radius,
  bottom: pos.y + radius,
  right: pos.x + radius,
  left: pos.x - radius,
});

const mouse = { pos: new Vector(-100, -100), vel: new Vector(0, 0), radius: 1 };

const detectBubbleCollision = (bubble1, bubble2) =>
  bubble1.pos.clone().add(bubble1.vel).distance(bubble2.pos) <=
  getBubbleRadius(bubble1) + getBubbleRadius(bubble2);

/**
 * Collision maths from https://en.wikipedia.org/wiki/Elastic_collision
 */
const applyVelocityOnCollision = (bubble1, bubble2) => {
  /**
   * @type {Array<Vector>}
   */
  const [v1, v2, x1, x2] = [bubble1.vel, bubble2.vel, bubble1.pos, bubble2.pos];
  const m1 = getBubbleRadius(bubble1);
  const m2 = getBubbleRadius(bubble2);

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
    let canvasRect = canvas.getBoundingClientRect();
    const parentComputedStyle = window.getComputedStyle(canvas.parentElement);
    canvas.width = canvas.offsetWidth;
    canvas.height = parseInt(parentComputedStyle.getPropertyValue('height'));
    const ctx = canvas.getContext('2d');
    let animationCallbackId;
    /**
     * @param {MouseEvent} e
     */
    const canvasMouseMoveListener = (e) => {
      mouse.pos.x = e.clientX - canvasRect.left;
      mouse.pos.y = e.clientY - canvasRect.top;
    };
    const canvasMouseLeaveListener = () => {
      mouse.pos.x = -100;
      mouse.pos.y = -100;
    };
    canvas.addEventListener('mousemove', canvasMouseMoveListener);
    canvas.addEventListener('mouseleave', canvasMouseLeaveListener);

    const getRandomLocation = () =>
      new Vector(0, 0).randomize(
        new Vector(0, 0),
        new Vector(canvas.offsetWidth, canvas.offsetHeight)
      );
    const numBubbles = bubbleList.length;
    const bubbles = bubbleList.map((bubble, i) => {
      const radius = 30 + numBubbles - i;
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

    let openPopover, pseudobubble;
    const renderPopover = (bubble) => {
      if (openPopover) return;
      pseudobubble = document.createElement('div');
      pseudobubble.className = styles.Pseudobubble;
      const radius = getBubbleRadius(bubble);
      pseudobubble.style.top = `${canvas.offsetTop + bubble.pos.y - radius}px`;
      pseudobubble.style.left = `${
        canvas.offsetLeft + bubble.pos.x - radius
      }px`;
      console.log(bubble.hasFocus);
      pseudobubble.style.height = `${radius * 2}px`;
      pseudobubble.style.width = `${radius * 2}px`;
      document.body.appendChild(pseudobubble);
      openPopover = document.createElement('div');
      openPopover.className = styles.BubblePopover;
      openPopover.setAttribute('role', 'tooltip');
      openPopover.textContent = bubble.title;
      const popoverArrow = document.createElement('div');
      popoverArrow.className = styles.BubblePopover__arrow;
      popoverArrow.setAttribute('data-popper-arrow', 1);
      openPopover.appendChild(popoverArrow);
      document.body.appendChild(openPopover);
      createPopper(pseudobubble, openPopover);
    };
    const hidePopover = () => {
      if (openPopover) {
        document.body.removeChild(pseudobubble);
        document.body.removeChild(openPopover);
        openPopover = undefined;
        pseudobubble = undefined;
      }
    };
    const applyBubbleFocus = () => {
      let popoverOpen = false;
      bubbles.forEach((bubble) => {
        if (!popoverOpen && detectBubbleCollision(bubble, mouse)) {
          bubble.hasFocus = true;
          renderPopover(bubble);
          popoverOpen = true;
        } else if (mouse.pos.x > 0 && mouse.pos.y > 0) {
          if (bubble.hasFocus) {
            hidePopover();
          }
          bubble.hasFocus = false;
        }
      });
      canvas.setAttribute('aria-expanded', popoverOpen ? 'true' : 'false');
    };
    const applyWallCollisions = () => {
      for (let i = 0; i < bubbles.length; i++) {
        const bubble = bubbles[i];
        const { top, right, left, bottom } = getBoundingBox(bubble);
        if (
          (right >= canvasRect.right && bubble.vel.x > 0) ||
          (left <= canvasRect.left && bubble.vel.x < 0)
        ) {
          bubble.vel.invertX();
        }
        if (
          (bottom >= canvasRect.bottom && bubble.vel.y > 0) ||
          (top <= canvasRect.top && bubble.vel.y < 0)
        ) {
          bubble.vel.invertY();
        }
      }
    };
    const applyBubbleCollisions = () => {
      const calcd = {};
      bubbles.forEach((bubble1, i) => {
        bubbles.forEach((bubble2, j) => {
          if (i === j || calcd[`${j},${i}`]) return;
          if (detectBubbleCollision(bubble1, bubble2)) {
            applyVelocityOnCollision(bubble1, bubble2);
            calcd[`${i},${j}`] = true;
          }
        });
      });
    };
    const updateBubbles = () => {
      applyBubbleFocus();
      applyWallCollisions();
      applyBubbleCollisions();
      bubbles.forEach((bubble) => {
        if (bubble.hasFocus) return;
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
        ctx.arc(
          bubble.pos.x,
          bubble.pos.y,
          getBubbleRadius(bubble),
          0,
          2 * Math.PI
        );
        ctx.fill();
        ctx.shadowColor = 'rgba(0,0,0,0.05)';
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 2;
        ctx.fillStyle = '#2e2e4b';
        ctx.font = `${getBubbleRadius(bubble) - 6}px "Font Awesome 5 ${
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
      canvasRect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      updateBubbles();
      renderBubbles();

      animationCallbackId = window.requestAnimationFrame(animate);
    };
    animate();
    return () => {
      canvas.removeEventListener('mousemove', canvasMouseMoveListener);
      canvas.removeEventListener('mouseleave', canvasMouseLeaveListener);
      window.cancelAnimationFrame(animationCallbackId);
      hidePopover();
    };
  }, [canvasRef]);

  return <canvas ref={canvasRef} className={styles.BouncingBubbles} />;
};

export default BouncingBubbles;
