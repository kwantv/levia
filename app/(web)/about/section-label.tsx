export default function SectionLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="bg-primary size-1.5 shrink-0" />

      <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.22em]">
        {children}
      </span>
    </div>
  );
}
