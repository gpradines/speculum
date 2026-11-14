/**
 * Pure scoring, formatting, warning, CSV and source helper logic for Speculum.
 * Decoupled from DOM so it runs in both Node.js (for unit tests) and browser (app.js).
 */

export interface ParameterDef {
  id: string;
  name: string;
  group: string;
  value_type: string;
  unit?: string;
  scale?: string;
  use?: string;
  similarity_method?: string | null;
  description?: string;
  analog_limitation?: string;
  in_data?: boolean;
}

export interface ParameterValue {
  typical?: number | string;
  min?: number;
  max?: number;
  unit?: string;
  confidence?: 'high' | 'medium' | 'low';
  source_id?: string;
  condition?: string;
}

export interface SourceDef {
  id: string;
  title: string;
  year?: number;
  url?: string;
  doi?: string;
  access?: string;
}

export interface SiteDef {
  id: string;
  name: string;
  country: string;
  region: string;
  lat: number;
  lon: number;
  coord_precision: string;
  environment_type: string;
  anchor_category: string;
  simulated_targets: string[];
  summary: string;
  source_ids: string[];
  evidence_level: string;
  flags: {
    has_support_station?: boolean;
    protected_area?: boolean;
    access_note?: string | null;
  };
  parameters: Record<string, ParameterValue>;
}

export interface TargetDef {
  id: string;
  body: string;
  name: string;
  description: string;
  label: string;
  directions: Array<{
    parameter_id: string;
    direction: 'lower' | 'higher';
    note?: string;
    source_id?: string;
  }>;
}

export interface ProfileDef {
  id: string;
  name: string;
  description: string;
  weights: Record<string, number>;
  default_filters: Record<string, unknown>;
}

export interface AnalogData {
  meta: {
    project: string;
    version: string;
    generated: string;
    scoring: string;
    confidence_multiplier: Record<string, number>;
    default_eligible: string;
  };
  universal_limits: string[];
  parameters: ParameterDef[];
  targets: TargetDef[];
  profiles: ProfileDef[];
  sites: SiteDef[];
  sources: SourceDef[];
}

export interface ParamBreakdownItem {
  parameterId: string;
  name: string;
  valueStr: string;
  sim: number; // 0..1
  percentileScore: number; // 0..100
  weight: number;
  confidence: string;
  multiplier: number;
  direction: 'lower' | 'higher';
}

export interface SiteWarning {
  type: 'coverage' | 'confidence' | 'access';
  message: string;
  tooltip?: string;
}

export interface RankedSiteResult {
  site: string;
  siteDef: SiteDef;
  score: number;
  coverage: number;
  tier: 'A' | 'B';
  paramBreakdown: ParamBreakdownItem[];
  warnings: SiteWarning[];
}

export interface RankOptions {
  onlyStation?: boolean;
  excludeProtected?: boolean;
  excludeAccessProblems?: boolean;
  includeClimateOnly?: boolean;
  includeAllEvidence?: boolean;
  customWeights?: Record<string, number>;
}

/**
 * Format a parameter value with its unit.
 */
export function formatParameterValue(paramDef: ParameterDef | undefined, paramValue: ParameterValue | undefined): string {
  if (!paramValue) return 'N/A';
  const unit = paramValue.unit || (paramDef ? paramDef.unit : '') || '';
  const u = unit ? ` ${unit}` : '';

  if (paramValue.typical !== undefined && paramValue.typical !== null) {
    const val = typeof paramValue.typical === 'number'
      ? (Number.isInteger(paramValue.typical) ? paramValue.typical.toString() : paramValue.typical.toFixed(1))
      : paramValue.typical;
    return `${val}${u}`;
  }

  if (paramValue.min !== undefined && paramValue.max !== undefined) {
    const minVal = Number.isInteger(paramValue.min) ? paramValue.min : paramValue.min.toFixed(1);
    const maxVal = Number.isInteger(paramValue.max) ? paramValue.max : paramValue.max.toFixed(1);
    return `${minVal} – ${maxVal}${u}`;
  }

  if (paramValue.min !== undefined) {
    const minVal = Number.isInteger(paramValue.min) ? paramValue.min : paramValue.min.toFixed(1);
    return `≥ ${minVal}${u}`;
  }

  if (paramValue.max !== undefined) {
    const maxVal = Number.isInteger(paramValue.max) ? paramValue.max : paramValue.max.toFixed(1);
    return `≤ ${maxVal}${u}`;
  }

  return 'N/A';
}

/**
 * Returns confidence badge data (class & label).
 */
export function getConfidenceBadgeInfo(confidence: string | undefined): { label: string; className: string; description: string } {
  const norm = (confidence || 'low').toLowerCase();
  switch (norm) {
    case 'high':
      return {
        label: 'High Confidence',
        className: 'confidence-high',
        description: 'Direct measurement or peer-reviewed site survey (weight multiplier 1.0x)'
      };
    case 'medium':
      return {
        label: 'Medium Confidence',
        className: 'confidence-medium',
        description: 'Validated climatology dataset or regional measurement (weight multiplier 0.8x)'
      };
    case 'low':
    default:
      return {
        label: 'Low Confidence',
        className: 'confidence-low',
        description: 'Satellite reanalysis or approximate grid cell (weight multiplier 0.5x)'
      };
  }
}

/**
 * Resolves source ID (e.g. S013) to target URL and source metadata.
 */
export function resolveSource(sourceId: string, sources: SourceDef[]): { url: string; title: string; year?: number; access?: string; doi?: string } | null {
  const src = sources.find(s => s.id === sourceId);
  if (!src) return null;
  let targetUrl = src.url || '';
  if (!targetUrl && src.doi) {
    targetUrl = `https://doi.org/${src.doi}`;
  }
  return {
    url: targetUrl,
    title: src.title,
    year: src.year,
    access: src.access,
    doi: src.doi
  };
}

/**
 * Computes exact similarity (0..1) for each site with numeric typical values:
 *   rank = (number of smaller values + (number of equal values - 1) / 2) / (n - 1)
 *   if direction === 'higher', sim = rank; if 'lower', sim = 1 - rank.
 *   If n <= 1, sim = 1.
 */
export function computeDirectionalSimilarities(
  items: Array<{ siteId: string; val: number }>,
  direction: 'lower' | 'higher'
): Record<string, number> {
  const n = items.length;
  const simMap: Record<string, number> = {};
  if (n === 0) return simMap;
  if (n === 1) {
    simMap[items[0].siteId] = 1;
    return simMap;
  }

  const values = items.map(item => item.val).sort((a, b) => a - b);

  for (const item of items) {
    let smaller = 0;
    let equal = 0;
    for (const v of values) {
      if (v < item.val) smaller++;
      else if (v === item.val) equal++;
    }
    const rank = (smaller + (equal - 1) / 2) / (n - 1);
    simMap[item.siteId] = direction === 'higher' ? rank : 1 - rank;
  }

  return simMap;
}

/**
 * Computes warnings for a ranked site result:
 * - coverage < 70%
 * - more than half of the rows used have low confidence
 * - access_note or protected_area flag present
 */
export function computeSiteWarnings(
  site: SiteDef,
  coverage: number,
  paramBreakdown: ParamBreakdownItem[]
): SiteWarning[] {
  const warnings: SiteWarning[] = [];

  if (coverage < 70) {
    warnings.push({
      type: 'coverage',
      message: `Coverage is below 70% (${coverage}%): some weighted target parameters lack data at this site.`
    });
  }

  const rowsUsed = paramBreakdown.length;
  if (rowsUsed > 0) {
    const lowConfRows = paramBreakdown.filter(r => (r.confidence || 'low').toLowerCase() === 'low').length;
    if (lowConfRows * 2 > rowsUsed) {
      warnings.push({
        type: 'confidence',
        message: 'Climate values for this site come from a coarse global grid, so treat the score as a guide and check local data before planning a test.',
        tooltip: 'High confidence (1.0x): direct ground measurement or published field survey. Medium confidence (0.8x): NASA POWER 25-year climatology matching the site setting reasonably well. Low confidence (0.5x): coarse global grid cell in mountains, islands, polar ice, or where grid elevation differs noticeably from the site.'
      });
    }
  }

  const hasAccessNote = Boolean(site.flags && site.flags.access_note && String(site.flags.access_note).trim() !== '');
  const isProtected = Boolean(site.flags && site.flags.protected_area);
  if (isProtected && hasAccessNote) {
    warnings.push({
      type: 'access',
      message: `Protected area (permits required). Access note: ${site.flags.access_note}`
    });
  } else if (isProtected) {
    warnings.push({
      type: 'access',
      message: 'Protected area: research permits may be required before field testing.'
    });
  } else if (hasAccessNote) {
    warnings.push({
      type: 'access',
      message: `Access note: ${site.flags.access_note}`
    });
  }

  return warnings;
}

/**
 * Rank candidate analog sites according to target, profile, custom slider weights, and logistics filters.
 * Pool percentile ranks are ALWAYS computed before logistics filters are applied.
 */
export function rankAnalogSites(
  data: AnalogData,
  targetId: string,
  profileId: string,
  options: RankOptions = {}
): { results: RankedSiteResult[]; nRanked: number; poolSize: number; allWeightsZero: boolean } {
  const target = data.targets.find(t => t.id === targetId);
  const profile = data.profiles.find(p => p.id === profileId);
  if (!target || !profile) {
    return { results: [], nRanked: 0, poolSize: 0, allWeightsZero: false };
  }

  const confMult = data.meta.confidence_multiplier || { high: 1.0, medium: 0.8, low: 0.5 };
  const includeClimateOnly = Boolean(options.includeClimateOnly || options.includeAllEvidence);

  // (a) Pool: documented sites, or all sites when includeClimateOnly is on.
  // Percentile ranks are computed on this pool BEFORE logistics filters.
  const pool = includeClimateOnly
    ? data.sites
    : data.sites.filter(s => s.evidence_level === 'documented');

  const getWeight = (pid: string): number => {
    if (options.customWeights && options.customWeights[pid] !== undefined) {
      return Number(options.customWeights[pid]);
    }
    if (profile.weights && profile.weights[pid] !== undefined) {
      return Number(profile.weights[pid]);
    }
    return 1;
  };

  // Precompute similarities on the pool for each target direction that has data (in_data === true)
  const simByParam: Record<string, Record<string, number>> = {};
  let activeWeightSum = 0;
  for (const d of target.directions) {
    const pDef = data.parameters.find(p => p.id === d.parameter_id);
    if (!pDef || !pDef.in_data) continue;

    const w = getWeight(d.parameter_id);
    if (w > 0) activeWeightSum += w;

    const vals: Array<{ siteId: string; val: number }> = [];
    for (const s of pool) {
      const pv = s.parameters[d.parameter_id];
      if (pv && typeof pv.typical === 'number') {
        vals.push({ siteId: s.id, val: pv.typical });
      }
    }
    simByParam[d.parameter_id] = computeDirectionalSimilarities(vals, d.direction);
  }
  const allWeightsZero = activeWeightSum <= 0;

  // Sum of weights of all the target's parameters (coverage denominator)
  let targetTotalWeight = 0;
  for (const d of target.directions) {
    targetTotalWeight += getWeight(d.parameter_id);
  }

  // Score every site in the pool
  const scoredPool: RankedSiteResult[] = pool.map(site => {
    let weightedSimSum = 0;
    let effectiveWeightSum = 0;
    let sitePresentWeight = 0;
    const paramBreakdown: ParamBreakdownItem[] = [];

    for (const d of target.directions) {
      const pid = d.parameter_id;
      const w = getWeight(pid);
      if (w <= 0) continue; // skip weight 0 silently

      const pDef = data.parameters.find(p => p.id === pid);
      if (!pDef || !pDef.in_data) continue; // skip in_data false silently

      const pv = site.parameters[pid];
      if (!pv || !simByParam[pid] || simByParam[pid][site.id] === undefined) {
        continue;
      }

      const sim = simByParam[pid][site.id];
      const confStr = pv.confidence || 'low';
      const m = confMult[confStr] !== undefined ? confMult[confStr] : 0.5;

      weightedSimSum += w * m * sim;
      effectiveWeightSum += w * m;
      sitePresentWeight += w;

      paramBreakdown.push({
        parameterId: pid,
        name: pDef.name || pid,
        valueStr: formatParameterValue(pDef, pv),
        sim,
        percentileScore: Number((sim * 100).toFixed(1)),
        weight: w,
        confidence: confStr,
        multiplier: m,
        direction: d.direction
      });
    }

    const score = effectiveWeightSum > 0
      ? Number(((100 * weightedSimSum) / effectiveWeightSum).toFixed(1))
      : 0;

    const coverage = targetTotalWeight > 0
      ? Math.round((100 * sitePresentWeight) / targetTotalWeight)
      : 0;

    const isTierA = Array.isArray(site.simulated_targets) && site.simulated_targets.includes(target.id);
    const tier: 'A' | 'B' = isTierA ? 'A' : 'B';
    const warnings = computeSiteWarnings(site, coverage, paramBreakdown);

    return {
      site: site.id,
      siteDef: site,
      score,
      coverage,
      tier,
      paramBreakdown,
      warnings
    };
  });

  // (e) After scoring, apply logistics filters to hide sites
  const filtered = scoredPool.filter(item => {
    const flags = item.siteDef.flags || {};
    if (options.onlyStation && !flags.has_support_station) {
      return false;
    }
    if (options.excludeProtected && flags.protected_area) {
      return false;
    }
    if (options.excludeAccessProblems && flags.access_note && String(flags.access_note).trim() !== '') {
      return false;
    }
    return true;
  });

  // (f) Sort: Tier A first, then Tier B, each tier by score descending
  filtered.sort((a, b) => {
    if (a.tier !== b.tier) {
      return a.tier === 'A' ? -1 : 1;
    }
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return b.coverage - a.coverage;
  });

  return {
    results: filtered,
    nRanked: filtered.length,
    poolSize: pool.length,
    allWeightsZero
  };
}

function escapeCsvCell(val: string | number | boolean | null | undefined): string {
  const s = val === null || val === undefined ? '' : String(val);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/**
 * Generates CSV string for ranked results.
 */
export function formatResultsCsv(
  results: RankedSiteResult[],
  targetLabel: string,
  profileName: string
): string {
  const headers = [
    'Rank',
    'Site ID',
    'Site Name',
    'Country',
    'Region',
    'Tier',
    'Tier Label',
    'Score',
    'Coverage (%)',
    'Evidence Level',
    'Support Station',
    'Protected Area',
    'Access Note',
    'Warnings',
    'Target',
    'Profile'
  ];

  const rows = results.map((item, idx) => {
    const s = item.siteDef;
    const f = s.flags || {};
    const tierLabel = item.tier === 'A'
      ? 'Documented analog of this target'
      : 'Similar climate, no documented analog';
    const warnText = item.warnings.map(w => w.message).join(' | ');
    return [
      idx + 1,
      s.id,
      s.name,
      s.country,
      s.region || '',
      item.tier,
      tierLabel,
      item.score.toFixed(1),
      item.coverage,
      s.evidence_level,
      f.has_support_station ? 'Yes' : 'No',
      f.protected_area ? 'Yes' : 'No',
      f.access_note || '',
      warnText,
      targetLabel,
      profileName
    ].map(escapeCsvCell).join(',');
  });

  return [headers.map(escapeCsvCell).join(','), ...rows].join('\n');
}
