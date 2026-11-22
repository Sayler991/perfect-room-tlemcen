# Perfect Room — Tlemcen
Site vitrine de Perfect Room, fabricant de luminaires à Tlemcen.

Branche `galerie-3d` : galerie-musée en première personne (WebGL / Three.js). Couloir de briques, sol en bois poli, projecteurs de galerie, cadres alternés gauche/droite, cartels et titres de collections. Défilement à inertie, vol vers le cadre, fiche produit, panier avec confirmation par téléphone. Repli horizontal si WebGL n'est pas disponible.

Les 4 créations exposées sont les photos réelles déjà publiées sur Google Maps (livre gravé, diplôme Sara, voiture de course, tableau pop art). Instagram (@_perfect__room) et Facebook (Perfect Room, Tlemcen) montrent d'autres travaux (ex. enseigne néon pour Tebnidja), mais ces images n'étaient pas accessibles publiquement sans connexion au moment de cette version — aucun produit ni prix n'a été inventé.

Textures de salle (CC0, ambientCG) : Bricks023 (murs), WoodFloor043 (sol), Concrete032 (plafond), compressées en WebP ≤ 1024 px.

Le reste du site (atelier néon IA, créations, photos cliquables, horaires, contact, bouton Appeler) reste sous la galerie et dans le menu.
Contenu (produits, galerie, téléphone, horaires, textes) lu depuis Supabase (table public.perfect_room_content), avec content-default.json comme valeurs par défaut.
Admin : /admin/ (connexion par lien direct à usage unique, fonction Supabase perfect-room-owner-link).
