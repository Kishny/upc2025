# UPC 2025 - Site de Campagne Politique

Site web de campagne pour le mouvement **Union Pour le Changement — 2025**, permettant de rejoindre la campagne, créer des comités locaux et s’inscrire à la newsletter.

---

## Table des matières

- [Technologies](#technologies)
- [Fonctionnalités](#fonctionnalités)
- [Installation](#installation)
- [Configuration](#configuration)
- [Lancement](#lancement)
- [Structure du projet](#structure-du-projet)
- [API](#api)
- [Licence](#licence)

---

## Technologies

- **Frontend :** HTML5, CSS3, JavaScript (Vanilla), i18n pour multilingue
- **Backend :** Node.js, Express, MongoDB, Nodemailer, Mailtrap
- **Sécurité :** Helmet, rate-limit, CORS
- **Email :** Envoi d’adhésion, comité et newsletter via SMTP (Mailtrap)

---

## Fonctionnalités

- Formulaire d’adhésion individuelle avec envoi email
- Formulaire de création de comité local avec envoi email
- Formulaire d’inscription newsletter avec envoi email
- Gestion multilingue (i18n)
- Interface responsive
- Animation simple sur les images de candidats
- Vidéo de meeting avec contrôle du son

---

## Installation

1. Cloner le projet :

```bash
git clone https://github.com/tonusername/upc2025.git
```
