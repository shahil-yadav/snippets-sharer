import { Outlet } from "react-router-dom";
import { Header } from "../components/header";
import Footer from "../components/footer";

function Home() {
  return (
    <main className="flex h-[100svh] flex-col  overflow-y-auto">
      <Header />
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
      <Footer />
    </main>
  );
}

export default Home;
