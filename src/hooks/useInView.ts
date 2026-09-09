import { useEffect, useState, type RefObject } from "react";

/**
 * 元素是否还在视口里。底部留出停靠条的高度，
 * 被停靠条盖住的按钮也算「看不见」，否则两个按钮会同时出现。
 */
export function useInView(ref: RefObject<Element | null>): boolean {
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) setInView(entry.isIntersecting);
      },
      // 整个按钮完整露出才算可见，只冒出一角时仍然给停靠条
      { rootMargin: "0px 0px -76px 0px", threshold: 1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return inView;
}
