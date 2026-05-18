# DNAMatch — Genetic Compatibility Analyzer

An educational web app that analyzes genetic compatibility between two individuals and estimates offspring disease risk across 22 hereditary conditions using Mendelian inheritance principles.

> **Important:** For educational purposes only. Not a medical device or substitute for professional genetic counseling.

## Features

- Upload 23andMe / AncestryDNA raw data files (.txt) or VCF files
- Manual SNP entry with table interface
- Analyzes 22 hereditary conditions (autosomal recessive/dominant, X-linked, complex)
- Mendelian inheritance risk calculation for offspring
- Overall compatibility score (0–100)
- Sortable results table + expandable disease cards with pie charts

## Conditions Analyzed

Cystic Fibrosis, Sickle Cell Anemia, Beta-Thalassemia, Tay-Sachs, PKU, Gaucher Disease, Spinal Muscular Atrophy, Wilson's Disease, Hereditary Hemochromatosis, Huntington's Disease, Familial Hypercholesterolemia, BRCA1, BRCA2, Factor V Leiden, Marfan Syndrome, Hemophilia A, Hemophilia B, Duchenne MD, Color Blindness, Fragile X Syndrome, MTHFR, Prothrombin Thrombophilia.

---

## Setup & Deployment

### Prerequisites
- Node.js 18+ and npm
- A Firebase project (Spark free tier is sufficient)
- GitHub account

### 1. Clone / Push to GitHub

```bash
# If starting fresh
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/dnamatch.git
git push -u origin main
```

### 2. Create a Firebase Project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project** → name it (e.g. `dnamatch`)
3. Disable Google Analytics (optional)
4. Go to **Hosting** → click **Get started** → follow setup steps
5. Note your **Project ID** (shown in project settings)

### 3. Update Project ID in Two Files

Replace `YOUR_FIREBASE_PROJECT_ID` in:
- `.firebaserc` → `"default": "YOUR_FIREBASE_PROJECT_ID"`
- `.github/workflows/firebase-deploy.yml` → `projectId: YOUR_FIREBASE_PROJECT_ID`

### 4. Set Up GitHub Actions Secret

1. In your Firebase project: **Project Settings → Service accounts → Generate new private key** → download JSON
2. In GitHub repo: **Settings → Secrets and variables → Actions → New repository secret**
   - Name: `FIREBASE_SERVICE_ACCOUNT`
   - Value: paste the entire JSON content

### 5. Deploy

Push to `main` branch — GitHub Actions will build and deploy automatically:

```bash
git push origin main
```

Your app will be live at `https://YOUR_FIREBASE_PROJECT_ID.web.app`

### Local Development

```bash
npm install
npm run dev
# Open http://localhost:3000
```

---

## Architecture

```
src/
  app/              Next.js App Router pages
  components/       React UI components
  lib/
    parsers/        23andMe TSV and VCF file parsers
    genetics/       Mendelian logic, scoring, analysis orchestrator
  data/             Disease & SNP database
```

All genetic analysis runs **client-side in the browser** — no server, no database, no API calls. Firebase Spark free tier is fully sufficient.

## Privacy

DNA data never leaves the user's browser. No data is uploaded to any server.
