import { LP } from "../types/lp";

interface LPCardProps {
  lp: LP;
}

export default function LPCard({ lp }: LPCardProps) {
  return (
    <div
      key={lp.id}
      className="relative rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
    >
      <img
        src={lp.thumbnail}
        alt={lp.title}
        className="object-cover w-full h-48"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gray-600 bg-opacity-75 p-2">
        <h3 className="text-white text-sm font-semibold">{lp.title}</h3>
      </div>
    </div>
  );
}
