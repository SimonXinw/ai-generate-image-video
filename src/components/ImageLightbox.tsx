import { useCallback, useEffect, useRef, useState } from "react";
import { LIGHTBOX_MAX_SCALE, LIGHTBOX_MIN_SCALE, LIGHTBOX_STEP } from "../constants";
import type { LightboxProps } from "../types";

export function ImageLightbox({ imageUrl, onClose }: LightboxProps) {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const dragFrom = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  const reset = useCallback(() => {
    setScale(1);
    setRotation(0);
    setOffset({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    reset();
  }, [imageUrl, reset]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const zoom = useCallback((delta: number) => {
    setScale((prev) => {
      const next = prev + delta;
      if (next < LIGHTBOX_MIN_SCALE) return LIGHTBOX_MIN_SCALE;
      if (next > LIGHTBOX_MAX_SCALE) return LIGHTBOX_MAX_SCALE;
      return Number(next.toFixed(2));
    });
  }, []);

  // React 把 wheel 注册成 passive，要缩放必须自己挂非 passive 监听
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoom(e.deltaY < 0 ? LIGHTBOX_STEP : -LIGHTBOX_STEP);
    };
    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [zoom]);

  return (
    <div className="lightbox" role="dialog" aria-modal="true" onClick={onClose}>
      <div
        ref={stageRef}
        className="lightbox-stage"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          className={dragging ? "dragging" : ""}
          src={imageUrl}
          alt="放大预览"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale}) rotate(${rotation}deg)`,
          }}
          draggable={false}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            dragFrom.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
            setDragging(true);
          }}
          onPointerMove={(e) => {
            const from = dragFrom.current;
            if (!from) return;
            setOffset({
              x: from.ox + (e.clientX - from.x),
              y: from.oy + (e.clientY - from.y),
            });
          }}
          onPointerUp={(e) => {
            e.currentTarget.releasePointerCapture(e.pointerId);
            dragFrom.current = null;
            setDragging(false);
          }}
          onPointerCancel={() => {
            dragFrom.current = null;
            setDragging(false);
          }}
          onDoubleClick={reset}
        />
      </div>
      <div className="lightbox-bar" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={() => zoom(-LIGHTBOX_STEP)}>
          缩小
        </button>
        <button type="button" onClick={() => zoom(LIGHTBOX_STEP)}>
          放大
        </button>
        <button type="button" onClick={() => setRotation((r) => r - 90)}>
          左转
        </button>
        <button type="button" onClick={() => setRotation((r) => r + 90)}>
          右转
        </button>
        <button type="button" onClick={reset}>
          还原
        </button>
        <span className="muted small">{Math.round(scale * 100)}%</span>
        <button type="button" onClick={onClose}>
          关闭
        </button>
      </div>
    </div>
  );
}
