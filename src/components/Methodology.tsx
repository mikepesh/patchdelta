export function Methodology() {
  return (
    <section id="methodology" className="max-w-3xl mx-auto py-16 px-4">
      <h2 className="text-2xl font-bold mb-8 text-gray-100">Methodology</h2>

      <h3 className="text-lg font-semibold mb-2 text-gray-200">
        What PatchDelta measures
      </h3>
      <p className="text-gray-400 mb-6 leading-relaxed">
        Delta = number of days between NVD CVE publication date and vendor advisory publication
        date confirming a patch. A lower or negative delta indicates faster vendor response.
      </p>

      <h3 className="text-lg font-semibold mb-2 text-gray-200">Data sources</h3>
      <p className="text-gray-400 mb-6 leading-relaxed">
        CVE publication dates are sourced from the National Vulnerability Database (NVD) at{' '}
        <a
          href="https://nvd.nist.gov"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          nvd.nist.gov
        </a>
        . Vendor advisory dates are sourced from official PSIRT pages:{' '}
        <a
          href="https://www.fortiguard.com/psirt"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          Fortinet PSIRT
        </a>{' '}
        and{' '}
        <a
          href="https://security.paloaltonetworks.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          Palo Alto Networks Security Advisories
        </a>
        .
      </p>

      <h3 className="text-lg font-semibold mb-2 text-gray-200">Negative delta</h3>
      <p className="text-gray-400 mb-4 leading-relaxed">
        A negative delta means the vendor published their advisory before NVD published the CVE.
        This indicates a proactive or coordinated disclosure where the vendor was aware of and
        addressed the vulnerability prior to public NVD cataloging.
      </p>
      <p className="text-gray-400 mb-4 leading-relaxed">
        Coordinated disclosure typically occurs through one of several channels: a bug bounty
        program submission, internal security team discovery, or direct coordination with a CVE
        Numbering Authority (CNA). In these cases, the vendor and the reporter work together to
        develop a patch before the vulnerability is publicly listed in NVD. The vendor advisory
        is then published — sometimes alongside a patch — before or concurrent with the NVD entry
        going live.
      </p>
      <p className="text-gray-400 mb-6 leading-relaxed">
        As a concrete example: CVE-2022-42475 (a FortiOS SSL-VPN heap overflow) was being
        exploited in the wild when Fortinet published their advisory on 2022-12-12. NVD did not
        catalog the CVE until 2023-01-11 — 21 days later. The negative delta in this case reflects
        Fortinet's emergency disclosure during active exploitation, not a routine coordinated
        process. Both scenarios — planned coordination and emergency disclosure — produce a
        negative delta; the number alone does not distinguish between them.
      </p>

      <h3 className="text-lg font-semibold mb-2 text-gray-200">Positive delta</h3>
      <p className="text-gray-400 mb-6 leading-relaxed">
        A positive delta means the vendor advisory came N days after NVD publication. Larger
        values indicate slower patch response relative to public disclosure.
      </p>

      <h3 className="text-lg font-semibold mb-2 text-gray-200">Scope</h3>
      <p className="text-gray-400 mb-6 leading-relaxed">
        V1 covers FortiOS (Fortinet) and PAN-OS (Palo Alto Networks) only. Data is manually
        collected from vendor PSIRT pages and cross-referenced with NVD. Not all CVEs affecting
        these products are included — focus is on high-severity vulnerabilities with confirmed
        vendor advisories.
      </p>
    </section>
  );
}
