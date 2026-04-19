export function Methodology() {
  return (
    <section id="methodology" className="max-w-3xl mx-auto py-16 px-4">
      <h2 className="text-2xl font-bold mb-8 text-gray-100">Methodology</h2>

      <p className="text-gray-400 mb-6 leading-relaxed">
        <strong className="text-gray-200">What PatchDelta measures.</strong>{' '}
        For each tracked CVE, we compute the difference in days between when the vendor first
        publicly warned customers about the underlying vulnerability and when the CVE record became
        public on NVD. Negative numbers mean the vendor warned customers before the NVD record
        existed.
      </p>

      <p className="text-gray-400 mb-6 leading-relaxed">
        <strong className="text-gray-200">What counts as &ldquo;vendor first warned.&rdquo;</strong>{' '}
        The earliest publicly verifiable date the vendor described the underlying vulnerability
        &mdash; even if the early advisory used a pre-CVE identifier. Where vendor revision history
        is incomplete, we use the earliest date we can verify and mark the entry&rsquo;s confidence
        accordingly.
      </p>

      <p className="text-gray-400 mb-6 leading-relaxed">
        <strong className="text-gray-200">What counts as &ldquo;NVD published.&rdquo;</strong>{' '}
        The <code className="text-gray-300 bg-gray-800 px-1 rounded text-sm">published</code> date
        on the NVD CVE record at the time of ingest. If NVD later revises the date, we log the
        revision and surface it in the entry&rsquo;s history.
      </p>

      <p className="text-gray-400 mb-6 leading-relaxed">
        <strong className="text-gray-200">Scope.</strong>{' '}
        V1 tracks vulnerabilities in network firewall products from vendors competing in the Gartner
        Network Firewalls Magic Quadrant. Currently: Fortinet (FortiOS&nbsp;/&nbsp;FortiGate) and
        Palo Alto Networks (PAN-OS).
      </p>

      <p className="text-gray-300 mb-3 font-medium">Limitations to keep in mind.</p>
      <ul className="space-y-3 text-gray-400">
        <li className="leading-relaxed">
          <strong className="text-gray-300">Coordinated disclosure obscures effort.</strong>{' '}
          A CVE patched on the same day as NVD publication may have been responsibly disclosed to
          the vendor months earlier. The delta does not reflect pre-disclosure coordination work.
        </li>
        <li className="leading-relaxed">
          <strong className="text-gray-300">Vendor revision histories vary.</strong>{' '}
          Some vendors publish full advisory revision logs; others show only current state. Where
          history is incomplete, dates are inferred from the best public source available, and the
          entry is marked.
        </li>
        <li className="leading-relaxed">
          <strong className="text-gray-300">Pre-CVE advisories produce negative deltas.</strong>{' '}
          When a vendor warns customers under a vendor-specific identifier before the CVE is
          assigned, the delta will be negative. This is the intended semantics &mdash; the vendor
          protected customers first.
        </li>
        <li className="leading-relaxed">
          <strong className="text-gray-300">Product scope is narrow by design.</strong>{' '}
          Only products covered by an in-scope Magic Quadrant are tracked. CVEs in adjacent products
          (cloud, mail, endpoint) are not in scope for V1.
        </li>
      </ul>
    </section>
  );
}
