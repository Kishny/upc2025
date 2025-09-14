/* =========================
   NAV / HEADER
========================= */
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");

if (burger) {
  burger.addEventListener("click", () => nav.classList.toggle("open"));
  nav
    ?.querySelectorAll("a")
    .forEach((a) =>
      a.addEventListener("click", () => nav.classList.remove("open"))
    );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") nav?.classList.remove("open");
  });
}

/* =========================
   FOOTER
========================= */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* =========================
   HERO — Vidéo
========================= */
const video = document.getElementById("meetingVideo");
const btn = document.getElementById("volumeToggle");
const iconMute = document.getElementById("iconMute");
const iconSound = document.getElementById("iconSound");

if (video) {
  video.loop = true;
  video.muted = true;
  video.play().catch(() => console.log("Autoplay bloqué"));
  btn?.addEventListener("click", () => {
    video.muted = !video.muted;
    iconMute?.classList.toggle("hidden");
    iconSound?.classList.toggle("hidden");
  });
}

/* =========================
   BACKEND — URL dynamique
========================= */
const BASE_URL = ["127.0.0.1", "localhost"].includes(location.hostname)
  ? "http://127.0.0.1:4000"
  : "https://upc2025-backend.onrender.com";

/* =========================
   POST FORMULAIRE
========================= */
async function postForm(url, data) {
  try {
    const res = await fetch(`${BASE_URL}${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    console.error("Erreur fetch:", err);
    return { ok: false, error: "NETWORK_ERROR" };
  }
}

/* =========================
   FORMULAIRE ADHÉSION
========================= */
const form = document.getElementById("form-adhesion");
const orgFields = document.querySelector(".org-only");
const downloadBtn = document.getElementById("download-form");
const memberTypeRadios = document.querySelectorAll('input[name="member_type"]');
const modeRadios = document.querySelectorAll('input[name="inscription_mode"]');

function updateFormDisplay() {
  const memberType = document.querySelector(
    'input[name="member_type"]:checked'
  ).value;
  const mode = document.querySelector(
    'input[name="inscription_mode"]:checked'
  ).value;

  orgFields.style.display = memberType === "organization" ? "flex" : "none";
  downloadBtn.style.display = mode === "online" ? "none" : "inline-block";
}

memberTypeRadios.forEach((r) =>
  r.addEventListener("change", updateFormDisplay)
);
modeRadios.forEach((r) => r.addEventListener("change", updateFormDisplay));

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const inputs = form.querySelectorAll("input, select");
  for (let inp of inputs)
    if (inp.required && !inp.value)
      return alert("Merci de remplir tous les champs obligatoires.");

  const data = Object.fromEntries(new FormData(form));
  const mode = document.querySelector(
    'input[name="inscription_mode"]:checked'
  ).value;

  try {
    const result = await postForm("/api/join", data);
    if (!result.ok) return alert("Erreur : " + (result.error || "Serveur"));

    // Afficher popup de succès
    alert("Formulaire envoyé ! Votre certificat est prêt au téléchargement.");

    // Réinitialiser le formulaire
    form.reset();
    updateFormDisplay();

    // Afficher bouton téléchargement pour certificat
    if (mode === "online" && result.pdfPath) {
      downloadBtn.style.display = "inline-block";
      downloadBtn.onclick = () =>
        window.open(`${BASE_URL}/${result.pdfPath}`, "_blank");
    }
  } catch (err) {
    console.error(err);
    alert("Erreur serveur, réessayez plus tard.");
  }
});

// Initialisation
updateFormDisplay();

/* =========================
   COOKIE POPUP
========================= */
if (!localStorage.getItem("cookiesAccepted")) {
  const cookieBanner = document.createElement("div");
  cookieBanner.innerHTML = `
    <div style="position:fixed;bottom:0;width:100%;background:#f1f1f1;padding:1rem;text-align:center;z-index:9999;box-shadow:0 -2px 10px rgba(0,0,0,0.1);">
      Ce site utilise des cookies pour améliorer votre expérience.
      <button id="acceptCookies" style="margin-left:1rem;padding:0.5rem 1rem;background:#007a5e;color:#fff;border:none;border-radius:5px;cursor:pointer;">Accepter</button>
      <button id="declineCookies" style="margin-left:0.5rem;padding:0.5rem 1rem;background:#ccc;color:#000;border:none;border-radius:5px;cursor:pointer;">Refuser</button>
    </div>
  `;
  document.body.appendChild(cookieBanner);

  document.getElementById("acceptCookies").onclick = () => {
    localStorage.setItem("cookiesAccepted", "true");
    cookieBanner.remove();
  };
  document.getElementById("declineCookies").onclick = () => {
    localStorage.setItem("cookiesAccepted", "false");
    cookieBanner.remove();
  };
}
/* =========================
   FORMULAIRE CONTACT
========================= 
const contactForm = document.getElementById("form-contact");
if (contactForm) {
  const subjectSelect = contactForm.querySelector('select[name="subject"]');
  const otherSubjectInput = contactForm.querySelector(
    'input[name="other_subject"]'
  );

  subjectSelect.addEventListener("change", () => {
    if (subjectSelect.value === "other") {
      otherSubjectInput.style.display = "block";
      otherSubjectInput.required = true;
    } else {
      otherSubjectInput.style.display = "none";
      otherSubjectInput.required = false;
    }
  });
}
// Initialisation
if (otherSubjectInput) otherSubjectInput.style.display = "none";
*/
