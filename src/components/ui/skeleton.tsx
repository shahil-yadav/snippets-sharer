import { TextGenerateEffect } from "./text-generate-effect";

const Skeleton = ({ code }: { code: string }) => (
  <div className="flex h-full min-h-[6rem] w-full flex-1 rounded-xl bg-gradient-to-br from-neutral-200 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
    <TextGenerateEffect className="px-5" words={code.slice(20)} />
  </div>
);

export default Skeleton;
