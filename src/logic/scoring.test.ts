import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  formatParameterValue,
  getConfidenceBadgeInfo,
  resolveSource,
  rankAnalogSites,
  formatResultsCsv,
  type AnalogData
} from './scoring';

// Load updated analog_data.js and archived analog_data_old.js (used for reference_results_5e67e401.json)
const code = fs.readFileSync(path.resolve('analog_data.js'), 'utf8');
const sandbox: { ANALOG_DATA?: AnalogData } = {};
new Function('window', code)(sandbox);
const data = sandbox.ANALOG_DATA!;

const oldCode = fs.readFileSync(path.resolve('analog_data_old.js'), 'utf8');
const oldSandbox: { ANALOG_DATA?: AnalogData } = {};
new Function('window', oldCode)(oldSandbox);
const oldData = oldSandbox.ANALOG_DATA!;

// Load reference_results_5e67e401.json
const refResults = JSON.parse(
  fs.readFileSync(path.resolve('public/assets/aistudio/reference_results_5e67e401.json'), 'utf8')
);

test('formatParameterValue correctly formats typical, ranges, and units', () => {
  const paramDef = {
    id: 'mean_annual_temperature',
    name: 'Mean annual temperature',
    group: 'climate_atmosphere',
    value_type: 'numeric',
    unit: '°C'
  };

  assert.equal(formatParameterValue(paramDef, { typical: -16, unit: '°C' }), '-16 °C');
  assert.equal(formatParameterValue(paramDef, { typical: 17.07, unit: '°C' }), '17.1 °C');
  assert.equal(formatParameterValue(paramDef, { min: 14.03, max: 19.96, unit: '°C' }), '14.0 – 20.0 °C');
  assert.equal(formatParameterValue(paramDef, { max: 13, unit: 'mm/year' }), '≤ 13 mm/year');
  assert.equal(formatParameterValue(paramDef, undefined), 'N/A');
});

test('getConfidenceBadgeInfo handles high, medium, low', () => {
  const high = getConfidenceBadgeInfo('high');
  assert.equal(high.label, 'High Confidence');
  assert.equal(high.className, 'confidence-high');

  const med = getConfidenceBadgeInfo('medium');
  assert.equal(med.label, 'Medium Confidence');

  const low = getConfidenceBadgeInfo('low');
  assert.equal(low.label, 'Low Confidence');

  const def = getConfidenceBadgeInfo(undefined);
  assert.equal(def.label, 'Low Confidence');
});

test('resolveSource finds doi and url', () => {
  const s013 = resolveSource('S013', data.sources);
  assert.ok(s013);
  assert.equal(s013?.url, 'https://journals.uair.arizona.edu/index.php/maps/article/download/15207/15195');

  const s008 = resolveSource('S008', data.sources);
  assert.ok(s008);
  assert.equal(s008?.doi, '10.1016/j.earscirev.2020.103288');

  const missing = resolveSource('S999', data.sources);
  assert.equal(missing, null);
});

test('rankAnalogSites matches ALL 5 reference test cases identically against analog_data_old.js', () => {
  for (let i = 0; i < refResults.cases.length; i++) {
    const refCase = refResults.cases[i];
    const { results, nRanked } = rankAnalogSites(
      oldData,
      refCase.target,
      refCase.profile,
      { onlyStation: Boolean(refCase.options?.only_station) }
    );

    assert.equal(nRanked, refCase.n_ranked, `Case ${i} n_ranked mismatch`);

    for (let rank = 0; rank < refCase.top5.length; rank++) {
      const expected = refCase.top5[rank];
      const actual = results[rank];

      assert.ok(actual, `Case ${i} missing result at rank ${rank}`);
      assert.equal(actual.site, expected.site, `Case ${i} rank ${rank} site mismatch`);
      assert.equal(actual.score, expected.score, `Case ${i} rank ${rank} score mismatch for ${expected.site}`);
      assert.equal(actual.coverage, expected.coverage, `Case ${i} rank ${rank} coverage mismatch for ${expected.site}`);
      assert.equal(actual.tier, expected.tier, `Case ${i} rank ${rank} tier mismatch for ${expected.site}`);
    }
  }
});

test('logistics filters apply AFTER percentile pool calculation and preserve scores', () => {
  const baseline = rankAnalogSites(data, 'mars_equatorial', 'wheeled_rover');
  const mdrsBaseline = baseline.results.find(r => r.site === 'mdrs_utah');
  assert.ok(mdrsBaseline);

  // Applying onlyStation, excludeProtected, excludeAccessProblems must NOT change mdrs_utah's score!
  const filtered = rankAnalogSites(data, 'mars_equatorial', 'wheeled_rover', {
    onlyStation: true,
    excludeProtected: true,
    excludeAccessProblems: true
  });
  const mdrsFiltered = filtered.results.find(r => r.site === 'mdrs_utah');
  assert.ok(mdrsFiltered);
  assert.equal(mdrsFiltered.score, mdrsBaseline.score);
  assert.equal(mdrsFiltered.coverage, mdrsBaseline.coverage);

  // Verify protected sites and sites with access_note are excluded
  assert.equal(filtered.results.some(r => r.siteDef.flags.protected_area), false);
  assert.equal(filtered.results.some(r => Boolean(r.siteDef.flags.access_note)), false);
  assert.equal(filtered.results.every(r => Boolean(r.siteDef.flags.has_support_station)), true);
});

test('includeClimateOnly adds climate_only sites to the pool', () => {
  const withoutClimate = rankAnalogSites(data, 'mars_equatorial', 'wheeled_rover');
  const withClimate = rankAnalogSites(data, 'mars_equatorial', 'wheeled_rover', {
    includeClimateOnly: true
  });

  assert.equal(withoutClimate.poolSize, 23);
  assert.equal(withClimate.poolSize, 28);
  assert.ok(withClimate.results.some(r => r.siteDef.evidence_level === 'climate_only'));
});

test('customWeights slider values override profile weights and weight 0 skips parameter', () => {
  const res = rankAnalogSites(data, 'mars_equatorial', 'wheeled_rover', {
    customWeights: {
      mean_annual_temperature: 5,
      daily_temperature_range: 0,
      extreme_min_temperature: 0,
      uv_radiation: 0,
      atmospheric_pressure: 0,
      annual_precipitation: 0,
      water_vapor_pressure: 0
    }
  });
  const first = res.results[0];
  assert.equal(first.paramBreakdown.length, 1);
  assert.equal(first.paramBreakdown[0].parameterId, 'mean_annual_temperature');
  assert.equal(first.paramBreakdown[0].weight, 5);
});

test('updated analog_data.js exposes 29 parameters with 12 populated in_data parameters', () => {
  assert.equal(data.parameters.length, 29);
  assert.equal(data.parameters.filter(p => p.in_data).length, 12);
  const res = rankAnalogSites(data, 'mars_equatorial', 'wheeled_rover');
  const mdrs = res.results.find(r => r.site === 'mdrs_utah');
  assert.ok(mdrs);
  assert.equal(mdrs.coverage, 100);
  assert.ok(mdrs.paramBreakdown.some(b => b.parameterId === 'water_vapor_pressure'));
});

test('warnings trigger for coverage < 70%, >50% low confidence, and access/permit notes', () => {
  // hiseas_mauna_loa lacks mean_annual_temperature and atmospheric_pressure -> low coverage on moon_south_pole
  const case3 = rankAnalogSites(data, 'moon_south_pole', 'power_communications');
  const hiseas = case3.results.find(r => r.site === 'hiseas_mauna_loa');
  assert.ok(hiseas);
  assert.ok(hiseas.warnings.some(w => w.type === 'coverage'));

  const concordia = case3.results.find(r => r.site === 'concordia_dome_c');
  assert.ok(concordia);
  assert.ok(concordia.warnings.some(w => w.type === 'access'));

  // haughton_devon has mostly low confidence NASA POWER parameters (> 50%)
  const haughton = case3.results.find(r => r.site === 'haughton_devon');
  assert.ok(haughton);
  const confWarn = haughton.warnings.find(w => w.type === 'confidence');
  assert.ok(confWarn);
  assert.equal(
    confWarn.message,
    'Climate values for this site come from a coarse global grid, so treat the score as a guide and check local data before planning a test.'
  );
  assert.ok(confWarn.tooltip && confWarn.tooltip.includes('Low') && confWarn.tooltip.includes('Medium') && confWarn.tooltip.includes('High'));

  // Verify <= 50% low-confidence rows do NOT trigger confidence warning
  const marsRes = rankAnalogSites(data, 'mars_equatorial', 'wheeled_rover');
  const mdrs = marsRes.results.find(r => r.site === 'mdrs_utah');
  assert.ok(mdrs);
  assert.equal(mdrs.warnings.some(w => w.type === 'confidence'), false);

  // craters_of_the_moon_idaho is a protected area
  const craters = case3.results.find(r => r.site === 'craters_of_the_moon_idaho');
  assert.ok(craters);
  assert.ok(craters.warnings.some(w => w.type === 'access'));
});

test('formatResultsCsv produces valid CSV output', () => {
  const { results } = rankAnalogSites(data, 'mars_equatorial', 'wheeled_rover');
  const csv = formatResultsCsv(results.slice(0, 10), 'Mars · equatorial regions', 'Wheeled rover');
  const lines = csv.split('\n');
  assert.equal(lines.length, 11); // header + 10 rows
  assert.ok(lines[0].includes('Rank,Site ID,Site Name'));
  assert.ok(lines[1].includes('qaidam_china'));
});

test('allWeightsZero is true when all active parameter weights are 0', () => {
  const zeroProfile = {
    id: 'zero_test',
    name: 'Zero test',
    description: 'All weights zero',
    weights: {
      mean_annual_temperature: 0,
      daily_temperature_range: 0,
      extreme_min_temperature: 0,
      uv_radiation: 0,
      atmospheric_pressure: 0,
      annual_precipitation: 0,
      solar_irradiance: 0,
      extreme_max_temperature: 0,
      altitude: 0,
      mean_wind_speed: 0,
      relative_humidity: 0,
      water_vapor_pressure: 0
    },
    default_filters: {}
  };
  const dataWithZero = {
    ...data,
    profiles: [...data.profiles, zeroProfile]
  };

  const res = rankAnalogSites(dataWithZero, 'mars_equatorial', 'zero_test');
  assert.equal(res.allWeightsZero, true);

  const baseline = rankAnalogSites(data, 'mars_equatorial', 'wheeled_rover');
  assert.equal(baseline.allWeightsZero, false);
});

test('filters removing every site return empty results and nRanked 0', () => {
  const noStationData = {
    ...data,
    sites: data.sites.map(s => ({
      ...s,
      flags: { ...s.flags, has_support_station: false }
    }))
  };
  const res = rankAnalogSites(noStationData, 'mars_equatorial', 'wheeled_rover', {
    onlyStation: true
  });
  assert.equal(res.nRanked, 0);
  assert.equal(res.results.length, 0);
});
