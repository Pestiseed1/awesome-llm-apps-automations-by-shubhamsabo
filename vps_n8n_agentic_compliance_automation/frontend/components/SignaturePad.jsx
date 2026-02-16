'use client';

import { useRef } from 'react';

export default function SignaturePad() {
  const canvasRef = useRef(null);

  function clear() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  return (
    <section>
      <h3>Customer Signature</h3>
      <canvas
        ref={canvasRef}
        width={420}
        height={160}
        style={{ border: '1px solid #ccc', borderRadius: 8, display: 'block', marginBottom: 12 }}
      />
      <button type="button" onClick={clear}>Clear Signature</button>
    </section>
  );
}
