import LPCardSekeleton from "./LPCardSekeleton";

interface LPCardSkeletonListProps {
  count: number;
}

export default function LPCardSkeletonList({ count }: LPCardSkeletonListProps) {
  return (
    <>
      {new Array(count).fill(0).map((_, idx) => (
        <LPCardSekeleton key={idx} />
      ))}
    </>
  );
}
