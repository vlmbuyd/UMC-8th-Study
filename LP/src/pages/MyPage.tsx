import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import { useAuth } from "../context/AuthContext";
import { ResponseMyInfoDTO } from "../types/auth";
import { useNavigate } from "react-router-dom";

export default function MyPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [data, setData] = useState<ResponseMyInfoDTO>();

  useEffect(() => {
    const getData = async () => {
      const res = await getMyInfo();
      setData(res);
    };
    getData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div>
      <h1>{data?.data.name}님 환영합니다</h1>
      <img src={data?.data.avatar as string} alt="logo" />
      <p>{data?.data.email}</p>

      <button
        className="cursor-pointer bg-blue-300 rounded-sm p-5 hover:scale-90"
        onClick={handleLogout}
      >
        로그아웃
      </button>
    </div>
  );
}
