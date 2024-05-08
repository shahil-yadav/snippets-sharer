import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { IconRestore, IconTrash } from "@tabler/icons-react";
import {
  arrayRemove,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  runTransaction,
  updateDoc,
  where,
} from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../../lib/firebase/database";
import { cn } from "../../utils/cn";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-3 ",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  documentId,
  header,
  modalBody,
  modalHeader,
  icon,
  snippetRef,
  uid,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  documentId?: string;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  modalHeader?:
    | "Deleting the snippet to Trash"
    | "Opt out of the snippet"
    | "You are about to delete your snippet permanently, there's no going back after this";
  modalBody?: string;
  snippetRef: string;
  uid?: string;
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const location = useLocation();
  const navigate = useNavigate();
  async function handleDeleteSnippet(
    mode: "trash" | "delete",
    onClose: () => void,
  ) {
    if (mode === "trash") {
      const q = query(
        collection(db, "users"),
        where("snippetRef", "==", snippetRef),
      );
      try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (document) => {
          try {
            const usersRef = doc(db, "users", document.id);
            await updateDoc(usersRef, {
              action: "trashed",
            });
          } catch (error) {
            console.error(
              "🚀 ~ file: bento-grid.tsx:59 ~ querySnapshot.forEach ~ error:",
              error,
            );
          }
        });
      } catch (error) {
        console.error(
          "🚀 ~ file: bento-grid.tsx:56 ~ handleDeleteSnippet ~ error:",
          error,
        );
      }
    } else if (mode === "delete") {
      const q = query(
        collection(db, "users"),
        where("snippetRef", "==", snippetRef),
      );
      try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (document) => {
          try {
            const usersRef = doc(db, "users", document.id);
            await deleteDoc(usersRef);
          } catch (error) {
            console.error(
              "🚀 ~ file: bento-grid.tsx:59 ~ querySnapshot.forEach ~ error:",
              error,
            );
          }
        });
        await deleteDoc(doc(db, "snippets", snippetRef));
      } catch (error) {
        console.error(
          "🚀 ~ file: bento-grid.tsx:56 ~ handleDeleteSnippet ~ error:",
          error,
        );
      }
    } else {
      alert("Button mode is incorrectly passed");
    }
    onClose();
  }
  async function handleRestoreSnippet() {
    const q = query(
      collection(db, "users"),
      where("snippetRef", "==", snippetRef),
    );
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (document) => {
        try {
          const usersRef = doc(db, "users", document.id);
          await updateDoc(usersRef, {
            action: "created",
          });
        } catch (error) {
          console.error(
            "🚀 ~ file: bento-grid.tsx:59 ~ querySnapshot.forEach ~ error:",
            error,
          );
        }
      });
    } catch (error) {
      console.error(
        "🚀 ~ file: bento-grid.tsx:56 ~ handleDeleteSnippet ~ error:",
        error,
      );
    }
  }
  async function handleLeaveSnippet(onClose: () => void) {
    if (!uid) return;
    try {
      await runTransaction(db, async (transaction) => {
        transaction.update(doc(db, "snippets", snippetRef), {
          members: arrayRemove(uid),
        });
        if (!documentId) return;
        transaction.delete(doc(db, "users", documentId));
      });
    } catch (error) {
      console.error(
        "📑 ~ file: bento-grid.tsx:163 ~ handleLeaveSnippet ~ error:",
        error,
      );
    } finally {
      onClose();
    }
  }
  function handleRedirect() {
    navigate(`/snippet/${snippetRef}`);
  }
  return (
    <>
      <div
        className={cn(
          "group/bento shadow-input row-span-1 flex flex-col justify-between space-y-4 rounded-xl border border-transparent bg-white p-4 transition duration-200 hover:shadow-xl dark:border-white/[0.2] dark:bg-black dark:shadow-none",
          className,
        )}
        onClick={handleRedirect}
      >
        {header}
        <div className="flex items-center justify-between">
          <div className="transition duration-200 group-hover/bento:translate-x-2">
            {icon}
            <div className="mb-2 mt-2 font-sans font-bold text-neutral-600 dark:text-neutral-200">
              {title}
            </div>
            <div className="font-sans text-xs font-normal text-neutral-600 dark:text-neutral-300">
              {description}
            </div>
          </div>
          <div className="flex gap-2">
            {location.pathname === "/trash" && (
              <Button color="success" isIconOnly onPress={handleRestoreSnippet}>
                <IconRestore />
              </Button>
            )}
            <Button
              isIconOnly
              aria-label="Trash"
              onPress={onOpen}
              color="danger"
            >
              <IconTrash />
            </Button>
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {modalHeader}
              </ModalHeader>
              <ModalBody>{modalBody}</ModalBody>
              <ModalFooter>
                <Button color="primary" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="danger"
                  onPress={() => {
                    if (location.pathname === "/shared-with-me") {
                      handleLeaveSnippet(onClose);
                      return;
                    }
                    handleDeleteSnippet(
                      location.pathname === "/trash" ? "delete" : "trash",
                      onClose,
                    );
                  }}
                >
                  {modalHeader === "Opt out of the snippet"
                    ? "Leave"
                    : "Delete"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
