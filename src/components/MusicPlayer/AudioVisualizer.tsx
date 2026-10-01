import React, { useEffect, useRef } from 'react';
import { useAudio } from '../../context/AudioContext';

interface VisualizerProps {
  className?: string;
  barCount?: number;
  height?: number;
  mode?: 'bars' | 'waveform';
}

export const AudioVisualizer: React.FC<VisualizerProps> = ({
  className = '',
  barCount = 24,
  height = 36,
  mode = 'bars'
}) => {
  const { analyserNode, isPlaying } = useAudio();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const bufferLength = analyserNode ? analyserNode.frequencyBinCount : 32;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animId = requestAnimationFrame(render);

      const width = canvas.width;
      const cHeight = canvas.height;
      ctx.clearRect(0, 0, width, cHeight);

      if (analyserNode && isPlaying) {
        analyserNode.getByteFrequencyData(dataArray);
      }

      if (mode === 'waveform') {
        ctx.beginPath();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.7)';
        const sliceWidth = width / barCount;
        let x = 0;

        for (let i = 0; i < barCount; i++) {
          const val = isPlaying ? (dataArray[i % dataArray.length] || 20) / 255 : Math.sin(Date.now() * 0.003 + i) * 0.15 + 0.2;
          const y = cHeight / 2 + (val - 0.5) * cHeight * 0.8;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }
        ctx.stroke();
      } else {
        const gap = 3;
        const totalGap = gap * (barCount - 1);
        const barWidth = Math.max(2, (width - totalGap) / barCount);

        for (let i = 0; i < barCount; i++) {
          let magnitude = 0.1;
          if (isPlaying && analyserNode) {
            const index = Math.floor((i / barCount) * (dataArray.length * 0.6));
            magnitude = (dataArray[index] || 10) / 255;
          } else if (isPlaying) {
            magnitude = 0.2 + 0.3 * Math.abs(Math.sin(Date.now() * 0.004 + i * 0.4));
          } else {
            magnitude = 0.06;
          }

          const barH = Math.max(3, magnitude * cHeight);
          const x = i * (barWidth + gap);
          const y = (cHeight - barH) / 2;

          // Soft amber gradient
          const grad = ctx.createLinearGradient(0, y, 0, y + barH);
          grad.addColorStop(0, 'rgba(251, 191, 36, 0.9)');
          grad.addColorStop(1, 'rgba(217, 119, 6, 0.4)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barH, 2);
          ctx.fill();
        }
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [analyserNode, isPlaying, barCount, mode]);

  return (
    <canvas
      ref={canvasRef}
      width={barCount * 8}
      height={height}
      className={`block pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
};
