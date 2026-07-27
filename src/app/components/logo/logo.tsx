export const Logo = () => {
  return (
    <svg viewBox="0 0 50 50" fill="none">
      <path
        d="M 40 24 v 18.5"
        stroke="var(--blue-accent)"
        strokeWidth="5"
      />
      <circle
        cx="25"
        cy="25"
        r="15"
        stroke="var(--blue-accent)"
        strokeWidth="5"
        pathLength="100"
        strokeDasharray="85 15"
        strokeDashoffset="-15"
      />
    </svg>
  );
};
