export default function LPCardSekeleton() {
  return (
    <div className="relative rounded-lg overflow-hidden shadow-2xl animate-pulse">
      <img className="bg-gray-300 w-full h-48" />
      <div className="absolute bottom-0 left-0 right-0 bg-gray-600 bg-opacity-75 p-2">
        <h3 className="bg-gray-400 w-3/4 rounded-sm" />
      </div>
    </div>
  );
}
