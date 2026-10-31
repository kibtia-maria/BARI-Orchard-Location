# BARI Orchards GIS Portal
### Bangladesh Agricultural Research Institute (বাংলাদেশ কৃষি গবেষণা ইনস্টিটিউট)

A Web Geographical Information System (GIS) application displaying the geographical locations of orchards, germplasm blocks, and research stations of the **Bangladesh Agriculture Research Institute (BARI)**.

---

## Features

1. **Administrative Boundary Exploration:**
   - Interactive administrative boundaries covering all **64 Districts** and **464 Upazilas** of Bangladesh based on the national shapefile.
   - Top dropdowns to filter by **District** and **Upazila**, with instant map auto-zoom and bounding box alignment.

2. **BARI Research Stations & Office Mapping:**
   - Displays BARI headquarters and regional research stations (such as BARI HQ Gazipur and RARS Cumilla).
   - Custom map markers with station identity and details.
   - Total number of offices in the selected region displayed below the map.

3. **Orchard & Germplasm Exploration:**
   - Clicking any BARI office reveals all subordinate fruit orchards on the interactive map.
   - Interactive side panel displaying aggregated figures:
     - **Total number of orchards**
     - **Total number of fruit tree types (botanical species)**
     - **Total number of registered varieties/cultivars**
     - **Total tree (plant) count**
     - **Total orchard area** (toggle between **Acres** and **Hectares**)
   - Clicking an orchard shows its specific information:
     - Full address and supervising office
     - GPS Coordinates (WGS84) with copy button and Google Maps navigation link
     - Date of planting and orchard area
     - Full varieties breakdown table (Fruit type, Variety name, Tree count, Planting date)

4. **Integrated Admin Panel:**
   - **Add New Orchard**: Select office, district, upazila, enter coordinates, area, planting date, and add multiple fruit varieties dynamically.
   - **Modify/Edit**: Update existing orchard or office data with automatic `localStorage` synchronization.
   - **Delete**: Remove orchards or offices with confirmation safeguards.
   - **Data Backup & GitHub Sync**:
     - Export full database to JSON (`bari_orchards_database.json`)
     - Export orchards to CSV
     - Import/Restore JSON backups
     - Reset to original seed datasets anytime

5. **Multi-Basemap GIS Engine:**
   - Standard OpenStreetMap
   - Satellite Imagery (Esri World Imagery)
   - Clean Carto Light Positron
   - Topographic Map (OpenTopoMap)

---

## Pre-Loaded Datasets

- **Upazila Shapefile**: Converted to optimized WGS84 GeoJSON (`/public/data/bangladesh_upazilas.json`).
- **Gazipur BARI Headquarters Campus**: 10 orchard divisions (Fruit Division, Lakkha Field, HRC Backyard, Breeding Field, Pomology Research Field, Fol Bagan, etc.).
- **RARS Cumilla (Regional Agricultural Research Station)**: 6 orchard sites (Sribidda, Chandina, Barura, RARS-1, RARS-2, Nangalkot) with over 56 distinct fruit varieties (Mango, Jackfruit, Citrus, Guava, Litchi, Dragon Fruit, etc.).

---

## How to Host on GitHub (GitHub Pages)

This project is built with Vite + React + TypeScript and is configured with relative base paths (`base: './'`), making it ready for **GitHub Pages**:

1. Initialize Git repository and commit files:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of BARI Orchards GIS Portal"
   ```

2. Link to your GitHub repository:
   ```bash
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git branch -M main
   git push -u origin main
   ```

3. Enable GitHub Pages:
   - Go to your repository on GitHub &rarr; **Settings** &rarr; **Pages**.
   - Under **Build and deployment**, select **GitHub Actions** and use the standard static Vite workflow, or run `npm run build` and deploy the `dist/` folder to the `gh-pages` branch.
