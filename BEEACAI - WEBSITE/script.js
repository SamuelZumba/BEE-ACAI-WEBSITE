const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
const side = $("#sideMenu"),
  overlay = $(".overlay"),
  burger = $(".hamburger");
function openMenu() {
  side?.classList.add("open");
  overlay?.classList.add("show");
  side?.setAttribute("aria-hidden", "false");
  burger?.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
}
function closeMenu() {
  side?.classList.remove("open");
  overlay?.classList.remove("show");
  side?.setAttribute("aria-hidden", "true");
  burger?.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}
burger?.addEventListener("click", openMenu);
$$("[data-close-menu], .side-menu a").forEach((el) =>
  el.addEventListener("click", closeMenu),
);
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeMenu();
    closeLightbox();
  }
});
const reveals = $$(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("show");
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.12 },
  );
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("show"));
}
const sections = ["inicio", "pedido", "historia", "cursos", "revenda"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);
const bottomLinks = $$('.bottom-nav a[href^="#"]');
function setActive() {
  let current = "inicio";
  sections.forEach((sec) => {
    if (sec.getBoundingClientRect().top < window.innerHeight * 0.42)
      current = sec.id;
  });
  bottomLinks.forEach((a) =>
    a.classList.toggle("active", a.getAttribute("href") === "#" + current),
  );
}
window.addEventListener("scroll", setActive, { passive: true });
setActive();
const ramo = $("#ramo-select"),
  campoOutro = $("#campo-outro");
ramo?.addEventListener("change", () => {
  campoOutro?.classList.toggle("hide", ramo.value !== "outro");
  validateField($("#ramo-select"));
  validateField($("#outro_ramo"));
});

function onlyDigits(v) {
  return (v || "").replace(/\D/g, "");
}
function maskCpf(v) {
  return onlyDigits(v)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}
function maskCnpj(v) {
  return onlyDigits(v)
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}
function maskPhone(v) {
  return onlyDigits(v)
    .slice(0, 11)
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

function isValidCpf(value) {
  const cpf = onlyDigits(value);
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(cpf[i]) * (10 - i);
  let d1 = (sum * 10) % 11;
  if (d1 === 10) d1 = 0;
  if (d1 !== Number(cpf[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += Number(cpf[i]) * (11 - i);
  let d2 = (sum * 10) % 11;
  if (d2 === 10) d2 = 0;
  return d2 === Number(cpf[10]);
}
function isValidCnpj(value) {
  const cnpj = onlyDigits(value);
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;
  const calc = (base, weights) => {
    const sum = base
      .split("")
      .reduce((a, n, i) => a + Number(n) * weights[i], 0);
    const mod = sum % 11;
    return mod < 2 ? 0 : 11 - mod;
  };
  const d1 = calc(cnpj.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const d2 = calc(cnpj.slice(0, 13), [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  return d1 === Number(cnpj[12]) && d2 === Number(cnpj[13]);
}
function isValidPhone(value) {
  const n = onlyDigits(value);
  const ddds = new Set([
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "21",
    "22",
    "24",
    "27",
    "28",
    "31",
    "32",
    "33",
    "34",
    "35",
    "37",
    "38",
    "41",
    "42",
    "43",
    "44",
    "45",
    "46",
    "47",
    "48",
    "49",
    "51",
    "53",
    "54",
    "55",
    "61",
    "62",
    "63",
    "64",
    "65",
    "66",
    "67",
    "68",
    "69",
    "71",
    "73",
    "74",
    "75",
    "77",
    "79",
    "81",
    "82",
    "83",
    "84",
    "85",
    "86",
    "87",
    "88",
    "89",
    "91",
    "92",
    "93",
    "94",
    "95",
    "96",
    "97",
    "98",
    "99",
  ]);
  if (n.length !== 11) return false;
  if (!ddds.has(n.slice(0, 2))) return false;
  if (n[2] !== "9") return false;
  if (/^(\d)\1+$/.test(n.slice(2))) return false;
  return true;
}
function emailMessage(value) {
  const v = value.trim();

  if (!v) return "E-mail obrigatório.";
  if (/\s/.test(v)) return "E-mail inválido: remova os espaços.";
  if (!v.includes("@")) return "E-mail inválido: falta o @.";

  const [user, domain, ...extra] = v.split("@");

  if (extra.length) return "E-mail inválido: use apenas um @.";
  if (!user) return "E-mail inválido: falta o nome antes do @.";
  if (!domain) return "E-mail inválido: falta o domínio depois do @.";
  if (!domain.includes("."))
    return "E-mail inválido: falta o ponto no domínio. Exemplo: gmail.com.";
  if (!domain.toLowerCase().includes(".com"))
    return "E-mail inválido: falta o .com no domínio.";
  if (!/^[^\s@]+@[^\s@]+\.com(\.[^\s@]+)?$/i.test(v))
    return "E-mail inválido: confira se está no formato correto.";

  return "";
}
function normalizeCompanyName(value) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}
function getCompanyCache() {
  try {
    return JSON.parse(localStorage.getItem("beeEmpresasCache") || "{}");
  } catch (e) {
    return {};
  }
}
function saveCompanyCache(name, cnpj) {
  const key = normalizeCompanyName(name);
  if (!key || !cnpj) return;
  const cache = getCompanyCache();
  cache[key] = { name, cnpj };
  try {
    localStorage.setItem("beeEmpresasCache", JSON.stringify(cache));
  } catch (e) {}
}
let cnpjLookupTimer;
async function lookupCnpjData(cnpjValue) {
  const cnpj = onlyDigits(cnpjValue);
  if (cnpj.length !== 14 || !isValidCnpj(cnpjValue)) return;
  try {
    const response = await fetch(
      `https://brasilapi.com.br/api/cnpj/v1/${cnpj}`,
    );
    if (!response.ok) return;
    const data = await response.json();
    const nome = (data.razao_social || data.nome_fantasia || "").trim();
    if (nome) {
      const empresa = $("#empresa");
      if (
        empresa &&
        (!empresa.value.trim() || empresa.dataset.autofill === "cnpj")
      ) {
        empresa.value = nome;
        empresa.dataset.autofill = "cnpj";
        validateField(empresa);
      }
      saveCompanyCache(nome, cnpj);
      if (data.nome_fantasia) saveCompanyCache(data.nome_fantasia, cnpj);
    }
  } catch (e) {}
}
function tryFillCnpjByCompanyName() {
  const empresa = $("#empresa"),
    cnpjInput = $("#cnpj");
  if (!empresa || !cnpjInput || cnpjInput.value.trim()) return;
  const item = getCompanyCache()[normalizeCompanyName(empresa.value)];
  if (item?.cnpj) {
    cnpjInput.value = maskCnpj(item.cnpj);
    cnpjInput.dataset.autofill = "empresa";
    validateField(cnpjInput);
  }
}
function ensureErrorEl(input) {
  if (!input) return null;
  let label = input.closest("label");
  let msg = label?.querySelector(".field-error");
  if (!msg) {
    msg = document.createElement("small");
    msg.className = "field-error";
    label?.appendChild(msg);
  }
  return msg;
}
function setFieldState(input, message) {
  if (!input) return false;
  const msg = ensureErrorEl(input);
  const invalid = Boolean(message);
  const hasValue =
    input.type === "checkbox" ? input.checked : input.value.trim().length > 0;
  const canBeValid =
    !invalid && hasValue && !input.closest(".hide") && input.type !== "hidden";
  input.classList.toggle("input-error", invalid);
  input.classList.toggle("input-valid", canBeValid);
  input.setAttribute("aria-invalid", invalid ? "true" : "false");
  if (msg) msg.textContent = message || "";
  return !invalid;
}
function validateField(input) {
  if (!input) return true;
  const id = input.id;
  const value = input.type === "checkbox" ? input.checked : input.value.trim();
  if (id === "outro_ramo" && ramo?.value !== "outro") {
    input.classList.remove("input-error", "input-valid");
    return setFieldState(input, "");
  }
  if (input.required && (input.type === "checkbox" ? !input.checked : !value)) {
    if (id === "consentimento")
      return setFieldState(
        input,
        "Você precisa aceitar os termos para enviar.",
      );
    return setFieldState(input, "Campo obrigatório.");
  }
  if (id === "nome" && value.length < 3)
    return setFieldState(input, "Digite o nome completo.");
  if (id === "email") return setFieldState(input, emailMessage(input.value));
  if (id === "empresa" && value.length < 2)
    return setFieldState(input, "Digite o nome da empresa.");
  if (id === "ramo-select" && !input.value)
    return setFieldState(input, "Selecione o ramo de atuação.");
  if (id === "outro_ramo" && ramo?.value === "outro" && value.length < 2)
    return setFieldState(input, "Informe o outro ramo de atuação.");
  if (id === "cpf") {
    if (onlyDigits(value).length < 11)
      return setFieldState(input, "CPF incompleto.");
    return setFieldState(input, isValidCpf(value) ? "" : "CPF inválido.");
  }
  if (id === "cnpj") {
    if (onlyDigits(value).length < 14)
      return setFieldState(input, "CNPJ incompleto.");
    return setFieldState(input, isValidCnpj(value) ? "" : "CNPJ inválido.");
  }
  if (id === "whatsapp") {
    if (onlyDigits(value).length < 11)
      return setFieldState(input, "WhatsApp incompleto.");
    return setFieldState(
      input,
      isValidPhone(value) ? "" : "WhatsApp inválido. Confira DDD e número.",
    );
  }
  return setFieldState(input, "");
}

$("#cpf")?.addEventListener("input", (e) => {
  e.target.value = maskCpf(e.target.value);
  validateField(e.target);
});
$("#cnpj")?.addEventListener("input", (e) => {
  e.target.value = maskCnpj(e.target.value);
  validateField(e.target);
  clearTimeout(cnpjLookupTimer);
  cnpjLookupTimer = setTimeout(() => lookupCnpjData(e.target.value), 700);
});
$("#whatsapp")?.addEventListener("input", (e) => {
  e.target.value = maskPhone(e.target.value);
  validateField(e.target);
});
$$("#form-revendedor input, #form-revendedor select").forEach((el) => {
  if (!["cpf", "cnpj", "whatsapp"].includes(el.id))
    el.addEventListener("input", () => {
      validateField(el);
      if (el.id === "empresa") {
        el.dataset.autofill = "";
        tryFillCnpjByCompanyName();
      }
    });
  el.addEventListener("blur", () => validateField(el));
  el.addEventListener("change", () => validateField(el));
});

$("#form-revendedor")?.addEventListener("submit", async function (e) {
  e.preventDefault();
  const fields = $$("#form-revendedor input, #form-revendedor select").filter(
    (el) => el.type !== "hidden",
  );
  const ok = fields.map(validateField).every(Boolean);
  if (!ok) {
    const first = $("#form-revendedor .input-error");
    first?.focus();
    first?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  const btn = this.querySelector('button[type="submit"]');
  btn.textContent = "ENVIANDO...";
  btn.disabled = true;
  try {
    const r = await fetch(this.action, {
      method: "POST",
      body: new FormData(this),
      headers: { Accept: "application/json" },
    });
    if (!r.ok) throw new Error("send");
    this.reset();
    $$(".field-error").forEach((el) => (el.textContent = ""));
    $$(".input-error,.input-valid").forEach((el) =>
      el.classList.remove("input-error", "input-valid"),
    );
    campoOutro?.classList.add("hide");
    $("#status-envio")?.classList.remove("hide");
  } catch (err) {
    alert(
      "Não foi possível enviar agora. Tente novamente ou entre em contato pelo Instagram da Bee Açaí.",
    );
  } finally {
    btn.textContent = "ENVIAR";
    btn.disabled = false;
  }
});
function openTerms() {
  const card = $("#privacy-card");
  if (card) {
    card.hidden = false;
    card.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}
function closeTerms() {
  const card = $("#privacy-card");
  if (card) card.hidden = true;
}
window.openTerms = openTerms;
window.closeTerms = closeTerms;
function openImage(src) {
  const box = $("#lightbox"),
    img = $("#lightbox-img"),
    vid = $("#lightbox-video");
  if (!box || !img || !vid) return;
  vid.pause();
  vid.style.display = "none";
  img.style.display = "block";
  img.src = src;
  box.classList.add("show");
  document.body.style.overflow = "hidden";
}
function openVideo() {
  const box = $("#lightbox"),
    img = $("#lightbox-img"),
    vid = $("#lightbox-video");
  if (!box || !img || !vid) return;
  img.style.display = "none";
  vid.style.display = "block";
  vid.src = "feedback.mp4";
  box.classList.add("show");
  vid.play();
  document.body.style.overflow = "hidden";
}
function closeLightbox() {
  const box = $("#lightbox"),
    vid = $("#lightbox-video");
  if (!box || !vid) return;
  box.classList.remove("show");
  vid.pause();
  document.body.style.overflow = "";
}
window.openImage = openImage;
window.openVideo = openVideo;
window.closeLightbox = closeLightbox;
$("#lightbox")?.addEventListener("click", (e) => {
  if (e.target.id === "lightbox" || e.target.tagName === "BUTTON")
    closeLightbox();
});


const featureCards = $$(".feature-card");
const featureDots = $$(".feature-dots button");
let featureIndex = 0;
let featureTimer;
function setFeatureSlide(index) {
  if (!featureCards.length) return;
  featureIndex = (index + featureCards.length) % featureCards.length;
  const prevIndex =
    (featureIndex - 1 + featureCards.length) % featureCards.length;
  const nextIndex = (featureIndex + 1) % featureCards.length;
  featureCards.forEach((card, i) => {
    card.classList.toggle("active", i === featureIndex);
    card.classList.toggle("prev", i === prevIndex);
    card.classList.toggle("next", i === nextIndex);
  });
  featureDots.forEach((dot, i) =>
    dot.classList.toggle("active", i === featureIndex),
  );
}
function startFeatureCarousel() {
  clearInterval(featureTimer);
  featureTimer = setInterval(() => setFeatureSlide(featureIndex + 1), 6000);
}
featureDots.forEach((dot, i) =>
  dot.addEventListener("click", () => {
    setFeatureSlide(i);
    startFeatureCarousel();
  }),
);
let featureTouchStart = 0;
const featureTrack = $(".feature-track");
featureTrack?.addEventListener(
  "touchstart",
  (e) => {
    featureTouchStart = e.touches[0].clientX;
  },
  { passive: true },
);
featureTrack?.addEventListener(
  "touchend",
  (e) => {
    const diff = e.changedTouches[0].clientX - featureTouchStart;
    if (Math.abs(diff) > 45) {
      setFeatureSlide(featureIndex + (diff < 0 ? 1 : -1));
      startFeatureCarousel();
    }
  },
  { passive: true },
);

let featurePointerStart = 0;
let featureDragging = false;
featureTrack?.addEventListener("mousedown", (e) => {
  featureDragging = true;
  featurePointerStart = e.clientX;
  featureTrack.style.cursor = "grabbing";
});
window.addEventListener("mouseup", (e) => {
  if (!featureDragging) return;
  featureDragging = false;
  featureTrack.style.cursor = "grab";
  const diff = e.clientX - featurePointerStart;
  if (Math.abs(diff) > 45) {
    setFeatureSlide(featureIndex + (diff < 0 ? 1 : -1));
    startFeatureCarousel();
  }
});

setFeatureSlide(0);
startFeatureCarousel();
