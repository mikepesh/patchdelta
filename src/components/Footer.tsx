interface FooterProps {
  lastUpdated: string;
}

export function Footer({ lastUpdated }: FooterProps) {
  return (
    <footer className="border-t border-gray-800 bg-gray-950 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center text-sm text-gray-500">
        <span>Last updated: {lastUpdated || '—'}</span>
        <a href="#methodology" className="text-blue-400 hover:underline">
          Methodology
        </a>
      </div>
    </footer>
  );
}
