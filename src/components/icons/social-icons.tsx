import type { SVGProps } from "react";

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <path d="M17.5 6.5h.01" />
    </svg>
  );
}

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function WhatsappIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.44 1.32 4.94L2.05 22l5.29-1.39a9.9 9.9 0 0 0 4.7 1.2h.01c5.46 0 9.9-4.45 9.9-9.9C21.96 6.45 17.5 2 12.04 2zm5.83 14.15c-.24.68-1.4 1.31-1.93 1.35-.5.05-1 .25-3.37-.7-2.85-1.14-4.66-4.05-4.8-4.24-.14-.19-1.15-1.53-1.15-2.92 0-1.39.73-2.07.99-2.35.26-.28.57-.35.76-.35.19 0 .38 0 .55.01.17.01.42-.06.65.5.24.57.82 1.98.89 2.12.07.14.12.31.02.5-.09.19-.14.3-.28.46-.14.17-.3.37-.42.5-.14.14-.29.29-.13.57.17.28.75 1.24 1.61 2.01 1.1.99 2.03 1.29 2.31 1.44.28.14.44.12.61-.07.17-.19.72-.84.91-1.13.19-.28.38-.24.64-.14.26.09 1.65.78 1.94.92.28.14.47.21.54.33.07.12.07.68-.17 1.35z" />
    </svg>
  );
}
