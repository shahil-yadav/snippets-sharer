import { IconCode } from "@tabler/icons-react";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthContext } from "../context/useAuthContext";
import { db } from "../lib/firebase/database";
import { TItems } from "../types";
import { BentoGrid, BentoGridItem } from "../components/ui/bento-grid";
import Skeleton from "../components/ui/skeleton";

function Trash() {
  const { user } = useAuthContext();
  const [items, setItems] = useState<TItems>([]);
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "users"),
      where("uid", "==", user.uid),
      where("action", "==", "trashed"),
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        const users = change.doc.data();
        if (change.type == "added") {
          const snippetDoc = await getDoc(
            doc(db, "snippets", users.snippetRef),
          );
          if (snippetDoc.exists()) {
            const snippet = snippetDoc.data();
            setItems((prev) => [
              ...prev,
              {
                description: snippet.language,
                header: <Skeleton code={snippet.code} />,
                icon: <IconCode className="h-5 w-5 text-neutral-500" />,
                snippetRef: users.snippetRef,
                title: snippet.title,
              },
            ]);
          }
        }
        if (change.type === "removed") {
          setItems((prev) =>
            prev.filter((item) => item.snippetRef !== users.snippetRef),
          );
        }
        if (change.type === "modified") {
          setItems((prev) =>
            prev.filter((item) => item.snippetRef !== users.snippetRef),
          );
        }
      });
    });
    return () => {
      unsubscribe();
    };
  }, []);
  if (items.length === 0) {
    return (
      <div className="flex h-full items-center justify-center px-5">
        <h1 className="text-3xl font-medium">
          You have no snippets in the trash{" "}
          <span className="text-red-500 underline">currently</span>
        </h1>
      </div>
    );
  }
  return (
    <>
      <BentoGrid className="mx-auto max-w-5xl px-6 py-3">
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            className={i > 0 && i % 2 === 1 ? "md:col-span-2" : ""}
            description={item.description}
            header={item.header}
            icon={item.icon}
            snippetRef={item.snippetRef}
            title={item.title}
            modalHeader="You are about to delete your snippet permanently, there's no going back after this"
            modalBody="Are you sure you want to delete"
          />
        ))}
      </BentoGrid>
    </>
  );
}

export default Trash;
