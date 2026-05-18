type FooterSectionProps = {
  label: string;
  items: string[];
  type: "known" | "unfamiliar";
};

const textColor: Record<FooterSectionProps["type"], string> = {
  known: "text-[#10b981]",
  unfamiliar: "text-red-400",
};
const borderColor: Record<FooterSectionProps["type"], string> = {
  known: "border-[#10b981]",
  unfamiliar: "border-red-500/50",
};

function FooterSection({ label, items, type }: FooterSectionProps) {
  return (
    <div>
      <div className="mb-2 flex justify-between px-1 text-zinc-400">
        <span className="uppercase">{label}</span>
        <span className={`font-bold ${textColor[type]}`}>{items.length}</span>
      </div>
      <div className="max-h-24 scrollbar-thin space-y-1 overflow-y-auto rounded-lg border border-zinc-900 bg-zinc-950/50 p-2">
        {items.length === 0 ? (
          <span className="block p-1 text-zinc-700 italic">Empty</span>
        ) : (
          items.map((item, idx) => (
            <div
              key={idx}
              className={`truncate rounded border-l ${borderColor[type]} bg-zinc-900/40 px-2 py-1 text-zinc-300`}
            >
              {item}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default FooterSection;
