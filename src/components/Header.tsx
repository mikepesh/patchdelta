export function Header() {
  return (
    <header className="border-b border-gray-800 bg-gray-950 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col">
        <span className="text-2xl font-bold tracking-tight text-gray-100">PatchDelta</span>
        <span className="text-sm text-gray-400">Vendor Patch Response Times</span>
      </div>
    </header>
  );
}
