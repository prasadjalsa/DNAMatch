import type { Disease } from '@/lib/types'

export const DISEASES: Disease[] = [
  // ─── Autosomal Recessive ─────────────────────────────────────────────────────
  {
    id: 'cystic-fibrosis',
    name: 'Cystic Fibrosis',
    gene: 'CFTR',
    inheritance: 'autosomal_recessive',
    severity: 'lethal',
    variants: [
      { rsid: 'rs113993960', riskAllele: 'D', normalAllele: 'I' }, // ΔF508 deletion
      { rsid: 'rs75961395', riskAllele: 'T', normalAllele: 'C' },  // W1282X
    ],
    description: 'A life-threatening genetic disorder that causes thick, sticky mucus to build up in the lungs, digestive tract, and other organs.',
    plainLanguageSummary: 'Causes severe lung disease and digestive problems. With modern treatments, many people live into their 40s–50s, but it remains life-shortening. Both parents must carry a mutation to pass it on.',
    prevalence: 1,
  },
  {
    id: 'sickle-cell-anemia',
    name: 'Sickle Cell Anemia',
    gene: 'HBB',
    inheritance: 'autosomal_recessive',
    severity: 'severe',
    variants: [
      { rsid: 'rs334', riskAllele: 'T', normalAllele: 'A' }, // Glu6Val (HbS)
    ],
    description: 'A blood disorder where abnormal hemoglobin causes red blood cells to become sickle-shaped, leading to pain crises, anemia, and organ damage.',
    plainLanguageSummary: 'Causes episodes of severe pain ("crises"), anemia, and increased risk of infections. Having one copy (sickle cell trait) is usually harmless. Two copies cause the disease.',
    prevalence: 8,
  },
  {
    id: 'beta-thalassemia',
    name: 'Beta-Thalassemia',
    gene: 'HBB',
    inheritance: 'autosomal_recessive',
    severity: 'severe',
    variants: [
      { rsid: 'rs63751763', riskAllele: 'T', normalAllele: 'C' }, // IVS1-110 G>A (common Mediterranean)
    ],
    description: 'A blood disorder that reduces the production of hemoglobin, causing severe anemia requiring lifelong blood transfusions.',
    plainLanguageSummary: 'Severe form requires regular blood transfusions. Carriers (thalassemia minor) are usually healthy. Most common in Mediterranean, Middle Eastern, and South Asian populations.',
    prevalence: 4,
    limitedSnpCoverage: true,
    limitationNote: 'Beta-thalassemia has hundreds of mutations. This analysis covers only the most common variant (IVS1-110). Full diagnosis requires comprehensive gene sequencing.',
  },
  {
    id: 'tay-sachs',
    name: 'Tay-Sachs Disease',
    gene: 'HEXA',
    inheritance: 'autosomal_recessive',
    severity: 'lethal',
    variants: [
      { rsid: 'rs80338748', riskAllele: 'A', normalAllele: 'G' }, // common Ashkenazi variant
    ],
    description: 'A fatal genetic disorder that progressively destroys nerve cells in the brain and spinal cord, typically causing death in early childhood.',
    plainLanguageSummary: 'Causes progressive neurological destruction. The infantile form is uniformly fatal, usually by age 4–5. Most common in Ashkenazi Jewish, French-Canadian, and Cajun populations.',
    prevalence: 0.4,
    limitedSnpCoverage: true,
    limitationNote: 'Tay-Sachs is caused by insertions/deletions not fully captured by standard SNP arrays. Enzyme assay (hex-A activity testing) is the gold standard for carrier screening.',
  },
  {
    id: 'pku',
    name: 'Phenylketonuria (PKU)',
    gene: 'PAH',
    inheritance: 'autosomal_recessive',
    severity: 'moderate',
    variants: [
      { rsid: 'rs5030858', riskAllele: 'T', normalAllele: 'C' }, // R408W
    ],
    description: 'A metabolic disorder where the body cannot process phenylalanine, an amino acid found in many foods, leading to brain damage if untreated.',
    plainLanguageSummary: 'Fully preventable with a low-phenylalanine diet. Newborn screening catches virtually all cases. Untreated PKU causes severe intellectual disability. With treatment, patients live normal lives.',
    prevalence: 1,
  },
  {
    id: 'gaucher',
    name: 'Gaucher Disease',
    gene: 'GBA',
    inheritance: 'autosomal_recessive',
    severity: 'moderate',
    variants: [
      { rsid: 'rs76763715', riskAllele: 'T', normalAllele: 'C' }, // N370S (most common in Ashkenazi)
      { rsid: 'rs80356773', riskAllele: 'A', normalAllele: 'G' }, // L444P
    ],
    description: 'A lysosomal storage disorder causing the accumulation of fatty substances in organs, especially the spleen and liver.',
    plainLanguageSummary: 'Causes enlarged spleen/liver, bone pain, and anemia. Enzyme replacement therapy is highly effective. The N370S variant (Ashkenazi) rarely causes neurological disease; L444P can.',
    prevalence: 1,
  },
  {
    id: 'sma',
    name: 'Spinal Muscular Atrophy (SMA)',
    gene: 'SMN1',
    inheritance: 'autosomal_recessive',
    severity: 'lethal',
    variants: [
      { rsid: 'rs9916', riskAllele: 'A', normalAllele: 'G' }, // proxy marker near SMN1
    ],
    description: 'A genetic disease affecting the motor nerve cells in the spinal cord, causing progressive muscle weakness and loss of movement.',
    plainLanguageSummary: 'Type 1 SMA is the most common genetic cause of infant death. Gene therapy (Zolgensma) has transformed outcomes when treated early. Newborn screening is now standard in many countries.',
    prevalence: 1,
    limitedSnpCoverage: true,
    limitationNote: 'SMA is caused by deletion/duplication of the SMN1 gene, which cannot be reliably detected by standard SNP arrays. MLPA (Multiplex Ligation-dependent Probe Amplification) is required for accurate carrier testing.',
  },
  {
    id: 'wilsons',
    name: "Wilson's Disease",
    gene: 'ATP7B',
    inheritance: 'autosomal_recessive',
    severity: 'moderate',
    variants: [
      { rsid: 'rs76151636', riskAllele: 'A', normalAllele: 'G' }, // H1069Q (most common in Europeans)
    ],
    description: 'A genetic disorder where copper accumulates in the liver, brain, and other vital organs, causing liver failure and neurological problems.',
    plainLanguageSummary: 'Treatable with copper chelation therapy (penicillamine or trientine) if caught early. Without treatment, causes progressive liver and brain damage. Most common in Eastern Europeans.',
    prevalence: 3,
  },
  {
    id: 'hemochromatosis',
    name: 'Hereditary Hemochromatosis',
    gene: 'HFE',
    inheritance: 'autosomal_recessive',
    severity: 'mild',
    variants: [
      { rsid: 'rs1800562', riskAllele: 'A', normalAllele: 'G' }, // C282Y — main variant
      { rsid: 'rs1799945', riskAllele: 'G', normalAllele: 'C' }, // H63D — modifier
    ],
    description: 'A condition where the body absorbs too much iron from food, causing iron to build up in organs over time.',
    plainLanguageSummary: 'Most common hereditary iron overload disorder in Northern Europeans. Easily treated with regular blood donation (phlebotomy). Compound heterozygosity (one C282Y + one H63D) causes mild-moderate risk.',
    prevalence: 250,
  },

  // ─── Autosomal Dominant ──────────────────────────────────────────────────────
  {
    id: 'huntingtons',
    name: "Huntington's Disease",
    gene: 'HTT',
    inheritance: 'autosomal_dominant',
    severity: 'lethal',
    variants: [
      { rsid: 'rs363050', riskAllele: 'A', normalAllele: 'G' }, // proxy marker — NOT diagnostic
    ],
    description: "A progressive brain disorder causing uncontrolled movements, emotional problems, and loss of thinking ability, typically appearing in the 30s–50s.",
    plainLanguageSummary: 'Each child of an affected parent has a 50% chance of inheriting the disease. Full-penetrance: everyone with the gene mutation will develop Huntington\'s eventually. No cure currently exists.',
    prevalence: 5,
    limitedSnpCoverage: true,
    limitationNote: 'Huntington\'s is caused by CAG repeat expansion in HTT, which cannot be determined from standard SNP arrays. rs363050 is a proxy marker only. Definitive diagnosis requires a specialized CAG repeat test.',
  },
  {
    id: 'familial-hypercholesterolemia',
    name: 'Familial Hypercholesterolemia',
    gene: 'LDLR',
    inheritance: 'autosomal_dominant',
    severity: 'moderate',
    variants: [
      { rsid: 'rs28942078', riskAllele: 'T', normalAllele: 'C' }, // LDLR p.Asp200Gly
    ],
    description: 'An inherited condition causing very high levels of LDL ("bad") cholesterol from birth, dramatically increasing the risk of early heart disease.',
    plainLanguageSummary: 'Significantly increases risk of heart attack before age 50 if untreated. Statin therapy is highly effective. One of the most common serious genetic conditions (1 in 250 people).',
    prevalence: 400,
    limitedSnpCoverage: true,
    limitationNote: 'FH is caused by hundreds of variants across LDLR, APOB, and PCSK9 genes. This analysis covers only one common LDLR variant. Panel testing covers all known pathogenic variants.',
  },
  {
    id: 'brca1',
    name: 'BRCA1 (Hereditary Breast/Ovarian Cancer)',
    gene: 'BRCA1',
    inheritance: 'autosomal_dominant',
    severity: 'severe',
    variants: [
      { rsid: 'rs80357906', riskAllele: 'A', normalAllele: 'G' }, // 185delAG (Ashkenazi founder)
      { rsid: 'rs80357914', riskAllele: 'T', normalAllele: 'C' }, // 5382insC (Ashkenazi founder)
    ],
    description: 'Mutations in BRCA1 significantly increase lifetime risk of breast cancer (~70%) and ovarian cancer (~45%).',
    plainLanguageSummary: 'Carrying a BRCA1 mutation does not guarantee cancer — it raises lifetime risk significantly. Enhanced screening and preventive options (surgery, medication) are available. Each child has a 50% chance of inheriting the mutation.',
    prevalence: 40,
    limitedSnpCoverage: true,
    limitationNote: 'Hundreds of pathogenic BRCA1 variants exist. This covers only the two most common Ashkenazi Jewish founder mutations. A full BRCA1/2 panel is needed for comprehensive assessment.',
  },
  {
    id: 'brca2',
    name: 'BRCA2 (Hereditary Breast Cancer)',
    gene: 'BRCA2',
    inheritance: 'autosomal_dominant',
    severity: 'severe',
    variants: [
      { rsid: 'rs80358981', riskAllele: 'A', normalAllele: 'G' }, // 6174delT (Ashkenazi founder)
    ],
    description: 'Mutations in BRCA2 increase lifetime risk of breast cancer (~70%), ovarian cancer (~17%), and also pancreatic and prostate cancers.',
    plainLanguageSummary: 'Similar to BRCA1 but with different cancer spectrum and slightly lower ovarian cancer risk. Also raises male breast cancer risk. The inherited allele is passed to 50% of children.',
    prevalence: 40,
    limitedSnpCoverage: true,
    limitationNote: 'Only the most common Ashkenazi founder variant is covered here. Full BRCA2 panel testing is recommended for comprehensive screening.',
  },
  {
    id: 'factor-v-leiden',
    name: 'Factor V Leiden Thrombophilia',
    gene: 'F5',
    inheritance: 'autosomal_dominant',
    severity: 'mild',
    variants: [
      { rsid: 'rs6025', riskAllele: 'A', normalAllele: 'G' }, // F5 1691G>A (Leiden mutation)
    ],
    description: 'The most common inherited blood clotting disorder, where the blood clots more easily than normal, increasing risk of deep vein thrombosis and pulmonary embolism.',
    plainLanguageSummary: 'Most carriers never have a clot. Risk increases with pregnancy, surgery, or prolonged immobility. Anticoagulant medications are effective for prevention and treatment when needed.',
    prevalence: 2000,
  },
  {
    id: 'marfan',
    name: 'Marfan Syndrome',
    gene: 'FBN1',
    inheritance: 'autosomal_dominant',
    severity: 'moderate',
    variants: [
      { rsid: 'rs121913502', riskAllele: 'A', normalAllele: 'G' }, // FBN1 pathogenic variant
    ],
    description: 'A connective tissue disorder affecting the heart, eyes, blood vessels, and skeleton, with aortic aneurysm being the most serious complication.',
    plainLanguageSummary: 'Causes tall stature, long limbs, lens dislocation, and most critically aortic aneurysm. With proper cardiovascular monitoring and beta-blockers, many people lead normal lives.',
    prevalence: 6,
    limitedSnpCoverage: true,
    limitationNote: 'Marfan syndrome involves hundreds of unique FBN1 mutations. This covers one known pathogenic variant. Clinical diagnosis is based on Ghent criteria, not a single SNP.',
  },

  // ─── X-Linked Recessive ──────────────────────────────────────────────────────
  {
    id: 'hemophilia-a',
    name: 'Hemophilia A',
    gene: 'F8',
    inheritance: 'x_linked_recessive',
    severity: 'severe',
    variants: [
      { rsid: 'rs137852580', riskAllele: 'A', normalAllele: 'G' }, // F8 pathogenic variant
    ],
    description: 'A blood clotting disorder where the blood does not clot properly due to a lack of clotting factor VIII, causing spontaneous and prolonged bleeding.',
    plainLanguageSummary: 'Males with one mutated X chromosome are affected (no second X to compensate). Females with one mutated X are carriers. Modern clotting factor therapy and gene therapy have dramatically improved outcomes.',
    prevalence: 10,
    limitedSnpCoverage: true,
    limitationNote: 'About 50% of severe Hemophilia A cases are caused by intron 22 inversions, not SNPs. Comprehensive diagnosis requires targeted inversion testing in addition to sequencing.',
  },
  {
    id: 'hemophilia-b',
    name: 'Hemophilia B',
    gene: 'F9',
    inheritance: 'x_linked_recessive',
    severity: 'severe',
    variants: [
      { rsid: 'rs137852559', riskAllele: 'T', normalAllele: 'C' }, // F9 pathogenic variant
    ],
    description: 'A blood clotting disorder caused by deficiency of clotting factor IX ("Christmas disease"), clinically similar to Hemophilia A.',
    plainLanguageSummary: 'Less common than Hemophilia A (about 1 in 30,000 males). Same X-linked inheritance pattern. Treatment includes factor IX concentrates. Gene therapy is now available for adults.',
    prevalence: 3,
    limitedSnpCoverage: true,
    limitationNote: 'Hemophilia B involves diverse F9 mutations across the gene. Panel sequencing provides comprehensive coverage.',
  },
  {
    id: 'dmd',
    name: 'Duchenne Muscular Dystrophy',
    gene: 'DMD',
    inheritance: 'x_linked_recessive',
    severity: 'lethal',
    variants: [
      { rsid: 'rs137852337', riskAllele: 'T', normalAllele: 'C' }, // DMD proxy variant
    ],
    description: 'A severe muscle-wasting disease affecting primarily males, causing progressive loss of muscle function and typically leading to death in the 20s–30s from cardiac or respiratory failure.',
    plainLanguageSummary: "One of the most common lethal genetic diseases in males (1 in 3,500 boys). Predominantly caused by large DNA deletions not detectable by SNP arrays. Exon-skipping therapies and gene therapy are advancing rapidly.",
    prevalence: 28,
    limitedSnpCoverage: true,
    limitationNote: 'DMD is mostly caused by large deletions/duplications (65%) of the DMD gene, which SNP arrays cannot detect. Multiplex PCR or array CGH is needed for comprehensive testing.',
  },
  {
    id: 'color-blindness',
    name: 'Red-Green Color Blindness',
    gene: 'OPN1LW/OPN1MW',
    inheritance: 'x_linked_recessive',
    severity: 'mild',
    variants: [
      { rsid: 'rs104894722', riskAllele: 'T', normalAllele: 'C' }, // OPN1LW variant
    ],
    description: 'Reduced ability to distinguish between red and green colors due to absence or malfunction of cone photoreceptors in the retina.',
    plainLanguageSummary: 'Affects ~8% of males and ~0.5% of females of Northern European descent. Not a disease in the traditional sense — most color-blind individuals adapt well. No treatment, but aids (special glasses, apps) exist.',
    prevalence: 8000,
    limitedSnpCoverage: true,
    limitationNote: 'Color blindness is caused by rearrangements of the opsin gene array, often not captured by single SNPs. Population-level carrier frequency estimates are more reliable than SNP-based testing.',
  },

  // ─── X-Linked Dominant ───────────────────────────────────────────────────────
  {
    id: 'fragile-x',
    name: 'Fragile X Syndrome',
    gene: 'FMR1',
    inheritance: 'x_linked_dominant',
    severity: 'moderate',
    variants: [
      { rsid: 'rs29232', riskAllele: 'A', normalAllele: 'G' }, // FMR1 proxy marker
    ],
    description: 'The most common inherited cause of intellectual disability, caused by expansion of a CGG repeat in the FMR1 gene on the X chromosome.',
    plainLanguageSummary: 'Causes mild to severe intellectual disability, autism features, and behavioral challenges. Females can be affected but usually less severely than males. Premutation carriers can develop late-onset tremor/ataxia (FXTAS).',
    prevalence: 25,
    limitedSnpCoverage: true,
    limitationNote: 'Fragile X is caused by CGG repeat expansion (>200 repeats = full mutation). This cannot be determined from standard SNP data. PCR-based repeat testing is required for accurate diagnosis and carrier detection.',
  },

  // ─── Complex / Polygenic ─────────────────────────────────────────────────────
  {
    id: 'mthfr',
    name: 'MTHFR Variant',
    gene: 'MTHFR',
    inheritance: 'complex',
    severity: 'mild',
    variants: [
      { rsid: 'rs1801133', riskAllele: 'T', normalAllele: 'C' }, // C677T (thermolabile variant)
      { rsid: 'rs1801131', riskAllele: 'C', normalAllele: 'A' }, // A1298C
    ],
    description: 'Variants in the MTHFR gene reduce the activity of the methylenetetrahydrofolate reductase enzyme, affecting folate metabolism and homocysteine levels.',
    plainLanguageSummary: 'Linked to elevated homocysteine (cardiovascular risk) and neural tube defects in pregnancy. The effect is modifiable with folic acid supplementation. Compound heterozygosity (one C677T + one A1298C) has mild clinical impact.',
    prevalence: 40000,
  },
  {
    id: 'prothrombin-g20210a',
    name: 'Prothrombin Thrombophilia',
    gene: 'F2',
    inheritance: 'autosomal_dominant',
    severity: 'mild',
    variants: [
      { rsid: 'rs1799963', riskAllele: 'A', normalAllele: 'G' }, // F2 20210G>A
    ],
    description: 'A mutation in the prothrombin gene that increases prothrombin levels in the blood, raising the risk of abnormal blood clots (thrombosis).',
    plainLanguageSummary: 'Second most common inherited clotting disorder after Factor V Leiden. Risk of clots is low in absolute terms but increases significantly with other risk factors like surgery, pregnancy, or combined with Factor V Leiden.',
    prevalence: 200,
  },
]
