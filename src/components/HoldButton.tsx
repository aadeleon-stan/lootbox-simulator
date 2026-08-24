import { useRef, useState, useCallback } from 'react';

interface HoldButtonProps {
  label: string;
  onComplete: () => void;
  disabled?: boolean;
  durationMs?: number;
}

export default function HoldButton({ label, onComplete, disabled = false, durationMs = 3000 }: HoldButtonProps) {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const doneRef = useRef(false);

  const cancel = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    setProgress(0);
    doneRef.current = false;
  }, []);

  const tick = useCallback((now: number) => {
    if (!startTimeRef.current) startTimeRef.current = now;
    const elapsed = now - startTimeRef.current;
    const pct = Math.min(elapsed / durationMs, 1);
    setProgress(pct * 100);

    if (pct >= 1) {
      if (!doneRef.current) {
        doneRef.current = true;
        setProgress(0);
        onComplete();
      }
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [durationMs, onComplete]);

  const handlePointerDown = useCallback(() => {
    if (disabled) return;
    doneRef.current = false;
    startTimeRef.current = 0;
    rafRef.current = requestAnimationFrame(tick);
  }, [disabled, tick]);

  return (
    <button
      className={[
        'relative overflow-hidden px-6 py-3 rounded-lg font-semibold text-white select-none',
        'bg-purple-600 active:bg-purple-700',
        disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
      ].join(' ')}
      onPointerDown={handlePointerDown}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      disabled={disabled}
    >
      <span
        className="absolute inset-0 bg-white/25 origin-left"
        style={{ width: `${progress}%` }}
      />
      <span className="relative">{label}</span>
    </button>
  );
}
