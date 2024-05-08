import { TextGenerateEffect } from "./text-generate-effect";

const Skeleton = ({ code }: { code: string }) => {
  const firstBreakLine = [...code].findIndex((val) => val === "\n");
  const startingIndex = code[0] == "/" && code[1] == "/" ? 2 : 0;
  return (
    <div className="flex h-full min-h-[6rem] w-full flex-1 rounded-xl bg-gradient-to-br from-neutral-200 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
      <div className="flex h-full items-center pl-5">
        <TextGenerateEffect
          words={
            firstBreakLine === -1
              ? "Empty"
              : code.slice(startingIndex, firstBreakLine)
          }
        />
      </div>
    </div>
  );
};

export default Skeleton;
