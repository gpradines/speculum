/**
 * AnalogFinder - Shared Application Engine & Helpers
 * Plain vanilla JavaScript. No framework, no build step, no fetch for analog data.
 * Loads window.ANALOG_DATA from analog_data.js.
 */

(function () {
  'use strict';

  // --- 0. I18N BRIDGE ---
  function getI18n() {
    return typeof window !== 'undefined' && window.SpeculumI18n ? window.SpeculumI18n : null;
  }

  function tr(key, vars, fallback) {
    const i18n = getI18n();
    if (i18n && typeof i18n.t === 'function') {
      return i18n.t(key, vars);
    }
    return fallback || key;
  }

  // --- 1. DATA ACCESS HELPER ---
  function getAnalogData() {
    if (typeof window !== 'undefined' && window.ANALOG_DATA) {
      return window.ANALOG_DATA;
    }
    console.error('AnalogFinder: window.ANALOG_DATA is not defined. Ensure analog_data.js is loaded prior to app.js.');
    return null;
  }

  // --- 2. PARAMETER FORMATTING HELPER ---
  /**
   * Formats a parameter value with its unit.
   * Handles typical value, min/max ranges, or single bounds.
   * Do not invent data: uses strictly the values from ANALOG_DATA.
   */
  function formatParameterValue(paramDef, paramValue) {
    if (!paramValue) return 'N/A';
    const rawUnit = paramValue.unit || (paramDef ? paramDef.unit : '') || '';
    const i18n = getI18n();
    const unit = i18n && rawUnit ? i18n.tUnit(rawUnit) : rawUnit;
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

  // --- 3. CONFIDENCE BADGE COMPONENT ---
  /**
   * Returns an accessible HTML badge for parameter confidence (high, medium, low).
   */
  function renderConfidenceBadge(confidence) {
    const norm = (confidence || 'low').toLowerCase();
    let label = tr('conf.lowLabel', null, 'Low confidence');
    let title = tr('conf.lowTitle', null, 'Satellite reanalysis or coarse grid cell (multiplier 0.5x)');
    let cssClass = 'badge-conf-low';

    if (norm === 'high') {
      label = tr('conf.highLabel', null, 'High confidence');
      title = tr('conf.highTitle', null, 'Direct ground measurement or published site survey (multiplier 1.0x)');
      cssClass = 'badge-conf-high';
    } else if (norm === 'medium') {
      label = tr('conf.medLabel', null, 'Medium confidence');
      title = tr('conf.medTitle', null, 'Validated NASA POWER climatology (multiplier 0.8x)');
      cssClass = 'badge-conf-medium';
    }

    return `<span class="badge ${cssClass}" title="${escapeHtml(title)}" aria-label="${escapeHtml(label)}: ${escapeHtml(title)}"><span class="badge-dot" aria-hidden="true"></span>${escapeHtml(label)}</span>`;
  }

  // --- 4. SOURCE LINK HELPER ---
  /**
   * Turns a source id such as S013 into a link using the url or doi found in ANALOG_DATA.sources.
   */
  function renderSourceLink(sourceId, sources) {
    if (!sources || !sourceId) return sourceId || '';
    const src = sources.find(s => s.id === sourceId);
    if (!src) return `<span class="source-id">${escapeHtml(sourceId)}</span>`;

    let url = src.url || '';
    if (!url && src.doi) {
      url = `https://doi.org/${encodeURIComponent(src.doi)}`;
    }

    const titleText = `${src.title}${src.year ? ` (${src.year})` : ''}`;

    if (url) {
      return `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="source-link" title="${escapeHtml(titleText)}">${escapeHtml(sourceId)}<span class="ext-icon" aria-hidden="true">↗</span></a>`;
    }

    return `<span class="source-tag" title="${escapeHtml(titleText)}">${escapeHtml(sourceId)}</span>`;
  }

  function getSourceDetail(sourceId, sources) {
    if (!sources || !sourceId) return null;
    return sources.find(s => s.id === sourceId) || null;
  }

  // --- 5. TIER BADGE COMPONENT ---
  function renderTierBadge(tier) {
    if (tier === 'A') {
      const labelA = tr('finder.tierALabel', null, 'Documented analog of this target');
      const titleA = tr('tier.aTitle', null, 'Peer-reviewed literature explicitly documents this site as an analog for this target environment.');
      return `<span class="badge badge-tier-a" title="${escapeHtml(titleA)}"><span class="badge-dot" aria-hidden="true"></span>${escapeHtml(labelA)}</span>`;
    }
    const labelB = tr('finder.tierBLabel', null, 'Similar climate, no documented analog');
    const titleB = tr('tier.bTitle', null, 'Physical and climatological match; not yet formally cataloged in published literature for this target.');
    return `<span class="badge badge-tier-b" title="${escapeHtml(titleB)}"><span class="badge-dot" aria-hidden="true"></span>${escapeHtml(labelB)}</span>`;
  }

  // --- 6. SCORING & RANKING ENGINE ---
  /**
   * Computes exact directional similarity (0..1) for each site with numeric typical values:
   *   rank = (number of smaller values + (number of equal values - 1) / 2) / (n - 1)
   *   if direction === 'higher', sim = rank; if 'lower', sim = 1 - rank.
   */
  function computeDirectionalSimilarities(items, direction) {
    const n = items.length;
    const simMap = {};
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

  function computeSiteWarnings(site, coverage, paramBreakdown) {
    const warnings = [];
    const i18n = getI18n();

    if (coverage < 70) {
      warnings.push({
        type: 'coverage',
        message: tr('warn.coverage', { coverage }, `Coverage is below 70% (${coverage}%): some weighted target parameters lack data at this site.`)
      });
    }

    const rowsUsed = paramBreakdown.length;
    if (rowsUsed > 0) {
      const lowConfRows = paramBreakdown.filter(r => (r.confidence || 'low').toLowerCase() === 'low').length;
      if (lowConfRows * 2 > rowsUsed) {
        warnings.push({
          type: 'confidence',
          message: tr('warn.lowConfMsg', null, 'Climate values for this site come from a coarse global grid, so treat the score as a guide and check local data before planning a test.'),
          tooltip: tr('warn.lowConfTooltip', null, 'High confidence (1.0x): direct ground measurement or published field survey. Medium confidence (0.8x): NASA POWER 25-year climatology matching the site setting reasonably well. Low confidence (0.5x): coarse global grid cell in mountains, islands, polar ice, or where grid elevation differs noticeably from the site.')
        });
      }
    }

    const flags = site.flags || {};
    const rawNote = flags.access_note && String(flags.access_note).trim() !== '' ? flags.access_note : '';
    const note = rawNote && i18n ? i18n.tAccessNote(site) : rawNote;
    const hasAccessNote = Boolean(note);
    const isProtected = Boolean(flags.protected_area);
    if (isProtected && hasAccessNote) {
      warnings.push({
        type: 'access',
        message: tr('warn.protectedWithNote', { note }, `Protected area (permits required). Access note: ${note}`)
      });
    } else if (isProtected) {
      warnings.push({
        type: 'access',
        message: tr('warn.protectedOnly', null, 'Protected area: research permits may be required before field testing.')
      });
    } else if (hasAccessNote) {
      warnings.push({
        type: 'access',
        message: tr('warn.accessOnly', { note }, `Access note: ${note}`)
      });
    }

    return warnings;
  }

  function rankAnalogSites(data, targetId, profileId, options = {}) {
    if (!data) return { results: [], nRanked: 0, poolSize: 0, allWeightsZero: false };
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

    const getWeight = (pid) => {
      if (options.customWeights && options.customWeights[pid] !== undefined) {
        return Number(options.customWeights[pid]);
      }
      if (profile.weights && profile.weights[pid] !== undefined) {
        return Number(profile.weights[pid]);
      }
      return 1;
    };

    // (b) Precompute similarities on pool for active target directions (in_data === true)
    const simByParam = {};
    let activeWeightSum = 0;
    target.directions.forEach(d => {
      const pDef = data.parameters.find(p => p.id === d.parameter_id);
      if (!pDef || !pDef.in_data) return;

      const w = getWeight(d.parameter_id);
      if (w > 0) activeWeightSum += w;

      const vals = [];
      pool.forEach(s => {
        const pv = s.parameters[d.parameter_id];
        if (pv && typeof pv.typical === 'number') {
          vals.push({ siteId: s.id, val: pv.typical });
        }
      });
      simByParam[d.parameter_id] = computeDirectionalSimilarities(vals, d.direction);
    });
    const allWeightsZero = activeWeightSum <= 0;

    // Total weight across all target parameters
    let targetTotalWeight = 0;
    target.directions.forEach(d => {
      targetTotalWeight += getWeight(d.parameter_id);
    });

    // (c)-(d) Score every site in pool
    const scoredPool = pool.map(site => {
      let weightedSimSum = 0;
      let effectiveWeightSum = 0;
      let sitePresentWeight = 0;
      const paramBreakdown = [];

      target.directions.forEach(d => {
        const pid = d.parameter_id;
        const w = getWeight(pid);
        if (w <= 0) return;

        const pDef = data.parameters.find(p => p.id === pid);
        if (!pDef || !pDef.in_data) return;

        const pv = site.parameters[pid];
        if (!pv || !simByParam[pid] || simByParam[pid][site.id] === undefined) {
          return;
        }

        const sim = simByParam[pid][site.id];
        const confStr = pv.confidence || 'low';
        const m = confMult[confStr] !== undefined ? confMult[confStr] : 0.5;

        weightedSimSum += w * m * sim;
        effectiveWeightSum += w * m;
        sitePresentWeight += w;

        const i18n = getI18n();
        const translatedName = i18n ? i18n.tParam(pDef, 'name') : (pDef.name || pid);
        const translatedUnit = i18n ? i18n.tParam(pDef, 'unit') : (pDef.unit || '');

        paramBreakdown.push({
          parameterId: pid,
          name: translatedName || pid,
          valueStr: formatParameterValue(pDef, pv),
          rawVal: pv.typical,
          unit: translatedUnit,
          sim,
          percentileScore: Number((sim * 100).toFixed(1)),
          weight: w,
          confidence: confStr,
          multiplier: m,
          direction: d.direction
        });
      });

      const score = effectiveWeightSum > 0
        ? Number(((100 * weightedSimSum) / effectiveWeightSum).toFixed(1))
        : 0;

      const coverage = targetTotalWeight > 0
        ? Math.round((100 * sitePresentWeight) / targetTotalWeight)
        : 0;

      const isTierA = Array.isArray(site.simulated_targets) && site.simulated_targets.includes(target.id);
      const tier = isTierA ? 'A' : 'B';
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

  function escapeCsvCell(val) {
    const s = val === null || val === undefined ? '' : String(val);
    if (/[",\n\r]/.test(s)) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  }

  function formatResultsCsv(results, targetLabel, profileName) {
    const i18n = getI18n();
    const headers = [
      tr('csv.rank', null, 'Rank'),
      tr('csv.siteId', null, 'Site ID'),
      tr('csv.siteName', null, 'Site Name'),
      tr('csv.country', null, 'Country'),
      tr('csv.region', null, 'Region'),
      tr('csv.tier', null, 'Tier'),
      tr('csv.tierLabel', null, 'Tier Label'),
      tr('csv.score', null, 'Score'),
      tr('csv.coverage', null, 'Coverage (%)'),
      tr('csv.evidence', null, 'Evidence Level'),
      tr('csv.station', null, 'Support Station'),
      tr('csv.protected', null, 'Protected Area'),
      tr('csv.accessNote', null, 'Access Note'),
      tr('csv.warnings', null, 'Warnings'),
      tr('csv.target', null, 'Target'),
      tr('csv.profile', null, 'Profile')
    ];

    const yesStr = tr('csv.yes', null, 'Yes');
    const noStr = tr('csv.no', null, 'No');

    const rows = results.map((item, idx) => {
      const s = item.siteDef;
      const f = s.flags || {};
      const tierLabel = item.tier === 'A'
        ? tr('finder.tierALabel', null, 'Documented analog of this target')
        : tr('finder.tierBLabel', null, 'Similar climate, no documented analog');
      const warnText = (item.warnings || []).map(w => w.message).join(' | ');
      const countryStr = i18n ? i18n.tCountry(s.country) : s.country;
      const regionStr = s.region ? (i18n ? i18n.tRegion(s.region) : s.region) : '';
      const accessStr = f.access_note ? (i18n ? i18n.tAccessNote(s) : f.access_note) : '';
      return [
        idx + 1,
        s.id,
        s.name,
        countryStr,
        regionStr,
        item.tier,
        tierLabel,
        item.score.toFixed(1),
        item.coverage,
        s.evidence_level,
        f.has_support_station ? yesStr : noStr,
        f.protected_area ? yesStr : noStr,
        accessStr,
        warnText,
        targetLabel,
        profileName
      ].map(escapeCsvCell).join(',');
    });

    return [headers.map(escapeCsvCell).join(','), ...rows].join('\n');
  }

  // --- 7. UTILITY & RULE-BASED STATEMENT FUNCTIONS ---
  function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function getTargetLabel(data, targetId) {
    const t = data.targets.find(x => x.id === targetId);
    if (!t) return targetId;
    const i18n = getI18n();
    return i18n ? i18n.tTarget(t, 'label') : (t.label || t.name);
  }

  function formatEnvironmentType(type) {
    const i18n = getI18n();
    if (i18n) return i18n.tEnvType(type);
    if (!type) return 'Geological analog';
    const text = type.replace(/_/g, ' ');
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  /**
   * Rule-based engine: computes site percentile ranks among all sites for each numeric parameter
   * and returns the top 3 most extreme statements (e.g. 'Colder than 82% of the sites' or 'Drier than 90% of the sites').
   */
  function computeSiteExtremeStatements(site, allSites, paramDefs) {
    if (!site || !allSites || !paramDefs) return [];
    const numericParams = paramDefs.filter(p => p.in_data && p.value_type === 'numeric');

    // Build distributions
    const paramValues = {};
    numericParams.forEach(p => {
      paramValues[p.id] = [];
      allSites.forEach(s => {
        const v = s.parameters && s.parameters[p.id];
        if (v && typeof v.typical === 'number') {
          paramValues[p.id].push(v.typical);
        }
      });
      paramValues[p.id].sort((a, b) => a - b);
    });

    const statements = [];
    numericParams.forEach(p => {
      const valObj = site.parameters && site.parameters[p.id];
      if (!valObj || typeof valObj.typical !== 'number') return;
      const arr = paramValues[p.id];
      if (!arr || arr.length === 0) return;

      let below = 0, equal = 0;
      for (const val of arr) {
        if (val < valObj.typical) below++;
        else if (val === valObj.typical) equal++;
      }
      const pct = Math.round(((below + 0.5 * equal) / arr.length) * 100);

      const i18n = getI18n();
      const paramName = i18n ? i18n.tParam(p, 'name') : p.name;
      let text = '', extremity = 0;
      if (pct < 50) {
        const opp = 100 - pct;
        extremity = opp - 50;
        if (i18n) {
          text = i18n.formatExtremeStatement(p.id, paramName, true, opp);
        } else {
          if (p.id === 'mean_annual_temperature') text = `Colder than ${opp}% of the sites`;
          else if (p.id === 'annual_precipitation') text = `Drier than ${opp}% of the sites`;
          else if (p.id === 'atmospheric_pressure') text = `Lower atmospheric pressure than ${opp}% of the sites`;
          else if (p.id === 'altitude') text = `Lower elevation than ${opp}% of the sites`;
          else if (p.id === 'daily_temperature_range') text = `More stable daily temperature than ${opp}% of the sites`;
          else if (p.id === 'extreme_min_temperature') text = `Colder winter lows than ${opp}% of the sites`;
          else if (p.id === 'extreme_max_temperature') text = `Milder summer highs than ${opp}% of the sites`;
          else if (p.id === 'solar_irradiance') text = `Lower solar irradiance than ${opp}% of the sites`;
          else if (p.id === 'uv_radiation') text = `Lower UV radiation than ${opp}% of the sites`;
          else if (p.id === 'mean_wind_speed') text = `Calmer winds than ${opp}% of the sites`;
          else if (p.id === 'relative_humidity') text = `Lower relative humidity than ${opp}% of the sites`;
          else if (p.id === 'water_vapor_pressure') text = `Drier air (lower vapor pressure) than ${opp}% of the sites`;
          else text = `Lower ${p.name.toLowerCase()} than ${opp}% of the sites`;
        }
      } else {
        extremity = pct - 50;
        if (i18n) {
          text = i18n.formatExtremeStatement(p.id, paramName, false, pct);
        } else {
          if (p.id === 'mean_annual_temperature') text = `Warmer than ${pct}% of the sites`;
          else if (p.id === 'annual_precipitation') text = `Wetter than ${pct}% of the sites`;
          else if (p.id === 'atmospheric_pressure') text = `Higher atmospheric pressure than ${pct}% of the sites`;
          else if (p.id === 'altitude') text = `Higher elevation than ${pct}% of the sites`;
          else if (p.id === 'daily_temperature_range') text = `Wider daily temperature swing than ${pct}% of the sites`;
          else if (p.id === 'extreme_min_temperature') text = `Milder winter lows than ${pct}% of the sites`;
          else if (p.id === 'extreme_max_temperature') text = `Hotter summer highs than ${pct}% of the sites`;
          else if (p.id === 'solar_irradiance') text = `Sunnier (higher solar irradiance) than ${pct}% of the sites`;
          else if (p.id === 'uv_radiation') text = `Higher UV radiation than ${pct}% of the sites`;
          else if (p.id === 'mean_wind_speed') text = `Windier than ${pct}% of the sites`;
          else if (p.id === 'relative_humidity') text = `Higher relative humidity than ${pct}% of the sites`;
          else if (p.id === 'water_vapor_pressure') text = `More humid air (higher vapor pressure) than ${pct}% of the sites`;
          else text = `Higher ${p.name.toLowerCase()} than ${pct}% of the sites`;
        }
      }
      statements.push({ paramId: p.id, paramName, pct, extremity, text });
    });

    statements.sort((a, b) => b.extremity - a.extremity);
    return statements.slice(0, 3);
  }

  /**
   * Builds the 'What this site does NOT simulate' list from ANALOG_DATA.universal_limits
   * plus the analog_limitation text of each parameter the site has.
   */
  function getSiteLimitations(site, data) {
    const i18n = getI18n();
    const list = (data.universal_limits || []).map(l => (i18n ? i18n.tUniversalLimit(l) : l));
    const seen = new Set(list.map(s => s.trim().toLowerCase()));
    if (site && site.parameters && data.parameters) {
      Object.keys(site.parameters).forEach(pKey => {
        const pDef = data.parameters.find(p => p.id === pKey);
        if (pDef && pDef.analog_limitation) {
          const text = (i18n ? i18n.tParamLimitation(pDef) : pDef.analog_limitation).trim();
          const norm = text.toLowerCase();
          if (!seen.has(norm)) {
            seen.add(norm);
            list.push(text);
          }
        }
      });
    }
    return list;
  }

  /**
   * Resolves site.exploration_use (use_tags via use_case_labels, exploration_value, source_ids)
   * using active i18n translations when available. Returns null if site lacks exploration_use.
   */
  function getSiteExplorationUse(site, data) {
    if (!site || !site.exploration_use) return null;
    const i18n = getI18n();
    const eu = site.exploration_use;
    const labelsMap = (data && data.use_case_labels) || {};
    const tags = (eu.use_tags || []).map(tag => ({
      id: tag,
      label: i18n
        ? i18n.tUseCaseLabel(tag, labelsMap)
        : (labelsMap[tag] || String(tag).replace(/_/g, ' '))
    }));
    const explorationValue = i18n
      ? i18n.tExplorationValue(site)
      : (eu.exploration_value || '');
    const sourceIds = Array.isArray(eu.source_ids) ? eu.source_ids.slice() : [];
    return {
      tags,
      explorationValue,
      sourceIds
    };
  }

  /**
   * Extracts unique planetary bodies ('moon', 'mars', ...) present in site.simulated_targets
   * prefixes that have an entry in ANALOG_DATA.body_references.
   */
  function getSiteReferenceBodies(site, data) {
    if (!site || !data || !data.body_references) return [];
    const bodies = [];
    (site.simulated_targets || []).forEach(targetId => {
      const prefix = String(targetId || '').split('_')[0];
      if (prefix && data.body_references[prefix] && !bodies.includes(prefix)) {
        bodies.push(prefix);
      }
    });
    return bodies;
  }

  /**
   * Computes 'Where the analogy breaks down' items comparing site measurements against
   * ANALOG_DATA.body_references[body].items, plus the gravity line from ANALOG_DATA.universal_limits.
   */
  function computeAnalogyGaps(site, data, bodiesOverride) {
    const i18n = getI18n();
    const rawGravity = (data && Array.isArray(data.universal_limits) && data.universal_limits[0]) || '';
    const gravityLine = rawGravity ? (i18n ? i18n.tUniversalLimit(rawGravity) : rawGravity) : '';

    if (!site || !data || !data.body_references) {
      return { gravityLine, bodies: [] };
    }

    const bodyIds = Array.isArray(bodiesOverride)
      ? bodiesOverride.filter((b, idx, arr) => Boolean(data.body_references[b]) && arr.indexOf(b) === idx)
      : getSiteReferenceBodies(site, data);

    const bodies = bodyIds.map(bodyId => {
      const bodyRef = data.body_references[bodyId];
      const label = i18n ? i18n.tBodyRefLabel(bodyId, bodyRef) : (bodyRef.label || bodyId);
      const sourceId = bodyRef.source_id || '';
      const items = [];

      (bodyRef.items || []).forEach(item => {
        const pVal = site.parameters && site.parameters[item.parameter_id];
        if (!pVal || typeof pVal.typical !== 'number') return;

        const pDef = (data.parameters || []).find(p => p.id === item.parameter_id) || {
          id: item.parameter_id,
          name: item.parameter_id,
          unit: item.unit || ''
        };
        const parameterName = i18n ? i18n.tParam(pDef, 'name') : (pDef.name || item.parameter_id);
        const siteValueStr = formatParameterValue(pDef, pVal);
        const refText = i18n ? i18n.tBodyRefItemText(bodyId, item.parameter_id, item) : (item.text || '');
        const refValueShort = `${item.value}${item.unit ? ' ' + item.unit : ''}`;

        let gapText = '';
        if (i18n && typeof i18n.formatAnalogyGap === 'function') {
          gapText = i18n.formatAnalogyGap(bodyId, item.parameter_id, pVal.typical, item.value);
        } else if (item.parameter_id === 'atmospheric_pressure') {
          if (bodyId === 'moon') {
            gapText = 'The Moon is effectively a vacuum';
          } else {
            const ratioRaw = item.value > 0 ? pVal.typical / item.value : 0;
            const ratioStr = ratioRaw >= 10 ? String(Math.round(ratioRaw)) : (Math.round(ratioRaw * 10) / 10).toString();
            const bodyName = bodyId.charAt(0).toUpperCase() + bodyId.slice(1);
            gapText = `The site's pressure is ${ratioStr} times ${bodyName}`;
          }
        } else {
          const diff = pVal.typical - item.value;
          const absRounded = Math.round(Math.abs(diff) * 10) / 10;
          const diffStr = Number.isInteger(absRounded) ? String(absRounded) : absRounded.toFixed(1);
          const bodyName = bodyId.charAt(0).toUpperCase() + bodyId.slice(1);
          if (item.parameter_id === 'daily_temperature_range') {
            gapText = diff < 0
              ? `${diffStr} °C smaller daily swing than ${bodyName}`
              : `${diffStr} °C wider daily swing than ${bodyName}`;
          } else {
            gapText = diff > 0
              ? `${diffStr} °C warmer than ${bodyName}`
              : `${diffStr} °C colder than ${bodyName}`;
          }
        }

        items.push({
          parameterId: item.parameter_id,
          parameterName,
          refValue: item.value,
          refUnit: item.unit || '',
          refText,
          refValueShort,
          siteValue: pVal.typical,
          siteValueStr,
          gapText
        });
      });

      return {
        bodyId,
        label,
        sourceId,
        items
      };
    });

    return { gravityLine, bodies };
  }

  // --- 8. GLOBAL NAVIGATION & UI ENHANCEMENTS ---
  function initNavigation() {
    // Highlight current page in navigation
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.site-nav a');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === page || (page === '' && href === 'index.html') || (page === 'index.html' && href === './')) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });

    // Mobile nav toggle
    const mobileBtn = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('.site-nav');
    if (mobileBtn && navMenu) {
      mobileBtn.addEventListener('click', () => {
        const isExpanded = mobileBtn.getAttribute('aria-expanded') === 'true';
        mobileBtn.setAttribute('aria-expanded', (!isExpanded).toString());
        navMenu.classList.toggle('nav-open');
      });
    }

    // Language dropdown menu (beside Methods in navigation)
    const i18n = getI18n();
    const langDropdown = document.getElementById('lang-dropdown');
    const langBtn = document.getElementById('lang-toggle-btn');
    const langMenu = document.getElementById('lang-dropdown-menu');
    if (i18n) {
      i18n.applyDomTranslations(document);
      if (langDropdown && langBtn && langMenu) {
        const setDropdownOpen = isOpen => {
          langMenu.hidden = !isOpen;
          langBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        };

        setDropdownOpen(false);

        langBtn.addEventListener('click', event => {
          event.stopPropagation();
          setDropdownOpen(langMenu.hidden);
        });

        langMenu.querySelectorAll('.lang-option[data-lang]').forEach(option => {
          option.addEventListener('click', () => {
            const selected = option.getAttribute('data-lang');
            if (selected) {
              i18n.setLang(selected);
            }
            setDropdownOpen(false);
          });
        });

        document.addEventListener('click', event => {
          if (!langMenu.hidden && !langDropdown.contains(event.target)) {
            setDropdownOpen(false);
          }
        });

        langDropdown.addEventListener('keydown', event => {
          if (event.key === 'Escape' && !langMenu.hidden) {
            event.preventDefault();
            setDropdownOpen(false);
            langBtn.focus();
            return;
          }
          if (langMenu.hidden) return;
          const options = Array.from(langMenu.querySelectorAll('.lang-option'));
          const idx = options.indexOf(document.activeElement);
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            options[(idx + 1) % options.length].focus();
          } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            options[(idx - 1 + options.length) % options.length].focus();
          }
        });
      }
    }
  }

  // Expose API on window for pages and scripts (Speculum & AnalogFinder for compatibility)
  const api = {
    getData: getAnalogData,
    formatParameterValue,
    renderConfidenceBadge,
    renderSourceLink,
    getSourceDetail,
    renderTierBadge,
    computeSiteWarnings,
    rankAnalogSites,
    formatResultsCsv,
    formatEnvironmentType,
    getTargetLabel,
    computeSiteExtremeStatements,
    getSiteLimitations,
    getSiteExplorationUse,
    getSiteReferenceBodies,
    computeAnalogyGaps,
    escapeHtml,
    initNavigation
  };

  window.Speculum = api;
  window.AnalogFinder = api;

  // Run navigation init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation);
  } else {
    initNavigation();
  }
})();
