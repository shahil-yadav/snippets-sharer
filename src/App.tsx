import { NextUIProvider } from "@nextui-org/react";
import { useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useAuthContext } from "./context/useAuthContext";
import { auth } from "./lib/firebase/auth";
import Auth from "./pages/auth";
import Home from "./pages/home";
import SharedWithMe from "./pages/shared-with-me";
import Snippet from "./pages/snippet";
import SnippetsList from "./pages/snippets-list";
import Trash from "./pages/trash";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const navigate = useNavigate();
  const { user, setUser } = useAuthContext();
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user_snapshot) => {
      if (user_snapshot && !user) {
        setUser(user_snapshot);
      } else if (!user_snapshot) setUser(null);
    });
    return () => {
      unsub();
    };
  }, [setUser, user]);

  return (
    <NextUIProvider navigate={navigate}>
      <Routes>
        <Route path="/" element={<PrivateLayout />}>
          <Route index element={<SnippetsList />} />
          <Route path="trash" element={<Trash />} />
          <Route path="shared-with-me" element={<SharedWithMe />} />
          <Route path="snippet/:id" element={<Snippet />} />
        </Route>
        <Route
          path="/404"
          element={<h1 className="text-red-500">404! Not found</h1>}
        />
        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
    </NextUIProvider>
  );
}

function PrivateLayout() {
  const { user } = useAuthContext();
  return user === null ? <Auth /> : <Home />;
}

export default App;
