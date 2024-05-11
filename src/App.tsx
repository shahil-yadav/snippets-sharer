import { NextUIProvider } from "@nextui-org/react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import SnippetsList from "./pages/snippets-list";
import { useAuthContext } from "./context/useAuthContext";
import Auth from "./pages/auth";
import Home from "./pages/home";
import SharedWithMe from "./pages/shared-with-me";
import Snippet from "./pages/snippet";
import Trash from "./pages/trash";

function App() {
  const auth = getAuth();
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
  }, [user, setUser, auth]);
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
