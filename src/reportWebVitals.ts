import { onFCP, onCLS, onINP, onLCP, onTTFB } from 'web-vitals';

export default function ReportWebVitals(onPerfEntry?: (paload: any) => void): void {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    onFCP(onPerfEntry);
    onCLS(onPerfEntry);
    onINP(onPerfEntry);
    onLCP(onPerfEntry);
    onTTFB(onPerfEntry);
  }
}