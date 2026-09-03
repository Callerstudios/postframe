export function ReplyIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M12 3C7.03 3 3 6.58 3 11c0 2.49 1.28 4.71 3.3 6.17-.1.99-.5 2.62-1.7 4.13 1.75-.15 3.5-.94 4.78-1.9A10.9 10.9 0 0 0 12 19c4.97 0 9-3.58 9-8s-4.03-8-9-8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function RepostIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M6 5.5h9a3 3 0 0 1 3 3V12M6 5.5 3.5 8M6 5.5 8.5 8M18 18.5H9a3 3 0 0 1-3-3V12M18 18.5l2.5-2.5M18 18.5l-2.5-2.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LikeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M12 20.2s-7.5-4.6-9.7-9.1C.6 7.9 2 4.6 5.3 3.9c2-.4 3.9.5 5 2.2C11.4 4.4 13.3 3.5 15.3 3.9c3.3.7 4.7 4 3 7.2-2.2 4.5-9.7 9.1-9.7 9.1Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M4 12v6.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V12M12 15V4M12 4 7.5 8.5M12 4l4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function VerifiedBadge({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 22 22" width="17" height="17" style={{ flexShrink: 0 }}>
      <path
        d="M11 1.6 13.4 3l2.9-.4 1.1 2.7 2.7 1.1-.4 2.9L21 12l-1.3 2.4.4 2.9-2.7 1.1-1.1 2.7-2.9-.4L11 22l-2.4-1.3-2.9.4-1.1-2.7-2.7-1.1.4-2.9L1 12l1.3-2.4-.4-2.9 2.7-1.1L5.7 3l2.9.4Z"
        fill={color}
      />
      <path
        d="M7.2 11.3l2.6 2.6 5-5.6"
        stroke="#fff"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}