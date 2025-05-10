import { useEffect, useState } from "react";
import { PAGINATION_ORDER } from "../enums/common";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";
import useGetLpList from "../hooks/queries/useGetLpList";
import { useInView } from "react-intersection-observer";
import LPCard from "../components/LPCard";
import LPCardSkeletonList from "../components/LPCardSkeletonList";

export default function HomePage() {
  const [search, setSearch] = useState<string>("");

  // const { data } = useGetLpList({
  //   cursor: 0,
  //   limit: 5,
  //   search: "type",
  //   order: PAGINATION_ORDER.asc,
  // });

  const { ref, inView } = useInView({ threshold: 0 });

  const {
    data: lps,
    isFetching,
    hasNextPage,
    isPending,
    fetchNextPage,
    isError,
  } = useGetInfiniteLpList(5, search, PAGINATION_ORDER.asc);

  console.log("lps", lps);

  useEffect(() => {
    if (inView && !isFetching && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage]);

  console.log(lps?.pages?.map((page) => page.data));

  return (
    <div className="container mx-auto px-4 py-6">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        type="text"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:gird-cols-4 gap-4">
        {isPending && <LPCardSkeletonList count={20} />}

        {lps?.pages
          ?.map((page) => page.data.data)
          .flat()
          .map((lp) => (
            <LPCard key={lp.id} lp={lp} />
          ))}
        {isFetching && <LPCardSkeletonList count={5} />}
        <div ref={ref} className="h-2" />
      </div>
    </div>
  );
}
