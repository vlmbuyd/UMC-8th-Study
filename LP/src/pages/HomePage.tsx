import { PAGINATION_ORDER } from "../enums/common";
import useGetLpList from "../hooks/queries/useGetLpList";

export default function HomePage() {
  const { data } = useGetLpList({
    // cursor: 0,
    // limit: 10,
    // search: "type",
    // order: PAGINATION_ORDER.asc,
  });

  console.log("data", data);

  return <div>{data?.map((lp) => lp.title)}</div>;
}
