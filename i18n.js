/**
 * Speculum - Internationalization (i18n) Module
 * Supports English ('en', default), Spanish ('es'), and Portuguese (Brazil) ('pt-BR').
 * Plain vanilla JS + CommonJS export for unit testing.
 */

(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.SpeculumI18n = api;
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  const STORAGE_KEY = 'speculum_lang';
  const DEFAULT_LANG = 'en';
  const SUPPORTED_LANGS = ['en', 'es', 'pt-BR'];

  const LANG_META = {
    en: {
      code: 'EN',
      htmlLang: 'en',
      name: 'English',
      nextName: 'Español'
    },
    es: {
      code: 'ES',
      htmlLang: 'es',
      name: 'Español',
      nextName: 'Português (Brasil)'
    },
    'pt-BR': {
      code: 'PT-BR',
      htmlLang: 'pt-BR',
      name: 'Português (Brasil)',
      nextName: 'English'
    }
  };

  function normalizeLang(lang) {
    if (!lang || typeof lang !== 'string') return DEFAULT_LANG;
    const trimmed = lang.trim();
    if (trimmed === 'en' || trimmed.toLowerCase().startsWith('en-')) return 'en';
    if (trimmed === 'es' || trimmed.toLowerCase().startsWith('es-')) return 'es';
    if (trimmed === 'pt-BR' || trimmed.toLowerCase() === 'pt-br' || trimmed.toLowerCase() === 'pt') return 'pt-BR';
    return SUPPORTED_LANGS.includes(trimmed) ? trimmed : DEFAULT_LANG;
  }

  function getNextLang(current) {
    const norm = normalizeLang(current);
    const idx = SUPPORTED_LANGS.indexOf(norm);
    return SUPPORTED_LANGS[(idx + 1) % SUPPORTED_LANGS.length];
  }

  function getStoredLang() {
    try {
      if (typeof window !== 'undefined') {
        if (window.localStorage) {
          window.localStorage.removeItem(STORAGE_KEY);
        }
        if (window.sessionStorage) {
          const stored = window.sessionStorage.getItem(STORAGE_KEY);
          if (stored) return normalizeLang(stored);
        }
      }
    } catch (_err) {
      // Ignore storage errors in restricted contexts
    }
    return DEFAULT_LANG;
  }

  let activeLang = getStoredLang();

  // --- UI STRINGS ---
  const UI = {
    en: {
      // Chrome / Nav / Footer
      'skip.link': 'Skip to main content',
      'brand.homeAria': 'Speculum Home',
      'nav.aria': 'Primary Navigation',
      'nav.menu': 'Menu',
      'nav.toggleAria': 'Toggle navigation menu',
      'nav.overview': 'Overview',
      'nav.map': 'Map',
      'nav.finder': 'Finder',
      'nav.methods': 'Methods',
      'lang.buttonTitle': 'Select language',
      'lang.buttonAria': 'Language: English. Select language',
      'lang.menuAria': 'Select language',
      'footer.desc': 'Earth analog sites and similarity calculator for lunar bases and Mars exploration.',
      'footer.credits': 'Data obtained from the National Aeronautics and Space Administration (NASA) Langley Research Center (LaRC) Prediction of Worldwide Energy Resource (POWER) Project funded through the NASA Earth Science/Applied Science Program. Planetary reference data from the NASA NSSDC Moon and Mars Fact Sheets.',
      'footer.creditsYears': 'Data obtained from the National Aeronautics and Space Administration (NASA) Langley Research Center (LaRC) Prediction of Worldwide Energy Resource (POWER) Project funded through the NASA Earth Science/Applied Science Program. Planetary reference data from the NASA NSSDC Moon and Mars Fact Sheets.',
      'footer.pagesTitle': 'Pages',
      'footer.methodsTitle': 'Methods',
      'footer.scoring': 'Scoring method',
      'footer.confidence': 'Confidence rules',
      'footer.parameters': 'Parameters',
      'footer.limitations': 'Known limitations',
      'footer.sources': 'Sources',
      'footer.madeFor': 'Made for the NASA Space Apps Challenge 2026',
      'footer.nasaPower': 'NASA POWER data',

      // Index page
      'meta.indexTitle': 'Speculum - Earth analogs of Moon & Mars',
      'meta.indexDesc': 'Identify Earth locations that are analogs of permanent Moon base locations and of Mars, so teams can test rovers and other hardware before flying.',
      'index.kicker': 'Moon and Mars analog catalog',
      'index.heroTitle': 'Speculum',
      'index.heroDesc': 'Identify Earth locations that are analogs of permanent Moon base locations and of Mars, so teams can test rovers and other hardware before flying.',
      'index.ctaPrimary': 'Describe your project →',
      'index.ctaSecondary': 'Explore the map',
      'index.statsAria': 'Live Catalog Numbers',
      'index.statSites': 'Sites in catalog',
      'index.statDocumented': 'Documented sites',
      'index.statScanCandidates': 'Scan candidates',
      'index.statParams': 'Parameters with data',
      'index.statSources': 'Cited sources',
      'globalScan.title': 'Global scan',
      'globalScan.body': 'We scanned <span class="scan-count-inline">{count}</span> regions of the world with the same climate method to look for candidates outside the known catalog. They are hypotheses based on climate only.',
      'index.challengeTitle': 'The challenge',
      'index.challengeBody': 'Before launching rovers, drills, habitats, or power hardware to permanent lunar bases or Mars, engineering teams need terrestrial field sites that stress equipment under realistic temperatures, aridity, and terrain. Finding the right testbed is difficult because published analog studies are scattered across decades of papers, and no single Earth location replicates every physical condition of another world.',
      'index.howTitle': 'How it works',
      'index.step1Num': 'Step 01',
      'index.step1Title': 'Explore the map',
      'index.step1Desc': 'Browse documented field analogs and climate-only candidates worldwide, inspect NASA POWER climatologies, review extreme percentile ranks, and check access or permit constraints.',
      'index.step1Link': 'Open map →',
      'index.step2Num': 'Step 02',
      'index.step2Title': 'Describe your project',
      'index.step2Desc': 'Choose what hardware or discipline you are testing, select the lunar or Martian target environment to simulate, set logistics filters, and optionally adjust parameter weights.',
      'index.step2Link': 'Open finder →',
      'index.step3Num': 'Step 03',
      'index.step3Title': 'Get a ranked list',
      'index.step3Desc': 'Review the top 10 matching sites separated by published analog evidence (Tier A) vs climatological similarity (Tier B), inspect per-parameter breakdowns and warnings, or export a CSV.',
      'index.step3Link': 'Rank sites →',
      'index.whatTitle': 'What this tool can and cannot tell you',
      'index.whatCanTitle': 'What it tells you',
      'index.whatCan1': 'Which terrestrial sites rank closest to each other along the climate directions relevant to a Moon or Mars target.',
      'index.whatCan2': 'Climate baselines sourced from 25-year NASA POWER grid data (2001–2025) and published literature, each tagged with explicit <strong>high</strong>, <strong>medium</strong>, or <strong>low</strong> confidence levels.',
      'index.whatCan3': 'Whether a site has published analog literature for your target, missing-data coverage warnings, or logistics and permit constraints.',
      'index.whatCannotTitle': 'What it cannot tell you',
      'index.whatCannot1': '<strong>Analogs never reproduce gravity, ionizing radiation, or space vacuum:</strong> Earth testing always runs at 1 g under a thick protective atmosphere.',
      'index.whatCannot2': '<strong>Scores are relative, not absolute:</strong> a high score ranks a site favorably against the other sites in the pool and does not mean the site physically matches lunar or Martian conditions.',
      'index.whatCannot3': 'Missing field metrics such as slope, soil bearing strength, and verified site-level logistics still require local survey checks before deployment.',
      'index.dataTitle': 'Data and methods',
      'index.dataBody': 'Every number on Speculum comes from NASA POWER 25-year climatologies (2001–2025), the NASA NSSDC Moon and Mars Fact Sheets, and published analog studies. Read how the scoring works with a worked example, browse all <span id="data-params-count">{count}</span> parameters, check confidence rules, and view the full source list.',
      'index.dataCta': 'Methods and sources →',
      'index.teamTitle': 'Team',
      'index.teamDesc': 'We are high school students from Recife, Brazil, looking for a way to expand our knowledge by integrating collaboration, technology, and space science. Our goal is to use open-source data and software development to create impactful solutions for real-world and off-world challenges.',
      'index.teamMembersLabel': 'Members:',

      // Map page
      'meta.mapTitle': 'Map - Speculum',
      'meta.mapDesc': 'Map of Earth analog test sites for Moon and Mars exploration with NASA POWER climate data and site limits.',
      'map.kicker': 'Global map',
      'map.title': 'Analog sites map',
      'map.desc': 'Global map of Moon and Mars testing grounds with NASA POWER climate data and site limits.',
      'map.filterTarget': 'Target:',
      'map.allTargets': 'All targets ({n})',
      'map.filterBody': 'Body:',
      'map.allBodies': 'All bodies',
      'map.showClimateOnly': 'Show climate-only sites',
      'map.showingSites': 'Showing {visible} of {total} sites',
      'map.offlineBanner': 'Map tiles unavailable offline - site markers and detailed analog data remain interactive.',
      'map.leafletUnavailable': 'Interactive map library unavailable. Use the site table below to inspect every analog site.',
      'map.emptyTitle': 'No analog sites match these filters.',
      'map.emptyDesc': 'No sites in the dataset match the selected target, body, and evidence filters.',
      'map.emptyTableHint': 'Try clearing your target or body filter, or enable “Show climate-only sites”.',
      'map.resetFilters': 'Reset map filters',
      'map.legendDoc': 'Documented analogs ({n})',
      'map.legendClimate': 'Climate data only ({n})',
      'map.legendDiscovery': 'Global scan candidates ({n})',
      'map.selectSiteTitle': 'Select a site',
      'map.selectSiteDesc': 'Click any blue (documented) or gray (climate-only) marker on the map to view its parameters, simulated targets, strengths and weaknesses, and limits.',
      'map.tableTitle': 'Site coordinates and elevation',
      'map.colSite': 'Site',
      'map.colEvidence': 'Evidence',
      'map.colLocation': 'Location',
      'map.colLat': 'Latitude',
      'map.colLon': 'Longitude',
      'map.colElev': 'Elevation',
      'map.colAction': 'Action',
      'map.badgeDoc': 'Documented',
      'map.badgeClimate': 'Climate only',
      'map.badgeDiscovery': 'Scan candidate',
      'map.btnInspect': 'Inspect',
      'map.tooltipDoc': 'Documented analog',
      'map.tooltipClimate': 'Climate data only',
      'map.tooltipDiscovery': 'Discovery candidate (climate only)',
      'map.panelClimateBadge': 'Climate data only: no literature source yet',
      'map.panelDiscoveryBadge': 'Discovery candidate from the global scan: climate data only, no literature yet',
      'map.panelCloseAria': 'Close details panel',
      'map.coordNotice': 'All coordinates are approximate (regional / grid-cell center).',
      'map.docAnalogFor': 'Documented analog for',
      'map.noneRecorded': 'None recorded',
      'map.explorationTitle': 'How this site helps exploration',
      'map.explorationEmpty': 'No documented exploration campaign recorded yet (climate-only candidate).',
      'map.breaksDownTitle': 'Where the analogy breaks down',
      'map.breaksDownReference': 'Reference',
      'map.breaksDownSite': 'Site',
      'map.breaksDownGap': 'Gap',
      'map.breaksDownNoMatch': 'None of the reference parameters for this body are recorded at this site.',
      'map.breaksDownNoTargetBody': 'No Moon or Mars target is assigned yet (climate-only candidate).',
      'map.strengthsTitle': 'Strengths and weaknesses',
      'map.strengthsSub': 'Top <span class="mono">3</span> most extreme traits relative to all <span class="mono">{n}</span> sites:',
      'map.noNumericDist': 'No numeric distributions available.',
      'map.siteParamsTitle': 'Site parameters',
      'map.colParameter': 'Parameter',
      'map.colValue': 'Value',
      'map.colRange': 'Range',
      'map.colConfidence': 'Confidence',
      'map.colSource': 'Source',
      'map.noMeasurements': 'No measurements recorded.',
      'map.flagsTitle': 'Flags and access',
      'map.stationLabel': 'Support station:',
      'map.stationYes': 'Permanent analog station',
      'map.stationNo': 'None (field expedition site)',
      'map.protectedLabel': 'Protected area:',
      'map.protectedYes': 'Yes (permits required)',
      'map.protectedNo': 'No',
      'map.accessNoteLabel': 'Access note:',
      'map.accessNoteNone': 'None reported.',
      'map.notSimTitle': 'What this site does NOT simulate',
      'map.notSimSub': 'Conditions that differ from Moon and Mars:',
      'map.sourcesTitle': 'Sources ({n})',
      'map.viewPub': 'View publication',
      'map.noSourcesSite': 'No literature sources recorded for this site.',
      'map.openInFinder': 'Open in finder →',

      // Finder page
      'meta.finderTitle': 'Finder - Speculum',
      'meta.finderDesc': 'Rank Earth analog sites for Moon and Mars targets using NASA POWER climate data and mission weights.',
      'finder.kicker': 'Site ranking calculator',
      'finder.title': 'Analog finder',
      'finder.desc': 'Choose what you are testing and the target environment to rank Earth sites by directional percentiles and mission weights.',
      'finder.q1': '1. What are you testing?',
      'finder.q2': '2. Which environment do you want to simulate?',
      'finder.q3': '3. Logistics and site pool',
      'finder.onlyStation': 'Only sites with a support station',
      'finder.excludeProtected': 'Exclude protected areas',
      'finder.excludeAccess': 'Exclude sites with access problems',
      'finder.includeClimateOnly': 'Include climate-only sites',
      'finder.advanced': 'Advanced',
      'finder.activeParamsCount': '{n} active parameters (0–5)',
      'finder.lowerCloser': 'Lower value is closer',
      'finder.higherCloser': 'Higher value is closer',
      'finder.skipZero': '0 (skip)',
      'finder.resetWeights': 'Reset to profile weights',
      'finder.disclaimer': 'The score ranks the candidate sites against each other within the selected pool and is not an absolute similarity to the target.',
      'finder.resultsHeadline': 'Ranked sites',
      'finder.calculating': 'Calculating...',
      'finder.downloadCsv': 'Download CSV',
      'finder.tierALabel': 'Documented analog of this target',
      'finder.tierADesc': 'Published analog studies cite this site for this target.',
      'finder.tierBLabel': 'Similar climate, no documented analog',
      'finder.tierBDesc': 'Similar climate, with no published study linking this site to this target.',
      'finder.zeroWeightsMeta': '<strong>0 active weighted parameters</strong> for <em>{target}</em> &bull; <em>{profile}</em>.',
      'finder.zeroWeightsTitle': 'All parameter weights are set to 0.',
      'finder.zeroWeightsDesc': 'Ranking requires at least one active parameter with a weight above 0. Increase a slider in the Advanced section or reset to the default weights for this mission profile.',
      'finder.showingTop': 'Showing top <strong>10</strong> of <strong>{n}</strong> matching sites',
      'finder.showingCountSingular': 'Showing <strong>{n}</strong> matching site',
      'finder.showingCountPlural': 'Showing <strong>{n}</strong> matching sites',
      'finder.scoredMeta': '{showing} (scored across <strong>{pool}</strong>-site pool) for <em>{target}</em> &bull; <em>{profile}</em>.',
      'finder.splitScoredMeta': 'Showing <strong>{docShown}</strong> documented analogs and <strong>{discShown}</strong> discovery candidates (scored across <strong>{pool}</strong>-site pool) for <em>{target}</em> &bull; <em>{profile}</em>.',
      'finder.sectionDocTitle': 'Documented analogs',
      'finder.sectionDocMeta': 'Top 5 of Tier A ({total} matching)',
      'finder.sectionDocEmpty': 'No Tier A documented analogs match this target and the active filters.',
      'finder.sectionDiscoveryKicker': 'Discovery candidates from the global scan',
      'finder.sectionDiscoveryTitle': 'Hypotheses to validate, not recommendations',
      'finder.sectionDiscoveryMeta': 'Top 5 global-scan sites ({total} matching, scored across all {pool} sites)',
      'finder.sectionDiscoveryEmpty': 'No discovery candidates from the global scan match the active logistics filters.',
      'finder.emptyTitle': 'No candidate sites match these logistics filters.',
      'finder.emptyDesc': 'All {pool} sites in the selected pool were excluded by the active logistics restrictions. Try clearing one or more filters or enabling “Include climate-only sites”.',
      'finder.clearFilters': 'Clear logistics filters',
      'finder.coverageLabel': 'Coverage:',
      'finder.showOnMap': 'Show on map',
      'finder.flagStationYes': 'Support station available',
      'finder.flagStationNo': 'No support station',
      'finder.flagProtected': 'Protected area',
      'finder.flagAccessNote': 'Access note',
      'finder.flagClimateOnly': 'Climate-only candidate',
      'finder.flagDiscovery': 'Discovery candidate (global scan)',
      'finder.dirLowerArrow': '↓ lower is closer',
      'finder.dirHigherArrow': '↑ higher is closer',
      'finder.breakdownSummary': 'Parameter breakdown ({n} active factors)',
      'finder.colParam': 'Parameter',
      'finder.colSiteVal': 'Site value',
      'finder.colSimilarity': 'Similarity',
      'finder.colWeight': 'Weight',
      'finder.colConfidence': 'Confidence',
      'finder.noBreakdown': 'No weighted target parameters with available site measurements (all active weights may be 0).',
      'finder.breaksDownTitle': 'Where the analogy breaks down ({body})',
      'finder.refPrefix': 'Ref:',
      'finder.sitePrefix': 'Site:',
      'finder.sourcesLabel': 'Sources:',
      'finder.noneCited': 'None cited',
      'finder.approxCoord': 'Approx. coord:',
      'finder.warningsAria': 'Site warnings',
      'finder.confLevelsTitle': 'Confidence levels',
      'finder.confPopoverHigh': '<strong>High (1.0×):</strong> direct ground measurement or field survey.',
      'finder.confPopoverMed': '<strong>Medium (0.8×):</strong> NASA POWER climatology matching site setting.',
      'finder.confPopoverLow': '<strong>Low (0.5×):</strong> coarse global grid in mountains, islands, polar ice, or mismatched elevation.',

      // Shared badges & warnings (app.js)
      'conf.highLabel': 'High confidence',
      'conf.highTitle': 'Direct ground measurement or published site survey (multiplier 1.0x)',
      'conf.medLabel': 'Medium confidence',
      'conf.medTitle': 'Validated NASA POWER climatology (multiplier 0.8x)',
      'conf.lowLabel': 'Low confidence',
      'conf.lowTitle': 'Satellite reanalysis or coarse grid cell (multiplier 0.5x)',
      'tier.aTitle': 'Peer-reviewed literature explicitly documents this site as an analog for this target environment.',
      'tier.bTitle': 'Physical and climatological match; not yet formally cataloged in published literature for this target.',
      'warn.coverage': 'Coverage is below 70% ({coverage}%): some weighted target parameters lack data at this site.',
      'warn.lowConfMsg': 'Climate values for this site come from a coarse global grid, so treat the score as a guide and check local data before planning a test.',
      'warn.lowConfTooltip': 'High confidence (1.0x): direct ground measurement or published field survey. Medium confidence (0.8x): NASA POWER 25-year climatology matching the site setting reasonably well. Low confidence (0.5x): coarse global grid cell in mountains, islands, polar ice, or where grid elevation differs noticeably from the site.',
      'warn.protectedWithNote': 'Protected area (permits required). Access note: {note}',
      'warn.protectedOnly': 'Protected area: research permits may be required before field testing.',
      'warn.accessOnly': 'Access note: {note}',

      // CSV headers
      'csv.rank': 'Rank',
      'csv.siteId': 'Site ID',
      'csv.siteName': 'Site Name',
      'csv.country': 'Country',
      'csv.region': 'Region',
      'csv.tier': 'Tier',
      'csv.tierLabel': 'Tier Label',
      'csv.score': 'Score',
      'csv.coverage': 'Coverage (%)',
      'csv.evidence': 'Evidence Level',
      'csv.station': 'Support Station',
      'csv.protected': 'Protected Area',
      'csv.accessNote': 'Access Note',
      'csv.warnings': 'Warnings',
      'csv.target': 'Target',
      'csv.profile': 'Profile',
      'csv.section': 'Result Section',
      'csv.yes': 'Yes',
      'csv.no': 'No',

      // Methods page
      'meta.methodsTitle': 'Methods and limits - Speculum',
      'meta.methodsDesc': 'Scoring method with a worked example, parameter list, confidence rules, known limitations, and sources for Speculum.',
      'methods.kicker': 'Methods and limits',
      'methods.title': 'Scoring method and limits',
      'methods.desc': 'How Speculum compares analog sites without inventing missing measurements, how confidence affects weights, and where Earth analogs fall short of the Moon and Mars.',
      'methods.docCountLabel': 'Documented sites',
      'methods.scanCountLabel': 'Scan candidates',
      'methods.s1Title': '1. Scoring method',
      'methods.s1Intro': 'No place on Earth matches the absolute climate of the Moon or Mars: Earth is warmer, wetter, and wrapped in a dense atmosphere. Measuring raw distance to Martian or lunar numbers would make almost every Earth site look equally far away. Instead, Speculum ranks the Earth sites <strong>against each other</strong> in the direction that moves closer to your chosen target.',
      'methods.stepHeading': 'Step-by-step calculation',
      'methods.step1': '<strong>Choose the comparison pool:</strong> By default, the pool is the <span id="method-doc-count">{docCount}</span> documented sites. If you check <em>Include climate-only sites</em> on the calculator, the full catalog (<span id="method-all-count">{allCount}</span> sites total, including the <span id="method-scan-count">{scanCount}</span> global-scan candidates) enters the pool. Percentile ranks are always computed across this pool <em>before</em> logistics filters hide any sites.',
      'methods.step2': '<strong>Rank each active parameter in the target\'s direction:</strong> For every parameter used by the target that has site data, take all typical numeric values in the pool (count = <code>n</code>) and compute each site\'s percentile rank between 0 and 1:<div class="formula-box">rank = (number of smaller values + (number of equal values - 1) / 2) / (n - 1)</div>If the target favors a <strong>higher</strong> value (such as daily temperature swing or UV radiation), similarity is <code>sim = rank</code>. If the target favors a <strong>lower</strong> value (such as temperature, pressure, or precipitation), similarity is <code>sim = 1 - rank</code>.',
      'methods.step3': '<strong>Multiply by mission weight and confidence:</strong> Each parameter gets a weight <code>w</code> from 0 to 5 (prefilled from the profile you chose, or 1 if the profile does not list that parameter). Parameters with weight 0 or without site data are skipped. Each measured value also has a confidence multiplier <code>m</code> (<span id="mult-high">{high}</span> for high, <span id="mult-med">{med}</span> for medium, <span id="mult-low">{low}</span> for low).',
      'methods.step4': '<strong>Compute score and coverage:</strong><div class="formula-box">Score = 100 * sum(w * m * sim) / sum(w * m)   (over parameters the site has)<br />Coverage = 100 * sum(w of parameters the site has) / sum(w of all target parameters)</div>A low score does not mean a site is useless; a low coverage percentage warns that key parameters lacked measurements at that site.',
      'methods.step5': '<strong>Filter and sort into two tiers (or split discovery results):</strong> Logistics filters (support station, protected area, access problems) hide ineligible sites after scoring. By default, sites are grouped into <strong>Tier A</strong> (<em>Documented analog of this target</em>) first, then <strong>Tier B</strong> (<em>Similar climate, no documented analog</em>). When <em>Include climate-only sites</em> is enabled, results are split into <em>Documented analogs</em> (top 5 of Tier A) and <em>Discovery candidates from the global scan</em> (top 5 global-scan sites, regardless of tier).',
      'methods.workedTitle': 'Worked example: Mars Desert Research Station (MDRS) for Mars · equatorial regions and Wheeled rover',
      'methods.workedColParam': 'Parameter and direction',
      'methods.workedColVal': 'MDRS value',
      'methods.workedColPool': 'Pool count (n)',
      'methods.workedColSmaller': 'Smaller / equal',
      'methods.workedColSim': 'Similarity (sim)',
      'methods.workedColWeight': 'Weight (w)',
      'methods.workedColConf': 'Confidence (m)',
      'methods.workedColWm': 'w × m',
      'methods.workedColWmsim': 'w × m × sim',
      'methods.dirHigher': 'higher',
      'methods.dirLower': 'lower',
      'methods.confHighShort': 'High',
      'methods.confMedShort': 'Medium',
      'methods.confLowShort': 'Low',
      'methods.workedIntro': 'Using the default documented-only pool ({pool} sites), here is how MDRS (Utah, USA) is scored for <strong>{target}</strong> with the <strong>{profile}</strong> profile.{missingNote}',
      'methods.workedMissingNone': ' All {count} target parameters have site data at MDRS, with weights summing to <code>{weights} = {total}</code>.',
      'methods.workedMissingSingle': ' Notice that <em>{names}</em> has no site data yet, so it is omitted from the score numerator and denominator while still counting toward the total target weight.',
      'methods.workedMissingPlural': ' Notice that <em>{names}</em> have no site data yet, so they are omitted from the score numerator and denominator while still counting toward the total target weight.',
      'methods.workedTotals': '<strong>Totals:</strong> <code>sum(w * m * sim) = {sumWmSim}</code>, <code>sum(w * m) = {sumWm}</code> &rarr; <strong>Score = 100 &times; {sumWmSim} / {sumWm} = {score}%</strong>.<br /><strong>Coverage:</strong> MDRS has data for weights summing to <code>{siteWeight}</code> out of total target weight <code>{totalWeight}</code> &rarr; <strong>Coverage = round(100 &times; {siteWeight} / {totalWeight}) = {coverage}%</strong>. Because MDRS lists <code>mars_equatorial</code> in its documented targets, it is placed in <strong>Tier A</strong>.',
      'methods.s2Title': '2. Confidence rules',
      'methods.s2Intro': 'Every site parameter carries a confidence rating so coarse grid estimates do not outweigh direct site measurements. The multiplier reduces how strongly a low-certainty row affects the weighted average. If more than half of the scored rows at a site have low confidence, Speculum shows a warning on the result card.',
      'methods.multSuffix': '{val}× multiplier',
      'methods.confCardHighDesc': 'Direct ground measurement, site station record, or published field survey for that exact location.',
      'methods.confCardMedDesc': 'NASA POWER 25-year climatology (2001–2025) where the grid cell elevation and coastal setting match the field site reasonably well.',
      'methods.confCardLowDesc': 'Coarse grid cell in steep mountains, islands, polar ice sheets, or sites where grid elevation differs noticeably from the actual site.',
      'methods.s3Title': '3. Parameters',
      'methods.paramsSummary': '{total} parameters defined ({withData} with site data, {missing} missing).',
      'methods.pColParam': 'Parameter',
      'methods.pColUnit': 'Unit',
      'methods.pColGroup': 'Group',
      'methods.pColHasData': 'Has data',
      'methods.pColNotes': 'Notes and limitations',
      'methods.limitPrefix': 'Limit:',
      'methods.yes': 'Yes',
      'methods.no': 'No',
      'methods.s4Title': '4. Known limitations and next steps',
      'methods.s4Intro': 'Every terrestrial analog campaign must account for both universal spaceflight physics and current dataset gaps:',
      'methods.covTitle': 'Dimensions in the challenge and what Speculum covers',
      'methods.covColDimension': 'Dimension',
      'methods.covColStatus': 'Status',
      'methods.covColCoverage': 'What Speculum covers',
      'methods.statusCovered': 'Covered',
      'methods.statusPartial': 'Partial',
      'methods.statusLitOnly': 'Literature only',
      'methods.statusLitSites': 'Literature & sites',
      'methods.statusNotCovered': 'Not covered yet',
      'methods.dimGeology': 'Geology and surface materials',
      'methods.covGeology': 'Environment type and literature tags',
      'methods.dimTerrain': 'Terrain and slope',
      'methods.covTerrain': 'No site measurements yet',
      'methods.dimTemp': 'Temperature and extremes',
      'methods.covTemp': 'Mean annual temperature, daily range, extreme minimum and maximum',
      'methods.dimWater': 'Water and ice',
      'methods.covWater': 'Precipitation and water vapor, no ice data',
      'methods.dimDust': 'Dust and wind',
      'methods.covDust': 'Mean wind only',
      'methods.dimBio': 'Biology',
      'methods.covBio': 'Literature tags only',
      'methods.dimCaves': 'Caves',
      'methods.covCaves': 'Literature tags and lava-tube sites',
      'methods.dimOps': 'Operations',
      'methods.covOps': 'Support station, protected area and access flags',
      'methods.gapsTitle': 'Dataset gaps and next steps',
      'methods.gap1': '<strong>Slope, soil strength, radiation, and logistics data are missing:</strong> Parameters such as typical terrain slope, soil bearing strength (trafficability), surface rockiness, regolith type, ambient radiation dose, wind/dust storms, ice/permafrost, accessibility, infrastructure, permits, connectivity, and relative cost are modeled in the schema (<code>in_data: false</code>) but do not yet have site-by-site values.',
      'methods.gap2': '<strong>Coordinates are approximate:</strong> Site latitude and longitude points represent regional centers or representative desert/crater coordinates rather than surveyed rover test tracks or habitat pads.',
      'methods.gap3': '<strong>Grid data is weak in mountains and on islands:</strong> NASA POWER uses coarse reanalysis grid cells (roughly 0.5° × 0.625°), which blend sea and land on small volcanic islands (such as Tenerife, Lanzarote, Hawaii, or Jeju) and average elevation across valleys and summits in mountain ranges (such as Chajnantor or Mauna Kea).',
      'methods.gap4': '<strong>Next steps:</strong> Integrate peer-reviewed slope, regolith, and ground meteorological station measurements; verify site-level permit and connectivity fields; and add primary literature citations for the climate-only candidate sites.',
      'methods.s5Title': '5. Sources',
      'methods.sourcesSummary': '{count} data sources, articles, and mission reports cited in Speculum.',
      'methods.sourcesCredit': 'Site climatologies come from <strong>NASA POWER</strong> (2001–2025), planetary reference values come from the <strong>NASA NSSDC Moon and Mars Fact Sheets</strong> (S055, S056), and field-analog evidence comes from published literature and mission reports.',
      'methods.openAccess': 'Open access',
      'methods.openSource': 'Open source',
      'methods.citationOnly': 'Citation record (no external URL)',
      'methods.yearPrefix': 'Year:'
    },

    es: {
      'skip.link': 'Saltar al contenido principal',
      'brand.homeAria': 'Inicio de Speculum',
      'nav.aria': 'Navegación principal',
      'nav.menu': 'Menú',
      'nav.toggleAria': 'Alternar menú de navegación',
      'nav.overview': 'Inicio',
      'nav.map': 'Mapa',
      'nav.finder': 'Buscador',
      'nav.methods': 'Métodos',
      'lang.buttonTitle': 'Seleccionar idioma',
      'lang.buttonAria': 'Idioma: Español. Seleccionar idioma',
      'lang.menuAria': 'Seleccionar idioma',
      'footer.desc': 'Sitios análogos terrestres y calculadora de similitud para bases lunares y exploración de Marte.',
      'footer.credits': 'Datos obtenidos del Proyecto Prediction of Worldwide Energy Resource (POWER) del Centro de Investigación Langley (LaRC) de la Administración Nacional de Aeronáutica y el Espacio (NASA), financiado a través del Programa de Ciencias de la Tierra/Ciencia Aplicada de la NASA. Datos planetarios de referencia de las Hojas de Datos de la Luna y Marte del NASA NSSDC.',
      'footer.creditsYears': 'Datos obtenidos del Proyecto Prediction of Worldwide Energy Resource (POWER) del Centro de Investigación Langley (LaRC) de la Administración Nacional de Aeronáutica y el Espacio (NASA), financiado a través del Programa de Ciencias de la Tierra/Ciencia Aplicada de la NASA. Datos planetarios de referencia de las Hojas de Datos de la Luna y Marte del NASA NSSDC.',
      'footer.pagesTitle': 'Páginas',
      'footer.methodsTitle': 'Métodos',
      'footer.scoring': 'Método de puntuación',
      'footer.confidence': 'Reglas de confianza',
      'footer.parameters': 'Parámetros',
      'footer.limitations': 'Limitaciones conocidas',
      'footer.sources': 'Fuentes',
      'footer.madeFor': 'Hecho para el NASA Space Apps Challenge 2026',
      'footer.nasaPower': 'Datos de NASA POWER',

      'meta.indexTitle': 'Speculum - Análogos terrestres de la Luna y Marte',
      'meta.indexDesc': 'Identifica lugares en la Tierra que son análogos de bases lunares permanentes y de Marte, para que los equipos prueben róveres y otro hardware antes de volar.',
      'index.kicker': 'Catálogo de análogos de la Luna y Marte',
      'index.heroTitle': 'Speculum',
      'index.heroDesc': 'Identifica ubicaciones terrestres que son análogas de bases lunares permanentes y de Marte, para que los equipos puedan probar róveres y otro equipamiento antes del lanzamiento.',
      'index.ctaPrimary': 'Describe tu proyecto →',
      'index.ctaSecondary': 'Explorar el mapa',
      'index.statsAria': 'Cifras en vivo del catálogo',
      'index.statSites': 'Sitios en el catálogo',
      'index.statDocumented': 'Sitios documentados',
      'index.statScanCandidates': 'Candidatos del barrido',
      'index.statParams': 'Parámetros con datos',
      'index.statSources': 'Fuentes citadas',
      'globalScan.title': 'Barrido global',
      'globalScan.body': 'Examinamos <span class="scan-count-inline">{count}</span> regiones del mundo con el mismo método climático para buscar candidatos fuera del catálogo conocido. Son hipótesis basadas únicamente en el clima.',
      'index.challengeTitle': 'El desafío',
      'index.challengeBody': 'Antes de lanzar róveres, perforadoras, hábitats o sistemas de energía hacia bases lunares permanentes o Marte, los equipos de ingeniería necesitan sitios de campo en la Tierra que pongan a prueba los equipos bajo temperaturas, aridez y terrenos realistas. Encontrar el banco de pruebas adecuado es difícil porque los estudios publicados están dispersos en décadas de artículos y ningún lugar terrestre reproduce todas las condiciones físicas de otro mundo.',
      'index.howTitle': 'Cómo funciona',
      'index.step1Num': 'Paso 01',
      'index.step1Title': 'Explora el mapa',
      'index.step1Desc': 'Recorre análogos de campo documentados y candidatos basados solo en clima en todo el mundo, consulta climatologías de NASA POWER, revisa rangos percentiles extremos y verifica restricciones de acceso o permisos.',
      'index.step1Link': 'Abrir mapa →',
      'index.step2Num': 'Paso 02',
      'index.step2Title': 'Describe tu proyecto',
      'index.step2Desc': 'Elige qué equipo o disciplina estás probando, selecciona el entorno objetivo lunar o marciano que deseas simular, define filtros logísticos y ajusta opcionalmente los pesos de los parámetros.',
      'index.step2Link': 'Abrir buscador →',
      'index.step3Num': 'Paso 03',
      'index.step3Title': 'Obtén una lista ordenada',
      'index.step3Desc': 'Revisa los 10 mejores sitios separados por evidencia publicada de análogo (Nivel A) frente a similitud climatológica (Nivel B), consulta el desglose por parámetro y las advertencias, o exporta un CSV.',
      'index.step3Link': 'Clasificar sitios →',
      'index.whatTitle': 'Qué puede y qué no puede decirte esta herramienta',
      'index.whatCanTitle': 'Qué te dice',
      'index.whatCan1': 'Qué sitios terrestres se posicionan más cerca entre sí según las direcciones climáticas relevantes para un objetivo de la Luna o Marte.',
      'index.whatCan2': 'Líneas base climáticas obtenidas de cuadrículas de NASA POWER de 25 años (2001–2025) y literatura publicada, cada una etiquetada con niveles explícitos de confianza <strong>alta</strong>, <strong>media</strong> o <strong>baja</strong>.',
      'index.whatCan3': 'Si un sitio cuenta con literatura publicada como análogo para tu objetivo, advertencias de cobertura por datos faltantes o restricciones logísticas y de permisos.',
      'index.whatCannotTitle': 'Qué no puede decirte',
      'index.whatCannot1': '<strong>Los análogos nunca reproducen la gravedad, la radiación ionizante ni el vacío espacial:</strong> las pruebas en la Tierra siempre ocurren a 1 g bajo una atmósfera densa y protectora.',
      'index.whatCannot2': '<strong>Las puntuaciones son relativas, no absolutas:</strong> una puntuación alta ubica un sitio favorablemente frente a los demás del grupo, pero no significa que iguale físicamente las condiciones lunares o marcianas.',
      'index.whatCannot3': 'Métricas de campo faltantes como pendiente, capacidad portante del suelo y logística verificada a nivel local siguen requiriendo inspecciones en terreno antes del despliegue.',
      'index.dataTitle': 'Datos y métodos',
      'index.dataBody': 'Cada cifra en Speculum proviene de climatologías de 25 años de NASA POWER (2001–2025), de las Hojas de Datos de la Luna y Marte del NASA NSSDC y de estudios publicados sobre análogos. Lee cómo funciona la puntuación con un ejemplo práctico, explora los <span id="data-params-count">{count}</span> parámetros, revisa las reglas de confianza y consulta la lista completa de fuentes.',
      'index.dataCta': 'Métodos y fuentes →',
      'index.teamTitle': 'Equipo',
      'index.teamDesc': 'Somos estudiantes de secundaria de Recife, Brasil, en busca de ampliar nuestros conocimientos integrando colaboración, tecnología y ciencia espacial. Nuestro objetivo es utilizar datos de código abierto y desarrollo de software para crear soluciones de impacto frente a desafíos en la Tierra y fuera de ella.',
      'index.teamMembersLabel': 'Integrantes:',

      'meta.mapTitle': 'Mapa - Speculum',
      'meta.mapDesc': 'Mapa de sitios de prueba análogos terrestres para la exploración de la Luna y Marte con datos climáticos de NASA POWER y límites del sitio.',
      'map.kicker': 'Mapa global',
      'map.title': 'Mapa de sitios análogos',
      'map.desc': 'Mapa global de terrenos de prueba para la Luna y Marte con datos climáticos de NASA POWER y límites de cada sitio.',
      'map.filterTarget': 'Objetivo:',
      'map.allTargets': 'Todos los objetivos ({n})',
      'map.filterBody': 'Cuerpo:',
      'map.allBodies': 'Todos los cuerpos',
      'map.showClimateOnly': 'Mostrar sitios solo climáticos',
      'map.showingSites': 'Mostrando {visible} de {total} sitios',
      'map.offlineBanner': 'Teselas del mapa no disponibles sin conexión: los marcadores y los datos detallados siguen siendo interactivos.',
      'map.leafletUnavailable': 'Biblioteca de mapa interactivo no disponible. Usa la tabla inferior para inspeccionar cada sitio análogo.',
      'map.emptyTitle': 'Ningún sitio análogo coincide con estos filtros.',
      'map.emptyDesc': 'Ningún sitio del conjunto de datos coincide con el objetivo, cuerpo celeste y filtros de evidencia seleccionados.',
      'map.emptyTableHint': 'Prueba limpiar el filtro de objetivo o cuerpo, o activa “Mostrar sitios solo climáticos”.',
      'map.resetFilters': 'Restablecer filtros del mapa',
      'map.legendDoc': 'Análogos documentados ({n})',
      'map.legendClimate': 'Solo datos climáticos ({n})',
      'map.legendDiscovery': 'Candidatos del barrido global ({n})',
      'map.selectSiteTitle': 'Selecciona un sitio',
      'map.selectSiteDesc': 'Haz clic en cualquier marcador azul (documentado) o gris (solo clima) del mapa para ver sus parámetros, objetivos simulados, fortalezas, debilidades y límites.',
      'map.tableTitle': 'Coordenadas y elevación de los sitios',
      'map.colSite': 'Sitio',
      'map.colEvidence': 'Evidencia',
      'map.colLocation': 'Ubicación',
      'map.colLat': 'Latitud',
      'map.colLon': 'Longitud',
      'map.colElev': 'Elevación',
      'map.colAction': 'Acción',
      'map.badgeDoc': 'Documentado',
      'map.badgeClimate': 'Solo clima',
      'map.badgeDiscovery': 'Candidato del barrido',
      'map.btnInspect': 'Inspeccionar',
      'map.tooltipDoc': 'Análogo documentado',
      'map.tooltipClimate': 'Solo datos climáticos',
      'map.tooltipDiscovery': 'Candidato de descubrimiento (solo clima)',
      'map.panelClimateBadge': 'Solo datos climáticos: aún sin fuente bibliográfica',
      'map.panelDiscoveryBadge': 'Candidato de descubrimiento del barrido global: solo datos climáticos, aún sin literatura',
      'map.panelCloseAria': 'Cerrar panel de detalles',
      'map.coordNotice': 'Todas las coordenadas son aproximadas (centro regional / celda de cuadrícula).',
      'map.docAnalogFor': 'Análogo documentado para',
      'map.noneRecorded': 'Ninguno registrado',
      'map.explorationTitle': 'Cómo ayuda este sitio a la exploración',
      'map.explorationEmpty': 'Aún no se ha registrado una campaña de exploración documentada (candidato solo climático).',
      'map.breaksDownTitle': 'Dónde falla la analogía',
      'map.breaksDownReference': 'Referencia',
      'map.breaksDownSite': 'Sitio',
      'map.breaksDownGap': 'Brecha',
      'map.breaksDownNoMatch': 'Ninguno de los parámetros de referencia para este cuerpo está registrado en este sitio.',
      'map.breaksDownNoTargetBody': 'Aún no se ha asignado un objetivo lunar o marciano (candidato solo climático).',
      'map.strengthsTitle': 'Fortalezas y debilidades',
      'map.strengthsSub': 'Los <span class="mono">3</span> rasgos más extremos respecto a los <span class="mono">{n}</span> sitios:',
      'map.noNumericDist': 'No hay distribuciones numéricas disponibles.',
      'map.siteParamsTitle': 'Parámetros del sitio',
      'map.colParameter': 'Parámetro',
      'map.colValue': 'Valor',
      'map.colRange': 'Rango',
      'map.colConfidence': 'Confianza',
      'map.colSource': 'Fuente',
      'map.noMeasurements': 'No hay mediciones registradas.',
      'map.flagsTitle': 'Indicadores y acceso',
      'map.stationLabel': 'Estación de apoyo:',
      'map.stationYes': 'Estación análoga permanente',
      'map.stationNo': 'Ninguna (sitio de expedición de campo)',
      'map.protectedLabel': 'Área protegida:',
      'map.protectedYes': 'Sí (requiere permisos)',
      'map.protectedNo': 'No',
      'map.accessNoteLabel': 'Nota de acceso:',
      'map.accessNoteNone': 'Ninguna reportada.',
      'map.notSimTitle': 'Lo que este sitio NO simula',
      'map.notSimSub': 'Condiciones que difieren de la Luna y Marte:',
      'map.sourcesTitle': 'Fuentes ({n})',
      'map.viewPub': 'Ver publicación',
      'map.noSourcesSite': 'No hay fuentes bibliográficas registradas para este sitio.',
      'map.openInFinder': 'Abrir en el buscador →',

      'meta.finderTitle': 'Buscador - Speculum',
      'meta.finderDesc': 'Clasifica sitios análogos terrestres para objetivos de la Luna y Marte usando datos climáticos de NASA POWER y pesos de misión.',
      'finder.kicker': 'Calculadora de clasificación de sitios',
      'finder.title': 'Buscador de análogos',
      'finder.desc': 'Elige qué estás probando y el entorno objetivo para clasificar sitios terrestres según percentiles direccionales y pesos de misión.',
      'finder.q1': '1. ¿Qué estás probando?',
      'finder.q2': '2. ¿Qué entorno deseas simular?',
      'finder.q3': '3. Logística y grupo de sitios',
      'finder.onlyStation': 'Solo sitios con estación de apoyo',
      'finder.excludeProtected': 'Excluir áreas protegidas',
      'finder.excludeAccess': 'Excluir sitios con problemas de acceso',
      'finder.includeClimateOnly': 'Incluir sitios solo climáticos',
      'finder.advanced': 'Avanzado',
      'finder.activeParamsCount': '{n} parámetros activos (0–5)',
      'finder.lowerCloser': 'Un valor menor es más cercano',
      'finder.higherCloser': 'Un valor mayor es más cercano',
      'finder.skipZero': '0 (omitir)',
      'finder.resetWeights': 'Restablecer pesos del perfil',
      'finder.disclaimer': 'La puntuación clasifica los sitios candidatos entre sí dentro del grupo seleccionado y no representa una similitud absoluta con el objetivo.',
      'finder.resultsHeadline': 'Sitios clasificados',
      'finder.calculating': 'Calculando...',
      'finder.downloadCsv': 'Descargar CSV',
      'finder.tierALabel': 'Análogo documentado de este objetivo',
      'finder.tierADesc': 'Estudios publicados de análogos citan este sitio para este objetivo.',
      'finder.tierBLabel': 'Clima similar, sin análogo documentado',
      'finder.tierBDesc': 'Clima similar, sin ningún estudio publicado que vincule este sitio con este objetivo.',
      'finder.zeroWeightsMeta': '<strong>0 parámetros ponderados activos</strong> para <em>{target}</em> &bull; <em>{profile}</em>.',
      'finder.zeroWeightsTitle': 'Todos los pesos de los parámetros están en 0.',
      'finder.zeroWeightsDesc': 'La clasificación requiere al menos un parámetro activo con un peso superior a 0. Aumenta algún control en la sección Avanzado o restablece los pesos predeterminados del perfil.',
      'finder.showingTop': 'Mostrando los <strong>10</strong> mejores de <strong>{n}</strong> sitios coincidentes',
      'finder.showingCountSingular': 'Mostrando <strong>{n}</strong> sitio coincidente',
      'finder.showingCountPlural': 'Mostrando <strong>{n}</strong> sitios coincidentes',
      'finder.scoredMeta': '{showing} (puntuados en un grupo de <strong>{pool}</strong> sitios) para <em>{target}</em> &bull; <em>{profile}</em>.',
      'finder.splitScoredMeta': 'Mostrando <strong>{docShown}</strong> análogos documentados y <strong>{discShown}</strong> candidatos de descubrimiento (puntuados en un grupo de <strong>{pool}</strong> sitios) para <em>{target}</em> &bull; <em>{profile}</em>.',
      'finder.sectionDocTitle': 'Análogos documentados',
      'finder.sectionDocMeta': 'Los 5 mejores de Nivel A ({total} coincidentes)',
      'finder.sectionDocEmpty': 'Ningún análogo documentado de Nivel A coincide con este objetivo y los filtros activos.',
      'finder.sectionDiscoveryKicker': 'Candidatos de descubrimiento del barrido global',
      'finder.sectionDiscoveryTitle': 'Hipótesis por validar, no recomendaciones',
      'finder.sectionDiscoveryMeta': 'Los 5 mejores sitios del barrido global ({total} coincidentes, puntuados entre los {pool} sitios)',
      'finder.sectionDiscoveryEmpty': 'Ningún candidato de descubrimiento del barrido global cumple los filtros logísticos activos.',
      'finder.emptyTitle': 'Ningún sitio candidato cumple con estos filtros logísticos.',
      'finder.emptyDesc': 'Los {pool} sitios del grupo seleccionado quedaron excluidos por las restricciones logísticas activas. Prueba limpiar uno o más filtros o activar “Incluir sitios solo climáticos”.',
      'finder.clearFilters': 'Limpiar filtros logísticos',
      'finder.coverageLabel': 'Cobertura:',
      'finder.showOnMap': 'Ver en el mapa',
      'finder.flagStationYes': 'Estación de apoyo disponible',
      'finder.flagStationNo': 'Sin estación de apoyo',
      'finder.flagProtected': 'Área protegida',
      'finder.flagAccessNote': 'Nota de acceso',
      'finder.flagClimateOnly': 'Candidato solo climático',
      'finder.flagDiscovery': 'Candidato de descubrimiento (barrido global)',
      'finder.dirLowerArrow': '↓ menor es más cercano',
      'finder.dirHigherArrow': '↑ mayor es más cercano',
      'finder.breakdownSummary': 'Desglose de parámetros ({n} factores activos)',
      'finder.colParam': 'Parámetro',
      'finder.colSiteVal': 'Valor del sitio',
      'finder.colSimilarity': 'Similitud',
      'finder.colWeight': 'Peso',
      'finder.colConfidence': 'Confianza',
      'finder.noBreakdown': 'No hay parámetros ponderados del objetivo con mediciones disponibles en este sitio (todos los pesos activos podrían estar en 0).',
      'finder.breaksDownTitle': 'Dónde falla la analogía ({body})',
      'finder.refPrefix': 'Ref.:',
      'finder.sitePrefix': 'Sitio:',
      'finder.sourcesLabel': 'Fuentes:',
      'finder.noneCited': 'Ninguna citada',
      'finder.approxCoord': 'Coord. aprox.:',
      'finder.warningsAria': 'Advertencias del sitio',
      'finder.confLevelsTitle': 'Niveles de confianza',
      'finder.confPopoverHigh': '<strong>Alta (1.0×):</strong> medición directa en terreno o estudio de campo.',
      'finder.confPopoverMed': '<strong>Media (0.8×):</strong> climatología NASA POWER acorde con el entorno del sitio.',
      'finder.confPopoverLow': '<strong>Baja (0.5×):</strong> cuadrícula global gruesa en montañas, islas, hielo polar o elevación discordante.',

      'conf.highLabel': 'Confianza alta',
      'conf.highTitle': 'Medición directa en terreno o estudio de campo publicado (multiplicador 1.0x)',
      'conf.medLabel': 'Confianza media',
      'conf.medTitle': 'Climatología validada de NASA POWER (multiplicador 0.8x)',
      'conf.lowLabel': 'Confianza baja',
      'conf.lowTitle': 'Reanálisis satelital o celda de cuadrícula gruesa (multiplicador 0.5x)',
      'tier.aTitle': 'La literatura revisada por pares documenta explícitamente este sitio como análogo de este entorno objetivo.',
      'tier.bTitle': 'Coincidencia física y climatológica; aún no catalogado formalmente en literatura publicada para este objetivo.',
      'warn.coverage': 'La cobertura es inferior al 70% ({coverage}%): faltan datos en este sitio para algunos parámetros ponderados del objetivo.',
      'warn.lowConfMsg': 'Los valores climáticos de este sitio provienen de una cuadrícula global gruesa; toma la puntuación como una guía y verifica datos locales antes de planificar una prueba.',
      'warn.lowConfTooltip': 'Confianza alta (1.0x): medición directa en terreno o estudio de campo publicado. Confianza media (0.8x): climatología NASA POWER de 25 años acorde con el entorno del sitio. Confianza baja (0.5x): celda de cuadrícula global gruesa en montañas, islas, hielo polar o donde la elevación de la cuadrícula difiere notablemente del sitio.',
      'warn.protectedWithNote': 'Área protegida (requiere permisos). Nota de acceso: {note}',
      'warn.protectedOnly': 'Área protegida: pueden requerirse permisos de investigación antes de las pruebas de campo.',
      'warn.accessOnly': 'Nota de acceso: {note}',

      'csv.rank': 'Puesto',
      'csv.siteId': 'ID del sitio',
      'csv.siteName': 'Nombre del sitio',
      'csv.country': 'País',
      'csv.region': 'Región',
      'csv.tier': 'Nivel',
      'csv.tierLabel': 'Etiqueta de nivel',
      'csv.score': 'Puntuación',
      'csv.coverage': 'Cobertura (%)',
      'csv.evidence': 'Nivel de evidencia',
      'csv.station': 'Estación de apoyo',
      'csv.protected': 'Área protegida',
      'csv.accessNote': 'Nota de acceso',
      'csv.warnings': 'Advertencias',
      'csv.target': 'Objetivo',
      'csv.profile': 'Perfil',
      'csv.section': 'Sección del resultado',
      'csv.yes': 'Sí',
      'csv.no': 'No',

      'meta.methodsTitle': 'Métodos y límites - Speculum',
      'meta.methodsDesc': 'Método de puntuación con ejemplo práctico, lista de parámetros, reglas de confianza, limitaciones conocidas y fuentes de Speculum.',
      'methods.kicker': 'Métodos y límites',
      'methods.title': 'Método de puntuación y límites',
      'methods.desc': 'Cómo compara Speculum los sitios análogos sin inventar mediciones faltantes, cómo afecta la confianza a los pesos y dónde los análogos terrestres quedan por debajo de la Luna y Marte.',
      'methods.docCountLabel': 'Sitios documentados',
      'methods.scanCountLabel': 'Candidatos del barrido',
      'methods.s1Title': '1. Método de puntuación',
      'methods.s1Intro': 'Ningún lugar de la Tierra iguala el clima absoluto de la Luna o Marte: la Tierra es más cálida, más húmeda y está envuelta en una atmósfera densa. Medir la distancia bruta respecto a cifras marcianas o lunares haría que casi todos los sitios terrestres parecieran igualmente lejanos. En su lugar, Speculum clasifica los sitios terrestres <strong>entre sí</strong> en la dirección que se acerca al objetivo elegido.',
      'methods.stepHeading': 'Cálculo paso a paso',
      'methods.step1': '<strong>Elegir el grupo de comparación:</strong> Por defecto, el grupo son los <span id="method-doc-count">{docCount}</span> sitios documentados. Si marcas <em>Incluir sitios solo climáticos</em> en la calculadora, el catálogo completo (<span id="method-all-count">{allCount}</span> sitios en total, incluidos los <span id="method-scan-count">{scanCount}</span> candidatos del barrido global) entra al grupo. Los rangos percentiles siempre se calculan sobre este grupo <em>antes</em> de que los filtros logísticos oculten sitios.',
      'methods.step2': '<strong>Clasificar cada parámetro activo en la dirección del objetivo:</strong> Para cada parámetro usado por el objetivo que tenga datos del sitio, toma todos los valores numéricos típicos del grupo (cantidad = <code>n</code>) y calcula el rango percentil de cada sitio entre 0 y 1:<div class="formula-box">rank = (cantidad de valores menores + (cantidad de valores iguales - 1) / 2) / (n - 1)</div>Si el objetivo favorece un valor <strong>mayor</strong> (como amplitud térmica diaria o radiación UV), la similitud es <code>sim = rank</code>. Si el objetivo favorece un valor <strong>menor</strong> (como temperatura, presión o precipitación), la similitud es <code>sim = 1 - rank</code>.',
      'methods.step3': '<strong>Multiplicar por peso de misión y confianza:</strong> Cada parámetro recibe un peso <code>w</code> de 0 a 5 (precargado del perfil elegido, o 1 si el perfil no incluye ese parámetro). Se omiten los parámetros con peso 0 o sin datos. Cada medición también tiene un multiplicador de confianza <code>m</code> (<span id="mult-high">{high}</span> para alta, <span id="mult-med">{med}</span> para media, <span id="mult-low">{low}</span> para baja).',
      'methods.step4': '<strong>Calcular puntuación y cobertura:</strong><div class="formula-box">Score = 100 * sum(w * m * sim) / sum(w * m)   (sobre parámetros que tiene el sitio)<br />Coverage = 100 * sum(w de parámetros que tiene el sitio) / sum(w de todos los parámetros del objetivo)</div>Una puntuación baja no significa que un sitio sea inútil; un porcentaje de cobertura bajo advierte que faltan mediciones clave en ese sitio.',
      'methods.step5': '<strong>Filtrar y ordenar en dos niveles (o dividir resultados de descubrimiento):</strong> Los filtros logísticos (estación de apoyo, área protegida, problemas de acceso) ocultan sitios no elegibles después de puntuar. Por defecto, los sitios se agrupan primero en <strong>Nivel A</strong> (<em>Análogo documentado de este objetivo</em>) y luego en <strong>Nivel B</strong> (<em>Clima similar, sin análogo documentado</em>). Cuando <em>Incluir sitios solo climáticos</em> está activo, los resultados se dividen en <em>Análogos documentados</em> (top 5 de Nivel A) y <em>Candidatos de descubrimiento del barrido global</em> (top 5 del barrido global, sin importar el nivel).',
      'methods.workedTitle': 'Ejemplo práctico: Mars Desert Research Station (MDRS) para Marte · regiones ecuatoriales y Róver con ruedas',
      'methods.workedColParam': 'Parámetro y dirección',
      'methods.workedColVal': 'Valor en MDRS',
      'methods.workedColPool': 'Grupo (n)',
      'methods.workedColSmaller': 'Menores / iguales',
      'methods.workedColSim': 'Similitud (sim)',
      'methods.workedColWeight': 'Peso (w)',
      'methods.workedColConf': 'Confianza (m)',
      'methods.workedColWm': 'w × m',
      'methods.workedColWmsim': 'w × m × sim',
      'methods.dirHigher': 'mayor',
      'methods.dirLower': 'menor',
      'methods.confHighShort': 'Alta',
      'methods.confMedShort': 'Media',
      'methods.confLowShort': 'Baja',
      'methods.workedIntro': 'Usando el grupo predeterminado solo documentado ({pool} sitios), así se puntúa MDRS (Utah, EE. UU.) para <strong>{target}</strong> con el perfil <strong>{profile}</strong>.{missingNote}',
      'methods.workedMissingNone': ' Todos los {count} parámetros del objetivo tienen datos en MDRS, con pesos que suman <code>{weights} = {total}</code>.',
      'methods.workedMissingSingle': ' Observa que <em>{names}</em> aún no tiene datos en el sitio, por lo que se omite del numerador y denominador de la puntuación, aunque sigue contando para el peso total del objetivo.',
      'methods.workedMissingPlural': ' Observa que <em>{names}</em> aún no tienen datos en el sitio, por lo que se omiten del numerador y denominador de la puntuación, aunque siguen contando para el peso total del objetivo.',
      'methods.workedTotals': '<strong>Totales:</strong> <code>sum(w * m * sim) = {sumWmSim}</code>, <code>sum(w * m) = {sumWm}</code> &rarr; <strong>Puntuación = 100 &times; {sumWmSim} / {sumWm} = {score}%</strong>.<br /><strong>Cobertura:</strong> MDRS tiene datos para pesos que suman <code>{siteWeight}</code> sobre un peso total del objetivo de <code>{totalWeight}</code> &rarr; <strong>Cobertura = round(100 &times; {siteWeight} / {totalWeight}) = {coverage}%</strong>. Como MDRS incluye <code>mars_equatorial</code> en sus objetivos documentados, se ubica en el <strong>Nivel A</strong>.',
      'methods.s2Title': '2. Reglas de confianza',
      'methods.s2Intro': 'Cada parámetro de un sitio lleva una calificación de confianza para que las estimaciones en cuadrícula gruesa no pesen más que las mediciones directas en terreno. El multiplicador reduce cuánto influye una fila de baja certeza en el promedio ponderado. Si más de la mitad de las filas puntuadas en un sitio tienen confianza baja, Speculum muestra una advertencia en la tarjeta de resultados.',
      'methods.multSuffix': 'multiplicador {val}×',
      'methods.confCardHighDesc': 'Medición directa en terreno, registro de estación local o estudio de campo publicado para esa ubicación exacta.',
      'methods.confCardMedDesc': 'Climatología de NASA POWER de 25 años (2001–2025) donde la elevación de la celda y el entorno costero coinciden razonablemente con el sitio.',
      'methods.confCardLowDesc': 'Celda de cuadrícula gruesa en montañas escarpadas, islas, capas de hielo polares o sitios donde la elevación de la cuadrícula difiere notablemente de la real.',
      'methods.s3Title': '3. Parámetros',
      'methods.paramsSummary': '{total} parámetros definidos ({withData} con datos de sitios, {missing} faltantes).',
      'methods.pColParam': 'Parámetro',
      'methods.pColUnit': 'Unidad',
      'methods.pColGroup': 'Grupo',
      'methods.pColHasData': 'Tiene datos',
      'methods.pColNotes': 'Notas y limitaciones',
      'methods.limitPrefix': 'Límite:',
      'methods.yes': 'Sí',
      'methods.no': 'No',
      'methods.s4Title': '4. Limitaciones conocidas y próximos pasos',
      'methods.s4Intro': 'Toda campaña de análogos terrestres debe tener en cuenta tanto la física universal de los vuelos espaciales como los vacíos actuales del conjunto de datos:',
      'methods.covTitle': 'Dimensiones del desafío y qué cubre Speculum',
      'methods.covColDimension': 'Dimensión',
      'methods.covColStatus': 'Estado',
      'methods.covColCoverage': 'Qué cubre Speculum',
      'methods.statusCovered': 'Cubierto',
      'methods.statusPartial': 'Parcial',
      'methods.statusLitOnly': 'Solo literatura',
      'methods.statusLitSites': 'Literatura y sitios',
      'methods.statusNotCovered': 'Aún sin cubrir',
      'methods.dimGeology': 'Geología y materiales superficiales',
      'methods.covGeology': 'Tipo de entorno y etiquetas de literatura',
      'methods.dimTerrain': 'Terreno y pendiente',
      'methods.covTerrain': 'Sin mediciones de sitio por ahora',
      'methods.dimTemp': 'Temperatura y extremos',
      'methods.covTemp': 'Temperatura media anual, amplitud diaria, mínimas y máximas extremas',
      'methods.dimWater': 'Agua y hielo',
      'methods.covWater': 'Precipitación y vapor de agua, sin datos de hielo',
      'methods.dimDust': 'Polvo y viento',
      'methods.covDust': 'Solo velocidad media del viento',
      'methods.dimBio': 'Biología',
      'methods.covBio': 'Solo etiquetas de literatura',
      'methods.dimCaves': 'Cuevas',
      'methods.covCaves': 'Etiquetas de literatura y sitios de tubos de lava',
      'methods.dimOps': 'Operaciones',
      'methods.covOps': 'Indicadores de estación de apoyo, área protegida y acceso',
      'methods.gapsTitle': 'Vacíos del conjunto de datos y próximos pasos',
      'methods.gap1': '<strong>Faltan datos de pendiente, resistencia del suelo, radiación y logística:</strong> Parámetros como pendiente típica del terreno, capacidad portante del suelo (transitabilidad), rocosidad superficial, tipo de regolito, dosis de radiación ambiental, tormentas de viento/polvo, hielo/permafrost, accesibilidad, infraestructura, permisos, conectividad y costo relativo están modelados en el esquema (<code>in_data: false</code>), pero aún no tienen valores por sitio.',
      'methods.gap2': '<strong>Las coordenadas son aproximadas:</strong> Los puntos de latitud y longitud representan centros regionales o coordenadas representativas de desiertos/cráteres, no pistas topografiadas de prueba de róveres ni plataformas de hábitats.',
      'methods.gap3': '<strong>Los datos de cuadrícula son débiles en montañas e islas:</strong> NASA POWER utiliza celdas de reanálisis gruesas (aprox. 0.5° × 0.625°), que mezclan mar y tierra en islas volcánicas pequeñas (como Tenerife, Lanzarote, Hawái o Jeju) y promedian la elevación entre valles y cumbres en cordilleras (como Chajnantor o Mauna Kea).',
      'methods.gap4': '<strong>Próximos pasos:</strong> Integrar mediciones revisadas por pares de pendiente, regolito y estaciones meteorológicas en tierra; verificar los campos de permisos y conectividad a nivel de sitio; y añadir citas de literatura primaria para los sitios candidatos solo climáticos.',
      'methods.s5Title': '5. Fuentes',
      'methods.sourcesSummary': '{count} fuentes de datos, artículos e informes de misión citados en Speculum.',
      'methods.sourcesCredit': 'Las climatologías de los sitios proceden de <strong>NASA POWER</strong> (2001–2025), los valores planetarios de referencia provienen de las <strong>Hojas de Datos de la Luna y Marte del NASA NSSDC</strong> (S055, S056), y la evidencia de campo procede de literatura publicada e informes de misión.',
      'methods.openAccess': 'Acceso abierto',
      'methods.openSource': 'Abrir fuente',
      'methods.citationOnly': 'Registro bibliográfico (sin URL externa)',
      'methods.yearPrefix': 'Año:'
    },

    'pt-BR': {
      'skip.link': 'Pular para o conteúdo principal',
      'brand.homeAria': 'Página inicial do Speculum',
      'nav.aria': 'Navegação principal',
      'nav.menu': 'Menu',
      'nav.toggleAria': 'Alternar menu de navegação',
      'nav.overview': 'Início',
      'nav.map': 'Mapa',
      'nav.finder': 'Buscador',
      'nav.methods': 'Métodos',
      'lang.buttonTitle': 'Selecionar idioma',
      'lang.buttonAria': 'Idioma: Português (Brasil). Selecionar idioma',
      'lang.menuAria': 'Selecionar idioma',
      'footer.desc': 'Locais análogos terrestres e calculadora de similaridade para bases lunares e exploração de Marte.',
      'footer.credits': 'Dados obtidos do Projeto Prediction of Worldwide Energy Resource (POWER) do Centro de Pesquisa Langley (LaRC) da Administração Nacional da Aeronáutica e Espaço (NASA), financiado pelo Programa de Ciências da Terra/Ciência Aplicada da NASA. Dados planetários de referência das Fichas Técnicas da Lua e de Marte do NASA NSSDC.',
      'footer.creditsYears': 'Dados obtidos do Projeto Prediction of Worldwide Energy Resource (POWER) do Centro de Pesquisa Langley (LaRC) da Administração Nacional da Aeronáutica e Espaço (NASA), financiado pelo Programa de Ciências da Terra/Ciência Aplicada da NASA. Dados planetários de referência das Fichas Técnicas da Lua e de Marte do NASA NSSDC.',
      'footer.pagesTitle': 'Páginas',
      'footer.methodsTitle': 'Métodos',
      'footer.scoring': 'Método de pontuação',
      'footer.confidence': 'Regras de confiança',
      'footer.parameters': 'Parâmetros',
      'footer.limitations': 'Limitações conhecidas',
      'footer.sources': 'Fontes',
      'footer.madeFor': 'Feito para o NASA Space Apps Challenge 2026',
      'footer.nasaPower': 'Dados da NASA POWER',

      'meta.indexTitle': 'Speculum - Análogos terrestres da Lua e de Marte',
      'meta.indexDesc': 'Identifique locais na Terra análogos a bases lunares permanentes e a Marte, para que equipes testem rovers e outros equipamentos antes do voo.',
      'index.kicker': 'Catálogo de análogos da Lua e de Marte',
      'index.heroTitle': 'Speculum',
      'index.heroDesc': 'Identifique locais na Terra que são análogos a bases lunares permanentes e a Marte, para que equipes possam testar rovers e outros equipamentos antes do lançamento.',
      'index.ctaPrimary': 'Descreva seu projeto →',
      'index.ctaSecondary': 'Explorar o mapa',
      'index.statsAria': 'Números ao vivo do catálogo',
      'index.statSites': 'Locais no catálogo',
      'index.statDocumented': 'Locais documentados',
      'index.statScanCandidates': 'Candidatos da varredura',
      'index.statParams': 'Parâmetros com dados',
      'index.statSources': 'Fontes citadas',
      'globalScan.title': 'Varredura global',
      'globalScan.body': 'Analisamos <span class="scan-count-inline">{count}</span> regiões do mundo com o mesmo método climático para buscar candidatos fora do catálogo conhecido. São hipóteses baseadas apenas no clima.',
      'index.challengeTitle': 'O desafio',
      'index.challengeBody': 'Antes de lançar rovers, perfuratrizes, habitats ou equipamentos de energia para bases lunares permanentes ou Marte, as equipes de engenharia precisam de campos de teste terrestres que submetam os equipamentos a temperaturas, aridez e terrenos realistas. Encontrar o campo de provas ideal é difícil porque os estudos publicados estão espalhados por décadas de artigos e nenhum local na Terra reproduz todas as condições físicas de outro mundo.',
      'index.howTitle': 'Como funciona',
      'index.step1Num': 'Passo 01',
      'index.step1Title': 'Explore o mapa',
      'index.step1Desc': 'Navegue por análogos de campo documentados e candidatos apenas climáticos no mundo todo, inspecione climatologias da NASA POWER, revise percentis extremos e verifique restrições de acesso ou licenças.',
      'index.step1Link': 'Abrir mapa →',
      'index.step2Num': 'Passo 02',
      'index.step2Title': 'Descreva seu projeto',
      'index.step2Desc': 'Escolha qual equipamento ou área está testando, selecione o ambiente-alvo lunar ou marciano a simular, defina filtros logísticos e ajuste opcionalmente os pesos dos parâmetros.',
      'index.step2Link': 'Abrir buscador →',
      'index.step3Num': 'Passo 03',
      'index.step3Title': 'Obtenha uma lista ranqueada',
      'index.step3Desc': 'Analise os 10 melhores locais separados por evidência publicada de análogo (Nível A) versus similaridade climatológica (Nível B), veja o detalhamento por parâmetro e alertas, ou exporte um CSV.',
      'index.step3Link': 'Ranquear locais →',
      'index.whatTitle': 'O que esta ferramenta pode e não pode dizer',
      'index.whatCanTitle': 'O que ela informa',
      'index.whatCan1': 'Quais locais terrestres ficam mais próximos entre si nas direções climáticas relevantes para um alvo da Lua ou de Marte.',
      'index.whatCan2': 'Linhas de base climáticas vindas de grades da NASA POWER de 25 anos (2001–2025) e literatura publicada, cada uma marcada com níveis explícitos de confiança <strong>alta</strong>, <strong>média</strong> ou <strong>baixa</strong>.',
      'index.whatCan3': 'Se um local possui literatura publicada de análogo para o seu alvo, alertas de cobertura por dados ausentes ou restrições logísticas e de licenças.',
      'index.whatCannotTitle': 'O que ela não pode informar',
      'index.whatCannot1': '<strong>Análogos nunca reproduzem gravidade, radiação ionizante ou vácuo espacial:</strong> testes na Terra sempre ocorrem a 1 g sob uma atmosfera densa e protetora.',
      'index.whatCannot2': '<strong>As pontuações são relativas, não absolutas:</strong> uma pontuação alta posiciona um local favoravelmente em relação aos demais do conjunto, mas não significa que ele corresponda fisicamente às condições lunares ou marcianas.',
      'index.whatCannot3': 'Métricas de campo ausentes, como inclinação, capacidade de suporte do solo e logística verificada localmente, ainda exigem levantamentos no local antes da operação.',
      'index.dataTitle': 'Dados e métodos',
      'index.dataBody': 'Cada número no Speculum vem das climatologias de 25 anos da NASA POWER (2001–2025), das Fichas Técnicas da Lua e de Marte do NASA NSSDC e de estudos publicados sobre análogos. Veja como funciona a pontuação com um exemplo prático, explore todos os <span id="data-params-count">{count}</span> parâmetros, confira as regras de confiança e acesse a lista completa de fontes.',
      'index.dataCta': 'Métodos e fontes →',
      'index.teamTitle': 'Equipe',
      'index.teamDesc': 'Somos estudantes do ensino médio de Recife, Brasil, buscando expandir nosso conhecimento integrando colaboração, tecnologia e ciência espacial. Nosso objetivo é usar dados abertos e desenvolvimento de software para criar soluções de impacto para desafios na Terra e fora dela.',
      'index.teamMembersLabel': 'Membros:',

      'meta.mapTitle': 'Mapa - Speculum',
      'meta.mapDesc': 'Mapa de locais de teste análogos terrestres para exploração da Lua e Marte com dados climáticos da NASA POWER e limites de cada local.',
      'map.kicker': 'Mapa global',
      'map.title': 'Mapa de locais análogos',
      'map.desc': 'Mapa global de campos de teste para a Lua e Marte com dados climáticos da NASA POWER e limites de cada local.',
      'map.filterTarget': 'Alvo:',
      'map.allTargets': 'Todos os alvos ({n})',
      'map.filterBody': 'Corpo:',
      'map.allBodies': 'Todos os corpos',
      'map.showClimateOnly': 'Mostrar locais apenas climáticos',
      'map.showingSites': 'Mostrando {visible} de {total} locais',
      'map.offlineBanner': 'Blocos do mapa indisponíveis offline — marcadores e dados detalhados continuam interativos.',
      'map.leafletUnavailable': 'Biblioteca de mapa interativo indisponível. Use a tabela abaixo para inspecionar cada local análogo.',
      'map.emptyTitle': 'Nenhum local análogo corresponde a esses filtros.',
      'map.emptyDesc': 'Nenhum local do conjunto de dados corresponde aos filtros selecionados de alvo, corpo celeste e evidência.',
      'map.emptyTableHint': 'Tente limpar o filtro de alvo ou corpo, ou ative “Mostrar locais apenas climáticos”.',
      'map.resetFilters': 'Redefinir filtros do mapa',
      'map.legendDoc': 'Análogos documentados ({n})',
      'map.legendClimate': 'Apenas dados climáticos ({n})',
      'map.legendDiscovery': 'Candidatos da varredura global ({n})',
      'map.selectSiteTitle': 'Selecione um local',
      'map.selectSiteDesc': 'Clique em qualquer marcador azul (documentado) ou cinza (apenas clima) no mapa para ver parâmetros, alvos simulados, pontos fortes e fracos e limites.',
      'map.tableTitle': 'Coordenadas e altitude dos locais',
      'map.colSite': 'Local',
      'map.colEvidence': 'Evidência',
      'map.colLocation': 'Localização',
      'map.colLat': 'Latitude',
      'map.colLon': 'Longitude',
      'map.colElev': 'Altitude',
      'map.colAction': 'Ação',
      'map.badgeDoc': 'Documentado',
      'map.badgeClimate': 'Apenas clima',
      'map.badgeDiscovery': 'Candidato da varredura',
      'map.btnInspect': 'Inspecionar',
      'map.tooltipDoc': 'Análogo documentado',
      'map.tooltipClimate': 'Apenas dados climáticos',
      'map.tooltipDiscovery': 'Candidato de descoberta (apenas clima)',
      'map.panelClimateBadge': 'Apenas dados climáticos: ainda sem fonte bibliográfica',
      'map.panelDiscoveryBadge': 'Candidato de descoberta da varredura global: apenas dados climáticos, ainda sem literatura',
      'map.panelCloseAria': 'Fechar painel de detalhes',
      'map.coordNotice': 'Todas as coordenadas são aproximadas (centro regional / célula da grade).',
      'map.docAnalogFor': 'Análogo documentado para',
      'map.noneRecorded': 'Nenhum registrado',
      'map.explorationTitle': 'Como este local ajuda a exploração',
      'map.explorationEmpty': 'Nenhuma campanha de exploração documentada registrada ainda (candidato apenas climático).',
      'map.breaksDownTitle': 'Onde a analogia falha',
      'map.breaksDownReference': 'Referência',
      'map.breaksDownSite': 'Local',
      'map.breaksDownGap': 'Diferença',
      'map.breaksDownNoMatch': 'Nenhum dos parâmetros de referência para este corpo está registrado neste local.',
      'map.breaksDownNoTargetBody': 'Nenhum alvo lunar ou marciano atribuído ainda (candidato apenas climático).',
      'map.strengthsTitle': 'Pontos fortes e fracos',
      'map.strengthsSub': 'Os <span class="mono">3</span> traços mais extremos em relação a todos os <span class="mono">{n}</span> locais:',
      'map.noNumericDist': 'Sem distribuições numéricas disponíveis.',
      'map.siteParamsTitle': 'Parâmetros do local',
      'map.colParameter': 'Parâmetro',
      'map.colValue': 'Valor',
      'map.colRange': 'Faixa',
      'map.colConfidence': 'Confiança',
      'map.colSource': 'Fonte',
      'map.noMeasurements': 'Nenhuma medição registrada.',
      'map.flagsTitle': 'Indicadores e acesso',
      'map.stationLabel': 'Estação de apoio:',
      'map.stationYes': 'Estação análoga permanente',
      'map.stationNo': 'Nenhuma (local de expedição em campo)',
      'map.protectedLabel': 'Área protegida:',
      'map.protectedYes': 'Sim (requer licenças)',
      'map.protectedNo': 'Não',
      'map.accessNoteLabel': 'Nota de acesso:',
      'map.accessNoteNone': 'Nenhuma relatada.',
      'map.notSimTitle': 'O que este local NÃO simula',
      'map.notSimSub': 'Condições que diferem da Lua e de Marte:',
      'map.sourcesTitle': 'Fontes ({n})',
      'map.viewPub': 'Ver publicação',
      'map.noSourcesSite': 'Nenhuma fonte bibliográfica registrada para este local.',
      'map.openInFinder': 'Abrir no buscador →',

      'meta.finderTitle': 'Buscador - Speculum',
      'meta.finderDesc': 'Ranqueie locais análogos terrestres para alvos da Lua e Marte usando dados climáticos da NASA POWER e pesos de missão.',
      'finder.kicker': 'Calculadora de classificação de locais',
      'finder.title': 'Buscador de análogos',
      'finder.desc': 'Escolha o que você está testando e o ambiente-alvo para ranquear locais terrestres por percentis direcionais e pesos de missão.',
      'finder.q1': '1. O que você está testando?',
      'finder.q2': '2. Qual ambiente deseja simular?',
      'finder.q3': '3. Logística e conjunto de locais',
      'finder.onlyStation': 'Apenas locais com estação de apoio',
      'finder.excludeProtected': 'Excluir áreas protegidas',
      'finder.excludeAccess': 'Excluir locais com problemas de acesso',
      'finder.includeClimateOnly': 'Incluir locais apenas climáticos',
      'finder.advanced': 'Avançado',
      'finder.activeParamsCount': '{n} parâmetros ativos (0–5)',
      'finder.lowerCloser': 'Valor menor é mais próximo',
      'finder.higherCloser': 'Valor maior é mais próximo',
      'finder.skipZero': '0 (ignorar)',
      'finder.resetWeights': 'Redefinir para pesos do perfil',
      'finder.disclaimer': 'A pontuação ranqueia os locais candidatos entre si dentro do conjunto selecionado e não representa uma similaridade absoluta com o alvo.',
      'finder.resultsHeadline': 'Locais ranqueados',
      'finder.calculating': 'Calculando...',
      'finder.downloadCsv': 'Baixar CSV',
      'finder.tierALabel': 'Análogo documentado deste alvo',
      'finder.tierADesc': 'Estudos publicados de análogos citam este local para este alvo.',
      'finder.tierBLabel': 'Clima semelhante, sem análogo documentado',
      'finder.tierBDesc': 'Clima semelhante, sem nenhum estudo publicado ligando este local a este alvo.',
      'finder.zeroWeightsMeta': '<strong>0 parâmetros ponderados ativos</strong> para <em>{target}</em> &bull; <em>{profile}</em>.',
      'finder.zeroWeightsTitle': 'Todos os pesos dos parâmetros estão em 0.',
      'finder.zeroWeightsDesc': 'O ranqueamento exige pelo menos um parâmetro ativo com peso maior que 0. Aumente um controle deslizante na seção Avançado ou redefina para os pesos padrão deste perfil de missão.',
      'finder.showingTop': 'Mostrando os <strong>10</strong> melhores de <strong>{n}</strong> locais correspondentes',
      'finder.showingCountSingular': 'Mostrando <strong>{n}</strong> local correspondente',
      'finder.showingCountPlural': 'Mostrando <strong>{n}</strong> locais correspondentes',
      'finder.scoredMeta': '{showing} (pontuados em um conjunto de <strong>{pool}</strong> locais) para <em>{target}</em> &bull; <em>{profile}</em>.',
      'finder.splitScoredMeta': 'Mostrando <strong>{docShown}</strong> análogos documentados e <strong>{discShown}</strong> candidatos de descoberta (pontuados em um conjunto de <strong>{pool}</strong> locais) para <em>{target}</em> &bull; <em>{profile}</em>.',
      'finder.sectionDocTitle': 'Análogos documentados',
      'finder.sectionDocMeta': 'Top 5 do Nível A ({total} correspondentes)',
      'finder.sectionDocEmpty': 'Nenhum análogo documentado de Nível A corresponde a este alvo e aos filtros ativos.',
      'finder.sectionDiscoveryKicker': 'Candidatos de descoberta da varredura global',
      'finder.sectionDiscoveryTitle': 'Hipóteses a validar, não recomendações',
      'finder.sectionDiscoveryMeta': 'Top 5 locais da varredura global ({total} correspondentes, pontuados entre todos os {pool} locais)',
      'finder.sectionDiscoveryEmpty': 'Nenhum candidato de descoberta da varredura global atende aos filtros logísticos ativos.',
      'finder.emptyTitle': 'Nenhum local candidato atende a esses filtros logísticos.',
      'finder.emptyDesc': 'Todos os {pool} locais do conjunto selecionado foram excluídos pelas restrições logísticas ativas. Tente limpar um ou mais filtros ou ativar “Incluir locais apenas climáticos”.',
      'finder.clearFilters': 'Limpar filtros logísticos',
      'finder.coverageLabel': 'Cobertura:',
      'finder.showOnMap': 'Ver no mapa',
      'finder.flagStationYes': 'Estação de apoio disponível',
      'finder.flagStationNo': 'Sem estação de apoio',
      'finder.flagProtected': 'Área protegida',
      'finder.flagAccessNote': 'Nota de acesso',
      'finder.flagClimateOnly': 'Candidato apenas climático',
      'finder.flagDiscovery': 'Candidato de descoberta (varredura global)',
      'finder.dirLowerArrow': '↓ menor é mais próximo',
      'finder.dirHigherArrow': '↑ maior é mais próximo',
      'finder.breakdownSummary': 'Detalhamento de parâmetros ({n} fatores ativos)',
      'finder.colParam': 'Parâmetro',
      'finder.colSiteVal': 'Valor do local',
      'finder.colSimilarity': 'Similaridade',
      'finder.colWeight': 'Peso',
      'finder.colConfidence': 'Confiança',
      'finder.noBreakdown': 'Nenhum parâmetro ponderado do alvo com medições disponíveis neste local (todos os pesos ativos podem estar em 0).',
      'finder.breaksDownTitle': 'Onde a analogia falha ({body})',
      'finder.refPrefix': 'Ref.:',
      'finder.sitePrefix': 'Local:',
      'finder.sourcesLabel': 'Fontes:',
      'finder.noneCited': 'Nenhuma citada',
      'finder.approxCoord': 'Coord. aprox.:',
      'finder.warningsAria': 'Alertas do local',
      'finder.confLevelsTitle': 'Níveis de confiança',
      'finder.confPopoverHigh': '<strong>Alta (1.0×):</strong> medição direta em solo ou levantamento de campo.',
      'finder.confPopoverMed': '<strong>Média (0.8×):</strong> climatologia NASA POWER compatível com o ambiente do local.',
      'finder.confPopoverLow': '<strong>Baixa (0.5×):</strong> grade global grossa em montanhas, ilhas, gelo polar ou altitude divergente.',

      'conf.highLabel': 'Confiança alta',
      'conf.highTitle': 'Medição direta em solo ou levantamento de campo publicado (multiplicador 1.0x)',
      'conf.medLabel': 'Confiança média',
      'conf.medTitle': 'Climatologia validada da NASA POWER (multiplicador 0.8x)',
      'conf.lowLabel': 'Confiança baixa',
      'conf.lowTitle': 'Reanálise por satélite ou célula de grade grossa (multiplicador 0.5x)',
      'tier.aTitle': 'A literatura revisada por pares documenta explicitamente este local como análogo para este ambiente-alvo.',
      'tier.bTitle': 'Correspondência física e climatológica; ainda não catalogado formalmente na literatura publicada para este alvo.',
      'warn.coverage': 'A cobertura está abaixo de 70% ({coverage}%): alguns parâmetros ponderados do alvo não têm dados neste local.',
      'warn.lowConfMsg': 'Os valores climáticos deste local vêm de uma grade global grossa; trate a pontuação como um guia e verifique dados locais antes de planejar um teste.',
      'warn.lowConfTooltip': 'Confiança alta (1.0x): medição direta em solo ou levantamento de campo publicado. Confiança média (0.8x): climatologia de 25 anos da NASA POWER compatível com o ambiente do local. Confiança baixa (0.5x): célula de grade global grossa em montanhas, ilhas, gelo polar ou onde a altitude da grade difere bastante do local.',
      'warn.protectedWithNote': 'Área protegida (requer licenças). Nota de acesso: {note}',
      'warn.protectedOnly': 'Área protegida: licenças de pesquisa podem ser necessárias antes de testes em campo.',
      'warn.accessOnly': 'Nota de acesso: {note}',

      'csv.rank': 'Posição',
      'csv.siteId': 'ID do local',
      'csv.siteName': 'Nome do local',
      'csv.country': 'País',
      'csv.region': 'Região',
      'csv.tier': 'Nível',
      'csv.tierLabel': 'Rótulo do nível',
      'csv.score': 'Pontuação',
      'csv.coverage': 'Cobertura (%)',
      'csv.evidence': 'Nível de evidência',
      'csv.station': 'Estação de apoio',
      'csv.protected': 'Área protegida',
      'csv.accessNote': 'Nota de acesso',
      'csv.warnings': 'Alertas',
      'csv.target': 'Alvo',
      'csv.profile': 'Perfil',
      'csv.section': 'Seção do resultado',
      'csv.yes': 'Sim',
      'csv.no': 'Não',

      'meta.methodsTitle': 'Métodos e limites - Speculum',
      'meta.methodsDesc': 'Método de pontuação com exemplo prático, lista de parâmetros, regras de confiança, limitações conhecidas e fontes do Speculum.',
      'methods.kicker': 'Métodos e limites',
      'methods.title': 'Método de pontuação e limites',
      'methods.desc': 'Como o Speculum compara locais análogos sem inventar medições ausentes, como a confiança afeta os pesos e onde os análogos terrestres ficam aquém da Lua e de Marte.',
      'methods.docCountLabel': 'Locais documentados',
      'methods.scanCountLabel': 'Candidatos da varredura',
      'methods.s1Title': '1. Método de pontuação',
      'methods.s1Intro': 'Nenhum lugar na Terra corresponde ao clima absoluto da Lua ou de Marte: a Terra é mais quente, mais úmida e envolvida por uma atmosfera densa. Medir a distância bruta até valores marcianos ou lunares faria quase todos os locais terrestres parecerem igualmente distantes. Em vez disso, o Speculum ranqueia os locais da Terra <strong>entre si</strong> na direção que se aproxima do alvo escolhido.',
      'methods.stepHeading': 'Cálculo passo a passo',
      'methods.step1': '<strong>Escolher o conjunto de comparação:</strong> Por padrão, o conjunto reúne os <span id="method-doc-count">{docCount}</span> locais documentados. Se você marcar <em>Incluir locais apenas climáticos</em> na calculadora, o catálogo completo (<span id="method-all-count">{allCount}</span> locais no total, incluindo os <span id="method-scan-count">{scanCount}</span> candidatos da varredura global) entra no conjunto. Os percentis são sempre calculados sobre esse conjunto <em>antes</em> de os filtros logísticos ocultarem locais.',
      'methods.step2': '<strong>Ranquear cada parâmetro ativo na direção do alvo:</strong> Para cada parâmetro usado pelo alvo que tenha dados no local, pegue todos os valores numéricos típicos do conjunto (total = <code>n</code>) e calcule o percentil de cada local entre 0 e 1:<div class="formula-box">rank = (quantidade de valores menores + (quantidade de valores iguais - 1) / 2) / (n - 1)</div>Se o alvo favorece um valor <strong>maior</strong> (como amplitude térmica diária ou radiação UV), a similaridade é <code>sim = rank</code>. Se o alvo favorece um valor <strong>menor</strong> (como temperatura, pressão ou precipitação), a similaridade é <code>sim = 1 - rank</code>.',
      'methods.step3': '<strong>Multiplicar pelo peso da missão e pela confiança:</strong> Cada parâmetro recebe um peso <code>w</code> de 0 a 5 (preenchido pelo perfil escolhido, ou 1 se o perfil não listar esse parâmetro). Parâmetros com peso 0 ou sem dados são ignorados. Cada medição também tem um multiplicador de confiança <code>m</code> (<span id="mult-high">{high}</span> para alta, <span id="mult-med">{med}</span> para média, <span id="mult-low">{low}</span> para baixa).',
      'methods.step4': '<strong>Calcular pontuação e cobertura:</strong><div class="formula-box">Score = 100 * sum(w * m * sim) / sum(w * m)   (sobre os parâmetros que o local possui)<br />Coverage = 100 * sum(w dos parâmetros que o local possui) / sum(w de todos os parâmetros do alvo)</div>Uma pontuação baixa não significa que um local seja inútil; uma porcentagem de cobertura baixa alerta que faltaram medições de parâmetros-chave nesse local.',
      'methods.step5': '<strong>Filtrar e ordenar em dois níveis (ou dividir resultados de descoberta):</strong> Filtros logísticos (estação de apoio, área protegida, problemas de acesso) ocultam locais inelegíveis após a pontuação. Por padrão, os locais são agrupados em <strong>Nível A</strong> (<em>Análogo documentado deste alvo</em>) primeiro e depois em <strong>Nível B</strong> (<em>Clima semelhante, sem análogo documentado</em>). Quando <em>Incluir locais apenas climáticos</em> está marcado, os resultados são divididos em <em>Análogos documentados</em> (top 5 do Nível A) e <em>Candidatos de descoberta da varredura global</em> (top 5 locais da varredura global, independentemente do nível).',
      'methods.workedTitle': 'Exemplo prático: Mars Desert Research Station (MDRS) para Marte · regiões equatoriais e Rover com rodas',
      'methods.workedColParam': 'Parâmetro e direção',
      'methods.workedColVal': 'Valor na MDRS',
      'methods.workedColPool': 'Conjunto (n)',
      'methods.workedColSmaller': 'Menores / iguais',
      'methods.workedColSim': 'Similaridade (sim)',
      'methods.workedColWeight': 'Peso (w)',
      'methods.workedColConf': 'Confiança (m)',
      'methods.workedColWm': 'w × m',
      'methods.workedColWmsim': 'w × m × sim',
      'methods.dirHigher': 'maior',
      'methods.dirLower': 'menor',
      'methods.confHighShort': 'Alta',
      'methods.confMedShort': 'Média',
      'methods.confLowShort': 'Baixa',
      'methods.workedIntro': 'Usando o conjunto padrão apenas documentado ({pool} locais), veja como a MDRS (Utah, EUA) é pontuada para <strong>{target}</strong> com o perfil <strong>{profile}</strong>.{missingNote}',
      'methods.workedMissingNone': ' Todos os {count} parâmetros do alvo têm dados na MDRS, com pesos somando <code>{weights} = {total}</code>.',
      'methods.workedMissingSingle': ' Observe que <em>{names}</em> ainda não tem dados no local, portanto é omitido do numerador e do denominador da pontuação, embora continue contando no peso total do alvo.',
      'methods.workedMissingPlural': ' Observe que <em>{names}</em> ainda não têm dados no local, portanto são omitidos do numerador e do denominador da pontuação, embora continuem contando no peso total do alvo.',
      'methods.workedTotals': '<strong>Totais:</strong> <code>sum(w * m * sim) = {sumWmSim}</code>, <code>sum(w * m) = {sumWm}</code> &rarr; <strong>Pontuação = 100 &times; {sumWmSim} / {sumWm} = {score}%</strong>.<br /><strong>Cobertura:</strong> A MDRS tem dados para pesos somando <code>{siteWeight}</code> de um peso total do alvo de <code>{totalWeight}</code> &rarr; <strong>Cobertura = round(100 &times; {siteWeight} / {totalWeight}) = {coverage}%</strong>. Como a MDRS lista <code>mars_equatorial</code> em seus alvos documentados, ela entra no <strong>Nível A</strong>.',
      'methods.s2Title': '2. Regras de confiança',
      'methods.s2Intro': 'Cada parâmetro do local recebe uma classificação de confiança para que estimativas em grade grossa não superem medições diretas em solo. O multiplicador reduz o quanto uma linha de baixa certeza influencia a média ponderada. Se mais da metade das linhas pontuadas de um local tiver confiança baixa, o Speculum exibe um alerta no cartão de resultados.',
      'methods.multSuffix': 'multiplicador {val}×',
      'methods.confCardHighDesc': 'Medição direta em solo, registro de estação local ou levantamento de campo publicado para aquela localização exata.',
      'methods.confCardMedDesc': 'Climatologia de 25 anos da NASA POWER (2001–2025) onde a altitude da célula e o ambiente costeiro correspondem razoavelmente ao local.',
      'methods.confCardLowDesc': 'Célula de grade grossa em montanhas íngremes, ilhas, mantos de gelo polares ou locais onde a altitude da grade difere bastante da real.',
      'methods.s3Title': '3. Parâmetros',
      'methods.paramsSummary': '{total} parâmetros definidos ({withData} com dados de locais, {missing} ausentes).',
      'methods.pColParam': 'Parâmetro',
      'methods.pColUnit': 'Unidade',
      'methods.pColGroup': 'Grupo',
      'methods.pColHasData': 'Tem dados',
      'methods.pColNotes': 'Notas e limitações',
      'methods.limitPrefix': 'Limite:',
      'methods.yes': 'Sim',
      'methods.no': 'Não',
      'methods.s4Title': '4. Limitações conhecidas e próximos passos',
      'methods.s4Intro': 'Toda campanha terrestre de análogos deve considerar tanto a física universal do voo espacial quanto as lacunas atuais do conjunto de dados:',
      'methods.covTitle': 'Dimensões no desafio e o que o Speculum cobre',
      'methods.covColDimension': 'Dimensão',
      'methods.covColStatus': 'Status',
      'methods.covColCoverage': 'O que o Speculum cobre',
      'methods.statusCovered': 'Coberto',
      'methods.statusPartial': 'Parcial',
      'methods.statusLitOnly': 'Apenas literatura',
      'methods.statusLitSites': 'Literatura e locais',
      'methods.statusNotCovered': 'Ainda não coberto',
      'methods.dimGeology': 'Geologia e materiais de superfície',
      'methods.covGeology': 'Tipo de ambiente e marcadores da literatura',
      'methods.dimTerrain': 'Terreno e inclinação',
      'methods.covTerrain': 'Sem medições de local ainda',
      'methods.dimTemp': 'Temperatura e extremos',
      'methods.covTemp': 'Temperatura média anual, amplitude diária, mínimas e máximas extremas',
      'methods.dimWater': 'Água e gelo',
      'methods.covWater': 'Precipitação e vapor d’água, sem dados de gelo',
      'methods.dimDust': 'Poeira e vento',
      'methods.covDust': 'Apenas velocidade média do vento',
      'methods.dimBio': 'Biologia',
      'methods.covBio': 'Apenas marcadores da literatura',
      'methods.dimCaves': 'Cavernas',
      'methods.covCaves': 'Marcadores da literatura e locais com tubos de lava',
      'methods.dimOps': 'Operações',
      'methods.covOps': 'Indicadores de estação de apoio, área protegida e acesso',
      'methods.gapsTitle': 'Lacunas do conjunto de dados e próximos passos',
      'methods.gap1': '<strong>Faltam dados de inclinação, resistência do solo, radiação e logística:</strong> Parâmetros como inclinação típica do terreno, capacidade de suporte do solo (trafegabilidade), rochosidade superficial, tipo de regolito, dose de radiação ambiente, tempestades de vento/poeira, gelo/permafrost, acessibilidade, infraestrutura, licenças, conectividade e custo relativo estão modelados no esquema (<code>in_data: false</code>), mas ainda não possuem valores por local.',
      'methods.gap2': '<strong>As coordenadas são aproximadas:</strong> Os pontos de latitude e longitude representam centros regionais ou coordenadas representativas de desertos/crateras, não pistas topografadas de teste de rovers nem plataformas de habitats.',
      'methods.gap3': '<strong>Os dados de grade são limitados em montanhas e ilhas:</strong> A NASA POWER usa células de reanálise grossas (cerca de 0.5° × 0.625°), que misturam mar e terra em pequenas ilhas vulcânicas (como Tenerife, Lanzarote, Havaí ou Jeju) e fazem média de altitude entre vales e cumes em cordilheiras (como Chajnantor ou Mauna Kea).',
      'methods.gap4': '<strong>Próximos passos:</strong> Integrar medições revisadas por pares de inclinação, regolito e estações meteorológicas em solo; verificar os campos de licenças e conectividade por local; e adicionar citações da literatura primária para os locais candidatos apenas climáticos.',
      'methods.s5Title': '5. Fontes',
      'methods.sourcesSummary': '{count} fontes de dados, artigos e relatórios de missão citados no Speculum.',
      'methods.sourcesCredit': 'As climatologias dos locais vêm da <strong>NASA POWER</strong> (2001–2025), os valores planetários de referência vêm das <strong>Fichas Técnicas da Lua e de Marte do NASA NSSDC</strong> (S055, S056) e as evidências de campo vêm da literatura publicada e relatórios de missão.',
      'methods.openAccess': 'Acesso aberto',
      'methods.openSource': 'Abrir fonte',
      'methods.citationOnly': 'Registro bibliográfico (sem URL externa)',
      'methods.yearPrefix': 'Ano:'
    }
  };

  // --- DATA DICTIONARIES (analog_data.js entities) ---
  const BODIES = {
    en: { moon: 'Moon', mars: 'Mars' },
    es: { moon: 'Luna', mars: 'Marte' },
    'pt-BR': { moon: 'Lua', mars: 'Marte' }
  };

  const GROUPS = {
    en: {
      climate_atmosphere: 'Climate & atmosphere',
      water_ice: 'Water & ice',
      surface_geology: 'Surface geology',
      light_radiation: 'Light & radiation',
      logistics: 'Logistics'
    },
    es: {
      climate_atmosphere: 'Clima y atmósfera',
      water_ice: 'Agua y hielo',
      surface_geology: 'Geología superficial',
      light_radiation: 'Luz y radiación',
      logistics: 'Logística'
    },
    'pt-BR': {
      climate_atmosphere: 'Clima e atmosfera',
      water_ice: 'Água e gelo',
      surface_geology: 'Geologia superficial',
      light_radiation: 'Luz e radiação',
      logistics: 'Logística'
    }
  };

  const ENV_TYPES = {
    en: {
      impact_crater: 'Impact crater',
      arid_desert: 'Arid desert',
      evaporitic_salt_flat: 'Evaporitic salt flat',
      basaltic_volcanic: 'Basaltic volcanic',
      acidic_hydrothermal: 'Acidic hydrothermal',
      cold_polar_desert: 'Cold polar desert',
      lava_tube: 'Lava tube',
      polar_glacial: 'Polar glacial',
      ancient_rocks: 'Ancient rocks',
      isolation_station: 'Isolation station',
      high_altitude: 'High altitude',
      other: 'Other'
    },
    es: {
      impact_crater: 'Cráter de impacto',
      arid_desert: 'Desierto árido',
      evaporitic_salt_flat: 'Salar evaporítico',
      basaltic_volcanic: 'Volcánico basáltico',
      acidic_hydrothermal: 'Hidrotermal ácido',
      cold_polar_desert: 'Desierto polar frío',
      lava_tube: 'Tubo de lava',
      polar_glacial: 'Glaciar polar',
      ancient_rocks: 'Rocas antiguas',
      isolation_station: 'Estación de aislamiento',
      high_altitude: 'Alta altitud',
      other: 'Otro'
    },
    'pt-BR': {
      impact_crater: 'Cratera de impacto',
      arid_desert: 'Deserto árido',
      evaporitic_salt_flat: 'Salar evaporítico',
      basaltic_volcanic: 'Vulcânico basáltico',
      acidic_hydrothermal: 'Hidrotermal ácido',
      cold_polar_desert: 'Deserto polar frio',
      lava_tube: 'Tubo de lava',
      polar_glacial: 'Glacial polar',
      ancient_rocks: 'Rochas antigas',
      isolation_station: 'Estação de isolamento',
      high_altitude: 'Alta altitude',
      other: 'Outro'
    }
  };

  const UNITS = {
    en: {
      'UV index': 'UV index',
      degrees: 'degrees'
    },
    es: {
      'UV index': 'índice UV',
      degrees: 'grados'
    },
    'pt-BR': {
      'UV index': 'índice UV',
      degrees: 'graus'
    }
  };

  const TARGETS = {
    es: {
      moon_south_pole: {
        name: 'Luna - región polar sur',
        label: 'Luna · polo sur',
        description: 'Cráteres en sombra permanente, frío extremo, posible hielo e iluminación casi continua en crestas.'
      },
      moon_mare: {
        name: 'Luna - mares basálticos',
        label: 'Luna · llanuras basálticas (maria)',
        description: 'Llanuras basálticas, relieve suave y regolito fino.'
      },
      moon_highlands: {
        name: 'Luna - tierras altas',
        label: 'Luna · tierras altas',
        description: 'Terreno antiguo, cráteres de impacto y roca anortosítica.'
      },
      moon_lava_tube: {
        name: 'Luna - tubos de lava y cuevas',
        label: 'Luna · tubos de lava y cuevas',
        description: 'Cavidades subterráneas como refugio frente a la radiación y las oscilaciones térmicas.'
      },
      mars_equatorial: {
        name: 'Marte - regiones ecuatoriales',
        label: 'Marte · regiones ecuatoriales',
        description: 'Terreno basáltico seco, polvo fino y gran amplitud térmica diaria.'
      },
      mars_mid_latitude_ice: {
        name: 'Marte - latitudes medias con hielo',
        label: 'Marte · latitudes medias con hielo',
        description: 'Hielo subsuperficial, permafrost y terreno periglaciar.'
      },
      mars_sedimentary_evaporites: {
        name: 'Marte - terreno sedimentario y evaporítico',
        label: 'Marte · lagos antiguos y sales',
        description: 'Lagos antiguos y sistemas hidrotermales: sulfatos, arcillas, sales e interés astrobiológico.'
      },
      mars_cave_lava_tube: {
        name: 'Marte - cuevas y tubos de lava',
        label: 'Marte · cuevas y tubos de lava',
        description: 'Cavidades volcánicas como posible refugio y objetivo astrobiológico.'
      }
    },
    'pt-BR': {
      moon_south_pole: {
        name: 'Lua - região polar sul',
        label: 'Lua · polo sul',
        description: 'Crateras permanentemente sombreadas, frio extremo, possível gelo e iluminação quase contínua em cristas.'
      },
      moon_mare: {
        name: 'Lua - mares basálticos',
        label: 'Lua · planícies basálticas (maria)',
        description: 'Planícies basálticas, relevo suave e regolito fino.'
      },
      moon_highlands: {
        name: 'Lua - terras altas',
        label: 'Lua · terras altas',
        description: 'Terreno antigo, crateras de impacto e rocha anortosítica.'
      },
      moon_lava_tube: {
        name: 'Lua - tubos de lava e cavernas',
        label: 'Lua · tubos de lava e cavernas',
        description: 'Cavidades subterrâneas como abrigo contra radiação e variações térmicas.'
      },
      mars_equatorial: {
        name: 'Marte - regiões equatoriais',
        label: 'Marte · regiões equatoriais',
        description: 'Terreno basáltico seco, poeira fina e grande variação térmica diária.'
      },
      mars_mid_latitude_ice: {
        name: 'Marte - latitudes médias com gelo',
        label: 'Marte · latitudes médias com gelo',
        description: 'Gelo subsuperficial, permafrost e terreno periglacial.'
      },
      mars_sedimentary_evaporites: {
        name: 'Marte - terreno sedimentar e evaporítico',
        label: 'Marte · lagos antigos e sais',
        description: 'Lagos antigos e sistemas hidrotermais: sulfatos, argilas, sais e interesse astrobiológico.'
      },
      mars_cave_lava_tube: {
        name: 'Marte - cavernas e tubos de lava',
        label: 'Marte · cavernas e tubos de lava',
        description: 'Cavidades vulcânicas como possível abrigo e alvo astrobiológico.'
      }
    }
  };

  const PROFILES = {
    es: {
      wheeled_rover: {
        name: 'Róver con ruedas',
        description: 'Movilidad, tracción, capacidad portante del suelo, polvo y gestión térmica de baterías.'
      },
      drone_helicopter: {
        name: 'Dron / helicóptero',
        description: 'Vuelo en atmósfera tenue; densidad del aire, viento y polvo.'
      },
      habitat_isru: {
        name: 'Hábitat y utilización de recursos in situ (ISRU)',
        description: 'Construcción, regolito, agua, energía y aislamiento térmico.'
      },
      ice_drilling_sampling: {
        name: 'Perforación en hielo y muestreo',
        description: 'Perforadoras, permafrost y hielo subsuperficial.'
      },
      eva_suit: {
        name: 'Traje espacial y actividad extravehicular (EVA)',
        description: 'Terreno, polvo, gestión térmica y movilidad al caminar.'
      },
      power_communications: {
        name: 'Energía y comunicaciones',
        description: 'Irradiancia solar y paneles, baterías, radio, iluminación y conectividad.'
      },
      astrobiology_sampling: {
        name: 'Astrobiología y muestreo',
        description: 'Búsqueda de vida/biofirmas y recolección limpia de muestras.'
      }
    },
    'pt-BR': {
      wheeled_rover: {
        name: 'Rover com rodas',
        description: 'Mobilidade, tração, capacidade de suporte do solo, poeira e gestão térmica de baterias.'
      },
      drone_helicopter: {
        name: 'Drone / helicóptero',
        description: 'Voo em atmosfera rarefeita; densidade do ar, vento e poeira.'
      },
      habitat_isru: {
        name: 'Habitat e utilização de recursos in situ (ISRU)',
        description: 'Construção, regolito, água, energia e isolamento térmico.'
      },
      ice_drilling_sampling: {
        name: 'Perfuração de gelo e amostragem',
        description: 'Perfuratrizes, permafrost e gelo subsuperficial.'
      },
      eva_suit: {
        name: 'Traje espacial e atividade extraveicular (EVA)',
        description: 'Terreno, poeira, gestão térmica e mobilidade ao caminhar.'
      },
      power_communications: {
        name: 'Energia e comunicações',
        description: 'Irradiância solar e painéis, baterias, rádio, iluminação e conectividade.'
      },
      astrobiology_sampling: {
        name: 'Astrobiologia e amostragem',
        description: 'Busca por vida/bioassinaturas e coleta limpa de amostras.'
      }
    }
  };

  const PARAMETERS = {
    es: {
      mean_annual_temperature: {
        name: 'Temperatura media anual',
        description: 'Media anual de la temperatura del aire cerca de la superficie en el sitio.'
      },
      daily_temperature_range: {
        name: 'Amplitud térmica diaria',
        description: 'Diferencia típica entre la máxima y la mínima diaria. Importante para el estrés térmico en electrónica y baterías.'
      },
      extreme_min_temperature: {
        name: 'Temperatura mínima extrema registrada',
        description: 'Temperatura más baja registrada, o mínima invernal típica, en el sitio.'
      },
      extreme_max_temperature: {
        name: 'Temperatura máxima extrema registrada',
        description: 'Temperatura más alta registrada, o máxima estival típica, en el sitio.'
      },
      atmospheric_pressure: {
        name: 'Presión atmosférica',
        description: 'Presión media en el sitio. Cuanto menor, más cercana a Marte y la Luna; comparar en escala logarítmica.',
        analog_limitation: 'Ningún sitio terrestre se acerca a la presión de Marte ni al vacío lunar. Solo puede aproximarse parcialmente en gran altitud o cámaras de vacío.'
      },
      altitude: {
        name: 'Altitud',
        description: 'Altitud del sitio sobre el nivel del mar. Ayuda a interpretar la presión, los UV y la dosis de radiación.'
      },
      annual_precipitation: {
        name: 'Precipitación anual',
        description: 'Precipitación media anual (incluido el equivalente en agua de nieve). Indicador de aridez.'
      },
      mean_wind_speed: {
        name: 'Velocidad media del viento (10 m)',
        description: 'Velocidad media anual del viento a 10 m. Relevante para levantamiento de polvo, vuelo de drones y estructuras. No refleja tormentas de polvo.',
        analog_limitation: 'La tenue atmósfera de Marte hace que el viento ejerza mucha menos fuerza que el viento terrestre de igual velocidad; la Luna no tiene viento.'
      },
      relative_humidity: {
        name: 'Humedad relativa (2 m)',
        description: 'Humedad relativa media anual a 2 m. Solo informativa: en lugares fríos la humedad relativa es alta aunque el aire contenga casi nada de agua, por lo que no mide bien la sequedad. Usa presión de vapor de agua para ello.'
      },
      water_vapor_pressure: {
        name: 'Presión de vapor de agua (derivada)',
        description: 'Sequedad absoluta del aire, derivada de la humedad relativa media anual y la temperatura media anual (fórmula de Magnus). Menor significa aire más seco, más cercano a Marte y la Luna.',
        analog_limitation: 'Derivada de medias anuales, por lo que es solo una aproximación de la presión de vapor media anual real.'
      },
      wind_dust: {
        name: 'Viento y tormentas de polvo',
        description: 'Régimen típico de vientos y ocurrencia de tormentas de arena/polvo.',
        analog_limitation: 'La atmósfera de Marte es tan tenue que el viento ejerce mucha menos fuerza que el viento terrestre a la misma velocidad; la Luna no tiene viento.'
      },
      ice_permafrost: {
        name: 'Hielo y permafrost',
        description: 'Presencia dominante de agua congelada en el sitio. Relevante para ISRU, perforación y Marte en latitudes medias.'
      },
      evaporites_salts: {
        name: 'Evaporitas y sales',
        description: 'Presencia de costras salinas, sulfatos y cloruros. Relevante para corrosión y para el Marte sedimentario.'
      },
      typical_slope: {
        name: 'Pendiente típica del terreno',
        description: 'Pendiente típica en zonas transitables. Fundamental para la movilidad de róveres.'
      },
      rockiness: {
        name: 'Rocosidad superficial',
        description: 'Abundancia de rocas y bloques en la superficie (obstáculos para la locomoción).'
      },
      regolith_type: {
        name: 'Tipo de suelo / regolito',
        description: 'Material superficial dominante. Afecta tracción, desgaste, sellado y recolección de muestras.',
        analog_limitation: 'El regolito lunar es extremadamente fino, angular y abrasivo; los suelos terrestres rara vez lo reproducen sin simulantes.'
      },
      soil_bearing_strength: {
        name: 'Capacidad portante del suelo (transitabilidad)',
        description: 'Qué tan bien soporta la superficie ruedas y pies. Arena suelta y polvo fino son muy blandos; suelo compactado o encostrado es firme; roca expuesta es dura. Condiciona hundimiento, tracción y movilidad.',
        analog_limitation: 'El hundimiento depende de la gravedad y la compactación; la gravedad terrestre es unas 6 veces la lunar y 2.6 veces la marciana, así que trátalo como una comparación cualitativa.'
      },
      mineralogy: {
        name: 'Mineralogía / geología dominante',
        description: 'Principales litologías y minerales en el sitio. Importante para ISRU y astrobiología.'
      },
      landforms: {
        name: 'Rasgos geomorfológicos',
        description: 'Formas del relieve presentes que también aparecen en la Luna o Marte.'
      },
      uv_radiation: {
        name: 'Radiación UV (índice máximo)',
        description: 'Índice UV máximo típico. Relevante para degradación de materiales y astrobiología.',
        analog_limitation: 'Marte y la Luna reciben UV superficial mucho más intensos que cualquier lugar de la Tierra por la ausencia de capa de ozono.'
      },
      illumination_cycle: {
        name: 'Ciclo de iluminación',
        description: 'Régimen de luz en el sitio. El día/noche polar y las cuevas sirven como análogos parciales del polo lunar y de tubos de lava.',
        analog_limitation: 'Un día lunar dura unos 29.5 días terrestres; los ciclos polares de la Tierra son solo análogos parciales.'
      },
      radiation_dose: {
        name: 'Dosis de radiación ambiental',
        description: 'Dosis ambiental típica. Registrada solo como referencia informativa; no entra en la puntuación.',
        analog_limitation: 'Ningún sitio terrestre reproduce la radiación cósmica y solar en la superficie lunar o marciana, bloqueada en la Tierra por la atmósfera y el campo magnético.'
      },
      solar_irradiance: {
        name: 'Irradiancia solar (media anual)',
        description: 'Energía solar diaria media anual sobre superficie horizontal. Determina el dimensionamiento de paneles solares y el balance energético.',
        analog_limitation: 'La Luna carece de atmósfera, por lo que la luz solar no se atenúa; Marte recibe menos de la mitad del flujo solar terrestre y las tormentas de polvo lo reducen aún más.'
      },
      accessibility: {
        name: 'Accesibilidad',
        description: 'Facilidad para llegar con equipamiento (carretera, aeropuerto, tiempo de viaje).'
      },
      infrastructure: {
        name: 'Infraestructura existente',
        description: 'Estaciones de investigación, hábitats simulados o apoyo local disponible.'
      },
      permits_regulation: {
        name: 'Permisos y regulación',
        description: 'Dificultad burocrática para operar equipos en el sitio (parques, áreas protegidas, restricciones políticas).'
      },
      best_season: {
        name: 'Mejor época del año',
        description: 'Meses más adecuados para campañas de prueba (clima, luz, acceso).'
      },
      connectivity: {
        name: 'Conectividad',
        description: 'Disponibilidad de internet o telefonía móvil para telemetría y operación remota.'
      },
      relative_cost: {
        name: 'Costo relativo de campaña',
        description: 'Estimación cualitativa de costo (transporte, alojamiento, permisos). Debe venir de una fuente o marcarse con confianza baja.'
      }
    },
    'pt-BR': {
      mean_annual_temperature: {
        name: 'Temperatura média anual',
        description: 'Média anual da temperatura do ar próxima à superfície no local.'
      },
      daily_temperature_range: {
        name: 'Amplitude térmica diária',
        description: 'Diferença típica entre máxima e mínima diária. Importante para o estresse térmico em eletrônicos e baterias.'
      },
      extreme_min_temperature: {
        name: 'Temperatura mínima extrema registrada',
        description: 'Menor temperatura registrada, ou mínima típica de inverno, no local.'
      },
      extreme_max_temperature: {
        name: 'Temperatura máxima extrema registrada',
        description: 'Maior temperatura registrada, ou máxima típica de verão, no local.'
      },
      atmospheric_pressure: {
        name: 'Pressão atmosférica',
        description: 'Pressão média no local. Quanto menor, mais próxima de Marte e da Lua; comparar em escala logarítmica.',
        analog_limitation: 'Nenhum local da Terra chega perto da pressão de Marte ou do vácuo lunar. Isso só pode ser aproximado parcialmente em grande altitude ou câmaras de vácuo.'
      },
      altitude: {
        name: 'Altitude',
        description: 'Altitude do local acima do nível do mar. Ajuda a interpretar pressão, UV e dose de radiação.'
      },
      annual_precipitation: {
        name: 'Precipitação anual',
        description: 'Precipitação média anual (incluindo equivalente em água de neve). Indicador de aridez.'
      },
      mean_wind_speed: {
        name: 'Velocidade média do vento (10 m)',
        description: 'Velocidade média anual do vento a 10 m. Relevante para levantamento de poeira, voo de drones e estruturas. Não captura tempestades de poeira.',
        analog_limitation: 'A atmosfera rarefeita de Marte faz o vento exercer muito menos força que o vento terrestre de mesma velocidade; a Lua não tem vento.'
      },
      relative_humidity: {
        name: 'Umidade relativa (2 m)',
        description: 'Umidade relativa média anual a 2 m. Apenas informativa: em locais frios a umidade relativa é alta mesmo com quase nenhuma água no ar, não servindo bem para medir secura. Use a pressão de vapor de água para isso.'
      },
      water_vapor_pressure: {
        name: 'Pressão de vapor de água (derivada)',
        description: 'Secura absoluta do ar, derivada da umidade relativa média anual e da temperatura média anual (fórmula de Magnus). Menor significa ar mais seco, mais próximo de Marte e da Lua.',
        analog_limitation: 'Derivada de médias anuais, sendo apenas uma aproximação da pressão de vapor média anual real.'
      },
      wind_dust: {
        name: 'Vento e tempestades de poeira',
        description: 'Regime típico de ventos e ocorrência de tempestades de areia/poeira.',
        analog_limitation: 'A atmosfera de Marte é tão tênue que o vento exerce muito menos força que o vento terrestre na mesma velocidade; a Lua não tem vento.'
      },
      ice_permafrost: {
        name: 'Gelo e permafrost',
        description: 'Presença dominante de água congelada no local. Relevante para ISRU, perfuração e Marte em latitudes médias.'
      },
      evaporites_salts: {
        name: 'Evaporitos e sais',
        description: 'Presença de crostas salinas, sulfatos e cloretos. Relevante para corrosão e para Marte sedimentar.'
      },
      typical_slope: {
        name: 'Inclinação típica do terreno',
        description: 'Inclinação típica em áreas trafegáveis. Fundamental para a mobilidade de rovers.'
      },
      rockiness: {
        name: 'Rochosidade superficial',
        description: 'Abundância de rochas e matacões na superfície (obstáculos à locomoção).'
      },
      regolith_type: {
        name: 'Tipo de solo / regolito',
        description: 'Material superficial dominante. Afeta tração, desgaste, vedação e coleta de amostras.',
        analog_limitation: 'O regolito lunar é extremamente fino, angular e abrasivo; solos terrestres raramente o reproduzem sem simulantes.'
      },
      soil_bearing_strength: {
        name: 'Capacidade de suporte do solo (trafegabilidade)',
        description: 'O quanto a superfície sustenta rodas e pés. Areia solta e poeira fina são muito macias; solo compactado ou com crosta é firme; rocha exposta é dura. Define afundamento, tração e mobilidade.',
        analog_limitation: 'O afundamento depende da gravidade e da compactação; a gravidade da Terra é cerca de 6 vezes a lunar e 2,6 vezes a marciana, então trate como comparação qualitativa.'
      },
      mineralogy: {
        name: 'Mineralogia / geologia dominante',
        description: 'Principais litologias e minerais do local. Importante para ISRU e astrobiologia.'
      },
      landforms: {
        name: 'Feições geomorfológicas',
        description: 'Formas de relevo presentes que também ocorrem na Lua ou em Marte.'
      },
      uv_radiation: {
        name: 'Radiação UV (índice máximo)',
        description: 'Índice UV máximo típico. Relevante para degradação de materiais e astrobiologia.',
        analog_limitation: 'Marte e a Lua recebem radiação UV superficial muito mais intensa do que qualquer lugar da Terra, pela ausência de camada de ozônio.'
      },
      illumination_cycle: {
        name: 'Ciclo de iluminação',
        description: 'Regime de luz no local. Dia/noite polar e cavernas servem como análogos parciais do polo lunar e de tubos de lava.',
        analog_limitation: 'Um dia lunar dura cerca de 29,5 dias terrestres; os ciclos polares da Terra são apenas análogos parciais.'
      },
      radiation_dose: {
        name: 'Dose de radiação ambiente',
        description: 'Dose ambiente típica. Registrada apenas para informação; não entra na pontuação.',
        analog_limitation: 'Nenhum local terrestre reproduz a radiação cósmica e solar na superfície lunar ou marciana, bloqueada na Terra pela atmosfera e pelo campo magnético.'
      },
      solar_irradiance: {
        name: 'Irradiância solar (média anual)',
        description: 'Energia solar diária média anual em superfície horizontal. Orienta o dimensionamento de painéis solares e o balanço de energia.',
        analog_limitation: 'A Lua não tem atmosfera, então a luz solar não é atenuada; Marte recebe menos da metade do fluxo solar terrestre, e tempestades de poeira o reduzem ainda mais.'
      },
      accessibility: {
        name: 'Acessibilidade',
        description: 'Facilidade para chegar com equipamentos (estrada, aeroporto, tempo de viagem).'
      },
      infrastructure: {
        name: 'Infraestrutura existente',
        description: 'Estações de pesquisa, habitats simulados ou apoio local disponível.'
      },
      permits_regulation: {
        name: 'Licenças e regulamentação',
        description: 'Dificuldade burocrática para operar equipamentos no local (parques, áreas protegidas, restrições políticas).'
      },
      best_season: {
        name: 'Melhor época do ano',
        description: 'Meses mais adequados para campanhas de teste (clima, luz, acesso).'
      },
      connectivity: {
        name: 'Conectividade',
        description: 'Disponibilidade de internet/sinal celular para telemetria e operação remota.'
      },
      relative_cost: {
        name: 'Custo relativo da campanha',
        description: 'Estimativa qualitativa de custo (transporte, hospedagem, licenças). Deve vir de fonte confiável ou ser marcada com confiança baixa.'
      }
    }
  };

  const COUNTRIES = {
    es: {
      Canada: 'Canadá',
      Chile: 'Chile',
      'United States': 'Estados Unidos',
      Iceland: 'Islandia',
      Spain: 'España',
      Ethiopia: 'Etiopía',
      Antarctica: 'Antártida',
      Norway: 'Noruega',
      Bolivia: 'Bolivia',
      Iran: 'Irán',
      Israel: 'Israel',
      Oman: 'Omán',
      Australia: 'Australia',
      Namibia: 'Namibia',
      China: 'China',
      Morocco: 'Marruecos',
      'South Korea': 'Corea del Sur',
      Brazil: 'Brasil',
      Niger: 'Níger',
      'Libya/Egypt': 'Libia / Egipto',
      Chad: 'Chad',
      Algeria: 'Argelia',
      Mauritania: 'Mauritania',
      Libya: 'Libia',
      Egypt: 'Egipto',
      Tunisia: 'Túnez',
      Botswana: 'Botsuana',
      'South Africa': 'Sudáfrica',
      'Saudi Arabia/Oman': 'Arabia Saudita / Omán',
      'Saudi Arabia': 'Arabia Saudita',
      Jordan: 'Jordania',
      Turkmenistan: 'Turkmenistán',
      Uzbekistan: 'Uzbekistán',
      Mongolia: 'Mongolia',
      Pakistan: 'Pakistán',
      Tajikistan: 'Tayikistán',
      'India/Pakistan': 'India / Pakistán',
      Russia: 'Rusia',
      'United States/Mexico': 'Estados Unidos / México',
      Mexico: 'México',
      Greenland: 'Groenlandia',
      Argentina: 'Argentina',
      'Chile/Argentina': 'Chile / Argentina',
      Peru: 'Perú'
    },
    'pt-BR': {
      Canada: 'Canadá',
      Chile: 'Chile',
      'United States': 'Estados Unidos',
      Iceland: 'Islândia',
      Spain: 'Espanha',
      Ethiopia: 'Etiópia',
      Antarctica: 'Antártida',
      Norway: 'Noruega',
      Bolivia: 'Bolívia',
      Iran: 'Irã',
      Israel: 'Israel',
      Oman: 'Omã',
      Australia: 'Austrália',
      Namibia: 'Namíbia',
      China: 'China',
      Morocco: 'Marrocos',
      'South Korea': 'Coreia do Sul',
      Brazil: 'Brasil',
      Niger: 'Níger',
      'Libya/Egypt': 'Líbia / Egito',
      Chad: 'Chade',
      Algeria: 'Argélia',
      Mauritania: 'Mauritânia',
      Libya: 'Líbia',
      Egypt: 'Egito',
      Tunisia: 'Tunísia',
      Botswana: 'Botsuana',
      'South Africa': 'África do Sul',
      'Saudi Arabia/Oman': 'Arábia Saudita / Omã',
      'Saudi Arabia': 'Arábia Saudita',
      Jordan: 'Jordânia',
      Turkmenistan: 'Turcomenistão',
      Uzbekistan: 'Uzbequistão',
      Mongolia: 'Mongólia',
      Pakistan: 'Paquistão',
      Tajikistan: 'Tajiquistão',
      'India/Pakistan': 'Índia / Paquistão',
      Russia: 'Rússia',
      'United States/Mexico': 'Estados Unidos / México',
      Mexico: 'México',
      Greenland: 'Groenlândia',
      Argentina: 'Argentina',
      'Chile/Argentina': 'Chile / Argentina',
      Peru: 'Peru'
    }
  };

  const REGIONS = {
    es: {
      'Antofagasta Region': 'Región de Antofagasta',
      Hawaii: 'Hawái',
      'Central Highlands': 'Tierras Altas Centrales',
      Andalusia: 'Andalucía',
      'Victoria Land': 'Tierra de Victoria',
      'Canary Islands': 'Islas Canarias',
      'Western Australia': 'Australia Occidental',
      'Antarctic Plateau': 'Meseta Antártica',
      'Jeju Island': 'Isla de Jeju'
    },
    'pt-BR': {
      'Antofagasta Region': 'Região de Antofagasta',
      California: 'Califórnia',
      Hawaii: 'Havaí',
      'Central Highlands': 'Terras Altas Centrais',
      Andalusia: 'Andaluzia',
      'Victoria Land': 'Terra de Vitória',
      'Canary Islands': 'Ilhas Canárias',
      'Western Australia': 'Austrália Ocidental',
      'Antarctic Plateau': 'Planalto Antártico',
      'Jeju Island': 'Ilha de Jeju'
    }
  };

  const SITE_SUMMARIES = {
    es: {
      haughton_devon: 'Citado en el enunciado del desafío. Cráter de impacto en un desierto polar frío, asociado con el Proyecto Haughton-Mars (por confirmar).',
      atacama_yungay: 'Citado en el enunciado del desafío. Hiperaridez extrema y suelos ricos en sales; ampliamente usado como análogo de Marte (por confirmar).',
      death_valley: 'Citado en el enunciado del desafío. Calor extremo, evaporitas y abanicos aluviales.',
      mdrs_utah: 'Hábitat de simulación de misiones a Marte operado por la Mars Society, en un desierto de rocas sedimentarias (por confirmar).',
      hiseas_mauna_loa: 'Descripción oficial del sitio: hábitat a unos 8,200 pies en el Mauna Loa, en una antigua cantera de ceniza junto a coladas recientes con tubos de lava y claraboyas (ver fuente). Coordenada movida al valor no oficial de Wikipedia; confirmar.',
      mauna_kea_pisces: 'Asociado con pruebas de róveres e ISRU y con simulantes de regolito fabricados a partir de ceniza volcánica (por confirmar).',
      askja_iceland: 'Astronautas de la era Apolo entrenaron en Islandia, incluida el área de Askja (S004). Basalto, interacción volcán-hielo y terreno periglaciar.',
      rio_tinto_spain: 'Río ácido rico en hierro y sulfatos, asociado con proyectos de astrobiología y perforación (por confirmar).',
      dallol_ethiopia: 'Sistema hidrotermal hipersalino y ácido con calor extremo. Verifica riesgos de seguridad y acceso antes de recomendar.',
      dry_valleys_antarctica: 'Desiertos polares fríos e hiperáridos con permafrost y hielo enterrado; citados con frecuencia como análogo de Marte (por confirmar).',
      lanzarote_lava_tubes: 'Extenso sistema de tubos de lava, relevante para estudios de cuevas como refugio (por confirmar).',
      craters_of_the_moon_idaho: 'Astronautas del Apolo 14 entrenaron aquí en agosto de 1969 (confirmado por el Servicio de Parques Nacionales). Tubos de lava estudiados como análogos de Marte. Área protegida: verificar permisos.',
      flagstaff_sunset_cinder: 'Campo volcánico con un campo artificial de cráteres usado en el entrenamiento Apolo (S004); el enlace del Centro de Astrogeología del USGS no fue verificado.',
      teide_tenerife: 'Desierto volcánico de gran altitud (por encima de 2,000 m) con terreno de lava y ceniza. Parque nacional: verificar permisos.',
      svalbard_norway: 'AMASE (Expedición Ártica Análoga a Marte en Svalbard) trabaja en el Complejo Volcánico Bockfjord (aprox. 79.5 N, 13.2 E; S029): suelos volcánicos, fuentes termales y depósitos de carbonatos. Coordenadas trasladadas desde Longyearbyen.',
      uyuni_bolivia: 'El salar más grande del mundo: una llanura extremadamente plana a gran altitud con costras de sal.',
      lut_iran: 'Calor extremo y terreno de dunas y yardangs. Verifica las restricciones de acceso antes de recomendar.',
      ramon_israel: 'AMADEE-20 (oct. 2021) se celebró en Makhtesh Ramon con la Agencia Espacial de Israel y el hábitat D-MARS (confirmado en prensa). Buscar el informe oficial del OeWF.',
      dhofar_oman: 'Desierto de la campaña de simulación AMADEE-18, feb. 2018 (S019). La coordenada es regional; el sitio exacto proviene de las fuentes.',
      pilbara_australia: 'Rocas muy antiguas con evidencia de vida microbiana primitiva; relevante para astrobiología y muestreo (por confirmar).',
      concordia_dome_c: 'Estación permanente en una meseta de hielo (3,200 m, 645 hPa, media -51 °C). Análogo de factores humanos (aislamiento, hipoxia, frío), no de terreno; mantener débil el vínculo con el polo lunar.',
      lava_beds_california: 'Gran concentración de tubos de lava accesibles. Área protegida: verificar permisos.',
      namib_namibia: 'Campos de dunas gigantes en un desierto costero, relevante para movilidad sobre arena.',
      qaidam_china: 'Desierto árido frío y de gran altitud (unos 3,000 m) con yardangs, dunas y polígonos de costra salina. Una base de simulación de Marte abrió en marzo de 2019 en Mangya, Qinghai. La coordenada es regional (cerca de Lenghu) y la base real está en otra zona de la cuenca; el nombre "Mars Base 1" no fue confirmado.',
      erfoud_morocco: 'Región asociada con una campaña de simulación de Marte del Foro Espacial Austriaco (MARS2013, feb. 2013; S020).',
      jeju_manjanggul: 'Uno de los tubos de lava más largos y mejor estudiados del mundo. Sitio patrimonial protegido: verificar permisos.',
      iron_quadrangle_brazil: 'HIPÓTESIS para el enfoque brasileño: rocas ricas en óxidos de hierro y cuevas ferruginosas. Solo se mantiene si una fuente lo vincula explícitamente con análogos; de lo contrario, descartar.',
      chajnantor_altiplano: 'Meseta a unos 5,000 m con baja presión, alta radiación UV y gran aridez. Alberga un observatorio (por confirmar), por lo que el acceso puede estar restringido.'
    },
    'pt-BR': {
      haughton_devon: 'Citado no enunciado do desafio. Cratera de impacto em deserto polar frio, associada ao Projeto Haughton-Mars (a confirmar).',
      atacama_yungay: 'Citado no enunciado do desafio. Hiperaridez extrema e solos ricos em sais; amplamente usado como análogo de Marte (a confirmar).',
      death_valley: 'Citado no enunciado do desafio. Calor extremo, evaporitos e leques aluviais.',
      mdrs_utah: 'Habitat de simulação de missões a Marte operado pela Mars Society, em um deserto de rochas sedimentares (a confirmar).',
      hiseas_mauna_loa: 'Descrição oficial do local: habitat a cerca de 8.200 pés no Mauna Loa, em uma antiga pedreira de escória vulcânica ao lado de derrames recentes com tubos de lava e claraboias (ver fonte). Coordenada movida para o valor não oficial da Wikipédia; confirmar.',
      mauna_kea_pisces: 'Associado a testes de rovers e ISRU e a simulantes de regolito feitos a partir de cinza vulcânica (a confirmar).',
      askja_iceland: 'Astronautas da era Apollo treinaram na Islândia, incluindo a área de Askja (S004). Basalto, interação vulcão-gelo e terreno periglacial.',
      rio_tinto_spain: 'Rio ácido rico em ferro e sulfatos, associado a projetos de astrobiologia e perfuração (a confirmar).',
      dallol_ethiopia: 'Sistema hidrotermal hipersalino e ácido com calor extremo. Verifique riscos de segurança e acesso antes de recomendar.',
      dry_valleys_antarctica: 'Desertos polares frios e hiperáridos com permafrost e gelo enterrado; frequentemente citados como análogo de Marte (a confirmar).',
      lanzarote_lava_tubes: 'Extenso sistema de tubos de lava, relevante para estudos de cavernas como abrigo (a confirmar).',
      craters_of_the_moon_idaho: 'Astronautas da Apollo 14 treinaram aqui em agosto de 1969 (confirmado pelo Serviço Nacional de Parques). Tubos de lava estudados como análogos de Marte. Área protegida: verificar licenças.',
      flagstaff_sunset_cinder: 'Campo vulcânico com um campo artificial de crateras usado no treinamento Apollo (S004); o link do USGS Astrogeology Science Center não foi verificado.',
      teide_tenerife: 'Deserto vulcânico de grande altitude (acima de 2.000 m) com terreno de lava e cinzas. Parque nacional: verificar licenças.',
      svalbard_norway: 'A expedição AMASE (Arctic Mars Analog Svalbard Expedition) atua no Complexo Vulcânico Bockfjord (cerca de 79,5 N, 13,2 E; S029): solos vulcânicos, fontes termais e depósitos de carbonatos. Coordenadas movidas de Longyearbyen para cá.',
      uyuni_bolivia: 'O maior salar do mundo: uma planície extremamente plana em grande altitude com crostas de sal.',
      lut_iran: 'Calor extremo e terreno de dunas e yardangs. Verifique restrições de acesso antes de recomendar.',
      ramon_israel: 'A missão AMADEE-20 (out. 2021) ocorreu em Makhtesh Ramon com a Agência Espacial de Israel e o habitat D-MARS (confirmado na imprensa). Buscar o relatório oficial do OeWF.',
      dhofar_oman: 'Deserto da campanha de simulação AMADEE-18, fev. 2018 (S019). A coordenada é regional; o local exato vem das fontes.',
      pilbara_australia: 'Rochas muito antigas com evidências de vida microbiana primitiva; relevante para astrobiologia e amostragem (a confirmar).',
      concordia_dome_c: 'Estação permanente em platô de gelo (3.200 m, 645 hPa, média -51 °C). Análogo de fatores humanos (isolamento, hipóxia, frio), não de terreno; manter fraca a relação com o polo lunar.',
      lava_beds_california: 'Grande concentração de tubos de lava acessíveis. Área protegida: verificar licenças.',
      namib_namibia: 'Campos de dunas gigantes em um deserto costeiro, relevante para mobilidade na areia.',
      qaidam_china: 'Deserto árido frio e de grande altitude (cerca de 3.000 m) com yardangs, dunas e polígonos de crosta salina. Uma base de simulação de Marte abriu em março de 2019 em Mangya, Qinghai. A coordenada é regional (perto de Lenghu) e a base fica em outra parte da bacia; o nome "Mars Base 1" não foi confirmado.',
      erfoud_morocco: 'Região associada a uma campanha de simulação de Marte do Fórum Espacial Austríaco (MARS2013, fev. 2013; S020).',
      jeju_manjanggul: 'Um dos tubos de lava mais longos e mais bem estudados do mundo. Patrimônio protegido: verificar licenças.',
      iron_quadrangle_brazil: 'HIPÓTESE para o recorte brasileiro: rochas ricas em óxidos de ferro e cavernas ferruginosas. Só permanece se uma fonte o vincular explicitamente a análogos; caso contrário, descartar.',
      chajnantor_altiplano: 'Planalto a cerca de 5.000 m com baixa pressão, alta radiação UV e grande aridez. Abriga um observatório (a confirmar), portanto o acesso pode ser restrito.'
    }
  };

  const ACCESS_NOTES = {
    es: {
      dallol_ethiopia: 'Remoto, con inestabilidad política pasada y sin infraestructura (S018).',
      lut_iran: 'Es probable que existan restricciones de acceso; no verificado.',
      concordia_dome_c: 'Sin acceso desde mediados de febrero hasta mediados de noviembre (S032).',
      chajnantor_altiplano: 'Sitio de observatorio; el acceso puede estar restringido (no verificado).'
    },
    'pt-BR': {
      dallol_ethiopia: 'Remoto, com instabilidade política passada e sem infraestrutura (S018).',
      lut_iran: 'Restrições de acesso são prováveis; não verificado.',
      concordia_dome_c: 'Sem acesso de meados de fevereiro a meados de novembro (S032).',
      chajnantor_altiplano: 'Local de observatório; o acesso pode ser restrito (não verificado).'
    }
  };

  const CLIMATE_ONLY_SUMMARIES = {
    es: 'Candidato solo climático del barrido global. Aún sin fuente bibliográfica; los valores climáticos provienen de una celda gruesa de NASA POWER, así que verifica los datos locales antes de usarlo.',
    'pt-BR': 'Candidato apenas climático da varredura global. Ainda sem fonte bibliográfica; os valores climáticos vêm de uma célula de grade grossa da NASA POWER, portanto verifique os dados locais antes de usá-lo.'
  };

  const USE_CASE_LABELS = {
    es: {
      rover_robotics: 'Pruebas de róveres y robótica',
      habitat_crew_ops: 'Operaciones de hábitat y tripulación',
      isru: 'Uso de recursos (ISRU)',
      ice_permafrost: 'Hielo y permafrost',
      astrobiology: 'Astrobiología',
      drilling_sampling: 'Perforación y muestreo',
      caves_lava_tubes: 'Cuevas y tubos de lava',
      isolation: 'Aislamiento de la tripulación',
      instrument_testing: 'Pruebas de instrumentos',
      astronaut_training: 'Entrenamiento de astronautas',
      geology_mineralogy: 'Geología y minerales'
    },
    'pt-BR': {
      rover_robotics: 'Testes de rovers e robótica',
      habitat_crew_ops: 'Operações de habitat e tripulação',
      isru: 'Uso de recursos (ISRU)',
      ice_permafrost: 'Gelo e permafrost',
      astrobiology: 'Astrobiologia',
      drilling_sampling: 'Perfuração e amostragem',
      caves_lava_tubes: 'Cavernas e tubos de lava',
      isolation: 'Isolamento da tripulação',
      instrument_testing: 'Testes de instrumentos',
      astronaut_training: 'Treinamento de astronautas',
      geology_mineralogy: 'Geologia e minerais'
    }
  };

  const EXPLORATION_VALUES = {
    es: {
      haughton_devon: 'Cráter de impacto en desierto polar con permafrost continuo y estación de investigación, estudiado como análogo marciano para geología de impacto y trabajo de campo en desiertos fríos.',
      atacama_yungay: 'Suelos hiperáridos similares a los de Marte que marcan el límite seco de la vida microbiana, lo que lo convierte en sitio de referencia para estudios de suelo y astrobiología.',
      death_valley: 'Abanicos aluviales y salares usados en estudios de análogos marcianos por teledetección; mucho más jóvenes y dinámicos que el terreno de Marte.',
      mdrs_utah: 'Hábitat de la Mars Society sobre rocas sedimentarias ricas en arcillas y sulfatos con canales invertidos, usado para simulaciones de operaciones de tripulación y geología de campo.',
      hiseas_mauna_loa: 'Hábitat de simulación junto a coladas recientes con tubos de lava y claraboyas, usado en misiones análogas incluyendo investigación de exploración de tubos de lava.',
      mauna_kea_pisces: 'Sitio de pruebas de PISCES en Mauna Kea para ensayos en campo de análogos lunares de extracción de recursos (ISRU) y robótica.',
      askja_iceland: 'Tierras altas basálticas donde astronautas de la era Apolo entrenaron en geología de campo.',
      rio_tinto_spain: 'Sistema fluvial ácido rico en hierro y sulfatos; sede de una misión simulada de perforación en Marte para buscar vida subsuperficial.',
      dallol_ethiopia: 'Campo hidrotermal ácido e hipersalino presentado como análogo planetario; extremadamente caluroso, remoto y con inestabilidad política pasada.',
      dry_valleys_antarctica: 'Valles fríos e hiperáridos con permafrost y hielo enterrado; tres zonas microclimáticas vinculan formas del relieve con hielo cercano a la superficie, relevante para Marte.',
      lanzarote_lava_tubes: 'Extensos tubos de lava relevantes para estudios de cuevas lunares y marcianas como refugio.',
      craters_of_the_moon_idaho: 'La tripulación del Apolo 14 entrenó aquí en 1969; sus tubos de lava se estudian como hábitats subsuperficiales análogos de Marte.',
      flagstaff_sunset_cinder: 'Campo volcánico con campos artificiales de cráteres usados en entrenamiento Apolo; sede del Centro de Ciencias Astrogeológicas del USGS.',
      teide_tenerife: 'Afloramientos volcánicos en Tenerife caracterizados con Raman, DRX y espectroscopía como análogos de la geología marciana.',
      svalbard_norway: 'Campañas árticas (AMASE) probaron instrumentos marcianos y almacenamiento de muestras por róveres en un entorno frío, volcánico y de fuentes termales.',
      uyuni_bolivia: 'Gigantesco salar cuyas salmueras y arcillas se comparan con depósitos de cloruros en Marte.',
      ramon_israel: 'Gran cráter desértico que alberga el hábitat D-MARS; sede de la simulación de Marte AMADEE-20 en 2021.',
      dhofar_oman: 'Región desértica de la simulación marciana de cuatro semanas AMADEE-18 (2018).',
      pilbara_australia: 'Rocas antiguas con estromatolitos visitadas por científicos de Mars 2020 y ExoMars para aprender a buscar vida primitiva.',
      concordia_dome_c: 'Estación permanente sobre una meseta de hielo usada para investigar factores humanos sobre aislamiento, frío y baja presión; sin acceso desde mediados de febrero hasta mediados de noviembre.',
      lava_beds_california: 'Tubos de lava accesibles usados como análogo lunar de tubos de lava (datos NASA TubeX) y estudiados por su habitabilidad mineral.',
      qaidam_china: 'Cuenca alta, fría y árida con yardangs, dunas y costras de sal presentada como análogo de Marte y usada en selección de análogos basada en similitud.',
      erfoud_morocco: 'Región del Sahara marroquí de la simulación marciana MARS2013 de 2013.'
    },
    'pt-BR': {
      haughton_devon: 'Cratera de impacto em deserto polar com permafrost contínuo e estação de pesquisa, estudada como análogo de Marte para geologia de impacto e trabalho de campo em desertos frios.',
      atacama_yungay: 'Solos hiperáridos semelhantes aos de Marte que marcam o limite seco da vida microbiana, servindo como referência para estudos de solo e astrobiologia.',
      death_valley: 'Leques aluviais e salinas usados em estudos de sensoriamento remoto análogos a Marte; muito mais jovens e dinâmicos do que o terreno marciano.',
      mdrs_utah: 'Habitat da Mars Society em rochas sedimentares ricas em argilas e sulfatos com canais invertidos, usado para operações de tripulação e simulações de geologia de campo.',
      hiseas_mauna_loa: 'Habitat de simulação ao lado de derrames de lava recentes com tubos de lava e claraboias, usado em missões análogas incluindo pesquisa de exploração de tubos de lava.',
      mauna_kea_pisces: 'Campo de testes da PISCES no Mauna Kea para ensaios de campo análogos lunares de extração de recursos (ISRU) e robótica.',
      askja_iceland: 'Terras altas basálticas onde astronautas da era Apollo treinaram geologia de campo.',
      rio_tinto_spain: 'Sistema fluvial ácido rico em ferro e sulfatos; local de uma missão simulada de perfuração em Marte buscando vida subsuperficial.',
      dallol_ethiopia: 'Campo hidrotermal ácido e hipersalino apresentado como análogo planetário; extremamente quente, remoto e com instabilidade política passada.',
      dry_valleys_antarctica: 'Vales frios e hiperáridos com permafrost e gelo enterrado; três zonas microclimáticas relacionam formas de relevo a gelo próximo à superfície, relevante para Marte.',
      lanzarote_lava_tubes: 'Extensos tubos de lava relevantes para estudos de cavernas lunares e marcianas como abrigo.',
      craters_of_the_moon_idaho: 'A tripulação da Apollo 14 treinou aqui em 1969; seus tubos de lava são estudados como habitats subsuperficiais análogos a Marte.',
      flagstaff_sunset_cinder: 'Campo vulcânico com campos artificiais de crateras usados no treinamento Apollo; sede do Centro de Ciências Astrogeológicas do USGS.',
      teide_tenerife: 'Afloramentos vulcânicos em Tenerife caracterizados com Raman, DRX e espectroscopia como análogos da geologia marciana.',
      svalbard_norway: 'Campanhas árticas (AMASE) testaram instrumentos de Marte e coleta de amostras por rovers em um ambiente frio, vulcânico e de fontes termais.',
      uyuni_bolivia: 'Gigantesco salar cujas salmouras e argilas são comparadas com depósitos de cloretos em Marte.',
      ramon_israel: 'Grande cratera desértica que abriga o habitat D-MARS; local da simulação de Marte AMADEE-20 em 2021.',
      dhofar_oman: 'Região desértica da simulação marciana de quatro semanas AMADEE-18 (2018).',
      pilbara_australia: 'Rochas antigas com estromatólitos visitadas por cientistas da Mars 2020 e ExoMars para aprender a procurar vida primitiva.',
      concordia_dome_c: 'Estação permanente em um platô de gelo usada para pesquisas de fatores humanos sobre isolamento, frio e baixa pressão; sem acesso de meados de fevereiro a meados de novembro.',
      lava_beds_california: 'Tubos de lava acessíveis usados como análogo lunar de tubos de lava (dados NASA TubeX) e estudados quanto à habitabilidade mineral.',
      qaidam_china: 'Bacia alta, fria e árida com yardangs, dunas e crostas salinas apresentada como análogo de Marte e usada na seleção de análogos baseada em similaridade.',
      erfoud_morocco: 'Região do Saara marroquino da simulação marciana MARS2013 de 2013.'
    }
  };

  const BODY_REF_TRANSLATIONS = {
    es: {
      mars: {
        label: 'Marte (referencia global)',
        items: {
          atmospheric_pressure: '0.636 kPa en promedio (0.40 a 0.87 kPa según la estación)',
          mean_annual_temperature: 'alrededor de -63 °C (210 K) de media',
          daily_temperature_range: 'oscilación de unos 58 °C (184–242 K) en el sitio de aterrizaje de Viking 1'
        }
      },
      moon: {
        label: 'Luna (referencia ecuatorial)',
        items: {
          atmospheric_pressure: 'unos 3e-13 kPa de noche (3e-15 bar): prácticamente un vacío',
          extreme_min_temperature: 'alrededor de -178 °C (95 K) de noche en el ecuador',
          extreme_max_temperature: 'alrededor de +117 °C (390 K) de día en el ecuador',
          daily_temperature_range: 'oscilación de unos 295 °C entre la noche y el día lunares en el ecuador'
        }
      }
    },
    'pt-BR': {
      mars: {
        label: 'Marte (referência global)',
        items: {
          atmospheric_pressure: '0.636 kPa em média (0.40 a 0.87 kPa conforme a estação)',
          mean_annual_temperature: 'cerca de -63 °C (210 K) em média',
          daily_temperature_range: 'variação de cerca de 58 °C (184–242 K) no local de pouso da Viking 1'
        }
      },
      moon: {
        label: 'Lua (referência equatorial)',
        items: {
          atmospheric_pressure: 'cerca de 3e-13 kPa à noite (3e-15 bar): praticamente vácuo',
          extreme_min_temperature: 'cerca de -178 °C (95 K) à noite no equador',
          extreme_max_temperature: 'cerca de +117 °C (390 K) de dia no equador',
          daily_temperature_range: 'variação de cerca de 295 °C entre a noite e o dia lunares no equador'
        }
      }
    }
  };

  const UNIVERSAL_LIMITS = {
    es: {
      'Earth gravity is 1 g, versus about 0.17 g on the Moon and 0.38 g on Mars.': 'La gravedad terrestre es de 1 g, frente a unos 0.17 g en la Luna y 0.38 g en Marte.',
      'Ionizing radiation and vacuum cannot be reproduced; no Earth site has the lunar or Martian radiation environment.': 'No se pueden reproducir la radiación ionizante ni el vacío; ningún sitio terrestre tiene el entorno de radiación lunar o marciano.',
      'No Earth site reaches the low pressure of Mars or the lunar vacuum; thin air at altitude is only a partial analog.': 'Ningún sitio de la Tierra alcanza la baja presión de Marte ni el vacío lunar; el aire tenue en altitud es solo un análogo parcial.'
    },
    'pt-BR': {
      'Earth gravity is 1 g, versus about 0.17 g on the Moon and 0.38 g on Mars.': 'A gravidade da Terra é 1 g, contra cerca de 0,17 g na Lua e 0,38 g em Marte.',
      'Ionizing radiation and vacuum cannot be reproduced; no Earth site has the lunar or Martian radiation environment.': 'Não é possível reproduzir radiação ionizante nem vácuo; nenhum local na Terra tem o ambiente de radiação lunar ou marciano.',
      'No Earth site reaches the low pressure of Mars or the lunar vacuum; thin air at altitude is only a partial analog.': 'Nenhum local na Terra atinge a baixa pressão de Marte ou o vácuo lunar; o ar rarefeito em grande altitude é apenas um análogo parcial.'
    }
  };

  // --- TRANSLATION HELPERS ---
  function formatTemplate(str, vars) {
    if (!vars || typeof str !== 'string') return str;
    return str.replace(/\{([a-zA-Z0-9_]+)\}/g, (match, key) => {
      return vars[key] !== undefined ? String(vars[key]) : match;
    });
  }

  function t(key, vars, langOverride) {
    const lang = langOverride ? normalizeLang(langOverride) : activeLang;
    const dict = UI[lang] || UI.en;
    const raw = dict[key] !== undefined ? dict[key] : (UI.en[key] !== undefined ? UI.en[key] : key);
    return formatTemplate(raw, vars);
  }

  function tBody(bodyId, langOverride) {
    const lang = langOverride ? normalizeLang(langOverride) : activeLang;
    return (BODIES[lang] && BODIES[lang][bodyId]) || BODIES.en[bodyId] || bodyId;
  }

  function tGroup(groupId, langOverride) {
    const lang = langOverride ? normalizeLang(langOverride) : activeLang;
    return (GROUPS[lang] && GROUPS[lang][groupId]) || GROUPS.en[groupId] || String(groupId || '').replace(/_/g, ' ');
  }

  function tEnvType(type, langOverride) {
    if (!type) {
      const lang = langOverride ? normalizeLang(langOverride) : activeLang;
      if (lang === 'es') return 'Análogo geológico';
      if (lang === 'pt-BR') return 'Análogo geológico';
      return 'Geological analog';
    }
    const lang = langOverride ? normalizeLang(langOverride) : activeLang;
    if (ENV_TYPES[lang] && ENV_TYPES[lang][type]) return ENV_TYPES[lang][type];
    if (ENV_TYPES.en[type]) return ENV_TYPES.en[type];
    const clean = String(type).replace(/_/g, ' ');
    return clean.charAt(0).toUpperCase() + clean.slice(1);
  }

  function tUnit(unit, langOverride) {
    if (!unit) return '';
    const lang = langOverride ? normalizeLang(langOverride) : activeLang;
    return (UNITS[lang] && UNITS[lang][unit]) || unit;
  }

  function tTarget(target, field) {
    if (!target) return '';
    const lang = activeLang;
    const tr = TARGETS[lang] && TARGETS[lang][target.id];
    return (tr && tr[field]) || target[field] || '';
  }

  function tProfile(profile, field) {
    if (!profile) return '';
    const tr = PROFILES[activeLang] && PROFILES[activeLang][profile.id];
    return (tr && tr[field]) || profile[field] || '';
  }

  function tParam(param, field) {
    if (!param) return '';
    const tr = PARAMETERS[activeLang] && PARAMETERS[activeLang][param.id];
    if (field === 'unit') return tUnit(param.unit || '');
    return (tr && tr[field] !== undefined) ? tr[field] : (param[field] || '');
  }

  function tCountry(country) {
    if (!country) return '';
    return (COUNTRIES[activeLang] && COUNTRIES[activeLang][country]) || country;
  }

  function tRegion(region) {
    if (!region) return '';
    return (REGIONS[activeLang] && REGIONS[activeLang][region]) || region;
  }

  function tSiteSummary(site) {
    if (!site) return '';
    const map = SITE_SUMMARIES[activeLang];
    if (map && map[site.id]) return map[site.id];
    if (
      activeLang !== 'en' &&
      site.summary === 'Climate-only candidate from the global scan. No literature source yet; climate values come from a coarse NASA POWER grid cell, so check local data before using it.'
    ) {
      return CLIMATE_ONLY_SUMMARIES[activeLang] || site.summary;
    }
    return site.summary || '';
  }

  const SHARED_ACCESS_NOTES = {
    es: {
      'Remote polar location: expedition-level logistics (general knowledge, not verified for this exact point).':
        'Ubicación polar remota: logística de nivel de expedición (conocimiento general, no verificado para este punto exacto).'
    },
    'pt-BR': {
      'Remote polar location: expedition-level logistics (general knowledge, not verified for this exact point).':
        'Localização polar remota: logística em nível de expedição (conhecimento geral, não verificado para este ponto exato).'
    }
  };

  function tAccessNote(site) {
    if (!site || !site.flags || !site.flags.access_note) return '';
    const map = ACCESS_NOTES[activeLang];
    if (map && map[site.id]) return map[site.id];
    const shared = SHARED_ACCESS_NOTES[activeLang];
    if (shared && shared[site.flags.access_note]) return shared[site.flags.access_note];
    return site.flags.access_note;
  }

  function tUniversalLimit(limitText) {
    if (!limitText) return '';
    const map = UNIVERSAL_LIMITS[activeLang];
    if (map && map[limitText]) return map[limitText];
    // Could also match an analog_limitation string from parameters
    return limitText;
  }

  function tParamLimitation(paramDef) {
    if (!paramDef) return '';
    const tr = PARAMETERS[activeLang] && PARAMETERS[activeLang][paramDef.id];
    return (tr && tr.analog_limitation) || paramDef.analog_limitation || '';
  }

  function tUseCaseLabel(tag, labelsMap, langOverride) {
    const lang = langOverride ? normalizeLang(langOverride) : activeLang;
    const dict = USE_CASE_LABELS[lang];
    if (dict && dict[tag]) return dict[tag];
    if (labelsMap && labelsMap[tag]) return labelsMap[tag];
    return String(tag || '').replace(/_/g, ' ');
  }

  function tExplorationValue(site, langOverride) {
    if (!site || !site.exploration_use) return '';
    const lang = langOverride ? normalizeLang(langOverride) : activeLang;
    const dict = EXPLORATION_VALUES[lang];
    return (dict && dict[site.id]) || site.exploration_use.exploration_value || '';
  }

  function tBodyRefLabel(bodyId, bodyRef, langOverride) {
    const lang = langOverride ? normalizeLang(langOverride) : activeLang;
    const tr = BODY_REF_TRANSLATIONS[lang] && BODY_REF_TRANSLATIONS[lang][bodyId];
    return (tr && tr.label) || (bodyRef && bodyRef.label) || tBody(bodyId, lang);
  }

  function tBodyRefItemText(bodyId, paramId, item, langOverride) {
    const lang = langOverride ? normalizeLang(langOverride) : activeLang;
    const tr = BODY_REF_TRANSLATIONS[lang] && BODY_REF_TRANSLATIONS[lang][bodyId];
    if (tr && tr.items && tr.items[paramId]) return tr.items[paramId];
    return (item && item.text) || '';
  }

  function formatGapDiffValue(absVal) {
    const rounded = Math.round(absVal * 10) / 10;
    return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
  }

  function formatAnalogyGap(bodyId, paramId, siteVal, refVal, langOverride) {
    const lang = langOverride ? normalizeLang(langOverride) : activeLang;
    const bodyName = tBody(bodyId, lang);
    const bodyEs = bodyId === 'moon' ? `la ${bodyName}` : bodyName;
    const bodyPt = bodyId === 'moon' ? `a ${bodyName}` : bodyName;
    const bodyDePt = bodyId === 'moon' ? `da ${bodyName}` : `de ${bodyName}`;

    if (paramId === 'atmospheric_pressure') {
      if (bodyId === 'moon') {
        if (lang === 'es') return 'La Luna es prácticamente un vacío';
        if (lang === 'pt-BR') return 'A Lua é praticamente um vácuo';
        return 'The Moon is effectively a vacuum';
      }
      const ratioRaw = refVal > 0 ? siteVal / refVal : 0;
      const ratioStr = ratioRaw >= 10
        ? String(Math.round(ratioRaw))
        : (Math.round(ratioRaw * 10) / 10).toString();
      if (lang === 'es') return `La presión del sitio es ${ratioStr} veces la de ${bodyEs}`;
      if (lang === 'pt-BR') return `A pressão do local é ${ratioStr} vezes a ${bodyDePt}`;
      return `The site's pressure is ${ratioStr} times ${bodyName}`;
    }

    const diff = siteVal - refVal;
    const absDiff = Math.abs(diff);
    const diffStr = formatGapDiffValue(absDiff);

    if (paramId === 'daily_temperature_range') {
      if (Math.abs(diff) < 0.05) {
        if (lang === 'es') return `Misma oscilación diaria que ${bodyEs}`;
        if (lang === 'pt-BR') return `Mesma variação diária que ${bodyPt}`;
        return `Matches ${bodyName}'s daily swing`;
      }
      if (diff < 0) {
        if (lang === 'es') return `${diffStr} °C menos de oscilación diaria que ${bodyEs}`;
        if (lang === 'pt-BR') return `${diffStr} °C menor variação diária do que ${bodyPt}`;
        return `${diffStr} °C smaller daily swing than ${bodyName}`;
      }
      if (lang === 'es') return `${diffStr} °C más de oscilación diaria que ${bodyEs}`;
      if (lang === 'pt-BR') return `${diffStr} °C maior variação diária do que ${bodyPt}`;
      return `${diffStr} °C wider daily swing than ${bodyName}`;
    }

    // Standard temperature difference (mean_annual_temperature, extreme_min_temperature, extreme_max_temperature)
    if (Math.abs(diff) < 0.05) {
      if (lang === 'es') return `Igual que la referencia de ${bodyEs}`;
      if (lang === 'pt-BR') return `Igual à referência ${bodyDePt}`;
      return `Matches ${bodyName} reference`;
    }
    if (diff > 0) {
      if (lang === 'es') return `${diffStr} °C más cálido que ${bodyEs}`;
      if (lang === 'pt-BR') return `${diffStr} °C mais quente que ${bodyPt}`;
      return `${diffStr} °C warmer than ${bodyName}`;
    }
    if (lang === 'es') return `${diffStr} °C más frío que ${bodyEs}`;
    if (lang === 'pt-BR') return `${diffStr} °C mais frio que ${bodyPt}`;
    return `${diffStr} °C colder than ${bodyName}`;
  }

  function formatExtremeStatement(paramId, paramName, isLower, pctValue, langOverride) {
    const lang = langOverride ? normalizeLang(langOverride) : activeLang;
    if (lang === 'es') {
      if (isLower) {
        switch (paramId) {
          case 'mean_annual_temperature': return `Más frío que el ${pctValue}% de los sitios`;
          case 'annual_precipitation': return `Más seco que el ${pctValue}% de los sitios`;
          case 'atmospheric_pressure': return `Menor presión atmosférica que el ${pctValue}% de los sitios`;
          case 'altitude': return `Menor elevación que el ${pctValue}% de los sitios`;
          case 'daily_temperature_range': return `Temperatura diaria más estable que el ${pctValue}% de los sitios`;
          case 'extreme_min_temperature': return `Mínimas invernales más frías que el ${pctValue}% de los sitios`;
          case 'extreme_max_temperature': return `Máximas estivales más suaves que el ${pctValue}% de los sitios`;
          case 'solar_irradiance': return `Menor irradiancia solar que el ${pctValue}% de los sitios`;
          case 'uv_radiation': return `Menor radiación UV que el ${pctValue}% de los sitios`;
          case 'mean_wind_speed': return `Vientos más calmados que el ${pctValue}% de los sitios`;
          case 'relative_humidity': return `Menor humedad relativa que el ${pctValue}% de los sitios`;
          case 'water_vapor_pressure': return `Aire más seco (menor presión de vapor) que el ${pctValue}% de los sitios`;
          default: return `Menor ${String(paramName || '').toLowerCase()} que el ${pctValue}% de los sitios`;
        }
      } else {
        switch (paramId) {
          case 'mean_annual_temperature': return `Más cálido que el ${pctValue}% de los sitios`;
          case 'annual_precipitation': return `Más húmedo que el ${pctValue}% de los sitios`;
          case 'atmospheric_pressure': return `Mayor presión atmosférica que el ${pctValue}% de los sitios`;
          case 'altitude': return `Mayor elevación que el ${pctValue}% de los sitios`;
          case 'daily_temperature_range': return `Mayor oscilación térmica diaria que el ${pctValue}% de los sitios`;
          case 'extreme_min_temperature': return `Mínimas invernales más suaves que el ${pctValue}% de los sitios`;
          case 'extreme_max_temperature': return `Máximas estivales más cálidas que el ${pctValue}% de los sitios`;
          case 'solar_irradiance': return `Más soleado (mayor irradiancia solar) que el ${pctValue}% de los sitios`;
          case 'uv_radiation': return `Mayor radiación UV que el ${pctValue}% de los sitios`;
          case 'mean_wind_speed': return `Más ventoso que el ${pctValue}% de los sitios`;
          case 'relative_humidity': return `Mayor humedad relativa que el ${pctValue}% de los sitios`;
          case 'water_vapor_pressure': return `Aire más húmedo (mayor presión de vapor) que el ${pctValue}% de los sitios`;
          default: return `Mayor ${String(paramName || '').toLowerCase()} que el ${pctValue}% de los sitios`;
        }
      }
    }

    if (lang === 'pt-BR') {
      if (isLower) {
        switch (paramId) {
          case 'mean_annual_temperature': return `Mais frio que ${pctValue}% dos locais`;
          case 'annual_precipitation': return `Mais seco que ${pctValue}% dos locais`;
          case 'atmospheric_pressure': return `Menor pressão atmosférica que ${pctValue}% dos locais`;
          case 'altitude': return `Menor altitude que ${pctValue}% dos locais`;
          case 'daily_temperature_range': return `Temperatura diária mais estável que ${pctValue}% dos locais`;
          case 'extreme_min_temperature': return `Mínimas de inverno mais frias que ${pctValue}% dos locais`;
          case 'extreme_max_temperature': return `Máximas de verão mais amenas que ${pctValue}% dos locais`;
          case 'solar_irradiance': return `Menor irradiância solar que ${pctValue}% dos locais`;
          case 'uv_radiation': return `Menor radiação UV que ${pctValue}% dos locais`;
          case 'mean_wind_speed': return `Ventos mais calmos que ${pctValue}% dos locais`;
          case 'relative_humidity': return `Menor umidade relativa que ${pctValue}% dos locais`;
          case 'water_vapor_pressure': return `Ar mais seco (menor pressão de vapor) que ${pctValue}% dos locais`;
          default: return `Menor ${String(paramName || '').toLowerCase()} que ${pctValue}% dos locais`;
        }
      } else {
        switch (paramId) {
          case 'mean_annual_temperature': return `Mais quente que ${pctValue}% dos locais`;
          case 'annual_precipitation': return `Mais úmido que ${pctValue}% dos locais`;
          case 'atmospheric_pressure': return `Maior pressão atmosférica que ${pctValue}% dos locais`;
          case 'altitude': return `Maior altitude que ${pctValue}% dos locais`;
          case 'daily_temperature_range': return `Maior variação térmica diária que ${pctValue}% dos locais`;
          case 'extreme_min_temperature': return `Mínimas de inverno mais amenas que ${pctValue}% dos locais`;
          case 'extreme_max_temperature': return `Máximas de verão mais quentes que ${pctValue}% dos locais`;
          case 'solar_irradiance': return `Mais ensolarado (maior irradiância solar) que ${pctValue}% dos locais`;
          case 'uv_radiation': return `Maior radiação UV que ${pctValue}% dos locais`;
          case 'mean_wind_speed': return `Mais ventoso que ${pctValue}% dos locais`;
          case 'relative_humidity': return `Maior umidade relativa que ${pctValue}% dos locais`;
          case 'water_vapor_pressure': return `Ar mais úmido (maior pressão de vapor) que ${pctValue}% dos locais`;
          default: return `Maior ${String(paramName || '').toLowerCase()} que ${pctValue}% dos locais`;
        }
      }
    }

    // English default
    if (isLower) {
      switch (paramId) {
        case 'mean_annual_temperature': return `Colder than ${pctValue}% of the sites`;
        case 'annual_precipitation': return `Drier than ${pctValue}% of the sites`;
        case 'atmospheric_pressure': return `Lower atmospheric pressure than ${pctValue}% of the sites`;
        case 'altitude': return `Lower elevation than ${pctValue}% of the sites`;
        case 'daily_temperature_range': return `More stable daily temperature than ${pctValue}% of the sites`;
        case 'extreme_min_temperature': return `Colder winter lows than ${pctValue}% of the sites`;
        case 'extreme_max_temperature': return `Milder summer highs than ${pctValue}% of the sites`;
        case 'solar_irradiance': return `Lower solar irradiance than ${pctValue}% of the sites`;
        case 'uv_radiation': return `Lower UV radiation than ${pctValue}% of the sites`;
        case 'mean_wind_speed': return `Calmer winds than ${pctValue}% of the sites`;
        case 'relative_humidity': return `Lower relative humidity than ${pctValue}% of the sites`;
        case 'water_vapor_pressure': return `Drier air (lower vapor pressure) than ${pctValue}% of the sites`;
        default: return `Lower ${String(paramName || '').toLowerCase()} than ${pctValue}% of the sites`;
      }
    }
    switch (paramId) {
      case 'mean_annual_temperature': return `Warmer than ${pctValue}% of the sites`;
      case 'annual_precipitation': return `Wetter than ${pctValue}% of the sites`;
      case 'atmospheric_pressure': return `Higher atmospheric pressure than ${pctValue}% of the sites`;
      case 'altitude': return `Higher elevation than ${pctValue}% of the sites`;
      case 'daily_temperature_range': return `Wider daily temperature swing than ${pctValue}% of the sites`;
      case 'extreme_min_temperature': return `Milder winter lows than ${pctValue}% of the sites`;
      case 'extreme_max_temperature': return `Hotter summer highs than ${pctValue}% of the sites`;
      case 'solar_irradiance': return `Sunnier (higher solar irradiance) than ${pctValue}% of the sites`;
      case 'uv_radiation': return `Higher UV radiation than ${pctValue}% of the sites`;
      case 'mean_wind_speed': return `Windier than ${pctValue}% of the sites`;
      case 'relative_humidity': return `Higher relative humidity than ${pctValue}% of the sites`;
      case 'water_vapor_pressure': return `More humid air (higher vapor pressure) than ${pctValue}% of the sites`;
      default: return `Higher ${String(paramName || '').toLowerCase()} than ${pctValue}% of the sites`;
    }
  }

  function applyDomTranslations(rootDoc) {
    const doc = rootDoc || (typeof document !== 'undefined' ? document : null);
    if (!doc) return;

    const meta = LANG_META[activeLang] || LANG_META.en;
    if (doc.documentElement) {
      doc.documentElement.setAttribute('lang', meta.htmlLang);
    }

    // Plain text elements
    doc.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) el.textContent = t(key);
    });

    // HTML elements (preserve inline formatting & dynamic spans)
    doc.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      if (!key) return;
      const vars = {};
      // Preserve existing counts if embedded before re-translation
      const dataParamsCount = doc.getElementById('data-params-count');
      if (dataParamsCount && el.contains(dataParamsCount)) {
        vars.count = dataParamsCount.textContent || '29';
      }
      const scanInlineEl = el.querySelector('.scan-count-inline');
      if (scanInlineEl) {
        vars.count = scanInlineEl.textContent || '61';
      }
      const docCountEl = doc.getElementById('method-doc-count');
      const allCountEl = doc.getElementById('method-all-count');
      const scanCountEl = doc.getElementById('method-scan-count');
      if (docCountEl && el.contains(docCountEl)) vars.docCount = docCountEl.textContent || '23';
      if (allCountEl && el.contains(allCountEl)) vars.allCount = allCountEl.textContent || '89';
      if (scanCountEl && el.contains(scanCountEl)) vars.scanCount = scanCountEl.textContent || '61';
      const mh = doc.getElementById('mult-high');
      const mm = doc.getElementById('mult-med');
      const ml = doc.getElementById('mult-low');
      if (mh && el.contains(mh)) vars.high = mh.textContent || '1.0';
      if (mm && el.contains(mm)) vars.med = mm.textContent || '0.8';
      if (ml && el.contains(ml)) vars.low = ml.textContent || '0.5';

      el.innerHTML = t(key, vars);
    });

    // Attributes (aria-label, title, content on meta tags)
    doc.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria');
      if (key) el.setAttribute('aria-label', t(key));
    });
    doc.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (key) el.setAttribute('title', t(key));
    });

    // Page title & meta description
    const pageTitleKey = doc.body && doc.body.getAttribute('data-i18n-page-title');
    if (pageTitleKey) {
      doc.title = t(pageTitleKey);
      const ogTitle = doc.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', doc.title);
    }
    const pageDescKey = doc.body && doc.body.getAttribute('data-i18n-page-desc');
    if (pageDescKey) {
      const translatedDesc = t(pageDescKey);
      const metaDesc = doc.querySelector('meta[name="description"]');
      const ogDesc = doc.querySelector('meta[property="og:description"]');
      if (metaDesc) metaDesc.setAttribute('content', translatedDesc);
      if (ogDesc) ogDesc.setAttribute('content', translatedDesc);
    }

    // Update language dropdown trigger and menu state
    const btn = doc.getElementById('lang-toggle-btn');
    if (btn) {
      const codeSpan = btn.querySelector('.lang-code');
      if (codeSpan) codeSpan.textContent = meta.name;
      btn.setAttribute('title', t('lang.buttonTitle'));
      btn.setAttribute('aria-label', t('lang.buttonAria'));
      btn.setAttribute('data-lang', activeLang);
    }
    const langMenu = doc.getElementById('lang-dropdown-menu');
    if (langMenu) {
      langMenu.setAttribute('aria-label', t('lang.menuAria'));
      langMenu.querySelectorAll('.lang-option[data-lang]').forEach(opt => {
        const isCurrent = opt.getAttribute('data-lang') === activeLang;
        opt.classList.toggle('active', isCurrent);
        opt.setAttribute('aria-checked', isCurrent ? 'true' : 'false');
      });
    }
  }

  function setLang(lang, opts) {
    const next = normalizeLang(lang);
    activeLang = next;
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.setItem(STORAGE_KEY, next);
      }
    } catch (_err) {
      // Ignore storage errors
    }

    if (typeof document !== 'undefined') {
      applyDomTranslations(document);
      if (!opts || !opts.silent) {
        try {
          document.dispatchEvent(new CustomEvent('speculum:langchange', { detail: { lang: next } }));
        } catch (_err) {
          // Fallback if CustomEvent unavailable
        }
      }
    }
    return next;
  }

  function cycleLang() {
    return setLang(getNextLang(activeLang));
  }

  function getLang() {
    return activeLang;
  }

  return {
    DEFAULT_LANG,
    SUPPORTED_LANGS,
    LANG_META,
    UI,
    normalizeLang,
    getNextLang,
    getLang,
    setLang,
    cycleLang,
    t,
    tBody,
    tGroup,
    tEnvType,
    tUnit,
    tTarget,
    tProfile,
    tParam,
    tCountry,
    tRegion,
    tSiteSummary,
    tAccessNote,
    tUniversalLimit,
    tParamLimitation,
    tUseCaseLabel,
    tExplorationValue,
    tBodyRefLabel,
    tBodyRefItemText,
    formatAnalogyGap,
    formatExtremeStatement,
    applyDomTranslations
  };
});
