import { useEffect } from "react";
import { getMyInfo } from "../apis/auth";

export default function MyPage() {
  useEffect(() => {
    const getData = async () => {
      const res = await getMyInfo();
      console.log(res);
    };
    getData();
  }, []);

  return <div>MyPage</div>;
}
