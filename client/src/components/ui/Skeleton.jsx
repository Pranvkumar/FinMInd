/**
 * Skeleton.jsx — Pulsing placeholder for loading states
 * 
 * Displays gray animated boxes while data is being fetched
 * or AI is processing.
 */

const Skeleton = ({ className = "", count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse rounded-xl bg-slate-800/60 ${className}`}
        />
      ))}
    </>
  );
};

export default Skeleton;
