import { useVendorData } from './hooks/useVendorData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Leaderboard } from './components/Leaderboard';
import { CveTable } from './components/CveTable';
import { Methodology } from './components/Methodology';

export default function App() {
  const { vendors, allCves, lastUpdated } = useVendorData();

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-12 space-y-16">

        <section>
          <h2 className="text-xl font-semibold text-gray-300 mb-6">Leaderboard</h2>
          <Leaderboard vendors={vendors} />
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-300 mb-6">CVE Comparison</h2>
          <CveTable cves={allCves} />
        </section>

        <Methodology />

      </main>

      <Footer lastUpdated={lastUpdated} />
    </div>
  );
}
