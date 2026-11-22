# Perfect Room — Tlemcen
Site vitrine de Perfect Room, fabricant de luminaires à Tlemcen.
- Galerie 3D immersive (WebGL / Three.js) inspirée d'une expérience type « Websites in 2026 » : mur courbe, défilement à inertie, fiches produit, panier avec confirmation par téléphone. Repli horizontal si WebGL n'est pas disponible.
- Le reste du site (atelier néon IA, créations, photos cliquables, horaires, contact, bouton Appeler) reste accessible sous la galerie et dans le menu.
- Contenu (produits, galerie, téléphone, horaires, textes) lu depuis Supabase (table public.perfect_room_content), avec content-default.json comme valeurs par défaut.
- Admin : /admin/ (connexion par lien direct à usage unique, fonction Supabase perfect-room-owner-link).
