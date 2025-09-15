/* =========================
   URL dynamique backend
========================= */
const BASE_URL = ["127.0.0.1", "localhost"].includes(location.hostname)
  ? "http://127.0.0.1:4000"
  : "https://upc2025-backend.onrender.com";

/* =========================
   Initialisation après DOM chargé
========================= */
document.addEventListener("DOMContentLoaded", () => {
  /* =========================
     FORMULAIRE D’ADHÉSION
  ========================= */
  const form = document.getElementById("form-adhesion");
  const orgFields = document.querySelector(".org-only");
  const downloadBtn = document.getElementById("download-form");

  if (form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const memberTypeRadios = document.querySelectorAll(
      'input[name="member_type"]'
    );
    const modeRadios = document.querySelectorAll(
      'input[name="inscription_mode"]'
    );

    function updateFormDisplay() {
      const memberType = document.querySelector(
        'input[name="member_type"]:checked'
      ).value;
      const mode = document.querySelector(
        'input[name="inscription_mode"]:checked'
      ).value;

      if (memberType === "organization") {
        orgFields.style.display = "flex";
        document.querySelector('input[name="org_name"]').required = true;
        document.querySelector('input[name="org_members"]').required = true;
        form.classList.add("form-org");
        form.classList.remove("form-individual");
      } else {
        orgFields.style.display = "none";
        document.querySelector('input[name="org_name"]').required = false;
        document.querySelector('input[name="org_members"]').required = false;
        form.classList.add("form-individual");
        form.classList.remove("form-org");
      }

      if (mode === "online") downloadBtn.style.display = "none";
      else downloadBtn.style.display = "inline-block";
    }

    memberTypeRadios.forEach((r) =>
      r.addEventListener("change", updateFormDisplay)
    );
    modeRadios.forEach((r) => r.addEventListener("change", updateFormDisplay));

    // =========================
    // Soumission adhésion
    // =========================
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Validation simple
      const inputs = form.querySelectorAll("input, select");
      let isValid = true;
      inputs.forEach((inp) => {
        if (inp.required && !inp.value.trim()) {
          inp.style.borderColor = "red";
          isValid = false;
        } else inp.style.borderColor = "";
      });
      if (!isValid) {
        alert("Merci de remplir tous les champs obligatoires.");
        return;
      }

      const formData = Object.fromEntries(new FormData(form));
      const mode = document.querySelector(
        'input[name="inscription_mode"]:checked'
      ).value;

      submitBtn.disabled = true;
      submitBtn.textContent = "Envoi en cours...";

      try {
        // =========================
        // Génération PDF côté frontend
        // =========================
        if (mode === "online") {
          if (window.PDFLib) {
            const { PDFDocument, rgb, StandardFonts } = PDFLib;
            const pdfDoc = await PDFDocument.create();
            const page = pdfDoc.addPage([600, 850]);
            const width = page.getWidth();
            const height = page.getHeight();
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
            const fontBold = await pdfDoc.embedFont(
              StandardFonts.HelveticaBold
            );

            // Fond pastel
            page.drawRectangle({
              x: 0,
              y: 0,
              width,
              height,
              color: rgb(0.93, 0.96, 0.94),
            });

            // Titre
            page.drawText("CERTIFICAT D'ADHÉSION", {
              x: 50,
              y: height - 200,
              size: 24,
              font: fontBold,
              color: rgb(0, 0.3, 0.2),
            });

            let y = height - 240;
            page.drawText(`Nom: ${formData.name}`, {
              x: 50,
              y,
              size: 14,
              font,
            });
            y -= 20;
            if (formData.member_type === "organization") {
              page.drawText(`Organisation: ${formData.org_name}`, {
                x: 50,
                y,
                size: 14,
                font,
              });
              y -= 20;
            }
            page.drawText(`Région: ${formData.region}`, {
              x: 50,
              y,
              size: 14,
              font,
            });
            y -= 20;
            page.drawText(`Contribution: ${formData.role}`, {
              x: 50,
              y,
              size: 14,
              font,
            });
            y -= 30;

            // Signatures – exemple, images locales
            // Tu peux ajouter ici logo ou signataires si nécessaire

            // Créer blob PDF
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);

            downloadBtn.style.display = "inline-block";
            downloadBtn.href = url;
            downloadBtn.download = `certificat_${formData.name}.pdf`;
            downloadBtn.classList.add("btn-download");
            downloadBtn.textContent = "Télécharger mon certificat";

            // Pop-up après 15 secondes
            setTimeout(() => {
              alert("Votre certificat est prêt au téléchargement !");
            }, 15000);
          }
        }

        // =========================
        // Mode papier → redirection
        // =========================
        if (mode === "paper") window.location.href = "documents.html";

        form.reset();
        updateFormDisplay();
      } catch (err) {
        console.error(err);
        // On ignore le backend pour PDF côté client → pas d’alerte serveur
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Rejoindre";
      }
    });

    updateFormDisplay();
  }

  /* =========================
     FORMULAIRE CONTACT
  ========================= */
  const contactForm = document.getElementById("form-contact");
  if (contactForm) {
    const alertBox = contactForm.querySelector(".form__alert");
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      let isValid = true;
      contactForm.querySelectorAll("input, textarea").forEach((input) => {
        if (input.required && !input.value.trim()) {
          input.style.borderColor = "red";
          isValid = false;
        } else input.style.borderColor = "";
      });

      if (!isValid) {
        alertBox.hidden = false;
        alertBox.textContent = "Merci de remplir tous les champs obligatoires.";
        alertBox.style.borderColor = "#CE1126";
        return;
      }

      const data = Object.fromEntries(new FormData(contactForm));
      submitBtn.disabled = true;
      submitBtn.textContent = "Envoi en cours…";
      alertBox.hidden = true;

      try {
        // Envoi au backend (ou service d’email)
        const res = await fetch(`${BASE_URL}/api/contact`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await res.json();

        if (result.ok) {
          alertBox.hidden = false;
          alertBox.textContent = "Merci ! Votre message a été envoyé.";
          alertBox.style.borderColor = "#007A5E";
          contactForm.reset();
        } else {
          alertBox.hidden = false;
          alertBox.textContent = `Erreur : ${result.error || "Serveur"}`;
          alertBox.style.borderColor = "#CE1126";
        }
      } catch (err) {
        console.error(err);
        alertBox.hidden = false;
        alertBox.textContent = "Erreur réseau, réessayez plus tard.";
        alertBox.style.borderColor = "#CE1126";
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Envoyer";
      }
    });
  }

  /* =========================
     COOKIES SITE
  ========================= */
  if (!localStorage.getItem("cookiesAccepted")) {
    const banner = document.createElement("div");
    banner.id = "cookie-banner";
    banner.style.position = "fixed";
    banner.style.bottom = "0";
    banner.style.left = "0";
    banner.style.width = "100%";
    banner.style.backgroundColor = "#f8f9fa";
    banner.style.borderTop = "1px solid #dee2e6";
    banner.style.padding = "1rem";
    banner.style.display = "flex";
    banner.style.flexWrap = "wrap";
    banner.style.justifyContent = "space-between";
    banner.style.alignItems = "center";
    banner.style.zIndex = "9999";
    banner.style.boxShadow = "0 -2px 10px rgba(0,0,0,0.1)";

    const text = document.createElement("span");
    text.innerHTML =
      "Nous utilisons des cookies pour améliorer votre expérience. En continuant, vous acceptez notre <a href='#' style='color: #007bff;'>politique de cookies</a>.";
    text.style.marginRight = "1rem";
    text.style.flex = "1";
    banner.appendChild(text);

    const buttons = document.createElement("div");
    buttons.style.display = "flex";
    buttons.style.gap = "0.5rem";

    const acceptBtn = document.createElement("button");
    acceptBtn.textContent = "Accepter";
    acceptBtn.className = "btn btn-primary";
    acceptBtn.style.padding = "0.5rem 1rem";

    const refuseBtn = document.createElement("button");
    refuseBtn.textContent = "Refuser";
    refuseBtn.className = "btn btn-secondary";
    refuseBtn.style.padding = "0.5rem 1rem";

    acceptBtn.onclick = () => {
      localStorage.setItem("cookiesAccepted", "true");
      banner.style.display = "none";
    };
    refuseBtn.onclick = () => {
      localStorage.setItem("cookiesAccepted", "false");
      banner.style.display = "none";
    };

    buttons.appendChild(acceptBtn);
    buttons.appendChild(refuseBtn);
    banner.appendChild(buttons);
    document.body.appendChild(banner);
  }
});
