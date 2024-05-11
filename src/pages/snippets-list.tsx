import { Button } from "@nextui-org/react";
import { IconCodeCircle, IconPlus } from "@tabler/icons-react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { availLanguages, defaultIndex } from "../constants";
import { useAuthContext } from "../context/useAuthContext";
import { db } from "../lib/firebase/database";
import { TItems } from "../types";
import { cn } from "../utils/cn";
import { BentoGrid, BentoGridItem } from "../components/ui/bento-grid";
import Skeleton from "../components/ui/skeleton";

function SnippetsList() {
  const { user } = useAuthContext();
  const [items, setItems] = useState<TItems>([]);
  async function handleAddButtonPress() {
    if (!user) {
      alert("You aren't logged in!");
      return;
    }
    try {
      const date = new Date();
      const snippetRef = await addDoc(collection(db, "snippets"), {
        members: [user.uid],
        language: availLanguages[defaultIndex].editorLanguage,
        title: `Snippet: ${date.toTimeString().split(" ")[0]}`,
        code: availLanguages[defaultIndex].defaultCode,
      });
      await addDoc(collection(db, "users"), {
        action: "created",
        snippetRef: snippetRef.id,
        uid: user.uid,
      });
    } catch (error) {
      console.log(
        "🚀 ~ file: snippets-list.tsx:83 ~ handleAddButtonPress ~ error:",
        error,
      );
    }
  }
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const unsub = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        const users = change.doc.data();
        if (change.type == "added" && users.action === "created") {
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
                icon: <IconCodeCircle className="h-5 w-5 text-neutral-500" />,
                snippetRef: users.snippetRef,
                title: users.title,
              },
            ]);
          }
        } else if (change.type == "modified" && users.action === "trashed") {
          setItems((prev) => [
            ...prev.filter((item) => item.snippetRef !== users.snippetRef),
          ]);
        }
      });
    });
    return () => {
      unsub();
    };
  }, []);
  return (
    <>
      <BentoGrid className="mx-auto max-w-5xl px-6 py-3">
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            className={cn(
              i === 3 || i === 6 ? "md:col-span-2" : "",
              "cursor-pointer",
            )}
            description={item.description}
            header={item.header}
            icon={item.icon}
            modalHeader="Deleting the snippet to Trash"
            snippetRef={item.snippetRef}
            title={item.title}
          />
        ))}
      </BentoGrid>
      <Button
        className="fixed bottom-[10%] right-5"
        color="success"
        isIconOnly
        onPress={handleAddButtonPress}
        radius="full"
        size="lg"
      >
        <IconPlus className="text-white" />
      </Button>
    </>
  );
}

export default SnippetsList;
