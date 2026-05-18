type HeaderProps = {
  topic: string;
};

function Header({ topic }: HeaderProps) {
  return (
    <header className="flex w-full max-w-md items-center justify-between border-b border-[#1f2937] pb-4">
      <div className="flex items-center gap-2">
        <span className="bg-linear-to-r from-[#10b981] to-[#3b82f6] bg-clip-text text-xl font-black tracking-tight text-transparent">
          MINDSWIPE
        </span>
        <span className="rounded-full border border-gray-700 bg-[#1f2937] px-2 py-0.5 font-mono text-xs text-gray-400">
          v1.0
        </span>
      </div>
      <span className="max-w-56 truncate font-mono text-xs text-gray-500">
        {topic.split(" ")[0]}
      </span>
    </header>
  );
}

export default Header;
