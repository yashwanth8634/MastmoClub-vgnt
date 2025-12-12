export default function GallerySkeleton() {
  return (
    <div className="flex w-full overflow-hidden gap-2 md:gap-4 px-2 h-[300px] md:h-[400px]">
      {[1, 2, 3, 4, 5].map((i) => (
        <div 
          key={i} 
          className="h-full rounded-2xl bg-white/5 border border-white/10 animate-pulse"
          style={{ width: i === 1 ? "30rem" : "5rem" }} // Simulate expanded first item
        />
      ))}
    </div>
  );
}