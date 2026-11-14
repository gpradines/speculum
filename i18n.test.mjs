import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const i18n = require('./i18n.js');

function loadAnalogData() {
  const ctx = { window: {} };
  vm.runInNewContext(fs.readFileSync(new URL('./analog_data.js', import.meta.url), 'utf8'), ctx);
  return ctx.window.ANALOG_DATA;
}

test('default language is English, clears stale localStorage, and uses sessionStorage', () => {
  assert.equal(i18n.DEFAULT_LANG, 'en');
  assert.equal(i18n.getLang(), 'en');
  assert.equal(i18n.getNextLang('en'), 'es');
  assert.equal(i18n.getNextLang('es'), 'pt-BR');
  assert.equal(i18n.getNextLang('pt-BR'), 'en');
  assert.equal(i18n.normalizeLang('pt-br'), 'pt-BR');
  assert.equal(i18n.normalizeLang('unknown'), 'en');

  // Verify fresh load in simulated browser clears stale localStorage and starts in English
  const localStore = new Map([['speculum_lang', 'es']]);
  const sessionStore = new Map();
  const ctx = {
    window: {
      localStorage: {
        getItem: k => localStore.get(k) || null,
        setItem: (k, v) => localStore.set(k, v),
        removeItem: k => localStore.delete(k)
      },
      sessionStorage: {
        getItem: k => sessionStore.get(k) || null,
        setItem: (k, v) => sessionStore.set(k, v),
        removeItem: k => sessionStore.delete(k)
      }
    }
  };
  ctx.globalThis = ctx;
  vm.runInNewContext(fs.readFileSync(new URL('./i18n.js', import.meta.url), 'utf8'), ctx);
  assert.equal(ctx.window.SpeculumI18n.getLang(), 'en');
  assert.equal(localStore.has('speculum_lang'), false);

  ctx.window.SpeculumI18n.setLang('pt-BR', { silent: true });
  assert.equal(sessionStore.get('speculum_lang'), 'pt-BR');
});

test('all UI keys exist across en, es, and pt-BR with matching placeholders', () => {
  const enKeys = Object.keys(i18n.UI.en);
  const placeholderRe = /\{[a-zA-Z0-9_]+\}/g;

  for (const lang of ['es', 'pt-BR']) {
    for (const key of enKeys) {
      assert.ok(
        typeof i18n.UI[lang][key] === 'string' && i18n.UI[lang][key].length > 0,
        `Missing or empty translation for ${lang}.${key}`
      );
      const enPlaceholders = (i18n.UI.en[key].match(placeholderRe) || []).sort();
      const trPlaceholders = (i18n.UI[lang][key].match(placeholderRe) || []).sort();
      assert.deepEqual(
        trPlaceholders,
        enPlaceholders,
        `Placeholder mismatch for ${lang}.${key}`
      );
    }
  }
});

test('all analog_data.js entities have complete ES and PT-BR translations', () => {
  const data = loadAnalogData();

  for (const lang of ['es', 'pt-BR']) {
    i18n.setLang(lang, { silent: true });

    for (const target of data.targets) {
      assert.notEqual(i18n.tTarget(target, 'label'), target.label, `Missing target label (${lang}) for ${target.id}`);
      assert.notEqual(i18n.tTarget(target, 'description'), target.description, `Missing target desc (${lang}) for ${target.id}`);
    }

    for (const profile of data.profiles) {
      assert.notEqual(i18n.tProfile(profile, 'name'), profile.name, `Missing profile name (${lang}) for ${profile.id}`);
      assert.notEqual(i18n.tProfile(profile, 'description'), profile.description, `Missing profile desc (${lang}) for ${profile.id}`);
    }

    for (const param of data.parameters) {
      if (!(lang === 'pt-BR' && param.id === 'altitude')) {
        assert.notEqual(i18n.tParam(param, 'name'), param.name, `Missing param name (${lang}) for ${param.id}`);
      }
      assert.notEqual(i18n.tParam(param, 'description'), param.description, `Missing param desc (${lang}) for ${param.id}`);
    }

    for (const site of data.sites) {
      assert.notEqual(i18n.tSiteSummary(site), site.summary, `Missing summary (${lang}) for ${site.id}`);
      if (site.flags && site.flags.access_note) {
        assert.notEqual(i18n.tAccessNote(site), site.flags.access_note, `Missing access note (${lang}) for ${site.id}`);
      }
      if (site.exploration_use) {
        assert.notEqual(
          i18n.tExplorationValue(site),
          site.exploration_use.exploration_value,
          `Missing exploration_value (${lang}) for ${site.id}`
        );
      }
      assert.ok(i18n.tEnvType(site.environment_type).length > 0);
    }

    for (const [tag, label] of Object.entries(data.use_case_labels || {})) {
      assert.notEqual(i18n.tUseCaseLabel(tag, data.use_case_labels), label, `Missing use_case_label (${lang}) for ${tag}`);
    }

    for (const [bodyId, bodyRef] of Object.entries(data.body_references || {})) {
      assert.notEqual(i18n.tBodyRefLabel(bodyId, bodyRef), bodyRef.label, `Missing body_ref label (${lang}) for ${bodyId}`);
      for (const item of bodyRef.items) {
        assert.notEqual(
          i18n.tBodyRefItemText(bodyId, item.parameter_id, item),
          item.text,
          `Missing body_ref item text (${lang}) for ${bodyId}.${item.parameter_id}`
        );
      }
    }

    for (const limit of data.universal_limits) {
      assert.notEqual(i18n.tUniversalLimit(limit), limit, `Missing universal limit (${lang})`);
    }
  }

  // Restore default
  i18n.setLang('en', { silent: true });
});

test('extreme statements format properly in all three languages', () => {
  for (const lang of i18n.SUPPORTED_LANGS) {
    const colder = i18n.formatExtremeStatement('mean_annual_temperature', 'Temp', true, 82, lang);
    const warmer = i18n.formatExtremeStatement('mean_annual_temperature', 'Temp', false, 90, lang);
    assert.ok(colder.includes('82%'));
    assert.ok(warmer.includes('90%'));
  }
});

test('target labels preserve Europa instead of Europe', () => {
  const data = loadAnalogData();
  const europa = data.targets.find(t => t.id === 'europa_ice_shell');
  assert.ok(europa);
  i18n.setLang('en', { silent: true });
  assert.equal(i18n.tTarget(europa, 'label'), 'Europa · ice shell');
});

function loadBrowserRuntime() {
  const sandbox = {
    window: {
      location: { pathname: '/map.html', search: '' },
      addEventListener: () => {}
    },
    document: {
      readyState: 'complete',
      addEventListener: () => {},
      querySelector: () => null,
      querySelectorAll: () => [],
      getElementById: () => null
    },
    console
  };
  sandbox.globalThis = sandbox;
  vm.runInNewContext(fs.readFileSync(new URL('./analog_data.js', import.meta.url), 'utf8'), sandbox);
  vm.runInNewContext(fs.readFileSync(new URL('./i18n.js', import.meta.url), 'utf8'), sandbox);
  vm.runInNewContext(fs.readFileSync(new URL('./app.js', import.meta.url), 'utf8'), sandbox);
  return {
    data: sandbox.window.ANALOG_DATA,
    i18n: sandbox.window.SpeculumI18n,
    app: sandbox.window.Speculum
  };
}

test('getSiteExplorationUse resolves tags, exploration_value, and sources', () => {
  const { data, i18n: rtI18n, app } = loadBrowserRuntime();
  const mdrs = data.sites.find(s => s.id === 'mdrs_utah');
  const climateOnly = data.sites.find(s => s.evidence_level === 'climate_only');
  assert.ok(mdrs && climateOnly);

  rtI18n.setLang('en', { silent: true });
  const euEn = app.getSiteExplorationUse(mdrs, data);
  assert.ok(euEn);
  assert.deepEqual(Array.from(euEn.tags.map(t => t.label)), ['Habitat and crew operations', 'Geology and minerals']);
  assert.deepEqual(Array.from(euEn.sourceIds), ['S021', 'S022', 'S023']);
  assert.match(euEn.explorationValue, /Mars Society habitat/);

  rtI18n.setLang('pt-BR', { silent: true });
  const euPt = app.getSiteExplorationUse(mdrs, data);
  assert.deepEqual(Array.from(euPt.tags.map(t => t.label)), ['Operações de habitat e tripulação', 'Geologia e minerais']);

  assert.equal(app.getSiteExplorationUse(climateOnly, data), null);
});

test('computeAnalogyGaps computes Mars pressure ratios, Moon vacuum, degree diffs, citations, and gravity', () => {
  const { data, i18n: rtI18n, app } = loadBrowserRuntime();
  rtI18n.setLang('en', { silent: true });

  const haughton = data.sites.find(s => s.id === 'haughton_devon');
  const gaps = app.computeAnalogyGaps(haughton, data);
  assert.match(gaps.gravityLine, /0\.17 g.*Moon.*0\.38 g.*Mars/);
  assert.deepEqual(Array.from(gaps.bodies.map(b => b.bodyId)), ['mars', 'moon']);

  const marsBlock = gaps.bodies.find(b => b.bodyId === 'mars');
  assert.equal(marsBlock.sourceId, 'S055');
  const marsPress = marsBlock.items.find(it => it.parameterId === 'atmospheric_pressure');
  assert.equal(marsPress.gapText, "The site's pressure is 156 times Mars");
  const marsTemp = marsBlock.items.find(it => it.parameterId === 'mean_annual_temperature');
  assert.equal(marsTemp.gapText, '47 °C warmer than Mars');

  const moonBlock = gaps.bodies.find(b => b.bodyId === 'moon');
  assert.equal(moonBlock.sourceId, 'S056');
  const moonPress = moonBlock.items.find(it => it.parameterId === 'atmospheric_pressure');
  assert.match(moonPress.gapText, /effectively a vacuum/i);
  const moonMax = moonBlock.items.find(it => it.parameterId === 'extreme_max_temperature');
  assert.equal(moonMax.gapText, '100.2 °C colder than Moon');

  // Target override matching only one body (used in Finder)
  const finderMoonOnly = app.computeAnalogyGaps(haughton, data, ['moon']);
  assert.deepEqual(Array.from(finderMoonOnly.bodies.map(b => b.bodyId)), ['moon']);

  // Site with only daily_temperature_range matches 1 item cleanly
  const hiseas = data.sites.find(s => s.id === 'hiseas_mauna_loa');
  const hiseasMars = app.computeAnalogyGaps(hiseas, data, ['mars']);
  assert.equal(hiseasMars.bodies[0].items.length, 1);
  assert.equal(hiseasMars.bodies[0].items[0].parameterId, 'daily_temperature_range');
  assert.equal(hiseasMars.bodies[0].items[0].gapText, '43.3 °C smaller daily swing than Mars');

  // Language switch produces translated gaps and gravity line
  rtI18n.setLang('es', { silent: true });
  const gapsEs = app.computeAnalogyGaps(haughton, data, ['moon']);
  assert.match(gapsEs.gravityLine, /gravedad terrestre/i);
  assert.match(gapsEs.bodies[0].items[0].gapText, /prácticamente un vacío/i);
});

test('methods.html challenge-coverage table has all 8 dimensions and valid i18n keys', () => {
  const html = fs.readFileSync(new URL('./methods.html', import.meta.url), 'utf8');
  assert.match(html, /id="challenge-coverage"/);
  assert.match(html, /id="challenge-coverage-table"/);

  const expectedKeys = [
    'methods.covTitle',
    'methods.dimGeology',
    'methods.dimTerrain',
    'methods.dimTemp',
    'methods.dimWater',
    'methods.dimDust',
    'methods.dimBio',
    'methods.dimCaves',
    'methods.dimOps'
  ];
  for (const key of expectedKeys) {
    assert.ok(html.includes(`data-i18n="${key}"`), `Missing ${key} on methods.html`);
    for (const lang of i18n.SUPPORTED_LANGS) {
      assert.ok(
        typeof i18n.UI[lang][key] === 'string' && i18n.UI[lang][key].length > 0,
        `Missing ${lang}.${key} translation`
      );
    }
  }
});

test('all HTML pages reference relative favicon.svg for GitHub Pages compatibility', () => {
  const rootFav = fs.readFileSync(new URL('./favicon.svg', import.meta.url), 'utf8');
  const pubFav = fs.readFileSync(new URL('./public/favicon.svg', import.meta.url), 'utf8');
  assert.equal(rootFav, pubFav);
  assert.match(rootFav, /<svg/);

  for (const page of ['index.html', 'map.html', 'finder.html', 'methods.html']) {
    const html = fs.readFileSync(new URL(`./${page}`, import.meta.url), 'utf8');
    assert.ok(html.includes('href="favicon.svg"'), `Missing relative favicon.svg link in ${page}`);
    assert.equal(html.includes('href="/favicon.svg"'), false, `Found root-absolute /favicon.svg in ${page}`);
  }
});

test('speculum-logo.svg contains both globe and SPECULUM wordmark cleanly', () => {
  const rootLogo = fs.readFileSync(new URL('./speculum-logo.svg', import.meta.url), 'utf8');
  const pubLogo = fs.readFileSync(new URL('./public/speculum-logo.svg', import.meta.url), 'utf8');
  assert.equal(rootLogo, pubLogo);
  assert.match(rootLogo, /<svg\b/);
  assert.match(rootLogo, /speculum-logo-planet-clip/);
  assert.match(rootLogo, /class="wordmark"/);
  assert.match(rootLogo, /class="planet-ring-front"/);
});

test('analog_data v4 has 89 sites: 23 documented and 61 discovery scan candidates', () => {
  const data = loadAnalogData();
  assert.equal(data.meta.version, 'v4');
  assert.equal(data.sites.length, 89);

  const documented = data.sites.filter(s => s.evidence_level === 'documented');
  const discovery = data.sites.filter(s => s.discovery === true);
  assert.equal(documented.length, 23);
  assert.equal(discovery.length, 61);

  for (const s of discovery) {
    assert.equal(s.evidence_level, 'climate_only');
    assert.deepEqual(Array.from(s.simulated_targets || []), []);
    assert.equal(s.exploration_use, undefined);
  }
});

test('Finder rankAnalogSites splits into Documented analogs (top 5 Tier A) and Discovery candidates (top 5 discovery) in full pool', () => {
  const { data, app } = loadBrowserRuntime();

  // Default: documented only (23 sites)
  const docOnly = app.rankAnalogSites(data, 'mars_equatorial', 'wheeled_rover', {
    includeClimateOnly: false
  });
  assert.equal(docOnly.poolSize, 23);
  assert.equal(docOnly.isDiscoverySplit, false);

  // With climate-only enabled: full pool (89 sites), split sections
  const splitMars = app.rankAnalogSites(data, 'mars_equatorial', 'wheeled_rover', {
    includeClimateOnly: true
  });
  assert.equal(splitMars.poolSize, 89);
  assert.equal(splitMars.isDiscoverySplit, true);
  assert.equal(splitMars.documentedAnalogs.length, 5);
  assert.ok(splitMars.documentedAnalogs.every(r => r.tier === 'A'));
  assert.equal(splitMars.discoveryCandidates.length, 5);
  assert.ok(splitMars.discoveryCandidates.every(r => r.siteDef.discovery === true));

  // Verify discovery candidates are sorted descending by score
  for (let i = 1; i < splitMars.discoveryCandidates.length; i++) {
    assert.ok(
      splitMars.discoveryCandidates[i - 1].score >= splitMars.discoveryCandidates[i].score,
      'Discovery candidates not sorted descending by score'
    );
  }

  // Europa has 0 Tier A analogs but 5 discovery candidates when climate-only is enabled
  const splitEuropa = app.rankAnalogSites(data, 'europa_ice_shell', 'wheeled_rover', {
    includeClimateOnly: true
  });
  assert.equal(splitEuropa.poolSize, 89);
  assert.equal(splitEuropa.isDiscoverySplit, true);
  assert.equal(splitEuropa.documentedAnalogs.length, 0);
  assert.equal(splitEuropa.discoveryCandidates.length, 5);
  assert.ok(splitEuropa.discoveryCandidates.every(r => r.siteDef.discovery === true));
});

test('Home, Methods, Map, and Finder pages include required v4 Global scan and discovery markup', () => {
  const indexHtml = fs.readFileSync(new URL('./index.html', import.meta.url), 'utf8');
  assert.match(indexHtml, /id="stat-documented"/);
  assert.match(indexHtml, /id="stat-scan-candidates"/);
  assert.match(indexHtml, /data-i18n="globalScan\.title"/);
  assert.match(indexHtml, /data-i18n-html="globalScan\.body"/);

  const methodsHtml = fs.readFileSync(new URL('./methods.html', import.meta.url), 'utf8');
  assert.match(methodsHtml, /id="methods-hero-doc-count"/);
  assert.match(methodsHtml, /id="methods-hero-scan-count"/);
  assert.match(methodsHtml, /data-i18n="globalScan\.title"/);
  assert.match(methodsHtml, /data-i18n-html="globalScan\.body"/);

  const mapHtml = fs.readFileSync(new URL('./map.html', import.meta.url), 'utf8');
  assert.match(mapHtml, /badge-discovery-candidate/);
  assert.match(mapHtml, /marker-discovery/);
  assert.match(mapHtml, /const isDiscovery = Boolean\(site\.discovery\)/);

  const finderHtml = fs.readFileSync(new URL('./finder.html', import.meta.url), 'utf8');
  assert.match(finderHtml, /finder\.sectionDocTitle/);
  assert.match(finderHtml, /finder\.sectionDiscoveryKicker/);
  assert.match(finderHtml, /finder\.sectionDiscoveryTitle/);

  assert.equal(
    i18n.UI.en['map.panelDiscoveryBadge'],
    'Discovery candidate from the global scan: climate data only, no literature yet'
  );
  assert.equal(i18n.UI.en['finder.sectionDocTitle'], 'Documented analogs');
  assert.equal(i18n.UI.en['finder.sectionDiscoveryKicker'], 'Discovery candidates from the global scan');
  assert.equal(i18n.UI.en['finder.sectionDiscoveryTitle'], 'Hypotheses to validate, not recommendations');
  assert.equal(i18n.UI.en['globalScan.title'], 'Global scan');
});


