// Burger / Nav
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");
if (burger)
  burger.addEventListener("click", () => nav.classList.toggle("open"));

// Year
document.getElementById("year").textContent = new Date().getFullYear();

// Pillars slider buttons
const track = document.querySelector(".pillars__track");
const prev = document.querySelector(".pillars .prev");
const next = document.querySelector(".pillars .next");
const scrollBy = 300;
prev?.addEventListener("click", () =>
  track.scrollBy({ left: -scrollBy, behavior: "smooth" })
);
next?.addEventListener("click", () =>
  track.scrollBy({ left: scrollBy, behavior: "smooth" })
);

// Forms (no backend): fake success + basic validation
function wireForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  const alertBox = form.querySelector(".form__alert");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      alertBox.hidden = false;
      alertBox.style.borderColor = "#CE1126";
      alertBox.textContent = i18n.t("form_invalid");
      return;
    }
    alertBox.hidden = false;
    alertBox.style.borderColor = "#007A5E";
    alertBox.textContent = i18n.t("form_success");
    form.reset();
  });
}
["form-adhesion", "form-committee", "form-contact"].forEach(wireForm);

// --- Minimal i18n (FR/EN toggle) ---
const DICT = {
  fr: {
    topbar_msg: "Élection présidentielle — Octobre 2025",
    contact: "Contact",
    nav_about: "À propos",
    nav_candidate: "Candidat",
    nav_docs: "Documents",
    nav_join: "Adhérer",
    nav_news: "Actualités",
    nav_media: "Médias",
    hero_title: "Union Pour le Changement — 2025",
    hero_subtitle: "Mobiliser. Fédérer. Gagner.",
    cta_join: "Adhérer maintenant",
    cta_program: "Télécharger le programme",
    pillar_1: "Priorités politiques",
    pillar_2: "Audit de l’État",
    pillar_3: "Réformes institutionnelles",
    pillar_4: "Réformes économiques",
    pillar_5: "Réformes sociales",
    pillar_6: "Pan-africanisme & diplomatie",
    about_title: "À propos de la Coalition",
    about_text:
      "Large coalition citoyenne et politique engagée pour l’alternance pacifique en 2025. Structure décentralisée, comités locaux, campagne participative.",
    about_point_1: "Fédérer les forces du changement",
    about_point_2: "Présenter un candidat consensuel",
    about_point_3: "Surveiller et défendre le vote",
    call_action: "Agir près de chez vous",
    call_action_text:
      "Rejoignez ou créez un comité local. Porte-à-porte, mobilisation, protection du vote.",
    cta_create_committee: "Créer un comité",
    candidate_title: "Le candidat consensuel",
    candidate_text:
      "Présentation courte du candidat (bio, valeurs, engagements).",
    candidate_read_oath: "Lire le serment",
    candidate_read_commitment: "Lire l’engagement",
    docs_title: "Documents officiels",
    doc_program: "Présentation ",
    doc_program_desc: "Qui sommes nous.",
    doc_appeal: "Appel à l’Union",
    doc_appeal_desc: "Texte d’adhésion à la coalition.",
    doc_candidate: "Engagement du candidat",
    doc_candidate_desc: "Principes et modalités de la candidature.",
    doc_member: "Engagement du membre",
    doc_member_desc: "Formulaire d’engagement.",
    doc_org: "Fiche d’adhésion — Organisation",
    doc_org_desc: "Télécharger le PDF.",
    doc_personal: "Fiche d’adhésion — Personnelle",
    doc_personal_desc: "Télécharger le PDF.",
    join_title: "Adhérer (individuel)",
    field_name: "Nom & Prénoms",
    field_phone: "Téléphone / WhatsApp",
    field_region: "Région",
    field_role: "Comment contribuer ?",
    opt_donor: "Donateur",
    opt_comms: "Communication",
    opt_mobilize: "Mobilisation",
    opt_vote: "Contrôle du vote",
    opt_influencer: "Influence",
    btn_send: "Envoyer",
    privacy_note:
      "En envoyant, vous acceptez notre politique de confidentialité.",
    committee_title: "Créer un comité local",
    field_committee: "Nom du comité",
    field_city: "Ville / Commune",
    field_contact: "Contact (email / tel)",
    btn_register: "Enregistrer",
    committee_note: "Nous vous recontacterons rapidement.",
    news_title: "Actualités",
    news_1_title: "Annonce du meeting national",
    news_1_excerpt: "Présentation du candidat et mobilisation des comités.",
    news_2_title: "Ouverture des adhésions",
    news_2_excerpt: "Rejoignez dès aujourd’hui l’Union pour le Changement.",
    news_3_title: "Appel à volontaires",
    news_3_excerpt: "Mobilisation, communication, contrôle du vote.",
    read_more: "Lire",
    media_title: "Galerie",
    contact_title: "Contact",
    contact_text: "Une question ? Un média ? Un partenariat ?",
    field_subject: "Sujet",
    field_message: "Message",
    btn_send_msg: "Envoyer",
    rights: "Tous droits réservés.",
    footer_docs: "Documents",
    footer_legal: "Mentions légales",
    footer_privacy: "Confidentialité",
    form_invalid: "Veuillez compléter les champs requis.",
    form_success: "Merci ! Votre envoi a bien été pris en compte.",
  },
  en: {
    topbar_msg: "Presidential election — October 2025",
    contact: "Contact",
    nav_about: "About",
    nav_candidate: "Candidate",
    nav_docs: "Documents",
    nav_join: "Join",
    nav_news: "News",
    nav_media: "Media",
    hero_title: "Union for Change — 2025",
    hero_subtitle: "Mobilize. Unite. Win.",
    cta_join: "Join now",
    cta_program: "Download the program",
    pillar_1: "Political priorities",
    pillar_2: "State audit",
    pillar_3: "Institutional reforms",
    pillar_4: "Economic reforms",
    pillar_5: "Social reforms",
    pillar_6: "Pan-Africanism & diplomacy",
    about_title: "About the Coalition",
    about_text:
      "Broad civic and political coalition for peaceful alternation in 2025. Decentralized structure, local committees, participatory campaign.",
    about_point_1: "Unite forces for change",
    about_point_2: "Present a consensus candidate",
    about_point_3: "Monitor and defend the vote",
    call_action: "Act locally",
    call_action_text:
      "Join or create a local committee. Door-to-door, mobilization, vote protection.",
    cta_create_committee: "Create a committee",
    candidate_title: "The consensus candidate",
    candidate_text: "Short bio, values, commitments.",
    candidate_read_oath: "Read the oath",
    candidate_read_commitment: "Read the commitment",
    docs_title: "Official documents",
    doc_program: "Common Program",
    doc_program_desc: "The 6 priority areas.",
    doc_appeal: "Appeal to Union",
    doc_appeal_desc: "Coalition joining text.",
    doc_candidate: "Candidate commitment",
    doc_candidate_desc: "Principles and candidacy terms.",
    doc_member: "Member commitment",
    doc_member_desc: "Engagement form.",
    doc_org: "Membership form — Organization",
    doc_org_desc: "Download PDF.",
    doc_personal: "Membership form — Personal",
    doc_personal_desc: "Download PDF.",
    join_title: "Join (individual)",
    field_name: "Full name",
    field_phone: "Phone / WhatsApp",
    field_region: "Region",
    field_role: "How to contribute?",
    opt_donor: "Donor",
    opt_comms: "Communication",
    opt_mobilize: "Mobilization",
    opt_vote: "Vote control",
    opt_influencer: "Influence",
    btn_send: "Send",
    privacy_note: "By submitting, you accept our privacy policy.",
    committee_title: "Create a local committee",
    field_committee: "Committee name",
    field_city: "City / Municipality",
    field_contact: "Contact (email / phone)",
    btn_register: "Register",
    committee_note: "We will get back to you shortly.",
    news_title: "News",
    news_1_title: "National rally announced",
    news_1_excerpt: "Candidate presentation and committee mobilization.",
    news_2_title: "Membership is open",
    news_2_excerpt: "Join the Union for Change today.",
    news_3_title: "Call for volunteers",
    news_3_excerpt: "Mobilization, communication, vote monitoring.",
    read_more: "Read",
    media_title: "Gallery",
    contact_title: "Contact",
    contact_text: "Press, partnerships or general questions?",
    field_subject: "Subject",
    field_message: "Message",
    btn_send_msg: "Send",
    rights: "All rights reserved.",
    footer_docs: "Documents",
    footer_legal: "Legal",
    footer_privacy: "Privacy",
    form_invalid: "Please complete required fields.",
    form_success: "Thank you! Your submission has been received.",
  },
};

const i18n = {
  lang: localStorage.getItem("lang") || "fr",
  t(key) {
    return DICT[this.lang][key] ?? key;
  },
  apply() {
    document.documentElement.lang = this.lang;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      el.textContent = this.t(key);
    });
  },
  toggle() {
    this.lang = this.lang === "fr" ? "en" : "fr";
    localStorage.setItem("lang", this.lang);
    this.apply();
  },
};
i18n.apply();

const langToggle = document.getElementById("langToggle");
langToggle?.addEventListener("click", () => i18n.toggle());
