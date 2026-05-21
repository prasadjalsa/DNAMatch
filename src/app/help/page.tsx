import { TEST_MODE_ENABLED } from '@/lib/config'
import MedicalDisclaimer from '@/components/MedicalDisclaimer'

const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
  <section id={id} className="mb-12 scroll-mt-20">
    <h2 className="text-white font-bold text-xl mb-4 pb-2 border-b border-slate-700">{title}</h2>
    <div className="space-y-4 text-slate-300">{children}</div>
  </section>
)

const Q = ({ q, children }: { q: string; children: React.ReactNode }) => (
  <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
    <p className="text-white font-medium mb-2">{q}</p>
    <div className="text-slate-400 text-sm space-y-1">{children}</div>
  </div>
)

const NAV_LINKS = [
  { href: '#getting-started', label: 'Getting Started' },
  { href: '#file-formats', label: 'File Formats' },
  { href: '#how-analysis-works', label: 'How Analysis Works' },
  { href: '#reading-results', label: 'Reading Results' },
  { href: '#data-privacy', label: 'Data & Privacy' },
  { href: '#technical', label: 'Technical Architecture' },
  { href: '#faq', label: 'FAQ' },
  ...(TEST_MODE_ENABLED ? [{ href: '#test-mode', label: '🧪 Test Mode Guide' }] : []),
]

export default function HelpPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-12">

        {/* Sidebar nav */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 space-y-1">
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-3 font-semibold">Contents</p>
            {NAV_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="block text-slate-400 hover:text-white text-sm py-1.5 px-3 rounded-lg hover:bg-slate-800 transition-colors"
              >
                {label}
              </a>
            ))}
            <div className="pt-4 border-t border-slate-700 mt-4">
              <a href="/" className="block text-indigo-400 hover:text-indigo-300 text-sm py-1.5 px-3 rounded-lg hover:bg-slate-800">
                ← Back to App
              </a>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="min-w-0">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-white mb-2">Help & Documentation</h1>
            <p className="text-slate-400">Everything you need to know about DNAMatch.</p>
          </div>

          {/* ── Getting Started ── */}
          <Section id="getting-started" title="Getting Started">
            <p>
              DNAMatch analyzes the genetic variants in two DNA files — one from a biological father and one from a biological mother — and calculates the probability that their offspring would be affected by, a carrier of, or unaffected by each of 22 hereditary genetic conditions.
            </p>

            <div className="bg-slate-800 rounded-xl p-5 space-y-3">
              <h3 className="text-white font-semibold">Quick Start (3 steps)</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li><strong className="text-slate-200">Upload two DNA files</strong> — one for the father, one for the mother. Supported formats: 23andMe raw data (.txt), AncestryDNA raw data (.txt), or VCF files (.vcf).</li>
                <li><strong className="text-slate-200">Optionally check the research consent box</strong> — if you want to contribute your anonymized variant data to improve the analysis database.</li>
                <li><strong className="text-slate-200">Click &quot;Analyze Genetic Compatibility&quot;</strong> — results appear in seconds, entirely in your browser.</li>
              </ol>
            </div>

            <p className="text-sm">
              No account is required. Your DNA files are <strong className="text-slate-200">never uploaded to any server</strong> — all analysis runs locally in your browser. Only the ~60 disease-relevant genetic positions are extracted from your file; the rest is discarded immediately.
            </p>
          </Section>

          {/* ── File Formats ── */}
          <Section id="file-formats" title="Supported File Formats">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  name: '23andMe Raw Data',
                  ext: '.txt',
                  desc: 'Export from 23andMe: Account → Settings → 23andMe Data → Download Raw Data. Select "All DNA Raw Data" and download the .zip. Extract the .txt file inside.',
                  badge: 'Best coverage',
                },
                {
                  name: 'AncestryDNA Raw Data',
                  ext: '.txt',
                  desc: 'Export from AncestryDNA: Settings → Download DNA Data → Confirm and Download. Extract the .txt file from the .zip.',
                  badge: 'Good coverage',
                },
                {
                  name: 'VCF File',
                  ext: '.vcf',
                  desc: 'Variant Call Format files from clinical sequencing labs, Nebula Genomics, or other whole-genome/exome services. Must include a sample column.',
                  badge: 'Best for WGS/WES',
                },
              ].map(({ name, ext, desc, badge }) => (
                <div key={name} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-semibold text-sm">{name}</span>
                    <span className="text-xs bg-indigo-900/40 text-indigo-400 border border-indigo-800 px-2 py-0.5 rounded-full">{badge}</span>
                  </div>
                  <p className="text-slate-500 text-xs font-mono mb-2">{ext}</p>
                  <p className="text-slate-400 text-xs">{desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-slate-800/50 rounded-xl p-4 text-sm">
              <h3 className="text-white font-semibold mb-2">Manual SNP Entry</h3>
              <p>
                If you only have specific variant results (e.g., from a clinical report or a partial test), switch to <strong className="text-slate-200">Enter SNPs Manually</strong> mode.
                Enter each variant as an rsID (e.g., <code className="bg-slate-700 px-1 rounded text-slate-300">rs1800562</code>) and a two-letter genotype (e.g., <code className="bg-slate-700 px-1 rounded text-slate-300">AG</code>).
                Click <em>Load example</em> to see sample entries.
              </p>
            </div>

            <div className="bg-amber-900/20 border border-amber-800 rounded-xl p-4 text-sm">
              <p className="text-amber-300 font-medium mb-1">⚠ File size limit: 100 MB</p>
              <p className="text-amber-400/80">
                23andMe v5 files can be 10–30 MB. VCF files from whole-genome sequencing can be much larger — consider filtering to relevant chromosomes first using <code className="bg-amber-900/30 px-1 rounded">bcftools view -r 1,6,7,11,12,13,15,17,19,X</code>.
              </p>
            </div>
          </Section>

          {/* ── How Analysis Works ── */}
          <Section id="how-analysis-works" title="How the Analysis Works">
            <p>
              DNAMatch uses <strong className="text-slate-200">Mendelian inheritance</strong> — the foundational rules of how genetic traits are passed from parents to offspring — to calculate disease risk probabilities.
            </p>

            <div className="space-y-3">
              {[
                {
                  title: 'Autosomal Recessive (AR)',
                  color: 'blue',
                  examples: 'Cystic Fibrosis, Sickle Cell, Tay-Sachs, PKU',
                  explanation: 'Both parents must pass a risk allele for the child to be affected. If both parents are carriers, each child has a 25% chance of being affected, 50% chance of being a carrier, and 25% chance of being unaffected.',
                  table: [
                    ['Father', 'Mother', 'Affected', 'Carrier', 'Normal'],
                    ['Normal', 'Normal', '0%', '0%', '100%'],
                    ['Normal', 'Carrier', '0%', '50%', '50%'],
                    ['Carrier', 'Carrier', '25%', '50%', '25%'],
                    ['Carrier', 'Affected', '50%', '50%', '0%'],
                    ['Affected', 'Affected', '100%', '0%', '0%'],
                  ],
                },
                {
                  title: 'Autosomal Dominant (AD)',
                  color: 'red',
                  examples: "Huntington's, BRCA1/2, Familial Hypercholesterolemia, Marfan",
                  explanation: 'A single copy of the risk allele is sufficient to cause disease. If one parent is affected, each child has a 50% chance of inheriting the condition.',
                  table: null,
                },
                {
                  title: 'X-Linked Recessive',
                  color: 'purple',
                  examples: 'Hemophilia A, Hemophilia B, Duchenne MD, Color Blindness',
                  explanation: "Males have only one X chromosome, so a single pathogenic allele makes them affected. Females with one pathogenic allele are carriers (usually unaffected). If a mother is a carrier, each son has a 50% chance of being affected, and each daughter has a 50% chance of being a carrier.",
                  table: null,
                },
              ].map(({ title, examples, explanation, table }) => (
                <div key={title} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                  <h3 className="text-white font-semibold mb-1">{title}</h3>
                  <p className="text-slate-500 text-xs mb-2"><em>Examples: {examples}</em></p>
                  <p className="text-slate-400 text-sm mb-3">{explanation}</p>
                  {table && (
                    <div className="overflow-x-auto">
                      <table className="text-xs w-full">
                        <thead>
                          <tr className="text-slate-500 border-b border-slate-700">
                            {table[0].map(h => <th key={h} className="text-left py-1 pr-4">{h}</th>)}
                          </tr>
                        </thead>
                        <tbody>
                          {table.slice(1).map((row, i) => (
                            <tr key={i} className="border-b border-slate-700/30">
                              {row.map((cell, j) => (
                                <td key={j} className={`py-1 pr-4 ${j >= 2 && cell !== '0%' ? 'text-amber-400 font-medium' : 'text-slate-400'}`}>
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-sm">
              <h3 className="text-white font-semibold mb-2">Compatibility Score</h3>
              <p className="text-slate-400">
                The compatibility score (0–100) is a weighted summary of all disease risks combined. More severe diseases (lethal weight: 25, severe: 15, moderate: 8, mild: 3) reduce the score more than milder ones. A score of 85–100 is Excellent; 70–84 Good; 50–69 Moderate; below 50 is Elevated risk.
              </p>
              <p className="text-amber-400 text-xs mt-2">
                The score is a heuristic tool for comparison — not a clinical risk metric. Two people with the same score may have very different disease profiles.
              </p>
            </div>
          </Section>

          {/* ── Reading Results ── */}
          <Section id="reading-results" title="Reading Your Results">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {[
                { title: 'Parent Status', items: [
                  ['Normal', 'No pathogenic alleles found for this disease.'],
                  ['Carrier', 'One pathogenic allele found. Usually healthy but can pass it to children.'],
                  ['Affected', 'Two (or one for dominant/X-linked) pathogenic alleles found.'],
                  ['Unknown', 'This variant was not present in the uploaded file — result unavailable.'],
                ]},
                { title: 'Offspring Risk', items: [
                  ['Affected %', 'Probability that a child will have the disease.'],
                  ['Carrier %', 'Probability of inheriting one copy (no disease, but can pass it on).'],
                  ['Unaffected %', 'Probability of inheriting no pathogenic alleles.'],
                  ['Risk Level', 'None / Low (<5%) / Moderate (5–25%) / High (25–50%) / Very High (>50%)'],
                ]},
              ].map(({ title, items }) => (
                <div key={title} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                  <h3 className="text-white font-semibold mb-3">{title}</h3>
                  <dl className="space-y-2">
                    {items.map(([term, def]) => (
                      <div key={term}>
                        <dt className="text-slate-200 font-medium text-xs">{term}</dt>
                        <dd className="text-slate-500 text-xs">{def}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-sm">
              <h3 className="text-white font-semibold mb-2">Limited SNP Coverage Warning</h3>
              <p className="text-slate-400">
                Some conditions (Huntington&apos;s, Fragile X, SMA, Hemophilia A, DMD, Color Blindness) are marked <span className="text-amber-400">Limited SNP coverage</span>.
                These diseases are caused by large deletions, repeat expansions, or gene rearrangements that standard SNP arrays cannot detect.
                The results for these conditions are proxy estimates only and should not be used for clinical decision-making.
              </p>
            </div>
          </Section>

          {/* ── Data Privacy ── */}
          <Section id="data-privacy" title="Data Usage & Privacy">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-green-900/20 border border-green-800 rounded-xl p-4">
                <h3 className="text-green-400 font-semibold mb-3">What is NEVER stored</h3>
                <ul className="space-y-1 text-slate-400">
                  <li>✓ Your full DNA file</li>
                  <li>✓ Your name, email, or any identifier</li>
                  <li>✓ Your IP address</li>
                  <li>✓ Any data when the research checkbox is unchecked</li>
                  <li>✓ Any data entered in test mode</li>
                </ul>
              </div>
              <div className="bg-blue-900/20 border border-blue-800 rounded-xl p-4">
                <h3 className="text-blue-400 font-semibold mb-3">What is stored (opt-in only)</h3>
                <ul className="space-y-1 text-slate-400">
                  <li>✓ The ~60 disease-relevant SNP positions and genotypes</li>
                  <li>✓ The analysis result (compatibility score, disease statuses)</li>
                  <li>✓ A server timestamp</li>
                  <li>✗ Nothing else</li>
                </ul>
              </div>
            </div>

            <p className="text-sm">
              When you check the research consent checkbox, the app sends only the specific genetic positions relevant to the 22 analyzed diseases to an anonymous Firestore database.
              This data <strong className="text-slate-200">cannot be linked back to you</strong>.
              It is used to build population-level variant frequency statistics that improve future analysis.
            </p>
            <p className="text-sm">
              The Firestore database is <strong className="text-slate-200">write-only from the client</strong> — no user can read another user&apos;s submission.
              Only the database administrator can access the raw data through the Firebase Admin console.
            </p>
            <p className="text-sm text-slate-500">
              All analysis computation happens in your browser. Your full DNA file is parsed locally and the raw file contents are discarded after the relevant SNPs are extracted.
              No full genome data ever leaves your device.
            </p>
          </Section>

          {/* ── Technical Architecture ── */}
          <Section id="technical" title="Technical Architecture">
            <p>
              DNAMatch is a fully static web application — all genetic analysis runs in your browser. There is no backend server processing your data.
            </p>

            {/* Stack */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 text-sm">
              <h3 className="text-white font-semibold mb-4">Tech Stack</h3>
              <ul className="space-y-2.5">
                {[
                  { label: 'Frontend', value: 'Next.js 14 (App Router) + React + TypeScript + Tailwind CSS' },
                  { label: 'Charts & UI', value: 'Recharts (RadialBarChart score gauge, PieChart per disease card)' },
                  { label: 'Genetic Analysis', value: 'Custom Mendelian engine — pure TypeScript, runs entirely client-side' },
                  { label: 'Hosting', value: 'Firebase Hosting — Spark free tier, static export (no server)' },
                  { label: 'Database', value: 'Firestore — write-only anonymous research submissions (opt-in)' },
                  { label: 'CI/CD', value: 'GitHub Actions — auto-deploy to Firebase on push to main' },
                  { label: 'DNA Parsers', value: '23andMe TSV parser + VCF parser with coordinate → rsID fallback map' },
                ].map(({ label, value }) => (
                  <li key={label} className="flex gap-2 text-sm">
                    <span className="text-white font-semibold shrink-0">{label}:</span>
                    <span className="text-slate-400">{value}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* File structure */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-sm">
              <h3 className="text-white font-semibold mb-3">Source File Structure</h3>
              <pre className="text-slate-400 text-[11px] leading-5 overflow-x-auto">{`src/
  app/
    layout.tsx              ← root layout, nav, disclaimer banner
    page.tsx                ← landing: file upload / manual entry / test mode
    globals.css
    results/
      page.tsx              ← analysis dashboard: score + disease cards
    help/
      page.tsx              ← this documentation page
  components/
    DNAUploadZone.tsx       ← drag-drop, auto-detects 23andMe vs VCF
    ManualSNPEntry.tsx      ← table for manual rsid + genotype entry
    CompatibilityScore.tsx  ← half-circle radial gauge (Recharts)
    DiseaseRiskCard.tsx     ← per-disease: parent badges, pie chart, text
    RiskSummaryTable.tsx    ← sortable table of all results
    MedicalDisclaimer.tsx   ← banner + footer variants
    NavTestToggle.tsx       ← purple 🧪 toggle in nav bar
    TestModePanel.tsx       ← Select/Browse tabs, 128 profiles
  lib/
    types.ts                ← all shared TypeScript interfaces
    utils.ts                ← cn() helper (clsx + tailwind-merge)
    config.ts               ← TEST_MODE_ENABLED feature flag
    firebase.ts             ← Firebase app init (NEXT_PUBLIC_ env vars)
    firestore.ts            ← submitDNAData() — opt-in research writes
    parsers/
      parse23andMe.ts       ← TSV → SNPMap (indels, no-calls, Windows \\r\\n)
      parseVCF.ts           ← VCF → SNPMap (GT decode, coord→rsid fallback)
    genetics/
      mendelian.ts          ← pure Mendelian functions per inheritance pattern
      analyzer.ts           ← orchestrator: two SNPMaps → AnalysisResult
      scoring.ts            ← severity-weighted compatibility score 0–100
  data/
    diseaseDatabase.ts      ← 22 diseases: rsIDs, alleles, severity, copy
    snpMetadata.ts          ← chromosome + position for TSV generation
    testProfiles.ts         ← 128 synthetic profiles, profileToTSV()`}</pre>
            </div>

            {/* Data flow */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-sm">
              <h3 className="text-white font-semibold mb-3">Data Flow</h3>
              <ol className="space-y-2 text-slate-400 text-xs list-decimal list-inside">
                <li><strong className="text-slate-300">Parse</strong> — uploaded file is read client-side by <code className="bg-slate-700 px-1 rounded">parse23andMe.ts</code> or <code className="bg-slate-700 px-1 rounded">parseVCF.ts</code>, producing a <code className="bg-slate-700 px-1 rounded">SNPMap</code> (Map of rsID → genotype string).</li>
                <li><strong className="text-slate-300">Filter</strong> — <code className="bg-slate-700 px-1 rounded">filterToRelevantSNPs()</code> reduces the full map (~650 K entries in a 23andMe file) to only the ~60 disease-relevant rsIDs.</li>
                <li><strong className="text-slate-300">Analyze</strong> — <code className="bg-slate-700 px-1 rounded">analyzeCompatibility(male, female)</code> iterates over all 22 diseases, calls the appropriate Mendelian function, and computes a per-disease <code className="bg-slate-700 px-1 rounded">OffspringRisk</code>.</li>
                <li><strong className="text-slate-300">Score</strong> — <code className="bg-slate-700 px-1 rounded">calculateScore()</code> applies severity weights and returns a 0–100 compatibility score.</li>
                <li><strong className="text-slate-300">Store (opt-in)</strong> — if consent is given, the filtered SNPs + result are written to Firestore <code className="bg-slate-700 px-1 rounded">submissions</code> collection.</li>
                <li><strong className="text-slate-300">Navigate</strong> — the <code className="bg-slate-700 px-1 rounded">AnalysisResult</code> is serialized to <code className="bg-slate-700 px-1 rounded">sessionStorage</code> and the router navigates to <code className="bg-slate-700 px-1 rounded">/results</code>.</li>
                <li><strong className="text-slate-300">Render</strong> — the results page reads from <code className="bg-slate-700 px-1 rounded">sessionStorage</code> and renders the score gauge, summary table, and individual disease cards.</li>
              </ol>
            </div>

            {/* Mendelian types */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-sm">
              <h3 className="text-white font-semibold mb-3">Inheritance Patterns Implemented</h3>
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-700">
                    <th className="text-left py-2 pr-4">Pattern</th>
                    <th className="text-left py-2 pr-4">Function</th>
                    <th className="text-left py-2">Diseases</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/30 text-slate-400">
                  {[
                    ['Autosomal Recessive', 'arOffspringRisk()', 'CF, Sickle Cell, Tay-Sachs, PKU, Gaucher, SMA, Wilson\'s, HFE, Beta-Thal'],
                    ['Autosomal Dominant', 'adOffspringRisk()', 'Huntington\'s, FH, BRCA1, BRCA2, Factor V, Marfan, Prothrombin'],
                    ['X-Linked Recessive', 'xlrOffspringRisk()', 'Hemophilia A, Hemophilia B, Duchenne MD, Color Blindness'],
                    ['X-Linked Dominant', 'xldOffspringRisk()', 'Fragile X (proxy)'],
                    ['Complex / multi-locus', 'complexMthfrRisk()', 'MTHFR (C677T + A1298C compound het)'],
                  ].map(([pattern, fn, diseases]) => (
                    <tr key={pattern}>
                      <td className="py-2 pr-4 text-slate-300 font-medium whitespace-nowrap">{pattern}</td>
                      <td className="py-2 pr-4 font-mono text-indigo-400 whitespace-nowrap">{fn}</td>
                      <td className="py-2 text-slate-500">{diseases}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Scoring */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-sm">
              <h3 className="text-white font-semibold mb-3">Scoring Formula</h3>
              <pre className="text-slate-400 text-[11px] leading-5 overflow-x-auto bg-slate-900 rounded p-3">{`severity weights:
  lethal   → 25  (Huntington's, CF, Tay-Sachs, DMD)
  severe   → 15  (Sickle Cell, Beta-Thal, SMA, BRCA1/2, Hemophilia A/B)
  moderate →  8  (PKU, Gaucher, Wilson's, Marfan, Fragile X, FH)
  mild     →  3  (HFE, Factor V, Prothrombin, Color Blindness, MTHFR)

score = 100 - Σ( weight × offspringRisk.affected )
score = clamp(score, 0, 100)

categories:
  85 – 100  → Excellent
  70 –  84  → Good
  50 –  69  → Moderate
   0 –  49  → Elevated`}</pre>
            </div>

            {/* Deployment */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-sm">
              <h3 className="text-white font-semibold mb-3">Deployment Pipeline</h3>
              <ol className="space-y-2 text-slate-400 text-xs list-decimal list-inside">
                <li>Developer pushes to the <code className="bg-slate-700 px-1 rounded">main</code> branch on GitHub.</li>
                <li>GitHub Actions workflow (<code className="bg-slate-700 px-1 rounded">.github/workflows/firebase-deploy.yml</code>) triggers automatically.</li>
                <li>Node 20 is installed; <code className="bg-slate-700 px-1 rounded">npm install</code> installs dependencies.</li>
                <li><code className="bg-slate-700 px-1 rounded">npm run build</code> runs <code className="bg-slate-700 px-1 rounded">next build</code> with <code className="bg-slate-700 px-1 rounded">output: &apos;export&apos;</code> — produces a fully static <code className="bg-slate-700 px-1 rounded">out/</code> directory. Firebase config is injected via <code className="bg-slate-700 px-1 rounded">NEXT_PUBLIC_FIREBASE_*</code> GitHub Secrets.</li>
                <li><code className="bg-slate-700 px-1 rounded">FirebaseExtended/action-hosting-deploy@v0</code> deploys the <code className="bg-slate-700 px-1 rounded">out/</code> directory to Firebase Hosting project <code className="bg-slate-700 px-1 rounded">dnamatch-2c4c8</code>.</li>
              </ol>
              <div className="mt-3 bg-slate-900 rounded p-3">
                <p className="text-slate-500 text-[11px] mb-1 font-semibold uppercase tracking-wider">Required GitHub Secrets</p>
                <div className="grid grid-cols-2 gap-1">
                  {[
                    'FIREBASE_SERVICE_ACCOUNT',
                    'NEXT_PUBLIC_FIREBASE_API_KEY',
                    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
                    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
                    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
                    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
                    'NEXT_PUBLIC_FIREBASE_APP_ID',
                  ].map(s => (
                    <code key={s} className="text-[10px] text-indigo-300 bg-slate-800 px-1.5 py-0.5 rounded">{s}</code>
                  ))}
                </div>
              </div>
            </div>

            {/* Firestore rules */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-sm">
              <h3 className="text-white font-semibold mb-3">Firestore Security Rules</h3>
              <p className="text-slate-400 text-xs mb-2">The database is write-only from the client. No user can read or delete another submission. Only the Firebase Admin console can access the data.</p>
              <pre className="text-slate-400 text-[11px] leading-5 bg-slate-900 rounded p-3 overflow-x-auto">{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /submissions/{docId} {
      allow create: if true;          // opt-in anonymous submissions
      allow read, update, delete: if false;
    }
  }
}`}</pre>
            </div>
          </Section>

          {/* ── FAQ ── */}
          <Section id="faq" title="Frequently Asked Questions">
            <Q q="Is this a medical test or diagnostic tool?">
              <p>No. DNAMatch is an educational tool for informational purposes only. It uses a limited set of known SNPs and cannot replace clinical genetic testing or professional genetic counseling. Do not make medical or reproductive decisions based solely on these results.</p>
            </Q>
            <Q q="My file uploaded but all results show 'Unknown' — why?">
              <p>This usually means the specific variant positions we check were not included in your DNA file. Older 23andMe v3 chips had lower coverage; v4 and v5 have better coverage. Some VCF files use different variant ID formats. Try enabling test mode to verify the analysis engine is working correctly with known data.</p>
            </Q>
            <Q q="What does 'Limited SNP Coverage' mean?">
              <p>Some diseases (like Huntington&apos;s, Fragile X, SMA, Hemophilia, DMD) are caused by large gene deletions, repeat expansions, or inversions — not simple single-letter changes. Standard DNA arrays from consumer services cannot detect these. The rsIDs used are proxy markers near the gene, not direct diagnostic variants. Results for these conditions are approximate estimates only.</p>
            </Q>
            <Q q="The compatibility score is low — should I be worried?">
              <p>Not necessarily. The score reflects how many disease risks are mathematically elevated when combining your variants. It does not account for penetrance (not all risk variants cause disease), lifestyle factors, or medical interventions. Consult a certified genetic counselor (nsgc.org) for clinical guidance.</p>
            </Q>
            <Q q="Can I use this to decide whether to have children?">
              <p>No — and you should not. These results are educational estimates based on a small subset of known variants. Clinical preconception carrier screening uses comprehensive panels covering hundreds of variants per disease and is performed by certified laboratories with genetic counselor support. DNAMatch is not designed or validated for reproductive decision-making.</p>
            </Q>
            <Q q="Why do BRCA1 and BRCA2 show '50% offspring affected' — does that mean 50% chance of cancer?">
              <p>No. The &quot;affected %&quot; for dominant conditions means the probability of inheriting the pathogenic allele — not the lifetime probability of getting cancer. BRCA1 carriers have roughly a 50–70% lifetime breast cancer risk, not a 100% certainty. Cancer risk depends on many additional factors including family history, environment, and other genetic modifiers.</p>
            </Q>
            <Q q="What happens to my data if I upload it?">
              <p>Your full file is parsed entirely in your browser and never sent anywhere. Only if you check the research consent checkbox will the ~60 disease-relevant variants (not your full genome) be sent to an anonymous database. See the Data & Privacy section for full details.</p>
            </Q>
            <Q q="Can I download my results?">
              <p>Click the 🖨 Print Report button on the results page to print or save as PDF. Future versions may add a direct PDF export.</p>
            </Q>
          </Section>

          {/* ── Test Mode Guide (only if enabled) ── */}
          {TEST_MODE_ENABLED && (
            <Section id="test-mode" title="🧪 Test Mode Guide">
              <div className="bg-purple-900/20 border border-purple-700 rounded-xl p-4 text-sm mb-4">
                <p className="text-purple-300 font-medium mb-1">Developer / QA feature</p>
                <p className="text-slate-400">Test mode is currently <strong className="text-purple-300">enabled</strong>. It can be hidden by setting <code className="bg-slate-700 px-1 rounded text-slate-300">TEST_MODE_ENABLED = false</code> in <code className="bg-slate-700 px-1 rounded text-slate-300">src/lib/config.ts</code> and redeploying.</p>
              </div>

              <p>Test mode provides <strong className="text-slate-200">128 pre-built synthetic DNA profiles</strong> that simulate specific genetic conditions. No real DNA file is needed — profiles are loaded directly into the analysis engine.</p>

              <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-sm">
                <h3 className="text-white font-semibold mb-3">How to activate test mode</h3>
                <ol className="list-decimal list-inside space-y-2 text-slate-400">
                  <li>Click the <strong className="text-slate-200">🧪 Test</strong> button in the top-right corner of the navigation bar.</li>
                  <li>The button turns purple and shows <em>Test ON</em>. The page reloads to show the test mode panel.</li>
                  <li>In the test panel, use the <strong className="text-slate-200">Select</strong> tab to pick a Father and Mother profile from the dropdowns.</li>
                  <li>Click <strong className="text-slate-200">↑ Load as Father</strong> and <strong className="text-slate-200">↑ Load as Mother</strong> to inject the profiles.</li>
                  <li>Click <strong className="text-slate-200">Analyze Genetic Compatibility</strong> — results appear immediately.</li>
                </ol>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-sm">
                <h3 className="text-white font-semibold mb-3">Profile categories ({128} profiles total)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { name: 'Normal', count: 22, desc: 'One per disease, all wild-type genotypes.', color: 'text-green-400' },
                    { name: 'Carrier', count: 22, desc: 'One per disease, heterozygous for the primary risk allele.', color: 'text-amber-400' },
                    { name: 'Affected', count: 22, desc: 'One per disease, homozygous risk allele.', color: 'text-red-400' },
                    { name: 'Combined', count: 20, desc: 'Multi-disease carriers (Ashkenazi panel, cardiac risk, etc.).', color: 'text-indigo-400' },
                    { name: 'X-Linked', count: 16, desc: 'Affected males, carrier females, normal males for X-linked diseases.', color: 'text-purple-400' },
                    { name: 'Edge Cases', count: 26, desc: 'Partial data, compound het, extreme risk, empty profiles.', color: 'text-slate-400' },
                  ].map(({ name, count, desc, color }) => (
                    <div key={name} className="bg-slate-900 rounded-lg p-3">
                      <p className={`${color} font-semibold text-sm`}>{name} <span className="text-slate-500 font-normal">({count})</span></p>
                      <p className="text-slate-500 text-xs mt-1">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-sm">
                <h3 className="text-white font-semibold mb-3">Quick test scenarios</h3>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-slate-500 border-b border-slate-700">
                      <th className="text-left py-2 pr-4">Scenario</th>
                      <th className="text-left py-2 pr-4">Father profile</th>
                      <th className="text-left py-2 pr-4">Mother profile</th>
                      <th className="text-left py-2">Expected result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/30">
                    {[
                      ['Baseline (perfect score)', 'All Diseases — Normal', 'All Diseases — Normal', 'Score 100, all None'],
                      ['CF risk (25% affected)', 'Cystic Fibrosis — Carrier', 'Cystic Fibrosis — Carrier', '25% offspring CF risk'],
                      ['X-linked Hemophilia', 'Hemophilia A — Normal Male', 'Hemophilia A — Carrier Female', '25% overall affected (sons 50%)'],
                      ['BRCA dominant risk', 'BRCA1 — Carrier', 'BRCA1 — Normal', '50% offspring inherit BRCA1'],
                      ['Ashkenazi matched carriers', 'Ashkenazi Panel — Carrier', 'Ashkenazi Panel — Carrier', '25% each for CF, Tay-Sachs, Gaucher'],
                      ['Low score test', 'Low Compatibility', 'Low Compatibility', 'Score below 70, multiple High risks'],
                      ['Partial data test', 'Partial Data — 5 SNPs', 'Partial Data — 5 SNPs', 'Most results Unknown'],
                    ].map(([scenario, father, mother, expected]) => (
                      <tr key={scenario}>
                        <td className="py-2 pr-4 text-slate-300 font-medium">{scenario}</td>
                        <td className="py-2 pr-4 text-slate-400">{father}</td>
                        <td className="py-2 pr-4 text-slate-400">{mother}</td>
                        <td className="py-2 text-slate-500">{expected}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-sm">
                <h3 className="text-white font-semibold mb-2">Downloading test files</h3>
                <p className="text-slate-400">Every test profile can be downloaded as a valid 23andMe-format .txt file using the <strong className="text-slate-200">↓ .txt</strong> button or the ↓ button in the Browse tab. These files can be uploaded through the normal upload interface to verify the parser is working correctly.</p>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-sm">
                <h3 className="text-white font-semibold mb-2">Hiding test mode in production</h3>
                <ol className="list-decimal list-inside space-y-1 text-slate-400">
                  <li>Open <code className="bg-slate-700 px-1 rounded text-slate-300">src/lib/config.ts</code></li>
                  <li>Change <code className="bg-slate-700 px-1 rounded text-slate-300">TEST_MODE_ENABLED = true</code> to <code className="bg-slate-700 px-1 rounded text-slate-300">false</code></li>
                  <li>Commit and push — the toggle disappears from the nav on next deploy</li>
                </ol>
              </div>
            </Section>
          )}

          <MedicalDisclaimer variant="footer" />
        </div>
      </div>
    </div>
  )
}
