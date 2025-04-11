import { Outlet } from "react-router-dom";

export default function HomeLayout() {
  return (
    <div className="h-dvh flex flex-col">
      <nav>네비게이션</nav>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer>푸터</footer>
    </div>
  );
}
