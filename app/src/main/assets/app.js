(() => {
  "use strict";

  const STORAGE_KEY = "samirApartmentsV1";
  const SETTINGS_KEY = "samirApartmentsSettingsV1";

  const CHECKLIST = [
    {
      id: "estrutura",
      title: "Estado do imóvel",
      items: [
        ["infiltracao_teto", "Infiltração / umidade", 1.5],
        ["infiltracao_banheiro", "Umidade entre banheiro e quartos", 1.5],
        ["trincas", "Trincas / rachaduras", 1.5],
        ["pisos", "Piso geral", 1.2],
        ["revestimentos", "Azulejos ocos / soltos", 1.3],
        ["madeira", "Taco / madeira", 1.3],
        ["cupim", "Cupim", 1.5],
        ["pintura", "Pintura / acabamento", 1.0],
        ["armarios", "Armários embutidos", 1.1]
      ]
    },
    {
      id: "portas_janelas",
      title: "Portas e janelas",
      items: [
        ["porta_entrada", "Porta de entrada / fechadura", 1.2],
        ["portas_internas", "Portas internas", 1.0],
        ["janela_sala", "Janela da sala", 1.1],
        ["janelas_quartos", "Janelas dos quartos", 1.1],
        ["esquadrias", "Esquadrias", 1.1],
        ["vidros", "Vidros / persianas / venezianas", 1.0]
      ]
    },
    {
      id: "hidraulica",
      title: "Água e banheiros",
      items: [
        ["pressao", "Pressão da água", 1.5],
        ["chuveiro", "Chuveiro", 1.5],
        ["torneiras", "Torneiras", 1.3],
        ["descargas", "Descargas", 1.3],
        ["ralos", "Ralos / escoamento", 1.4],
        ["sob_pias", "Vazamento sob pias", 1.5],
        ["registros", "Registros", 1.2],
        ["aquecimento", "Aquecimento / gás", 1.2]
      ]
    },
    {
      id: "eletrica",
      title: "Elétrica",
      items: [
        ["quadro", "Quadro de luz", 1.5],
        ["tomadas_sala_quartos", "Tomadas sala / quartos", 1.3],
        ["tomadas_cozinha", "Tomadas cozinha / serviço", 1.4],
        ["interruptores", "Interruptores / iluminação", 1.2],
        ["circuitos_potencia", "Chuveiro / forno / alta potência", 1.5],
        ["ar_condicionado", "Pontos para ar-condicionado", 1.1],
        ["fiacao_reforma", "Fiação / reforma elétrica", 1.3]
      ]
    },
    {
      id: "conforto",
      title: "Conforto",
      items: [
        ["sol", "Sol / posição solar", 1.0],
        ["ventilacao", "Ventilação", 1.0],
        ["mofo_odores", "Mofo / cheiro de umidade", 1.5],
        ["esgoto_odores", "Cheiro de esgoto", 1.4],
        ["ruido_fechado", "Isolamento com janelas fechadas", 1.2],
        ["ruido_predio", "Barulho interno do prédio", 1.2],
        ["privacidade", "Privacidade / vista", 1.0]
      ]
    },
    {
      id: "local",
      title: "Bairro e rotina",
      items: [
        ["ruido_dia", "Barulho durante o dia", 1.2],
        ["ruido_noite", "Barulho à noite", 1.4],
        ["bairro_dia", "Bairro durante o dia", 1.0],
        ["bairro_noite", "Bairro à noite", 1.4],
        ["iluminacao_rua", "Iluminação da rua à noite", 1.2],
        ["movimento_noturno", "Movimento / comércio à noite", 1.0],
        ["seguranca_entorno", "Segurança no entorno", 1.5],
        ["metro_acesso", "Caminho até o metrô", 1.3]
      ]
    },
    {
      id: "condominio",
      title: "Condomínio e garagem",
      items: [
        ["portaria_24h", "Portaria 24 horas", 1.4],
        ["seguranca", "Câmeras / acesso / eclusa", 1.3],
        ["elevadores", "Elevadores", 1.2],
        ["fachada", "Fachada / corredores / hall", 1.1],
        ["garagem", "Vaga de garagem", 1.3],
        ["manobra", "Facilidade de manobra", 1.2],
        ["portoes", "Portões", 1.2],
        ["areas_comuns", "Áreas comuns", 1.0],
        ["acessibilidade", "Acessibilidade", 1.0]
      ]
    },
    {
      id: "financeiro_documental",
      title: "Condomínio e documentos",
      items: [
        ["condominio_valor", "Condomínio confirmado", 1.3],
        ["taxa_extra", "Taxa extra", 1.5],
        ["obras_aprovadas", "Obras aprovadas", 1.5],
        ["regras", "Regras do condomínio", 1.1],
        ["pets", "Regras para pets", 1.0],
        ["debitos", "Débitos a conferir", 1.5],
        ["matricula", "Matrícula / ônus", 1.5]
      ]
    }
  ];

  const STATUS = {
    unseen: { label: "Não verificado", value: null },
    good: { label: "Bom", value: 2 },
    attention: { label: "Atenção", value: 1 },
    bad: { label: "Ruim", value: 0 },
    na: { label: "N/A", value: null }
  };

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const els = {
    form: $("#propertyForm"),
    checklistRoot: $("#checklistRoot"),
    toast: $("#toast"),
    savedCount: $("#savedCount"),
    savedList: $("#savedList"),
    savedDashboard: $("#savedDashboard"),
    comparisonList: $("#comparisonList"),
    compareDashboard: $("#compareDashboard"),
    visitTitle: $("#visitTitle"),
    autoSaveStatus: $("#autoSaveStatus"),
    heroScore: $("#heroScore"),
    heroProgress: $("#heroProgress"),
    checkDone: $("#checkDone"),
    checkTotal: $("#checkTotal"),
    effectiveCost: $("#effectiveCost"),
    monthlyCost: $("#monthlyCost"),
    priceM2: $("#priceM2"),
    distanceWork: $("#distanceWork"),
    durationWork: $("#durationWork"),
    nearestMetro: $("#nearestMetro"),
    metroDistance: $("#metroDistance"),
    finalScore: $("#finalScore"),
    scoreTechnical: $("#scoreTechnical"),
    scoreLocation: $("#scoreLocation"),
    scoreFinancial: $("#scoreFinancial"),
    summaryTitle: $("#summaryTitle"),
    scoreRing: $("#scoreRing"),
    printArea: $("#printArea")
  };

  let state = {
    properties: loadProperties(),
    currentId: null,
    draft: null,
    saveTimer: null
  };

  function uid() {
    return (crypto?.randomUUID?.() || `apt-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  }

  function defaultChecklist() {
    const out = {};
    CHECKLIST.forEach(group => group.items.forEach(([id]) => {
      out[id] = { status: "unseen", note: "" };
    }));
    return out;
  }

  function emptyProperty() {
    const settings = loadSettings();
    return {
      id: uid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      name: "",
      address: "",
      city: "São Paulo - SP",
      floor: "",
      realtor: "",
      listingUrl: "",
      price: "",
      condo: "",
      iptu: "",
      renovation: "",
      area: "",
      bedrooms: "",
      bathrooms: "",
      parking: "",
      workAddress: settings.workAddress || "",
      distanceKm: null,
      durationMin: null,
      propertyCoord: null,
      workCoord: null,
      nearestMetro: "",
      metroKm: null,
      metroManual: "",
      manualCommute: "",
      pros: "",
      cons: "",
      generalNotes: "",
      favorite: false,
      checklist: defaultChecklist()
    };
  }

  function isAndroidApp() {
    return typeof window.AndroidApp !== "undefined";
  }

  function loadProperties() {
    try {
      let raw = null;
      if (isAndroidApp() && typeof AndroidApp.loadState === "function") {
        raw = AndroidApp.loadState();
      }
      if (!raw) raw = localStorage.getItem(STORAGE_KEY) || "[]";
      const arr = JSON.parse(raw);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.isArray(arr) ? arr : []));
      return Array.isArray(arr) ? arr : [];
    } catch (err) {
      console.error("Falha ao carregar dados locais", err);
      return [];
    }
  }

  function loadSettings() {
    try {
      let raw = null;
      if (isAndroidApp() && typeof AndroidApp.loadSettings === "function") {
        raw = AndroidApp.loadSettings();
      }
      if (!raw) raw = localStorage.getItem(SETTINGS_KEY) || "{}";
      const data = JSON.parse(raw) || {};
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(data));
      return data;
    } catch { return {}; }
  }

  function saveSettings(data) {
    const raw = JSON.stringify(data || {});
    localStorage.setItem(SETTINGS_KEY, raw);
    if (isAndroidApp() && typeof AndroidApp.saveSettings === "function") {
      try { AndroidApp.saveSettings(raw); } catch (err) { console.error(err); }
    }
  }

  function persistAll() {
    const raw = JSON.stringify(state.properties);
    localStorage.setItem(STORAGE_KEY, raw);
    if (isAndroidApp() && typeof AndroidApp.saveState === "function") {
      try { AndroidApp.saveState(raw); } catch (err) { console.error("Falha no espelho Android", err); }
    }
  }

  function toast(message) {
    els.toast.textContent = message;
    els.toast.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => els.toast.classList.remove("show"), 2400);
  }

  function parseNum(value) {
    if (typeof value === "number") return Number.isFinite(value) ? value : 0;
    const s = String(value || "").trim().replace(/\s/g, "");
    if (!s) return 0;
    if (s.includes(",") && s.includes(".")) return Number(s.replace(/\./g, "").replace(",", ".")) || 0;
    if (s.includes(",")) return Number(s.replace(",", ".")) || 0;
    return Number(s) || 0;
  }

  function brl(value) {
    const n = parseNum(value);
    if (!n && n !== 0) return "—";
    return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
  }

  function num(value, digits = 1) {
    if (value == null || Number.isNaN(Number(value))) return "—";
    return Number(value).toLocaleString("pt-BR", { minimumFractionDigits: digits, maximumFractionDigits: digits });
  }

  function esc(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

  function renderChecklist() {
    els.checklistRoot.innerHTML = CHECKLIST.map((group, idx) => `
      <details class="check-group" data-group="${group.id}" ${idx === 0 ? "open" : ""}>
        <summary>
          <span>${esc(group.title)}</span>
          <span class="group-progress" id="group-${group.id}">0/${group.items.length}</span>
        </summary>
        <div class="check-items">
          ${group.items.map(([id, title, weight]) => `
            <div class="check-item" data-item="${id}">
              <div class="check-item-head">
                <div class="check-item-title">${esc(title)}</div>
                ${weight >= 1.5 ? '<span class="critical">CRÍTICO</span>' : ""}
              </div>
              <div class="status-row" role="group" aria-label="${esc(title)}">
                <button type="button" class="status-btn" data-status="good">✓ OK</button>
                <button type="button" class="status-btn" data-status="attention">! Atenção</button>
                <button type="button" class="status-btn" data-status="bad">× Ruim</button>
                <button type="button" class="status-btn" data-status="na">N/A</button>
              </div>
              <input class="item-note" data-note="${id}" type="text" placeholder="Observação" />
            </div>
          `).join("")}
        </div>
      </details>
    `).join("");
    els.checkTotal.textContent = CHECKLIST.reduce((n, g) => n + g.items.length, 0);
  }

  function formFields() {
    return [
      "name","address","city","floor","realtor","listingUrl","price","condo","iptu","renovation",
      "area","bedrooms","bathrooms","parking","workAddress","metroManual","manualCommute",
      "pros","cons","generalNotes"
    ];
  }

  function readFormIntoDraft() {
    if (!state.draft) return;
    formFields().forEach(id => state.draft[id] = $("#" + id)?.value ?? "");
    state.draft.favorite = $("#favorite").checked;
    state.draft.updatedAt = new Date().toISOString();
    const workAddress = state.draft.workAddress.trim();
    if (workAddress) saveSettings({ ...loadSettings(), workAddress });
  }

  function fillForm(property) {
    state.draft = structuredCloneSafe(property);
    state.currentId = property.id;
    formFields().forEach(id => {
      const el = $("#" + id);
      if (el) el.value = property[id] ?? "";
    });
    $("#favorite").checked = !!property.favorite;

    CHECKLIST.forEach(group => group.items.forEach(([id]) => {
      const value = property.checklist?.[id] || { status: "unseen", note: "" };
      const item = $(`.check-item[data-item="${id}"]`);
      $$(".status-btn", item).forEach(btn => btn.classList.toggle("is-selected", btn.dataset.status === value.status));
      const note = $(`[data-note="${id}"]`, item);
      if (note) note.value = value.note || "";
    }));
    updateAllUI();
  }

  function structuredCloneSafe(obj) {
    return window.structuredClone ? structuredClone(obj) : JSON.parse(JSON.stringify(obj));
  }

  function newVisit(silent = false) {
    fillForm(emptyProperty());
    if (!silent) {
      switchTab("visita");
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast("Nova visita iniciada.");
    }
  }

  function isMeaningful(p) {
    if (!p) return false;
    if (p.name.trim() || p.address.trim() || parseNum(p.price) || p.generalNotes.trim()) return true;
    return Object.values(p.checklist || {}).some(v => v.status !== "unseen" || v.note);
  }

  function saveDraft({ manual = false } = {}) {
    readFormIntoDraft();
    if (!isMeaningful(state.draft)) {
      if (manual) toast("Preencha pelo menos o endereço, nome ou algum item do checklist.");
      return false;
    }
    const idx = state.properties.findIndex(p => p.id === state.draft.id);
    if (idx >= 0) state.properties[idx] = structuredCloneSafe(state.draft);
    else state.properties.unshift(structuredCloneSafe(state.draft));
    persistAll();
    renderSaved();
    renderComparison();
    updateAllUI();
    if (manual) toast("Visita salva neste aparelho.");
    else {
      els.autoSaveStatus.textContent = `Salvo automaticamente às ${new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}.`;
    }
    return true;
  }

  function scheduleSave() {
    clearTimeout(state.saveTimer);
    state.saveTimer = setTimeout(() => saveDraft(), 450);
  }

  function technicalScore(p) {
    let earned = 0, max = 0, checked = 0, total = 0;
    CHECKLIST.forEach(group => group.items.forEach(([id,,weight]) => {
      total++;
      const st = p.checklist?.[id]?.status || "unseen";
      if (st !== "unseen") checked++;
      if (group.id === "local") return;
      if (st === "na" || st === "unseen") return;
      max += 2 * weight;
      earned += STATUS[st].value * weight;
    }));
    return {
      score: max ? (earned / max) * 10 : null,
      checked,
      total,
      progress: total ? (checked / total) * 100 : 0
    };
  }

  function locationScore(p) {
    const parts = [];
    if (Number.isFinite(Number(p.distanceKm)) && p.distanceKm !== null) {
      const d = Number(p.distanceKm);
      let s = d <= 3 ? 10 : d <= 5 ? 9 : d <= 8 ? 8 : d <= 12 ? 7 : d <= 18 ? 6 : d <= 25 ? 5 : d <= 35 ? 3.5 : 2;
      parts.push({ s, w: .35 });
    }
    if (Number.isFinite(Number(p.metroKm)) && p.metroKm !== null) {
      const d = Number(p.metroKm);
      let s = d <= .4 ? 10 : d <= .7 ? 9 : d <= 1 ? 8 : d <= 1.5 ? 6.5 : d <= 2.5 ? 5 : d <= 4 ? 3.5 : 2;
      parts.push({ s, w: .25 });
    }

    const localGroup = CHECKLIST.find(group => group.id === "local");
    if (localGroup) {
      let earned = 0, max = 0;
      localGroup.items.forEach(([id,,weight]) => {
        const st = p.checklist?.[id]?.status || "unseen";
        if (st === "unseen" || st === "na") return;
        max += 2 * weight;
        earned += STATUS[st].value * weight;
      });
      if (max) parts.push({ s: (earned / max) * 10, w: .40 });
    }

    if (!parts.length) return null;
    const sw = parts.reduce((a,b)=>a+b.w,0);
    return parts.reduce((a,b)=>a+b.s*b.w,0)/sw;
  }

  function financialScores(properties) {
    const valid = properties.filter(p => parseNum(p.price) > 0);
    const metrics = valid.map(p => ({
      id: p.id,
      pm2: parseNum(p.area) > 0 ? parseNum(p.price)/parseNum(p.area) : null,
      effective: parseNum(p.price)+parseNum(p.renovation),
      monthly: parseNum(p.condo)+parseNum(p.iptu)
    }));
    const scoreMetric = (value, values) => {
      const clean = values.filter(v => Number.isFinite(v) && v > 0);
      if (!Number.isFinite(value) || value <= 0 || !clean.length) return null;
      const min = Math.min(...clean), max = Math.max(...clean);
      if (min === max) return 7;
      return 10 - ((value-min)/(max-min))*5;
    };
    const map = {};
    metrics.forEach(m => {
      const parts = [
        { s: scoreMetric(m.pm2, metrics.map(x=>x.pm2)), w:.5 },
        { s: scoreMetric(m.effective, metrics.map(x=>x.effective)), w:.35 },
        { s: scoreMetric(m.monthly, metrics.map(x=>x.monthly)), w:.15 }
      ].filter(x => x.s !== null);
      const sw = parts.reduce((a,b)=>a+b.w,0);
      map[m.id] = sw ? parts.reduce((a,b)=>a+b.s*b.w,0)/sw : null;
    });
    return map;
  }

  function overallScore(p, financialMap = financialScores(state.properties.length ? state.properties : [p])) {
    const t = technicalScore(p).score;
    const l = locationScore(p);
    const f = financialMap[p.id] ?? (parseNum(p.price) ? 7 : null);
    const parts = [
      {s:t,w:.45},{s:l,w:.25},{s:f,w:.30}
    ].filter(x=>x.s!==null && Number.isFinite(x.s));
    const sw = parts.reduce((a,b)=>a+b.w,0);
    return sw ? parts.reduce((a,b)=>a+b.s*b.w,0)/sw : null;
  }

  function updateAllUI() {
    if (!state.draft) return;
    readFormIntoDraft();

    const p = state.draft;
    const tech = technicalScore(p);
    const loc = locationScore(p);
    const finMap = financialScores([...state.properties.filter(x=>x.id!==p.id), p]);
    const fin = finMap[p.id] ?? (parseNum(p.price) ? 7 : null);
    const overall = overallScore(p, finMap);

    els.visitTitle.textContent = p.name.trim() || p.address.trim() || "Novo apartamento";
    els.heroScore.textContent = overall === null ? "—" : num(overall,1);
    els.finalScore.textContent = overall === null ? "—" : num(overall,1);
    els.heroProgress.textContent = `${Math.round(tech.progress)}% conferido`;
    els.checkDone.textContent = tech.checked;

    els.effectiveCost.textContent = parseNum(p.price) ? brl(parseNum(p.price)+parseNum(p.renovation)) : "—";
    els.monthlyCost.textContent = (parseNum(p.condo)+parseNum(p.iptu)) ? brl(parseNum(p.condo)+parseNum(p.iptu)) : "—";
    els.priceM2.textContent = parseNum(p.area) && parseNum(p.price) ? `${brl(parseNum(p.price)/parseNum(p.area))}/m²` : "—";

    els.distanceWork.textContent = p.distanceKm != null ? `${num(p.distanceKm,1)} km` : "—";
    els.durationWork.textContent = p.durationMin != null ? `Estimativa viária: ${Math.round(p.durationMin)} min` : "Calcule após informar os dois endereços";
    els.nearestMetro.textContent = p.nearestMetro || "—";
    els.metroDistance.textContent = p.metroKm != null ? `aprox. ${num(p.metroKm,1)} km em linha reta` : "Busca automática em dados cartográficos";

    els.scoreTechnical.textContent = tech.score === null ? "—" : num(tech.score,1);
    els.scoreLocation.textContent = loc === null ? "—" : num(loc,1);
    els.scoreFinancial.textContent = fin === null ? "—" : num(fin,1);

    const deg = overall === null ? 0 : Math.max(0, Math.min(10, overall))*36;
    els.scoreRing.style.background = `conic-gradient(var(--brand) ${deg}deg,#e5e7eb ${deg}deg)`;
    els.summaryTitle.textContent = summaryLabel(overall, tech.progress);

    CHECKLIST.forEach(group => {
      const checked = group.items.filter(([id]) => (p.checklist?.[id]?.status || "unseen") !== "unseen").length;
      const gp = $(`#group-${group.id}`);
      if (gp) gp.textContent = `${checked}/${group.items.length}`;
    });
    els.savedCount.textContent = state.properties.length;
  }

  function summaryLabel(score, progress) {
    if (progress < 25) return "Continue a visita para formar uma comparação confiável.";
    if (score == null) return "Complete os principais dados do imóvel.";
    if (score >= 8.5) return "Imóvel muito competitivo entre os dados já preenchidos.";
    if (score >= 7) return "Boa avaliação geral, com pontos para conferir antes da decisão.";
    if (score >= 5.5) return "Avaliação intermediária: compare custos e pontos de atenção.";
    return "Há pontos relevantes que merecem investigação ou negociação.";
  }

  function advanceChecklist(item) {
    if (!item) return;
    const group = item.closest(".check-group");
    if (!group) return;
    const items = $$(".check-item", group);
    const complete = items.length && items.every(node => {
      const id = node.dataset.item;
      return (state.draft.checklist?.[id]?.status || "unseen") !== "unseen";
    });
    if (!complete) return;

    const groups = $$(".check-group");
    const index = groups.indexOf(group);
    const nextGroup = groups[index + 1];
    if (nextGroup) {
      setTimeout(() => {
        group.open = false;
        nextGroup.open = true;
        nextGroup.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 180);
    }
  }

  function bindEvents() {
    els.form.addEventListener("input", e => {
      if (e.target.matches("input,textarea")) {
        readFormIntoDraft();
        updateAllUI();
        scheduleSave();
      }
    });
    els.form.addEventListener("change", () => {
      readFormIntoDraft();
      updateAllUI();
      scheduleSave();
    });

    els.checklistRoot.addEventListener("click", e => {
      const btn = e.target.closest(".status-btn");
      if (!btn) return;
      const item = btn.closest(".check-item");
      const id = item.dataset.item;
      const current = state.draft.checklist[id]?.status || "unseen";
      const next = current === btn.dataset.status ? "unseen" : btn.dataset.status;
      state.draft.checklist[id] = state.draft.checklist[id] || {note:""};
      state.draft.checklist[id].status = next;
      $$(".status-btn", item).forEach(b => b.classList.toggle("is-selected", b.dataset.status === next));
      updateAllUI();
      scheduleSave();
      advanceChecklist(item);
    });

    els.checklistRoot.addEventListener("input", e => {
      if (!e.target.matches(".item-note")) return;
      const id = e.target.dataset.note;
      state.draft.checklist[id] = state.draft.checklist[id] || {status:"unseen",note:""};
      state.draft.checklist[id].note = e.target.value;
      scheduleSave();
    });

    $("#btnSave").addEventListener("click", () => saveDraft({manual:true}));
    $("#btnNew").addEventListener("click", () => newVisit());
    $("#btnPdf").addEventListener("click", async () => {
      readFormIntoDraft();
      await generatePropertyPdf(state.draft, {save:true});
    });
    $("#btnPrint").addEventListener("click", () => printProperty(state.draft));
    $("#btnShare").addEventListener("click", () => shareProperty(state.draft));
    $("#btnLocation").addEventListener("click", calculateLocation);
    $("#btnMapsProperty").addEventListener("click", () => openMapsProperty(state.draft));
    $("#btnMapsRoute").addEventListener("click", () => openMapsRoute(state.draft));

    $("#btnExportJson").addEventListener("click", exportBackup);
    $("#importJson").addEventListener("change", importBackup);
    $("#btnComparisonPdf").addEventListener("click", generateComparisonPdf);

    $$(".tab").forEach(btn => btn.addEventListener("click", () => switchTab(btn.dataset.tab)));

    $("#btnTheme").addEventListener("click", () => {
      document.body.classList.toggle("dark");
      localStorage.setItem("samirTheme", document.body.classList.contains("dark") ? "dark" : "light");
    });

    els.savedList.addEventListener("click", savedActions);
    els.comparisonList.addEventListener("click", comparisonActions);

    window.addEventListener("beforeunload", () => saveDraft());
  }

  function switchTab(tab) {
    $$(".tab").forEach(b => b.classList.toggle("is-active", b.dataset.tab === tab));
    $$(".page").forEach(p => p.classList.toggle("is-active", p.id === `page-${tab}`));
    if (tab === "salvos") renderSaved();
    if (tab === "comparar") renderComparison();
    window.scrollTo({top:0,behavior:"smooth"});
  }

  const COLLAPSE_KEY = "samirDashboardCollapsedV1";

  function loadCollapsedCards() {
    try { return JSON.parse(localStorage.getItem(COLLAPSE_KEY) || "{}") || {}; }
    catch { return {}; }
  }

  function isCardCollapsed(scope, id) {
    return !!loadCollapsedCards()?.[scope]?.[id];
  }

  function setCardCollapsed(scope, id, collapsed) {
    const state = loadCollapsedCards();
    state[scope] = state[scope] || {};
    state[scope][id] = !!collapsed;
    localStorage.setItem(COLLAPSE_KEY, JSON.stringify(state));
  }

  function propertyStatus(p) {
    const progress = technicalScore(p).progress;
    if (progress >= 100) return { label: "Concluído", cls: "done" };
    if (progress > 0) return { label: `${Math.round(progress)}%`, cls: "progress" };
    return { label: "Novo", cls: "new" };
  }

  function issueSummary(p, limit = 3) {
    const items = [];
    CHECKLIST.forEach(group => group.items.forEach(([id,title,weight]) => {
      const st = p.checklist?.[id]?.status || "unseen";
      if (st === "bad" || st === "attention") {
        items.push({ title, st, weight });
      }
    }));
    items.sort((a,b) => (b.st === "bad") - (a.st === "bad") || b.weight - a.weight);
    return items.slice(0, limit);
  }

  function dashboardStats(properties) {
    const finMap = financialScores(properties);
    const scored = properties.map(p => ({p, score: overallScore(p, finMap)})).filter(x => x.score != null);
    scored.sort((a,b)=>b.score-a.score);
    const favorites = properties.filter(p=>p.favorite).length;
    const done = properties.filter(p=>technicalScore(p).progress >= 100).length;
    return {
      total: properties.length,
      favorites,
      done,
      best: scored[0] || null
    };
  }

  function renderDashboardStrip(target, properties) {
    if (!target) return;
    if (!properties.length) { target.innerHTML = ""; return; }
    const d = dashboardStats(properties);
    target.innerHTML = `
      <div><span>IMÓVEIS</span><strong>${d.total}</strong></div>
      <div><span>CONCLUÍDOS</span><strong>${d.done}</strong></div>
      <div><span>FAVORITOS</span><strong>${d.favorites}</strong></div>
      <div><span>MELHOR NOTA</span><strong>${d.best ? num(d.best.score,1) : "—"}</strong></div>
    `;
  }

  function toggleDashboardCard(scope, card) {
    if (!card) return;
    const id = card.dataset.id;
    const collapsed = !card.classList.contains("is-collapsed");
    card.classList.toggle("is-collapsed", collapsed);
    const btn = card.querySelector('[data-action="toggle"]');
    if (btn) {
      btn.setAttribute("aria-expanded", String(!collapsed));
      btn.setAttribute("aria-label", collapsed ? "Expandir apartamento" : "Minimizar apartamento");
    }
    setCardCollapsed(scope, id, collapsed);
  }

  function renderSaved() {
    els.savedCount.textContent = state.properties.length;
    renderDashboardStrip(els.savedDashboard, state.properties);
    if (!state.properties.length) {
      els.savedList.innerHTML = `<div class="empty-state"><strong>Nenhum apartamento.</strong>Comece uma nova visita.</div>`;
      return;
    }
    const finMap = financialScores(state.properties);
    const list = [...state.properties].sort((a,b)=>new Date(b.updatedAt)-new Date(a.updatedAt));
    els.savedList.innerHTML = list.map(p => {
      const sc = overallScore(p, finMap);
      const tech = technicalScore(p);
      const status = propertyStatus(p);
      const issues = issueSummary(p);
      const collapsed = isCardCollapsed("saved", p.id);
      return `
        <article class="saved-card dashboard-card ${collapsed ? "is-collapsed" : ""}" data-id="${p.id}">
          <div class="saved-card-head dashboard-card-head">
            <button class="card-toggle" type="button" data-action="toggle" aria-expanded="${!collapsed}" aria-label="${collapsed ? "Expandir apartamento" : "Minimizar apartamento"}">
              <span class="card-chevron">⌄</span>
            </button>
            <div class="card-title-block">
              <div class="card-kickers">
                ${p.favorite ? '<span class="favorite-badge">★ Favorito</span>' : ""}
                <span class="status-badge ${status.cls}">${status.label}</span>
              </div>
              <h3>${esc(p.name || p.address || "Apartamento sem nome")}</h3>
              <p>${esc(p.address || "Endereço não informado")} ${p.floor ? "• "+esc(p.floor) : ""}</p>
            </div>
            <div class="card-score">${sc == null ? "—" : num(sc,1)}</div>
          </div>
          <div class="dashboard-card-body">
            <div class="card-metrics">
              <div><span>PREÇO</span><strong>${parseNum(p.price)?brl(p.price):"—"}</strong></div>
              <div><span>R$/M²</span><strong>${parseNum(p.price)&&parseNum(p.area)?brl(parseNum(p.price)/parseNum(p.area)):"—"}</strong></div>
              <div><span>TRABALHO</span><strong>${p.distanceKm!=null?`${num(p.distanceKm,1)} km`:"—"}</strong></div>
              <div><span>METRÔ</span><strong>${p.metroKm!=null?`${num(p.metroKm,1)} km`:"—"}</strong></div>
            </div>
            ${issues.length ? `<div class="issue-strip">${issues.map(x=>`<span class="issue-chip ${x.st}">${esc(x.title)}</span>`).join("")}</div>` : `<div class="issue-strip clean"><span>Sem alertas marcados</span></div>`}
            <div class="card-actions">
              <button class="btn btn-primary btn-small" data-action="open">Abrir</button>
              <button class="btn btn-light btn-small" data-action="pdf">PDF</button>
              <button class="btn btn-light btn-small" data-action="maps">Mapa</button>
              <button class="btn btn-danger btn-small" data-action="delete">Excluir</button>
            </div>
          </div>
        </article>
      `;
    }).join("");
  }

  async function savedActions(e) {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const card = btn.closest("[data-id]");
    const p = state.properties.find(x=>x.id===card.dataset.id);
    if (!p) return;
    const action = btn.dataset.action;
    if (action === "toggle") {
      toggleDashboardCard("saved", card);
      return;
    }
    if (action === "open") {
      fillForm(p); switchTab("visita"); toast("Visita carregada.");
    } else if (action === "pdf") {
      await generatePropertyPdf(p,{save:true});
    } else if (action === "maps") {
      openMapsProperty(p);
    } else if (action === "delete") {
      if (!confirm(`Excluir "${p.name || p.address || "este apartamento"}"?`)) return;
      state.properties = state.properties.filter(x=>x.id!==p.id);
      persistAll();
      if (state.currentId === p.id) newVisit(true);
      renderSaved(); renderComparison(); updateAllUI();
      toast("Apartamento excluído.");
    }
  }

  function renderComparison() {
    renderDashboardStrip(els.compareDashboard, state.properties);
    if (!state.properties.length) {
      els.comparisonList.innerHTML = `<div class="empty-state"><strong>Nenhum apartamento.</strong>Salve uma visita para comparar.</div>`;
      return;
    }
    const finMap = financialScores(state.properties);
    const ranked = state.properties.map(p => ({
      p,
      technical: technicalScore(p).score,
      location: locationScore(p),
      financial: finMap[p.id],
      overall: overallScore(p, finMap)
    })).sort((a,b)=>(b.overall??-1)-(a.overall??-1));

    els.comparisonList.innerHTML = ranked.map((r,i) => {
      const p = r.p;
      const issues = issueSummary(p);
      const status = propertyStatus(p);
      const collapsed = isCardCollapsed("compare", p.id);
      const metric = (label,val) => `
        <div class="bar-row">
          <span>${label}</span>
          <div class="bar-track"><div class="bar-fill" style="width:${val==null?0:Math.max(0,Math.min(100,val*10))}%"></div></div>
          <strong>${val==null?"—":num(val,1)}</strong>
        </div>`;
      return `
        <article class="compare-card dashboard-card ${collapsed ? "is-collapsed" : ""}" data-id="${p.id}">
          <div class="compare-card-head dashboard-card-head">
            <button class="card-toggle" type="button" data-action="toggle" aria-expanded="${!collapsed}" aria-label="${collapsed ? "Expandir apartamento" : "Minimizar apartamento"}">
              <span class="card-chevron">⌄</span>
            </button>
            <div class="compare-card-head-left card-title-block">
              <div class="rank">${i+1}º</div>
              <div class="compare-title-copy">
                <div class="card-kickers">
                  ${p.favorite?'<span class="favorite-badge">★ Favorito</span>':""}
                  <span class="status-badge ${status.cls}">${status.label}</span>
                </div>
                <h3>${esc(p.name || p.address || "Apartamento sem nome")}</h3>
                <p>${esc(p.address || "Endereço não informado")}</p>
              </div>
            </div>
            <div class="card-score">${r.overall==null?"—":num(r.overall,1)}</div>
          </div>
          <div class="dashboard-card-body">
            <div class="card-metrics">
              <div><span>PREÇO</span><strong>${parseNum(p.price)?brl(p.price):"—"}</strong></div>
              <div><span>+ REFORMA</span><strong>${parseNum(p.price)?brl(parseNum(p.price)+parseNum(p.renovation)):"—"}</strong></div>
              <div><span>R$/M²</span><strong>${parseNum(p.price)&&parseNum(p.area)?brl(parseNum(p.price)/parseNum(p.area)):"—"}</strong></div>
              <div><span>CONDO + IPTU</span><strong>${(parseNum(p.condo)+parseNum(p.iptu))?brl(parseNum(p.condo)+parseNum(p.iptu)):"—"}</strong></div>
              <div><span>TRABALHO</span><strong>${p.distanceKm!=null?`${num(p.distanceKm,1)} km`:"—"}</strong></div>
              <div><span>METRÔ</span><strong>${p.metroKm!=null?`${num(p.metroKm,1)} km`:"—"}</strong></div>
              <div><span>ÁREA</span><strong>${parseNum(p.area)?`${num(parseNum(p.area),0)} m²`:"—"}</strong></div>
              <div><span>VAGAS</span><strong>${p.parking||"—"}</strong></div>
            </div>
            <div class="compare-bars">
              ${metric("Técnico",r.technical)}
              ${metric("Localização",r.location)}
              ${metric("Custo-benefício",r.financial)}
            </div>
            ${issues.length ? `<div class="issue-strip">${issues.map(x=>`<span class="issue-chip ${x.st}">${esc(x.title)}</span>`).join("")}</div>` : `<div class="issue-strip clean"><span>Sem alertas marcados</span></div>`}
            <div class="card-actions dashboard-compare-actions">
              <button class="btn btn-primary btn-small" data-action="open">Abrir</button>
              <button class="btn btn-light btn-small" data-action="route">Rota</button>
              <button class="btn btn-light btn-small" data-action="pdf">PDF</button>
            </div>
          </div>
        </article>
      `;
    }).join("");
  }

  async function comparisonActions(e) {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const card = btn.closest("[data-id]");
    const p = state.properties.find(x=>x.id===card?.dataset.id);
    if (!p) return;
    if (btn.dataset.action === "toggle") { toggleDashboardCard("compare", card); return; }
    if (btn.dataset.action === "open") { fillForm(p); switchTab("visita"); }
    if (btn.dataset.action === "route") openMapsRoute(p);
    if (btn.dataset.action === "pdf") await generatePropertyPdf(p,{save:true});
  }

  function mapsQuery(p) {
    return [p.address,p.city].filter(Boolean).join(", ");
  }

  function openExternalUrl(url) {
    if (!url) return;
    if (isAndroidApp() && typeof AndroidApp.openUrl === "function") {
      AndroidApp.openUrl(url);
      return;
    }
    window.open(url,"_blank","noopener");
  }

  function openMapsProperty(p) {
    const q = mapsQuery(p);
    if (!q.trim()) return toast("Informe o endereço do apartamento.");
    openExternalUrl(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`);
  }

  function openMapsRoute(p) {
    const origin = mapsQuery(p);
    const dest = p.workAddress?.trim();
    if (!origin || !dest) return toast("Informe o endereço do apartamento e do trabalho.");
    openExternalUrl(`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(dest)}&travelmode=transit`);
  }

  async function geocode(query) {
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=br&q=${encodeURIComponent(query)}`;
    const res = await fetch(url, {headers:{"Accept":"application/json"}});
    if (!res.ok) throw new Error("Falha ao localizar endereço");
    const data = await res.json();
    if (!data?.length) throw new Error(`Endereço não encontrado: ${query}`);
    return {lat:Number(data[0].lat),lon:Number(data[0].lon),label:data[0].display_name};
  }

  async function routeEstimate(a,b) {
    const url = `https://router.project-osrm.org/route/v1/driving/${a.lon},${a.lat};${b.lon},${b.lat}?overview=false`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Falha ao calcular rota");
    const data = await res.json();
    const route = data.routes?.[0];
    if (!route) throw new Error("Rota não encontrada");
    return {km:route.distance/1000,min:route.duration/60};
  }

  function haversine(a,b) {
    const R=6371, toRad=x=>x*Math.PI/180;
    const dLat=toRad(b.lat-a.lat), dLon=toRad(b.lon-a.lon);
    const x=Math.sin(dLat/2)**2+Math.cos(toRad(a.lat))*Math.cos(toRad(b.lat))*Math.sin(dLon/2)**2;
    return 2*R*Math.asin(Math.sqrt(x));
  }

  async function nearestSubway(coord) {
    const q = `[out:json][timeout:18];
      (
        nwr(around:6000,${coord.lat},${coord.lon})["railway"="station"]["station"="subway"];
        nwr(around:6000,${coord.lat},${coord.lon})["railway"="station"]["subway"="yes"];
        nwr(around:6000,${coord.lat},${coord.lon})["public_transport"="station"]["subway"="yes"];
      );
      out center tags;`;
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(q)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Busca de metrô indisponível");
    const data = await res.json();
    const stations = (data.elements||[]).map(el => {
      const lat = el.lat ?? el.center?.lat;
      const lon = el.lon ?? el.center?.lon;
      return {name:el.tags?.name || el.tags?.["name:pt"] || "Estação de metrô",lat,lon};
    }).filter(x=>Number.isFinite(x.lat)&&Number.isFinite(x.lon));
    if (!stations.length) return null;
    stations.forEach(s=>s.km=haversine(coord,s));
    stations.sort((a,b)=>a.km-b.km);
    return stations[0];
  }

  async function calculateLocation() {
    readFormIntoDraft();
    const p = state.draft;
    if (!p.address.trim() || !p.workAddress.trim()) {
      toast("Informe o endereço do apartamento e o endereço do trabalho.");
      return;
    }
    const btn = $("#btnLocation");
    const original = btn.textContent;
    btn.disabled = true; btn.textContent = "Calculando...";
    try {
      const propertyQ = `${p.address}, ${p.city || "São Paulo - SP"}, Brasil`;
      const workQ = `${p.workAddress}, Brasil`;
      const [pc,wc] = await Promise.all([geocode(propertyQ), geocode(workQ)]);
      p.propertyCoord = pc; p.workCoord = wc;
      const [route,metro] = await Promise.all([
        routeEstimate(pc,wc),
        nearestSubway(pc).catch(()=>null)
      ]);
      p.distanceKm = route.km;
      p.durationMin = route.min;
      if (metro) {
        p.nearestMetro = metro.name;
        p.metroKm = metro.km;
      } else {
        p.nearestMetro = "Não identificada automaticamente";
        p.metroKm = null;
      }
      saveDraft();
      updateAllUI();
      toast("Localização atualizada.");
    } catch (err) {
      console.error(err);
      toast(err.message || "Não foi possível calcular agora. Use os botões do Google Maps.");
    } finally {
      btn.disabled = false; btn.textContent = original;
    }
  }

  function safeFilename(p, suffix="checklist") {
    const base = (p.name || p.address || "apartamento")
      .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
      .replace(/[^a-zA-Z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,55);
    return `${suffix}-${base || "apartamento"}.pdf`;
  }

  function pdfReady() {
    return !!(window.jspdf?.jsPDF);
  }

  function pdfColors(status) {
    if (status==="good") return [22,128,61];
    if (status==="attention") return [180,83,9];
    if (status==="bad") return [180,35,24];
    if (status==="na") return [100,116,139];
    return [148,163,184];
  }

  async function generatePropertyPdf(p,{save=false,blobOnly=false}={}) {
    if (!pdfReady()) {
      toast("Gerador de PDF não carregou. Abrindo modo de impressão.");
      printProperty(p); return null;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({unit:"mm",format:"a4"});
    const finMap = financialScores([...state.properties.filter(x=>x.id!==p.id),p]);
    const tech = technicalScore(p);
    const loc = locationScore(p);
    const fin = finMap[p.id] ?? (parseNum(p.price)?7:null);
    const overall = overallScore(p,finMap);

    const addHeader = () => {
      doc.setFillColor(15,23,42); doc.rect(0,0,210,28,"F");
      doc.setTextColor(255,255,255); doc.setFont("helvetica","bold"); doc.setFontSize(16);
      doc.text("Checklist de Compra — Samir",14,11);
      doc.setFont("helvetica","normal"); doc.setFontSize(9);
      doc.text((p.name || p.address || "Apartamento").slice(0,95),14,18);
      doc.setFontSize(8); doc.text(`Atualizado em ${new Date(p.updatedAt||Date.now()).toLocaleString("pt-BR")}`,14,23);
      if (overall!=null) {
        doc.setFont("helvetica","bold"); doc.setFontSize(18);
        doc.text(num(overall,1),190,16,{align:"right"});
        doc.setFont("helvetica","normal"); doc.setFontSize(7);
        doc.text("NOTA AUXILIAR",190,21,{align:"right"});
      }
      doc.setTextColor(17,24,39);
    };
    addHeader();

    let y=35;
    doc.setFont("helvetica","bold"); doc.setFontSize(11); doc.text("Imóvel",14,y); y+=4;
    doc.autoTable({
      startY:y, theme:"grid", styles:{fontSize:8,cellPadding:2.4,lineColor:[226,232,240]},
      headStyles:{fillColor:[241,245,249],textColor:[15,23,42]},
      body:[
        ["Endereço", [p.address,p.city,p.floor].filter(Boolean).join(" • ") || "Não informado"],
        ["Preço", parseNum(p.price)?brl(p.price):"Não informado"],
        ["Preço + reforma", parseNum(p.price)?brl(parseNum(p.price)+parseNum(p.renovation)):"—"],
        ["Área / quartos / banheiros / vagas", `${p.area||"—"} m² • ${p.bedrooms||"—"} qtos • ${p.bathrooms||"—"} banh. • ${p.parking||"—"} vagas`],
        ["Condomínio + IPTU", (parseNum(p.condo)+parseNum(p.iptu))?`${brl(parseNum(p.condo)+parseNum(p.iptu))}/mês`:"—"],
        ["Preço por m²", parseNum(p.price)&&parseNum(p.area)?brl(parseNum(p.price)/parseNum(p.area)):"—"]
      ]
    });
    y=doc.lastAutoTable.finalY+7;

    doc.setFont("helvetica","bold"); doc.setFontSize(11); doc.text("Localização e notas",14,y); y+=4;
    doc.autoTable({
      startY:y, theme:"grid", styles:{fontSize:8,cellPadding:2.4,lineColor:[226,232,240]},
      head:[["Trabalho","Metrô","Técnico","Localização","Custo-benefício","Geral"]],
      body:[[
        p.distanceKm!=null?`${num(p.distanceKm,1)} km • ${Math.round(p.durationMin||0)} min*`:"—",
        p.metroManual || p.nearestMetro || "—",
        tech.score==null?"—":num(tech.score,1),
        loc==null?"—":num(loc,1),
        fin==null?"—":num(fin,1),
        overall==null?"—":num(overall,1)
      ]],
      headStyles:{fillColor:[29,78,216],textColor:[255,255,255]}
    });
    y=doc.lastAutoTable.finalY+4;
    doc.setFont("helvetica","normal"); doc.setFontSize(6.8); doc.setTextColor(100,116,139);
    doc.text("* Tempo e distância automáticos são estimativas viárias. Confirme trânsito/transporte no Google Maps.",14,y);
    doc.setTextColor(17,24,39);
    y+=7;

    CHECKLIST.forEach(group => {
      if (y>255) {doc.addPage(); addHeader(); y=35;}
      doc.setFont("helvetica","bold"); doc.setFontSize(10); doc.text(group.title,14,y); y+=3;
      const rows = group.items.map(([id,title]) => {
        const v=p.checklist?.[id]||{status:"unseen",note:""};
        return [title, STATUS[v.status]?.label||"Não verificado", v.note||""];
      });
      doc.autoTable({
        startY:y, theme:"grid",
        head:[["Item","Situação","Observação"]],
        body:rows,
        styles:{fontSize:7.4,cellPadding:2,lineColor:[226,232,240],valign:"middle"},
        columnStyles:{0:{cellWidth:91},1:{cellWidth:28,fontStyle:"bold"},2:{cellWidth:62}},
        headStyles:{fillColor:[241,245,249],textColor:[15,23,42]},
        didParseCell(data){
          if(data.section==="body" && data.column.index===1){
            const st = group.items[data.row.index] ? (p.checklist?.[group.items[data.row.index][0]]?.status||"unseen") : "unseen";
            data.cell.styles.textColor = pdfColors(st);
          }
        },
        margin:{top:32,bottom:16}
      });
      y=doc.lastAutoTable.finalY+7;
    });

    if (y>215){doc.addPage();addHeader();y=35;}
    doc.setFont("helvetica","bold"); doc.setFontSize(10); doc.text("Impressão geral",14,y); y+=4;
    const notes = [
      ["Pontos fortes", p.pros||"—"],
      ["Pontos de atenção", p.cons||"—"],
      ["Observações finais", p.generalNotes||"—"]
    ];
    doc.autoTable({
      startY:y,theme:"grid",body:notes,
      styles:{fontSize:8,cellPadding:2.5,lineColor:[226,232,240]},
      columnStyles:{0:{cellWidth:34,fontStyle:"bold"},1:{cellWidth:147}}
    });
    y=doc.lastAutoTable.finalY+7;
    doc.setFont("helvetica","normal");doc.setFontSize(7);doc.setTextColor(100,116,139);
    const warning="Relatório de apoio à decisão. Não substitui vistoria de engenheiro/arquiteto, análise jurídica da documentação, certidões ou verificação profissional das instalações.";
    doc.text(doc.splitTextToSize(warning,180),14,y);
    y+=10;
    doc.setTextColor(15,23,42);doc.setFont("helvetica","bold");doc.setFontSize(8);
    doc.text("Powered by thIAguinho Soluções",105,Math.min(287,y+7),{align:"center"});

    const filename = safeFilename(p);
    const blob = doc.output("blob");
    if (save) {
      if (isAndroidApp() && typeof AndroidApp.saveBase64File === "function") {
        const base64 = doc.output("datauristring").split(",")[1];
        AndroidApp.saveBase64File(filename, "application/pdf", base64);
      } else {
        doc.save(filename);
      }
    }
    if(blobOnly) return {blob,filename,doc};
    return {blob,filename,doc};
  }

  function buildPrintHtml(p){
    const finMap=financialScores([...state.properties.filter(x=>x.id!==p.id),p]);
    const tech=technicalScore(p),loc=locationScore(p),fin=finMap[p.id]??null,overall=overallScore(p,finMap);
    const rows=CHECKLIST.map(g=>`
      <h2>${esc(g.title)}</h2>
      <table><thead><tr><th>Item</th><th>Situação</th><th>Observação</th></tr></thead><tbody>
      ${g.items.map(([id,title])=>{
        const v=p.checklist?.[id]||{status:"unseen",note:""};
        return `<tr><td>${esc(title)}</td><td>${esc(STATUS[v.status]?.label||"Não verificado")}</td><td>${esc(v.note||"")}</td></tr>`;
      }).join("")}</tbody></table>`).join("");
    return `<div class="print-wrap">
      <h1>Checklist de Compra — Samir</h1>
      <p><b>${esc(p.name||"Apartamento")}</b><br>${esc([p.address,p.city,p.floor].filter(Boolean).join(" • "))}</p>
      <div class="print-kpis">
        <div><small>Preço</small><br><b>${parseNum(p.price)?brl(p.price):"—"}</b></div>
        <div><small>+ reforma</small><br><b>${parseNum(p.price)?brl(parseNum(p.price)+parseNum(p.renovation)):"—"}</b></div>
        <div><small>Trabalho</small><br><b>${p.distanceKm!=null?`${num(p.distanceKm,1)} km`:"—"}</b></div>
        <div><small>Nota</small><br><b>${overall==null?"—":num(overall,1)}</b></div>
      </div>
      <h2>Resumo</h2>
      <table><tbody>
        <tr><th>Condição técnica</th><td>${tech.score==null?"—":num(tech.score,1)}</td><th>Localização</th><td>${loc==null?"—":num(loc,1)}</td></tr>
        <tr><th>Custo-benefício</th><td>${fin==null?"—":num(fin,1)}</td><th>Metrô</th><td>${esc(p.metroManual||p.nearestMetro||"—")}</td></tr>
        <tr><th>Condomínio + IPTU</th><td>${(parseNum(p.condo)+parseNum(p.iptu))?brl(parseNum(p.condo)+parseNum(p.iptu)):"—"}</td><th>Área</th><td>${esc(p.area||"—")} m²</td></tr>
      </tbody></table>
      ${rows}
      <h2>Impressão geral</h2>
      <p><b>Pontos fortes:</b> ${esc(p.pros||"—")}</p>
      <p><b>Pontos de atenção:</b> ${esc(p.cons||"—")}</p>
      <p><b>Observações finais:</b> ${esc(p.generalNotes||"—")}</p>
      <p><small>Relatório de apoio à decisão. Não substitui vistoria técnica ou análise jurídica/documental profissional.</small></p>
      <div class="print-footer">Powered by thIAguinho Soluções</div>
    </div>`;
  }

  function printProperty(p){
    readFormIntoDraft();
    els.printArea.innerHTML=buildPrintHtml(p);
    els.printArea.setAttribute("aria-hidden","false");
    setTimeout(()=>{
      if (isAndroidApp() && typeof AndroidApp.printCurrentPage === "function") {
        AndroidApp.printCurrentPage(`Checklist - ${p.name || p.address || "Apartamento"}`);
      } else {
        window.print();
        setTimeout(()=>{els.printArea.innerHTML="";els.printArea.setAttribute("aria-hidden","true");},400);
      }
    },120);
  }

  async function shareProperty(p){
    readFormIntoDraft();
    const sc=overallScore(p,financialScores([...state.properties.filter(x=>x.id!==p.id),p]));
    const text=`${p.name||"Apartamento"}
${p.address||""}
Preço: ${parseNum(p.price)?brl(p.price):"não informado"}
Nota auxiliar: ${sc==null?"—":num(sc,1)}
${p.nearestMetro?`Metrô: ${p.nearestMetro}`:""}`.trim();

    if (pdfReady()) {
      const result=await generatePropertyPdf(p,{blobOnly:true});
      if(result){
        if (isAndroidApp() && typeof AndroidApp.shareBase64File === "function") {
          const base64 = result.doc.output("datauristring").split(",")[1];
          AndroidApp.shareBase64File(result.filename,"application/pdf",base64,`Checklist — ${p.name||"Apartamento"}`);
          return;
        }
        const file=new File([result.blob],result.filename,{type:"application/pdf"});
        try{
          if(navigator.canShare?.({files:[file]})){
            await navigator.share({title:`Checklist — ${p.name||"Apartamento"}`,text,files:[file]});
            return;
          }
        }catch(err){
          if(err?.name==="AbortError") return;
          console.error(err);
        }
      }
    }

    if (isAndroidApp() && typeof AndroidApp.shareText === "function") {
      AndroidApp.shareText(`Checklist — ${p.name||"Apartamento"}`,text);
      return;
    }
    if(navigator.share){
      try{await navigator.share({title:`Checklist — ${p.name||"Apartamento"}`,text});return;}
      catch(err){if(err?.name==="AbortError") return;}
    }
    openExternalUrl(`https://wa.me/?text=${encodeURIComponent(text)}`);
  }

  async function generateComparisonPdf(){
    if(!state.properties.length) return toast("Não há apartamentos salvos.");
    if(!pdfReady()) return toast("Gerador de PDF indisponível agora.");

    const {jsPDF}=window.jspdf;
    const doc=new jsPDF({unit:"mm",format:"a4"});
    const finMap=financialScores(state.properties);
    const ranked=state.properties.map(p=>({
      p,technical:technicalScore(p).score,location:locationScore(p),
      financial:finMap[p.id],overall:overallScore(p,finMap)
    })).sort((a,b)=>(b.overall??-1)-(a.overall??-1));

    doc.setFillColor(15,23,42);doc.rect(0,0,210,29,"F");
    doc.setTextColor(255,255,255);doc.setFont("helvetica","bold");doc.setFontSize(16);
    doc.text("Comparação de Apartamentos — Samir",14,12);
    doc.setFont("helvetica","normal");doc.setFontSize(8);
    doc.text(`Gerado em ${new Date().toLocaleString("pt-BR")} • ${ranked.length} imóvel(is)`,14,20);
    doc.setTextColor(17,24,39);

    doc.autoTable({
      startY:36,
      head:[["#","Apartamento","Preço","+ Reforma","R$/m²","Trabalho","Metrô","Téc.","Loc.","C/B","Geral"]],
      body:ranked.map((r,i)=>[
        `${i+1}º`,
        r.p.name||r.p.address||"Sem nome",
        parseNum(r.p.price)?brl(r.p.price):"—",
        parseNum(r.p.price)?brl(parseNum(r.p.price)+parseNum(r.p.renovation)):"—",
        parseNum(r.p.price)&&parseNum(r.p.area)?brl(parseNum(r.p.price)/parseNum(r.p.area)):"—",
        r.p.distanceKm!=null?`${num(r.p.distanceKm,1)} km`:"—",
        r.p.metroKm!=null?`${num(r.p.metroKm,1)} km`:"—",
        r.technical==null?"—":num(r.technical,1),
        r.location==null?"—":num(r.location,1),
        r.financial==null?"—":num(r.financial,1),
        r.overall==null?"—":num(r.overall,1)
      ]),
      styles:{fontSize:6.5,cellPadding:1.6,lineColor:[226,232,240]},
      headStyles:{fillColor:[29,78,216],textColor:[255,255,255]},
      columnStyles:{0:{cellWidth:8},1:{cellWidth:34},2:{cellWidth:20},3:{cellWidth:21},4:{cellWidth:17},5:{cellWidth:15},6:{cellWidth:13},7:{cellWidth:10},8:{cellWidth:10},9:{cellWidth:10},10:{cellWidth:11}}
    });

    let y=doc.lastAutoTable.finalY+8;
    ranked.forEach((r,i)=>{
      if(y>255){doc.addPage();y=18;}
      doc.setFont("helvetica","bold");doc.setFontSize(10);
      doc.text(`${i+1}º — ${(r.p.name||r.p.address||"Apartamento").slice(0,85)}`,14,y);
      y+=5;
      doc.setFont("helvetica","normal");doc.setFontSize(7.5);
      const details=[
        `Endereço: ${[r.p.address,r.p.city,r.p.floor].filter(Boolean).join(" • ")||"—"}`,
        `Pontos fortes: ${r.p.pros||"—"}`,
        `Pontos de atenção: ${r.p.cons||"—"}`
      ];
      details.forEach(t=>{const lines=doc.splitTextToSize(t,178);doc.text(lines,14,y);y+=lines.length*3.4+1;});
      y+=3;
    });
    doc.setFont("helvetica","normal");doc.setTextColor(100,116,139);doc.setFontSize(7);
    if(y>270){doc.addPage();y=20;}
    doc.text("Pesos do ranking: 45% condição técnica, 25% localização e 30% custo-benefício relativo aos imóveis cadastrados.",14,y);
    doc.setTextColor(15,23,42);doc.setFont("helvetica","bold");doc.setFontSize(8);
    doc.text("Powered by thIAguinho Soluções",105,287,{align:"center"});
    const filename = "comparacao-apartamentos-samir.pdf";
    if (isAndroidApp() && typeof AndroidApp.saveBase64File === "function") {
      const base64 = doc.output("datauristring").split(",")[1];
      AndroidApp.saveBase64File(filename,"application/pdf",base64);
    } else {
      doc.save(filename);
    }
  }

  function exportBackup(){
    const payload={version:1,exportedAt:new Date().toISOString(),settings:loadSettings(),properties:state.properties};
    const filename=`backup-apartamentos-samir-${new Date().toISOString().slice(0,10)}.json`;
    const content=JSON.stringify(payload,null,2);
    if (isAndroidApp() && typeof AndroidApp.exportTextFile === "function") {
      AndroidApp.exportTextFile(filename,content);
      return;
    }
    const blob=new Blob([content],{type:"application/json"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);
    a.download=filename;
    a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500);
  }

  async function importBackup(e){
    const file=e.target.files?.[0]; if(!file)return;
    try{
      const data=JSON.parse(await file.text());
      if(!Array.isArray(data.properties)) throw new Error("Arquivo inválido");
      state.properties=data.properties;
      persistAll();
      if(data.settings) saveSettings(data.settings);
      renderSaved();renderComparison();updateAllUI();
      toast("Backup restaurado com sucesso.");
    }catch(err){toast("Não foi possível restaurar este backup.");}
    e.target.value="";
  }

  window.CasaDoSamirBack = function() {
    const active = $(".tab.is-active")?.dataset.tab || "visita";
    if (active !== "visita") {
      switchTab("visita");
      return true;
    }
    return false;
  };

  function init(){
    if (isAndroidApp()) {
      document.body.classList.add("android-app");
      try {
        const path = AndroidApp.getStorageDescription?.();
        if (path) console.info("Armazenamento local:", path);
      } catch {}
    }
    renderChecklist();
    bindEvents();
    if(localStorage.getItem("samirTheme")==="dark") document.body.classList.add("dark");
    newVisit(true);
    renderSaved();
    renderComparison();
    updateAllUI();
  }

  init();
})();
