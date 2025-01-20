import Navbar from "../Navbar";
import { Outlet } from "react-router";

export default function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
