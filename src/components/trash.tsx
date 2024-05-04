import { IconCode } from "@tabler/icons-react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthContext } from "../context/auth-provider";
import { db } from "../lib/firebase/database";
import { TItems } from "../types";
import { BentoGrid, BentoGridItem } from "./ui/bento-grid";
import Skeleton from "./ui/skeleton";

function Trash() {
  const { user } = useAuthContext();
  const [items, setItems] = useState<TItems>([]);
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const data = change.doc.data();
        if (change.type == "added") {
          if (data.action === "trashed")
            setItems((prev) => [
              ...prev,
              {
                description: data.snippet.language,
                header: <Skeleton code={data.snippet.code} />,
                icon: <IconCode className="h-5 w-5 text-neutral-500" />,
                snippetRef: data.snippetRef,
                title: data.snippet.title,
              },
            ]);
        }
        if (change.type === "removed") {
          setItems((prev) =>
            prev.filter((item) => item.snippetRef !== data.snippetRef),
          );
        }
        if (change.type === "modified") {
          setItems((prev) =>
            prev.filter((item) => item.snippetRef !== data.snippetRef),
          );
        }
      });
    });
    return () => {
      unsubscribe();
    };
  }, []);
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
