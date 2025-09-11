import { RefObject } from "react"


interface IObserverProps {
  target: RefObject<HTMLElement>;
  options: IntersectionObserverInit;
  onIntersection: () => void;
}

export const useObserver = ({ target, options, onIntersection }: IObserverProps) => {
  useEffect(() => {
    let observer: IntersectionObserver;
    if (target && target.current) {
      observer = new IntersectionObserver(([entry]) => {
        return entry.isIntersecting && onIntersection();
      }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
        ...options
      });

      observer.observe(target.current);
    }
    return () => observer && observer.disconnect();
  }, [target, options, onIntersection]);

}