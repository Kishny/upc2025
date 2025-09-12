/* =========================
   NAV / HEADER
   ========================= */
// Burger / Nav
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");
if (burger) {
  burger.addEventListener("click", () => nav.classList.toggle("open"));
  // Fermer le menu quand on clique sur un lien (mobile)
  nav
    ?.querySelectorAll("a")
    .forEach((a) =>
      a.addEventListener("click", () => nav.classList.remove("open"))
    );
  // Fermer avec ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") nav?.classList.remove("open");
  });
}

// Lien actif (surbrillance) selon la page
(function markActiveNav() {
  const path = location.pathname.split("/").pop() || "index.html";
  document
    .querySelectorAll("#nav a")
    .forEach((a) =>
      a.classList.toggle("active", a.getAttribute("href") === path)
    );
})();

/* =========================
   FOOTER
   ========================= */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* =========================
   SLIDER — PILLIERS (si présent sur une page)
   ========================= */
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

/* =========================
   SLIDER — AXES DU PROGRAMME (Accueil)
   ========================= */
(function axisSlider() {
  const wrap = document.getElementById("axisSlider");
  if (!wrap) return;
  const slides = Array.from(wrap.children);
  const dots = document.getElementById("axisDots");

  // Dots
  slides.forEach((_, i) => {
    const b = document.createElement("button");
    if (i === 0) b.classList.add("active");
    b.addEventListener("click", () => {
      wrap.scrollTo({ left: slides[i].offsetLeft - 16, behavior: "smooth" });
    });
    dots.appendChild(b);
  });

  // Active dot on scroll
  wrap.addEventListener("scroll", () => {
    const w = slides[0].offsetWidth + 16;
    const idx = Math.round(wrap.scrollLeft / w);
    [...dots.children].forEach((d, i) =>
      d.classList.toggle("active", i === idx)
    );
  });

  // Auto-play doux
  let i = 0;
  setInterval(() => {
    i = (i + 1) % slides.length;
    wrap.scrollTo({ left: slides[i].offsetLeft - 16, behavior: "smooth" });
  }, 5000);
})();

/* =========================
   I18N MINIMAL (FR / EN)
   ========================= */
const DICT = {
  fr: {
    topbar_msg: "Élection présidentielle — Octobre 2025",
    contact: "Contact",
    nav_about: "À propos",
    nav_candidate: "Candidat",
    nav_docs: "Documents",
    nav_join: "Participez",
    nav_news: "Actualités",
    nav_media: "Médias",
    // — Dans DICT.fr —
    nav_program: "Programme",
    nav_campaign: "Campagne populaire",
    nav_news_media: "Actualités / Médias",
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
    doc_program: "Présentation UPC 2025",
    doc_program_desc: "Programme, Appel, Engagements, Fiches d’adhésion.",
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
    // Axes (si tu veux traduire les titres du slider avec data-i18n)
    program_axes: "Les 5 axes du Programme",
    axis_1_title: "Paix & Cohésion",
    axis_1_text: "Réconciliation nationale et stabilité durable.",
    axis_2_title: "Réformes politiques",
    axis_2_text: "Institutions solides, État de droit, justice indépendante.",
    axis_3_title: "Croissance économique",
    axis_3_text: "Emplois, entrepreneuriat, infrastructures.",
    axis_4_title: "Développement humain",
    axis_4_text: "Éducation, santé, protection sociale.",
    axis_5_title: "Rayonnement international",
    axis_5_text: "Diplomatie active et intégration régionale.",
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
    // — Dans DICT.en —
    nav_program: "Program",
    nav_campaign: "People’s campaign",
    nav_news_media: "News / Media",
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
    program_axes: "The 5 Program Axes",
    axis_1_title: "Peace & Cohesion",
    axis_1_text: "National reconciliation and lasting stability.",
    axis_2_title: "Political reforms",
    axis_2_text: "Strong institutions, rule of law, independent justice.",
    axis_3_title: "Economic growth",
    axis_3_text: "Jobs, entrepreneurship, infrastructure.",
    axis_4_title: "Human development",
    axis_4_text: "Education, health, social protection.",
    axis_5_title: "International standing",
    axis_5_text: "Active diplomacy and regional integration.",
  },
};

// FR
Object.assign(DICT.fr, {
  candidate_caption: "Candidat consensuel — Union Pour le Changement",
  candidate_heading: "Le candidat consensuel & sa vision",
  candidate_intro:
    "Porté par une coalition large et citoyenne, le candidat consensuel incarne une transition pacifique, la refondation des institutions et l’unité nationale.",
  vision_point_1:
    "Restaurer la confiance démocratique et la justice indépendante.",
  vision_point_2:
    "Protéger le vote, garantir la transparence et l’alternance pacifique.",
  vision_point_3:
    "Relancer l’économie par l’emploi, l’entrepreneuriat et les infrastructures.",
  vision_point_4: "Investir dans l’éducation, la santé et la cohésion sociale.",
  candidate_quote:
    "« Notre victoire sera celle du peuple : une démocratie solide, une économie qui crée des opportunités et un État au service de tous. »",
});

// EN
Object.assign(DICT.en, {
  candidate_caption: "Consensus candidate — Union for Change",
  candidate_heading: "The consensus candidate & vision",
  candidate_intro:
    "Backed by a broad civic coalition, the consensus candidate stands for a peaceful transition, institutional renewal and national unity.",
  vision_point_1: "Restore democratic trust and an independent judiciary.",
  vision_point_2:
    "Protect the vote, ensure transparency and peaceful alternation.",
  vision_point_3:
    "Boost the economy through jobs, entrepreneurship and infrastructure.",
  vision_point_4: "Invest in education, health and social cohesion.",
  candidate_quote:
    "“Our victory will be the people’s: a strong democracy, an opportunity-creating economy and a State that serves everyone.”",
});

// FR
Object.assign(DICT.fr, {
  about_page_title: "À propos de l’UPC 2025",
  about_page_lead:
    "Historique & mission, objectifs de la coalition et principes du Programme Commun de Transition et de Refondation.",
  about_history_title: "Historique",
  about_tl_1_title: "Genèse citoyenne",
  about_tl_1_text:
    "Des organisations, mouvements et acteurs civiques convergent pour construire une alternative démocratique crédible.",
  about_tl_2_title: "Structuration de la coalition",
  about_tl_2_text:
    "Mise en place d’une coordination nationale, de comités locaux et de groupes thématiques.",
  about_tl_3_title: "Programme Commun",
  about_tl_3_text:
    "Élaboration participative d’un Programme Commun de Transition et de Refondation.",
  about_mission_title: "Mission",
  about_mission_text:
    "Fédérer les forces du changement, mobiliser les citoyens et garantir l’alternance pacifique en 2025, dans le respect de l’unité nationale et de l’État de droit.",
  about_mission_pt1: "Informer, mobiliser et former des comités locaux.",
  about_mission_pt2:
    "Présenter un candidat consensuel autour d’engagements clairs.",
  about_mission_pt3:
    "Protéger la souveraineté du vote et la transparence électorale.",
  about_objectives_title: "Objectifs de la coalition",
  about_obj_1_title: "Unité & consensus",
  about_obj_1_text:
    "Rassembler partis, associations, syndicats, diaspora et jeunesse autour d’un cap commun.",
  about_obj_2_title: "Campagne populaire",
  about_obj_2_text:
    "Appuyer l’action des comités de terrain : porte-à-porte, relais communautaires, protection du vote.",
  about_obj_3_title: "Transition démocratique",
  about_obj_3_text:
    "Conduire une alternance pacifique et lancer la refondation institutionnelle.",
  about_principles_title: "Principes du Programme Commun",
  about_pr_1: "État de droit, justice indépendante, libertés fondamentales.",
  about_pr_2: "Transparence, lutte contre la corruption, audit de l’État.",
  about_pr_3: "Décentralisation effective et gouvernance de proximité.",
  about_pr_4: "Relance économique inclusive et création d’emplois.",
  about_pr_5: "Investissement social : éducation, santé, cohésion nationale.",
  about_cta_title: "Envie d’agir ?",
  about_cta_text: "Rejoignez un comité local ou créez le vôtre.",
});

// EN
Object.assign(DICT.en, {
  about_page_title: "About UPC 2025",
  about_page_lead:
    "History & mission, coalition objectives and principles of the Common Program for Transition and Refoundation.",
  about_history_title: "History",
  about_tl_1_title: "Civic genesis",
  about_tl_1_text:
    "Organizations and civic actors converge to build a credible democratic alternative.",
  about_tl_2_title: "Coalition structuring",
  about_tl_2_text:
    "National coordination, local committees and thematic groups are set up.",
  about_tl_3_title: "Common Program",
  about_tl_3_text:
    "A participatory Common Program for Transition and Refoundation is drafted.",
  about_mission_title: "Mission",
  about_mission_text:
    "Unite forces for change, mobilize citizens and secure a peaceful alternation in 2025, upholding national unity and the rule of law.",
  about_mission_pt1: "Inform, mobilize and train local committees.",
  about_mission_pt2: "Present a consensus candidate with clear commitments.",
  about_mission_pt3: "Protect vote sovereignty and electoral transparency.",
  about_objectives_title: "Coalition objectives",
  about_obj_1_title: "Unity & consensus",
  about_obj_1_text:
    "Bring together parties, associations, unions, diaspora and youth around a shared path.",
  about_obj_2_title: "People-powered campaign",
  about_obj_2_text:
    "Support grassroots committees: door-to-door, community relays, vote protection.",
  about_obj_3_title: "Democratic transition",
  about_obj_3_text:
    "Achieve a peaceful alternation and launch institutional refoundation.",
  about_principles_title: "Principles of the Common Program",
  about_pr_1: "Rule of law, independent justice, fundamental freedoms.",
  about_pr_2: "Transparency, anti-corruption, state audit.",
  about_pr_3: "Effective decentralization and local governance.",
  about_pr_4: "Inclusive economic recovery and job creation.",
  about_pr_5: "Social investment: education, health, national cohesion.",
  about_cta_title: "Want to help?",
  about_cta_text: "Join a local committee or create your own.",
});

// FR
Object.assign(DICT.fr, {
  prog_title: "Programme Commun",
  prog_lead: "Les cinq axes stratégiques pour la Transition et la Refondation.",
  prog_download: "Télécharger le Programme (PDF)",
  prog_intro_title: "Une feuille de route claire",
  prog_intro_text:
    "Le Programme Commun définit les priorités immédiates pour sécuriser la paix, refonder l’État et relancer l’économie, tout en investissant dans l’humain et le rayonnement du Cameroun.",
  prog_intro_pt1: "Actions de transition réalistes et mesurables",
  prog_intro_pt2: "Gouvernance éthique et transparente",
  prog_intro_pt3: "Approche participative et inclusive",
  prog_dl_title: "Documents liés",
  prog_dl_text: "Consultez aussi les autres documents officiels.",
  prog_dl_btn: "Tous les documents",
  prog_axes_title: "Les cinq axes stratégiques",

  axis_1_tag: "Axe 1",
  axis_1_title: "Paix & Sécurité",
  axis_1_text:
    "Mettre fin aux conflits, restaurer la sécurité et la confiance civique, assurer la réconciliation nationale et la protection des citoyens.",
  axis_1_b1: "Désescalade & médiations ciblées",
  axis_1_b2: "Professionnalisation des forces",
  axis_1_b3: "Programme de réinsertion & justice transitionnelle",

  axis_2_tag: "Axe 2",
  axis_2_title: "Réformes politiques & institutionnelles",
  axis_2_text:
    "État de droit, séparation des pouvoirs, réforme électorale, décentralisation effective et lutte anticorruption.",
  axis_2_b1: "Refonte du cadre électoral & biométrie",
  axis_2_b2: "Indépendance de la justice",
  axis_2_b3: "Audit général de l’État & transparence",

  axis_3_tag: "Axe 3",
  axis_3_title: "Croissance économique & emplois",
  axis_3_text:
    "Relance productive, climat des affaires, filières locales, infrastructures et soutien aux PME/PMI.",
  axis_3_b1: "Agriculture, agro-transformation, énergie",
  axis_3_b2: "Allègement fiscal ciblé & financement des PME",
  axis_3_b3: "Grandes infrastructures utiles & PPP",

  axis_4_tag: "Axe 4",
  axis_4_title: "Développement humain",
  axis_4_text:
    "Investir dans l’éducation, la santé, la protection sociale, l’égalité des chances et la cohésion nationale.",
  axis_4_b1: "École de qualité & formation professionnelle",
  axis_4_b2: "Couverture santé & hôpitaux modernisés",
  axis_4_b3: "Programmes jeunesse & inclusion",

  axis_5_tag: "Axe 5",
  axis_5_title: "Rayonnement international",
  axis_5_text:
    "Diplomatie ouverte, intégration régionale, attractivité, diaspora & leadership panafricain.",
  axis_5_b1: "Relance des partenariats stratégiques",
  axis_5_b2: "Promotion export & tourisme",
  axis_5_b3: "Diaspora : investissement & transferts de compétences",

  back_home: "← Retour à l’accueil",
  see_docs: "Voir les documents →",
});

// EN
Object.assign(DICT.en, {
  prog_title: "Common Program",
  prog_lead: "Five strategic pillars for Transition and Refoundation.",
  prog_download: "Download the Program (PDF)",
  prog_intro_title: "A clear roadmap",
  prog_intro_text:
    "The Common Program sets immediate priorities to secure peace, refound the State and relaunch the economy, while investing in people and Cameroon’s international standing.",
  prog_intro_pt1: "Realistic and measurable transition actions",
  prog_intro_pt2: "Ethical and transparent governance",
  prog_intro_pt3: "Participatory and inclusive approach",
  prog_dl_title: "Related documents",
  prog_dl_text: "See the other official documents as well.",
  prog_dl_btn: "All documents",
  prog_axes_title: "The five strategic pillars",

  axis_1_tag: "Pillar 1",
  axis_1_title: "Peace & Security",
  axis_1_text:
    "End conflicts, restore security and civic trust, ensure national reconciliation and citizen protection.",
  axis_1_b1: "De-escalation & targeted mediation",
  axis_1_b2: "Professional security forces",
  axis_1_b3: "Reintegration & transitional justice",

  axis_2_tag: "Pillar 2",
  axis_2_title: "Political & institutional reforms",
  axis_2_text:
    "Rule of law, separation of powers, electoral reform, effective decentralization and anti-corruption.",
  axis_2_b1: "Electoral framework overhaul & biometrics",
  axis_2_b2: "Judicial independence",
  axis_2_b3: "State audit & transparency",

  axis_3_tag: "Pillar 3",
  axis_3_title: "Economic growth & jobs",
  axis_3_text:
    "Productive recovery, business climate, local value chains, infrastructure and SME/SMI support.",
  axis_3_b1: "Agriculture, agro-processing, energy",
  axis_3_b2: "Targeted tax relief & SME finance",
  axis_3_b3: "Useful major infrastructures & PPPs",

  axis_4_tag: "Pillar 4",
  axis_4_title: "Human development",
  axis_4_text:
    "Invest in education, health, social protection, equal opportunities and national cohesion.",
  axis_4_b1: "Quality school & vocational training",
  axis_4_b2: "Health coverage & modernized hospitals",
  axis_4_b3: "Youth programs & inclusion",

  axis_5_tag: "Pillar 5",
  axis_5_title: "International standing",
  axis_5_text:
    "Open diplomacy, regional integration, attractiveness, diaspora & Pan-African leadership.",
  axis_5_b1: "Revive strategic partnerships",
  axis_5_b2: "Export & tourism promotion",
  axis_5_b3: "Diaspora: investment & skills transfer",

  back_home: "← Back to home",
  see_docs: "See documents →",
});

// FR
Object.assign(DICT.fr, {
  docs_page_title: "Documents officiels",
  docs_page_lead: "Téléchargez les documents clés en français et en anglais.",
  docs_groups_title: "Corpus officiel",
  filter_all: "Tous",
  filter_fr: "Français",
  filter_en: "English",
  btn_download: "Télécharger",
  btn_view: "Voir",
});

// EN
Object.assign(DICT.en, {
  docs_page_title: "Official documents",
  docs_page_lead: "Download key documents in French and English.",
  docs_groups_title: "Official corpus",
  filter_all: "All",
  filter_fr: "French",
  filter_en: "English",
  btn_download: "Download",
  btn_view: "View",
});

// FR
Object.assign(DICT.fr, {
  camp_title: "Campagne populaire",
  camp_lead:
    "Participez à la mobilisation citoyenne : rejoignez ou créez un comité, organisez des actions et faites vivre la campagne près de chez vous.",
  camp_cta_committee: "Créer ou rejoindre un comité",
  camp_cta_tools: "Voir les outils",

  camp_participation_title: "Participation citoyenne",
  camp_participation_text:
    "La campagne est d’abord populaire : porte-à-porte, relais communautaires, mobilisation numérique, veille du scrutin et formation des bénévoles. Chaque citoyen a un rôle à jouer.",
  camp_participation_pt1: "Informer et convaincre autour de soi",
  camp_participation_pt2:
    "Animer des points d’information et des réunions locales",
  camp_participation_pt3: "Contribuer à la logistique et à la communication",

  camp_stats_title: "Réseau en croissance",
  camp_stats_text:
    "Des comités naissent dans toutes les régions, en ville comme en zone rurale.",
  camp_stat_committees: "Comités actifs",
  camp_stat_volunteers: "Bénévoles",
  camp_stat_regions: "Régions couvertes",

  camp_committee_title: "Créer & gérer un comité local",
  camp_committee_text:
    "Un comité local rassemble des citoyens motivés pour organiser la mobilisation sur un territoire donné (quartier, ville, campus, diaspora). Chaque comité désigne un coordinateur et planifie des actions régulières.",
  camp_committee_pt1: "Coordination (planning, rôles, suivi)",
  camp_committee_pt2: "Actions (porte-à-porte, stands, réunions)",
  camp_committee_pt3: "Communication (affiches, réseaux, messagerie)",
  camp_committee_pt4: "Protection du vote (formation & maillage)",
  camp_btn_tools: "Boîte à outils",

  camp_tools_title: "Outils de mobilisation",
  camp_tool_events_title: "Organiser un événement",
  camp_tool_events_text:
    "Réunions publiques, caravanes, stands d’information, projections-débats. Téléchargez des kits prêts à l’emploi.",
  camp_tool_events_btn: "Kits & checklists",

  camp_tool_petitions_title: "Lancer une pétition",
  camp_tool_petitions_text:
    "Proposez des pétitions locales (écoles, routes, hôpitaux) pour fédérer et faire remonter les priorités.",
  camp_tool_petitions_btn: "Modèles & conseils",

  camp_tool_local_title: "Mener une campagne locale",
  camp_tool_local_text:
    "Micro-campagnes thématiques : écoles, marchés, transports, sécurité, jeunesse, diaspora…",
  camp_tool_local_btn: "Boîte à idées",

  camp_tool_com_title: "Communication & réseaux",
  camp_tool_com_text:
    "Gabarits d’affiches, posts, stories et argumentaires simples aux couleurs 🇨🇲.",
  camp_tool_com_btn: "Templates",
});

// EN
Object.assign(DICT.en, {
  camp_title: "People-powered campaign",
  camp_lead:
    "Take part in the civic mobilization: join or create a committee, run actions and bring the campaign to your neighborhood.",
  camp_cta_committee: "Create or join a committee",
  camp_cta_tools: "See the tools",

  camp_participation_title: "Citizen participation",
  camp_participation_text:
    "The campaign is people-powered: door-to-door, community relays, digital mobilization, poll watching and volunteer training. Everyone has a role to play.",
  camp_participation_pt1: "Inform and convince around you",
  camp_participation_pt2: "Host info points and local meetings",
  camp_participation_pt3: "Support logistics and communications",

  camp_stats_title: "Network growing",
  camp_stats_text:
    "Committees are emerging across all regions, urban and rural.",
  camp_stat_committees: "Active committees",
  camp_stat_volunteers: "Volunteers",
  camp_stat_regions: "Regions covered",

  camp_committee_title: "Create & manage a local committee",
  camp_committee_text:
    "A local committee gathers motivated citizens to organize mobilization in a given area (neighborhood, city, campus, diaspora). Each committee appoints a coordinator and plans regular actions.",
  camp_committee_pt1: "Coordination (planning, roles, follow-up)",
  camp_committee_pt2: "Actions (door-to-door, booths, meetings)",
  camp_committee_pt3: "Communications (posters, social, messaging)",
  camp_committee_pt4: "Vote protection (training & coverage)",
  camp_btn_tools: "Toolbox",

  camp_tools_title: "Mobilization tools",
  camp_tool_events_title: "Organize an event",
  camp_tool_events_text:
    "Town halls, caravans, info booths, screenings & debates. Download ready-to-use kits.",
  camp_tool_events_btn: "Kits & checklists",

  camp_tool_petitions_title: "Launch a petition",
  camp_tool_petitions_text:
    "Propose local petitions (schools, roads, hospitals) to rally people and escalate priorities.",
  camp_tool_petitions_btn: "Templates & tips",

  camp_tool_local_title: "Run a local campaign",
  camp_tool_local_text:
    "Micro-campaigns by theme: schools, markets, transport, security, youth, diaspora…",
  camp_tool_local_btn: "Idea box",

  camp_tool_com_title: "Comms & social",
  camp_tool_com_text:
    "Poster layouts, post/story templates and simple talking points in 🇨🇲 colors.",
  camp_tool_com_btn: "Templates",
});

// FR
Object.assign(DICT.fr, {
  join_title_page: "Participez à la campagne",
  join_lead:
    "Devenez bénévole, soutenez financièrement, rejoignez ou créez un comité. Inscrivez-vous aussi à la newsletter.",
  join_form_title: "Rejoindre la campagne",
  field_email: "Email",
  join_interests: "Je souhaite contribuer via :",
  opt_volunteer: "Bénévolat",
  opt_committee: "Comité de soutien",
  field_message_opt: "Message (optionnel)",
  join_side_title: "Soutenir & organiser",
  join_side_text:
    "Votre aide peut être bénévole, matérielle ou financière. Les comités locaux mènent l’action sur le terrain.",
  join_cta_donate: "Faire un don",
  join_cta_committee: "Rejoindre / Créer un comité",
  join_pt1: "Formation express pour bénévoles",
  join_pt2: "Kits de communication & mobilisation",
  join_pt3: "Calendrier d’actions locales",
  nl_title: "Newsletter UPC 2025",
  nl_text:
    "Recevez les mises à jour : actions, événements, documents et appels à mobilisation.",
  nl_pt1: "1 à 2 emails / mois",
  nl_pt2: "Désinscription en un clic",
  nl_pt3: "Aucune revente de données",
  nl_form_title: "S’inscrire à la newsletter",
  select_optional: "— Optionnel —",
  nl_consent: "J’accepte de recevoir les emails d’information de l’UPC 2025.",
  nl_btn: "S’inscrire",
});

// EN
Object.assign(DICT.en, {
  join_title_page: "Get involved",
  join_lead:
    "Volunteer, donate, join or create a support committee. Also subscribe to the newsletter.",
  join_form_title: "Join the campaign",
  field_email: "Email",
  join_interests: "I want to help through:",
  opt_volunteer: "Volunteering",
  opt_committee: "Support committee",
  field_message_opt: "Message (optional)",
  join_side_title: "Support & organize",
  join_side_text:
    "Your help can be volunteer, in-kind or financial. Local committees drive field actions.",
  join_cta_donate: "Donate",
  join_cta_committee: "Join / Create a committee",
  join_pt1: "Express training for volunteers",
  join_pt2: "Comms & mobilization kits",
  join_pt3: "Local actions calendar",
  nl_title: "UPC 2025 Newsletter",
  nl_text: "Get updates: actions, events, documents and calls to mobilize.",
  nl_pt1: "1–2 emails / month",
  nl_pt2: "One-click unsubscribe",
  nl_pt3: "No data resale",
  nl_form_title: "Subscribe to the newsletter",
  select_optional: "— Optional —",
  nl_consent: "I agree to receive UPC 2025 information emails.",
  nl_btn: "Subscribe",
});

// ---- Français
Object.assign(DICT.fr, {
  // Bande hero de la page
  news_media_title: "Galerie",
  news_subtitle: "Suivez l’actualité, les images et les vidéos de la campagne.",
  back_home: "Retour à l’accueil",
  goto_socials: "Voir les réseaux sociaux",

  // Presse / articles
  press_title: "Articles & communiqués de presse",
  press_more: "Lire l’article",
  press_empty: "Pas encore d’article publié.",

  // Galerie
  gallery_title: "Galerie photo",
  gallery_subtitle: "Moments forts de la mobilisation.",
  gallery_empty: "Aucune image pour le moment.",

  // Vidéos
  videos_title: "Vidéos",
  videos_subtitle: "Interviews, meetings, formats courts.",
  videos_empty: "Aucune vidéo pour le moment.",

  // Réseaux sociaux
  socials_title: "Réseaux sociaux",
  socials_subtitle: "Nos canaux officiels pour rester informé :",
  social_fb: "Facebook",
  social_x: "X / Twitter",
  social_ig: "Instagram",
  social_tt: "TikTok",
  social_tg: "Telegram",
  social_yt: "YouTube",

  // Boutons communs
  open_gallery: "Ouvrir la galerie",
  open_video: "Regarder",
});

// ---- English
Object.assign(DICT.en, {
  // Page hero
  news_media_title: "Gallery",
  news_subtitle: "Follow our latest news, photos and videos.",
  back_home: "Back to Home",
  goto_socials: "Go to Socials",

  // Press / articles
  press_title: "Press releases & articles",
  press_more: "Read article",
  press_empty: "No article yet.",

  // Gallery
  gallery_title: "Photo gallery",
  gallery_subtitle: "Highlights from the campaign.",
  gallery_empty: "No image yet.",

  // Videos
  videos_title: "Videos",
  videos_subtitle: "Interviews, rallies and short formats.",
  videos_empty: "No video yet.",

  // Socials
  socials_title: "Social media",
  socials_subtitle: "Our official channels to stay updated:",
  social_fb: "Facebook",
  social_x: "X / Twitter",
  social_ig: "Instagram",
  social_tt: "TikTok",
  social_tg: "Telegram",
  social_yt: "YouTube",

  // Common buttons
  open_gallery: "Open gallery",
  open_video: "Watch",
});

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

/* =========================
   FORMS — DEMO (validation + messages i18n)
   ========================= */
function fakeSubmit(form, alertBox, okMessage) {
  alertBox.hidden = false;
  alertBox.style.borderColor = "#007A5E";
  alertBox.textContent = okMessage || i18n.t("form_success");
  form.reset();
}

function wireFormDemo(id, okMessage) {
  const form = document.getElementById(id);
  if (!form) return;
  const alertBox = form.querySelector(".form__alert");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      alertBox.hidden = false;
      alertBox.style.borderColor = "#CE1126";
      alertBox.textContent = i18n.t("form_invalid"); // <-- i18n, plus de FR en dur
      return;
    }
    fakeSubmit(form, alertBox, okMessage);
  });
}

// --- Docs: filtres FR/EN & recherche ---
(function () {
  const list = document.getElementById("docList");
  if (!list) return;

  const cards = Array.from(list.querySelectorAll(".doc"));
  const buttons = Array.from(document.querySelectorAll(".docfilter"));
  const search = document.getElementById("docSearch");

  let activeLang = "all";
  let q = "";

  function apply() {
    const query = q.trim().toLowerCase();
    cards.forEach((card) => {
      const lang = card.getAttribute("data-lang");
      const title = (card.getAttribute("data-title") || "").toLowerCase();
      const matchLang = activeLang === "all" || lang === activeLang;
      const matchText = !query || title.includes(query);
      card.style.display = matchLang && matchText ? "" : "none";
    });
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeLang = btn.getAttribute("data-filter");
      apply();
    });
  });

  search?.addEventListener("input", (e) => {
    q = e.target.value || "";
    apply();
  });
})();

wireFormDemo(
  "form-adhesion",
  "Merci ! Votre adhésion a été enregistrée (version démo)."
);
wireFormDemo("form-committee", "Comité enregistré (version démo).");
wireFormDemo("form-contact", "Message envoyé (version démo).");
wireFormDemo(
  "form-newsletter",
  "Inscription newsletter enregistrée (version démo)."
);
