# USER STORIES – MODULE CATALOGUE
## Document Révisé - Reflet de l'Implémentation Réelle

**Version :** 2.0
**Date :** Novembre 2024
**Auteur :** MultiFlex GESCOM
**Statut :** Analyse basée sur le code source des maquettes HTML/JS

---

## 🎯 OBJECTIF DU DOCUMENT

Ce document présente les **User Stories révisées** basées sur l'analyse approfondie du code source des maquettes HTML et JavaScript implémentées pour le module Catalogue. Il reflète **exactement** les fonctionnalités développées dans les fichiers :

- **Catégories** : `categories-list.html` / `categories-list.js`
- **Produits** : `products-list.html` / `products-list.js`
- **Conditionnements** : `variants-list.html` / `variants-list.js` / `variants-create.html` / `variants-create.js`

---

## 📋 FORMAT DES USER STORIES

Chaque User Story suit le format standard :

```
EN TANT QUE [Rôle utilisateur]
JE VEUX [Action/Fonctionnalité]
AFIN DE [Bénéfice/Objectif métier]

CRITÈRES D'ACCEPTATION :
- ✅ Critère implémenté
- ⚠️ Critère partiellement implémenté
- ❌ Critère non implémenté

RÈGLES DE GESTION :
- RG-XXX-NNN : Règle avec indication d'implémentation

ÉLÉMENTS D'INTERFACE (NOUVEAUTÉ) :
- Boutons, modales, formulaires réellement présents dans le code
- Fonctions JavaScript correspondantes
```

---

# 1. MODULE CATÉGORIES DE PRODUITS

## 1.1 - User Stories Principales

### US-CAT-001 : Créer une catégorie de produits

**EN TANT QUE** Super Administrateur, Chef Produits/Magasinier
**JE VEUX** créer une nouvelle catégorie de produits
**AFIN DE** organiser le catalogue en familles logiques

**CRITÈRES D'ACCEPTATION :**
- ✅ Je peux accéder à l'écran de création via le bouton "Nouvelle Catégorie"
- ✅ Je peux saisir les informations obligatoires : code (converti en majuscules), nom
- ✅ Je peux saisir la description (optionnel, textarea)
- ✅ Je peux définir une catégorie parente via un dropdown hiérarchique
- ✅ Le système calcule automatiquement le niveau hiérarchique (level)
- ✅ Le système définit automatiquement isLeaf = true si aucune sous-catégorie
- ✅ Le statut "ACTIVE" est affecté par défaut (via radio buttons)
- ✅ Je reçois une confirmation de création (alert message)
- ✅ La catégorie apparaît immédiatement dans l'arborescence

**RÈGLES DE GESTION :**
- ✅ **RG-CAT-001** : Le code de la catégorie doit être unique - Implémenté (ligne 415-418 categories-list.js)
- ✅ **RG-CAT-002** : Le nom de la catégorie doit être unique dans le même niveau
- ✅ **RG-CAT-003** : Une catégorie sans parent est racine (parentId = null, level = 0)
- ✅ **RG-CAT-004** : Le level est calculé automatiquement (ligne 422-426)
- ⚠️ **RG-CAT-005** : Profondeur max 5 niveaux - NON validé dans le code actuel
- ⚠️ **RG-CAT-006** : Code A-Z, 0-9, tirets, underscores - NON validé strictement
- ⚠️ **RG-CAT-007** : Code max 30 caractères - NON validé

**ÉLÉMENTS D'INTERFACE :**
- **Modal** : `#create-category-modal` (ouverture via `openCreateModal()`)
- **Formulaire** :
  - Input `#category-code` (uppercase auto)
  - Input `#category-name`
  - Select `#category-parent` (populé par `populateParentSelect()`)
  - Textarea `#category-description`
  - Radio `status` (ACTIVE/INACTIVE)
- **Bouton** : "Enregistrer" → appelle `saveCategory()`
- **Fonction** : `saveCategory()` génère ID unique avec timestamp

---

### US-CAT-002 : Définir la hiérarchie des catégories

**EN TANT QUE** Super Administrateur, Chef Produits/Magasinier
**JE VEUX** organiser les catégories en arborescence hiérarchique
**AFIN DE** créer une structure logique de navigation (ex: PEINTURES → INTÉRIEURES → MATES)

**CRITÈRES D'ACCEPTATION :**
- ✅ Je peux définir une catégorie parente lors de la création
- ✅ Je peux modifier la catégorie parente d'une catégorie existante (via edit modal)
- ✅ Le système empêche les références circulaires (ligne 384 : exclude self from parents)
- ✅ Le système met à jour automatiquement isLeaf du parent (ligne 453, 462-466)
- ✅ Le système recalcule le level lors d'un changement de parent
- ✅ Je peux visualiser l'arborescence complète avec expand/collapse

**RÈGLES DE GESTION :**
- ✅ **RG-CAT-008** : Pas de référence circulaire (ligne 384)
- ✅ **RG-CAT-009** : isLeaf = false si enfants (fonction `updateParentLeafStatus()`)
- ✅ **RG-CAT-010** : isLeaf = true si pas d'enfant
- ✅ **RG-CAT-011** : Vérification boucle hiérarchique
- ✅ **RG-CAT-012** : Modification du parent n'affecte pas les produits existants

**ÉLÉMENTS D'INTERFACE :**
- **Arborescence** : `renderTree()` génère l'arbre complet
- **Node rendering** : `renderTreeNode()` avec icônes 📁 (parent) / 📄 (leaf)
- **Toggle expand** : Click sur icône chevron (`toggleExpand()`)
- **Parent selector** : `populateParentSelect()` exclut les feuilles et la catégorie elle-même
- **Fonction hierarchy** : `getCategoryPath()` construit le chemin complet (ligne 499-509)

---

### US-CAT-003 : Activer/Désactiver une catégorie

**EN TANT QUE** Super Administrateur, Chef Produits/Magasinier
**JE VEUX** activer ou désactiver une catégorie
**AFIN DE** gérer le cycle de vie des catégories sans supprimer les données

**CRITÈRES D'ACCEPTATION :**
- ✅ Je peux changer le statut via edit modal (ACTIVE ↔ INACTIVE)
- ✅ Le système avertit si la catégorie contient des produits (via delete warning)
- ✅ Le système avertit si la catégorie a des sous-catégories (ligne 556)
- ✅ La désactivation ne supprime pas les données
- ✅ Une catégorie inactive apparaît avec badge rouge "Inactif"
- ✅ Je peux réactiver une catégorie
- ✅ Je reçois une confirmation (alert message)

**RÈGLES DE GESTION :**
- ✅ **RG-CAT-013** : Catégorie avec produits peut être désactivée (avertissement)
- ✅ **RG-CAT-014** : Désactivation ne désactive pas les produits automatiquement
- ✅ **RG-CAT-015** : Catégorie inactive reste consultable
- ✅ **RG-CAT-016** : Sous-catégories non désactivées automatiquement

**ÉLÉMENTS D'INTERFACE :**
- **Edit modal** : Radio buttons pour status (ACTIVE/INACTIVE)
- **Badge status** : Vert "Actif" / Rouge "Inactif" dans la vue détails
- **Fonction** : Status changé via `saveCategory()` en mode edit

---

### US-CAT-004 : Lister et rechercher des catégories

**EN TANT QUE** Super Administrateur, Chef Produits/Magasinier, Gérant
**JE VEUX** consulter la liste des catégories en arborescence
**AFIN DE** naviguer dans la structure du catalogue

**CRITÈRES D'ACCEPTATION :**
- ✅ Je vois la liste en structure arborescente complète
- ✅ Je peux développer/réduire les branches (click sur chevron)
- ✅ Je peux filtrer par statut via dropdown (Toutes, Actives, Inactives)
- ✅ Je peux filtrer par niveau (Tous, Niveaux 0-4)
- ✅ Je peux rechercher par nom, code ou description (case-insensitive, ligne 210-213)
- ✅ La liste affiche : code, nom, niveau, compteur sous-catégories, compteur produits, statut
- ✅ Je peux naviguer vers les détails via bouton "👁 Voir"
- ✅ Les catégories feuilles sont visuellement distinctes (📄 vs 📁)

**RÈGLES DE GESTION :**
- ✅ **RG-CAT-017** : Recherche insensible à la casse (ligne 210)
- ✅ **RG-CAT-018** : Par défaut, toutes les catégories affichées
- ✅ **RG-CAT-019** : Catégories racines en premier (level 0)
- ✅ **RG-CAT-020** : Arborescence construite depuis parentId
- ✅ **RG-CAT-021** : Catégories inactives avec badge rouge

**ÉLÉMENTS D'INTERFACE :**
- **Filtres** :
  - Input `#search-input` (recherche temps réel)
  - Select `#filter-status` (Toutes/Actives/Inactives)
  - Select `#filter-level` (Tous/0/1/2/3/4)
- **Arbre** : `#categories-tree` (rendu par `renderTree()`)
- **Statistiques** : 4 cartes (Total, Actives, Feuilles, Total Produits)
- **Actions par catégorie** :
  - 👁 Voir → `viewCategory(id)`
  - ✏️ Modifier → `editCategory(id)`
  - ➕ Ajouter sous-catégorie → `addSubCategory(id)`
  - 🗑️ Supprimer → `deleteCategory(id)`

---

## 1.2 - User Stories Supplémentaires (Implémentées dans le code)

### US-CAT-005 : Consulter les détails d'une catégorie

**EN TANT QUE** Utilisateur
**JE VEUX** consulter tous les détails d'une catégorie
**AFIN DE** vérifier ses informations complètes sans la modifier

**CRITÈRES D'ACCEPTATION :**
- ✅ Je peux cliquer sur "Voir" pour ouvrir une modal de détails
- ✅ Je vois toutes les informations : code, nom, description, statut
- ✅ Je vois le chemin hiérarchique complet (ex: PEINTURES > INTÉRIEURES > MATES)
- ✅ Je vois le niveau dans la hiérarchie
- ✅ Je vois le type (Catégorie parente / Catégorie feuille)
- ✅ Je vois le nombre de sous-catégories
- ✅ Je vois le nombre de produits
- ✅ Je vois les métadonnées (dates création/modification)

**ÉLÉMENTS D'INTERFACE :**
- **Modal** : `#view-category-modal` (ouverture via `viewCategory(id)`)
- **Fonction** : `getCategoryPath(category)` construit le chemin (ligne 499-509)
- **Affichage** : Sections organisées (Informations générales, Hiérarchie, Statistiques, Métadonnées)

---

### US-CAT-006 : Ajouter une sous-catégorie directement

**EN TANT QUE** Chef Produits
**JE VEUX** créer une sous-catégorie directement depuis une catégorie parente
**AFIN DE** gagner du temps en pré-sélectionnant le parent

**CRITÈRES D'ACCEPTATION :**
- ✅ Je vois un bouton "➕ Ajouter sous-catégorie" sur les catégories parentes
- ✅ Le click ouvre le modal de création avec le parent pré-rempli
- ✅ Je peux modifier le parent si nécessaire
- ✅ Le niveau est calculé automatiquement

**ÉLÉMENTS D'INTERFACE :**
- **Bouton** : "➕ Sous-catégorie" (visible uniquement sur les nodes)
- **Fonction** : `addSubCategory(parentId)` (ligne 470-476)
- **Comportement** : Pré-remplit `#category-parent` avec parentId

---

### US-CAT-007 : Supprimer une catégorie

**EN TANT QUE** Super Administrateur
**JE VEUX** supprimer une catégorie obsolète
**AFIN DE** nettoyer le catalogue

**CRITÈRES D'ACCEPTATION :**
- ✅ Je peux cliquer sur "🗑️ Supprimer"
- ✅ Le système vérifie si la catégorie a des sous-catégories (blocage si oui)
- ✅ Le système vérifie si la catégorie a des produits (confirmation requise)
- ✅ Je reçois un message de confirmation
- ✅ Le système met à jour le isLeaf du parent après suppression

**RÈGLES DE GESTION :**
- ✅ **RG-CAT-022** : Impossible de supprimer une catégorie avec sous-catégories (ligne 556-559)
- ✅ **RG-CAT-023** : Confirmation requise si la catégorie contient des produits (ligne 563-568)
- ✅ **RG-CAT-024** : Mise à jour automatique du parent (ligne 572-574)

**ÉLÉMENTS D'INTERFACE :**
- **Bouton** : "🗑️ Supprimer" (avec `deleteCategory(id)`)
- **Confirmations** : `confirm()` JavaScript avec messages contextuels
- **Fonction** : `updateParentLeafStatus(parentId)` après suppression

---

### US-CAT-008 : Modifier une catégorie existante

**EN TANT QUE** Chef Produits
**JE VEUX** modifier les informations d'une catégorie
**AFIN DE** corriger ou mettre à jour les données

**CRITÈRES D'ACCEPTATION :**
- ✅ Je peux cliquer sur "✏️ Modifier"
- ✅ Le modal s'ouvre avec les données pré-remplies
- ✅ Je peux modifier : nom, description, parent, statut
- ✅ Le code est pré-rempli mais modifiable
- ✅ Je reçois une confirmation de mise à jour
- ✅ Les changements sont visibles immédiatement

**ÉLÉMENTS D'INTERFACE :**
- **Modal** : Réutilise `#create-category-modal` en mode edit
- **Fonction** : `editCategory(id)` (ligne 477-494)
- **Sauvegarde** : `saveCategory()` détecte le mode edit via `editingCategoryId`

---

### US-CAT-009 : Exporter les catégories

**EN TANT QUE** Chef Produits
**JE VEUX** exporter la liste des catégories
**AFIN DE** partager ou analyser les données hors système

**CRITÈRES D'ACCEPTATION :**
- ✅ Je vois des boutons "Excel" et "PDF" dans la barre d'actions
- ⚠️ Le click affiche un message (fonctionnalité placeholder)

**ÉLÉMENTS D'INTERFACE :**
- **Boutons** : "Excel" / "PDF" avec icônes
- **Fonction** : `alert('Export Excel en cours de développement')` (placeholder)

---

### US-CAT-010 : Visualiser les statistiques des catégories

**EN TANT QUE** Gérant
**JE VEUX** voir des statistiques globales sur les catégories
**AFIN DE** avoir une vue d'ensemble rapide

**CRITÈRES D'ACCEPTATION :**
- ✅ Je vois 4 cartes de statistiques en haut de page
- ✅ Statistique 1 : Total catégories (mis à jour en temps réel)
- ✅ Statistique 2 : Catégories actives
- ✅ Statistique 3 : Catégories feuilles
- ✅ Statistique 4 : Total produits dans toutes les catégories

**ÉLÉMENTS D'INTERFACE :**
- **Fonction** : `updateStats()` (ligne 194-201)
- **Affichage** : Cartes avec icônes et couleurs distinctes

---

# 2. MODULE ARTICLES/PRODUITS (PRODUCTS)

## 2.1 - User Stories Principales

### US-PRD-001 : Créer un article générique (Product)

**EN TANT QUE** Super Administrateur, Chef Produits/Magasinier
**JE VEUX** créer un nouvel article générique (gamme/marque)
**AFIN DE** définir le concept de base qui regroupera plusieurs conditionnements

**CRITÈRES D'ACCEPTATION :**
- ✅ Je peux accéder au modal de création via "Nouveau Produit"
- ✅ Je peux saisir les informations obligatoires : code, désignation, catégorie
- ✅ Je peux sélectionner le type via dropdown (MARCHANDISE, PRODUIT_FINI, MATIERE_PREMIERE, SERVICE)
- ✅ Je peux sélectionner la catégorie via dropdown avec chemin hiérarchique complet
- ✅ Je peux saisir la description générale (textarea)
- ✅ Je peux saisir l'URL de l'image principale (input text)
- ✅ Le système génère automatiquement un ID unique (prd-code-timestamp)
- ✅ Le statut "ACTIVE" est affecté par défaut
- ✅ Je reçois une confirmation de création (alert)
- ✅ Le produit apparaît immédiatement dans la liste

**RÈGLES DE GESTION :**
- ✅ **RG-PRD-001** : Code unique (validation ligne 505-508 products-list.js)
- ⚠️ **RG-PRD-002** : Désignation unique dans catégorie - Non strictement validé
- ✅ **RG-PRD-003** : Catégorie obligatoire (champ required)
- ⚠️ **RG-PRD-004** : Format code A-Z, 0-9, tirets - Non validé
- ⚠️ **RG-PRD-005** : Code max 30 caractères - Non validé
- ⚠️ **RG-PRD-006/007** : Validation image format/taille - Non implémentée
- ✅ **RG-PRD-008** : ProductType obligatoire (dropdown)
- ✅ **RG-PRD-009** : Product sans données opérationnelles (respecté)

**ÉLÉMENTS D'INTERFACE :**
- **Modal** : `#create-product-modal` (ouverture `openCreateModal()`)
- **Formulaire** :
  - Input `#product-code`
  - Input `#product-designation`
  - Select `#product-category` (options avec chemin complet)
  - Select `#product-type` (4 options)
  - Textarea `#product-description`
  - Input `#product-image` (URL)
  - Radio `status` (ACTIVE/INACTIVE)
- **Bouton** : "Enregistrer" → `saveProduct()`
- **Helper** : Texte d'aide sous le select catégorie montrant le chemin complet

---

### US-PRD-002 : Modifier un article générique

**EN TANT QUE** Super Administrateur, Chef Produits/Magasinier
**JE VEUX** modifier les informations d'un article générique
**AFIN DE** corriger ou mettre à jour les données de la gamme

**CRITÈRES D'ACCEPTATION :**
- ✅ Je peux accéder au modal d'édition via "✏️ Modifier"
- ✅ Je peux modifier : désignation, description, catégorie, type, image, statut
- ✅ Le code est affiché en lecture seule (disabled, ligne 134)
- ✅ Le système enregistre la date de modification (updatedAt)
- ✅ Je reçois une confirmation de mise à jour (alert)
- ✅ Les modifications sont visibles immédiatement dans la liste
- ✅ La vue grille est également mise à jour

**RÈGLES DE GESTION :**
- ✅ **RG-PRD-010** : Code non modifiable (input disabled en mode edit)
- ✅ **RG-PRD-011** : Unicité désignation dans catégorie
- ✅ **RG-PRD-012** : Modification n'affecte pas les variantes
- ✅ **RG-PRD-013** : Changement catégorie n'affecte pas les prix
- ✅ **RG-PRD-014** : Traçabilité modification (updatedAt)

**ÉLÉMENTS D'INTERFACE :**
- **Modal** : Réutilise `#create-product-modal` en mode edit
- **Fonction** : `editProduct(id)` (ligne 357-377) pré-remplit le formulaire
- **Code** : Input désactivé avec `disabled` attribute (ligne 134)
- **Sauvegarde** : `saveProduct()` détecte mode edit via `editingProductId`

---

### US-PRD-003 : Dupliquer un article générique

**EN TANT QUE** Super Administrateur, Chef Produits/Magasinier
**JE VEUX** dupliquer un article générique existant
**AFIN DE** créer rapidement un produit similaire sans ressaisir toutes les informations

**CRITÈRES D'ACCEPTATION :**
- ✅ Je peux cliquer sur "📋 Dupliquer" depuis le menu actions
- ✅ Le système crée une copie avec code modifié (code-COPY)
- ✅ Le système ajoute " (Copie)" à la désignation
- ✅ Tous les autres champs sont copiés (catégorie, type, description, image)
- ✅ Le statut est copié (pas forcément DRAFT comme spécifié initialement)
- ✅ Les variantes ne sont PAS copiées
- ✅ Je reçois une confirmation (alert)
- ✅ Le nouveau produit apparaît dans la liste

**RÈGLES DE GESTION :**
- ✅ **RG-PRD-015** : Code unique (vérification implicite)
- ✅ **RG-PRD-016** : Suffixe "-COPY" (ligne 401)
- ✅ **RG-PRD-017** : Variantes non dupliquées (variantCount = 0)
- ✅ **RG-PRD-018** : Image référencée (même URL)
- ✅ **RG-PRD-019** : Nouveau createdAt pour la copie

**ÉLÉMENTS D'INTERFACE :**
- **Bouton** : "📋 Dupliquer" dans dropdown actions
- **Fonction** : `duplicateProduct(id)` (ligne 397-423)
- **Génération** : ID unique avec timestamp, code avec "-COPY"

---

### US-PRD-004 : Activer/Désactiver un article générique

**EN TANT QUE** Super Administrateur, Chef Produits/Magasinier
**JE VEUX** activer ou désactiver un article générique
**AFIN DE** gérer le cycle de vie sans supprimer les données

**CRITÈRES D'ACCEPTATION :**
- ✅ Je peux changer le statut via edit modal (ACTIVE ↔ INACTIVE)
- ✅ Le système avertit si le produit a des variantes (via delete function)
- ✅ La désactivation ne supprime pas les données
- ✅ Un produit inactif apparaît avec badge rouge "Inactif"
- ✅ Les variantes du produit peuvent rester actives
- ✅ Je peux réactiver un produit
- ✅ Je reçois une confirmation

**RÈGLES DE GESTION :**
- ✅ **RG-PRD-020** : Produit avec variantes peut être désactivé (avertissement)
- ✅ **RG-PRD-021** : Désactivation ne touche pas les variantes
- ✅ **RG-PRD-022** : Produit inactif consultable
- ✅ **RG-PRD-023** : Recommandation désactiver variantes d'abord

**ÉLÉMENTS D'INTERFACE :**
- **Edit modal** : Radio buttons status
- **Badge** : Vert "Actif" / Rouge "Inactif" (table et grid)
- **Fonction** : Status modifié via `saveProduct()`

---

### US-PRD-005 : Lister et rechercher des articles génériques

**EN TANT QUE** Super Administrateur, Chef Produits/Magasinier, Gérant
**JE VEUX** consulter la liste des articles génériques avec filtres
**AFIN DE** retrouver rapidement un produit spécifique

**CRITÈRES D'ACCEPTATION :**
- ✅ Je vois la liste de tous les produits en vue tableau par défaut
- ✅ Je peux basculer entre vue Tableau et vue Grille (toggle button)
- ✅ Je peux filtrer par catégorie (dropdown avec toutes les catégories)
- ✅ Je peux filtrer par type (Tous, Marchandise, Produit Fini, Matière Première, Service)
- ✅ Je peux filtrer par statut (Tous, Actifs, Inactifs)
- ✅ Je peux rechercher par code ou désignation (case-insensitive, ligne 213-216)
- ✅ La liste affiche : image, code, désignation, catégorie, type, nb variantes, statut
- ✅ Je peux trier par : code, désignation, nombre variantes, statut
- ✅ Je peux accéder aux détails via "👁 Voir"
- ✅ Pagination 10 items par page

**RÈGLES DE GESTION :**
- ✅ **RG-PRD-024** : Recherche insensible casse (ligne 213)
- ✅ **RG-PRD-025** : Pagination (10 items au lieu de 50)
- ✅ **RG-PRD-026** : Par défaut tous les produits affichés
- ✅ **RG-PRD-027** : Nombre variantes calculé en temps réel
- ✅ **RG-PRD-028** : Image affichée (imageUrl)

**ÉLÉMENTS D'INTERFACE :**
- **Filtres** :
  - Input `#search-input` (recherche temps réel)
  - Select `#filter-category` (Toutes + liste catégories)
  - Select `#filter-type` (Tous + 4 types)
  - Select `#filter-status` (Tous/Actifs/Inactifs)
- **Toggle view** : Boutons "📋 Tableau" / "🎴 Grille" → `toggleView()`
- **Table** : `#products-table-body` (rendu `renderTable()`)
- **Grid** : `#products-grid` (rendu `renderGrid()`)
- **Statistiques** : 4 cartes (Total, Actifs, Total Variantes, Catégories utilisées)
- **Tri** : Click sur en-têtes de colonnes → `sortTable(column)`
- **Pagination** : Boutons Précédent/Suivant + indicateur page

---

## 2.2 - User Stories Supplémentaires (Implémentées dans le code)

### US-PRD-006 : Consulter les détails d'un produit

**EN TANT QUE** Utilisateur
**JE VEUX** consulter tous les détails d'un produit
**AFIN DE** vérifier ses informations complètes

**CRITÈRES D'ACCEPTATION :**
- ✅ Je peux cliquer sur "👁 Voir"
- ✅ Je vois l'image principale (grande taille)
- ✅ Je vois toutes les informations : code, désignation, description, catégorie, type, statut
- ✅ Je vois le chemin hiérarchique de la catégorie
- ✅ Je vois le nombre de variantes avec badge
- ✅ Je vois les métadonnées (dates création/modification)
- ✅ Je peux fermer le modal

**ÉLÉMENTS D'INTERFACE :**
- **Modal** : `#view-product-modal` (ouverture `viewProduct(id)`)
- **Sections** : Image, Informations générales, Catégorie, Description, Variantes, Métadonnées
- **Fonction** : Construit le chemin catégorie avec `categories.find()`

---

### US-PRD-007 : Supprimer un produit

**EN TANT QUE** Super Administrateur
**JE VEUX** supprimer un produit obsolète
**AFIN DE** nettoyer le catalogue

**CRITÈRES D'ACCEPTATION :**
- ✅ Je peux cliquer sur "🗑️ Supprimer"
- ✅ Le système vérifie si le produit a des variantes (blocage si oui)
- ✅ Je reçois un message d'avertissement avec le nombre de variantes
- ✅ Je reçois une confirmation de suppression
- ✅ Le produit disparaît de la liste

**RÈGLES DE GESTION :**
- ✅ **RG-PRD-029** : Impossible de supprimer un produit avec variantes (ligne 428-432)
- ✅ **RG-PRD-030** : Message explicite avec nombre de variantes

**ÉLÉMENTS D'INTERFACE :**
- **Bouton** : "🗑️ Supprimer" dans dropdown actions
- **Fonction** : `deleteProduct(id)` (ligne 425-443)
- **Validation** : Vérification `variantCount > 0`

---

### US-PRD-008 : Basculer entre vue tableau et vue grille

**EN TANT QUE** Utilisateur
**JE VEUX** choisir le mode d'affichage (tableau ou grille)
**AFIN DE** visualiser les produits selon ma préférence

**CRITÈRES D'ACCEPTATION :**
- ✅ Je vois deux boutons "📋 Tableau" et "🎴 Grille"
- ✅ Le bouton actif est visuellement marqué (background primaire)
- ✅ Le click bascule instantanément entre les deux vues
- ✅ Vue tableau : liste classique avec colonnes
- ✅ Vue grille : cartes avec image, code, nom, variantes
- ✅ Les filtres et la pagination fonctionnent dans les deux vues

**ÉLÉMENTS D'INTERFACE :**
- **Toggle buttons** : `#view-toggle-table` / `#view-toggle-grid`
- **Fonction** : `toggleView(view)` (ligne 243-251)
- **Variables** : `currentView = 'table' ou 'grid'`
- **Rendu** : `renderTable()` ou `renderGrid()` selon la vue

---

### US-PRD-009 : Exporter les produits

**EN TANT QUE** Chef Produits
**JE VEUX** exporter la liste des produits
**AFIN DE** partager ou analyser les données

**CRITÈRES D'ACCEPTATION :**
- ✅ Je vois des boutons "Excel" et "PDF"
- ⚠️ Le click affiche un message (fonctionnalité placeholder)

**ÉLÉMENTS D'INTERFACE :**
- **Boutons** : "Excel" / "PDF"
- **Fonction** : `alert('Export en cours de développement')`

---

### US-PRD-010 : Visualiser les statistiques des produits

**EN TANT QUE** Gérant
**JE VEUX** voir des statistiques globales sur les produits
**AFIN DE** avoir une vue d'ensemble

**CRITÈRES D'ACCEPTATION :**
- ✅ Je vois 4 cartes de statistiques
- ✅ Stat 1 : Total produits
- ✅ Stat 2 : Produits actifs
- ✅ Stat 3 : Total variantes (somme de tous les variantCount)
- ✅ Stat 4 : Nombre de catégories utilisées

**ÉLÉMENTS D'INTERFACE :**
- **Fonction** : `updateStats()` (ligne 255-272)
- **Calculs** : Compteurs dynamiques sur le tableau `products`

---

### US-PRD-011 : Voir le chemin hiérarchique de la catégorie

**EN TANT QUE** Utilisateur
**JE VEUX** voir le chemin complet de la catégorie d'un produit
**AFIN DE** comprendre son positionnement dans le catalogue

**CRITÈRES D'ACCEPTATION :**
- ✅ Dans le dropdown de sélection de catégorie, je vois le chemin complet (ex: PEINTURES > INTÉRIEURES > MATES)
- ✅ Un texte d'aide sous le dropdown affiche le chemin sélectionné
- ✅ Dans les détails du produit, le chemin complet est affiché

**ÉLÉMENTS D'INTERFACE :**
- **Select options** : Format "Chemin > complet - Nom catégorie"
- **Helper text** : `#category-helper` mis à jour au changement
- **Fonction** : Construction du chemin avec parcours des parents

---

# 3. MODULE CONDITIONNEMENTS/VARIANTS

## 3.1 - User Stories Principales (Liste des Variants)

### US-VAR-006 : Activer/Désactiver une variante

**EN TANT QUE** Super Administrateur, Chef Produits/Magasinier
**JE VEUX** activer ou désactiver une variante
**AFIN DE** gérer le cycle de vie sans supprimer les données

**CRITÈRES D'ACCEPTATION :**
- ✅ Je peux changer le statut via edit modal (ACTIVE ↔ INACTIVE)
- ⚠️ Le système mentionne les avertissements (stock, transactions) mais ne les implémente pas
- ✅ La désactivation ne supprime pas les données
- ✅ Une variante inactive apparaît avec badge rouge
- ✅ Je peux réactiver une variante
- ✅ Je reçois une confirmation

**RÈGLES DE GESTION :**
- ⚠️ **RG-VAR-035-039** : Avertissements mentionnés mais non implémentés dans la version actuelle

**ÉLÉMENTS D'INTERFACE :**
- **Edit modal** : Radio buttons status (variants-list.html)
- **Badge** : Vert "Actif" / Rouge "Inactif"
- **Fonction** : `saveVariant()` en mode edit

---

### US-VAR-007 : Lister et rechercher des variantes

**EN TANT QUE** Super Administrateur, Chef Produits/Magasinier, Gérant
**JE VEUX** consulter la liste des variantes avec filtres
**AFIN DE** retrouver rapidement un conditionnement spécifique

**CRITÈRES D'ACCEPTATION :**
- ✅ Je vois la liste de toutes les variantes (vue globale)
- ✅ Je peux filtrer par produit parent (dropdown avec tous les produits)
- ✅ Je peux filtrer par statut (Tous, Actifs, Inactifs)
- ✅ Je peux filtrer par flags via checkboxes (Vendables, Stockables)
- ✅ Je peux rechercher par SKU, désignation ou code-barre (case-insensitive)
- ✅ La liste affiche : SKU, désignation, produit parent, unité stock, flags, statut
- ✅ Les flags sont affichés avec icônes : 💰 V (vendable), 📦 A (achetable), 📊 S (stockable), 🏭 P (productible)
- ✅ La variante par défaut a un badge ⭐ "Par défaut"
- ✅ Je peux trier par : SKU, désignation, statut
- ✅ Je peux accéder aux détails via "👁 Voir"
- ✅ Pagination 10 items par page

**RÈGLES DE GESTION :**
- ✅ **RG-VAR-040** : Recherche insensible casse (ligne 207-210 variants-list.js)
- ✅ **RG-VAR-041** : Recherche code-barre exacte
- ✅ **RG-VAR-042** : Pagination (10 items)
- ✅ **RG-VAR-043** : Par défaut toutes les variantes affichées
- ✅ **RG-VAR-044** : Variante par défaut mise en évidence (badge ⭐)
- ⚠️ **RG-VAR-045** : Stock actuel non affiché (pas de StockBalance)

**ÉLÉMENTS D'INTERFACE :**
- **Filtres** :
  - Input `#search-input`
  - Select `#filter-product` (Tous + liste produits)
  - Select `#filter-status`
  - Checkbox `#filter-saleable` (Vendables uniquement)
  - Checkbox `#filter-stockable` (Stockables uniquement)
- **Table** : `#variants-table-body` (rendu `renderTable()`)
- **Statistiques** : 4 cartes (Total, Actifs, Vendables, Stockables)
- **Actions** : Voir, Modifier, Dupliquer, Supprimer
- **Flags** : Affichage avec emojis + tooltips

---

### US-VAR-007-B : Consulter les détails d'une variante

**EN TANT QUE** Utilisateur
**JE VEUX** consulter tous les détails d'une variante
**AFIN DE** vérifier toutes ses caractéristiques

**CRITÈRES D'ACCEPTATION :**
- ✅ Je peux cliquer sur "👁 Voir"
- ✅ Je vois toutes les sections : Identification, Produit parent, Propriétés physiques, Unités, Flags, Paramètres de stock
- ✅ Je vois : SKU, désignation, code-barre
- ✅ Je vois : poids net, poids brut, volume
- ✅ Je vois : unité stock, unité achat, coefficient
- ✅ Je vois : les 4 flags avec icônes
- ✅ Je vois : stock sécurité, point commande, méthode valorisation
- ✅ Je vois : métadonnées (dates)

**ÉLÉMENTS D'INTERFACE :**
- **Modal** : `#view-variant-modal` (ouverture `viewVariant(id)`)
- **Organisation** : Sections claires avec badges et icônes
- **Fonction** : `viewVariant(id)` (ligne 375-447)

---

### US-VAR-007-C : Modifier une variante

**EN TANT QUE** Chef Produits
**JE VEUX** modifier une variante existante
**AFIN DE** corriger ou mettre à jour ses caractéristiques

**CRITÈRES D'ACCEPTATION :**
- ✅ Je peux cliquer sur "✏️ Modifier"
- ✅ Le modal s'ouvre avec toutes les données pré-remplies
- ✅ Je peux modifier tous les champs sauf le SKU (disabled)
- ✅ Je reçois une confirmation
- ✅ Les modifications sont visibles immédiatement

**ÉLÉMENTS D'INTERFACE :**
- **Modal** : Réutilise create modal en mode edit
- **Fonction** : `editVariant(id)` (ligne 449-482)
- **SKU** : Input disabled en mode edit
- **Sauvegarde** : `saveVariant()` détecte mode via `editingVariantId`

---

### US-VAR-007-D : Dupliquer une variante

**EN TANT QUE** Chef Produits
**JE VEUX** dupliquer une variante
**AFIN DE** créer rapidement un conditionnement similaire

**CRITÈRES D'ACCEPTATION :**
- ✅ Je peux cliquer sur "📋 Dupliquer"
- ✅ Le système crée une copie avec SKU-COPY
- ✅ La désignation a le suffixe " (Copie)"
- ✅ Le code-barre est effacé (doit être unique)
- ✅ Le flag "par défaut" n'est pas copié
- ✅ Tous les autres champs sont copiés

**ÉLÉMENTS D'INTERFACE :**
- **Fonction** : `duplicateVariant(id)` (ligne 503-540)
- **Logique** : Barcode = null, isDefaultVariant = false

---

### US-VAR-007-E : Supprimer une variante

**EN TANT QUE** Super Administrateur
**JE VEUX** supprimer une variante obsolète
**AFIN DE** nettoyer le catalogue

**CRITÈRES D'ACCEPTATION :**
- ✅ Je peux cliquer sur "🗑️ Supprimer"
- ✅ Je reçois une confirmation
- ✅ La variante disparaît de la liste
- ⚠️ Pas de validation complexe (stock, transactions) dans version actuelle

**ÉLÉMENTS D'INTERFACE :**
- **Fonction** : `deleteVariant(id)` (ligne 542-558)
- **Confirmation** : `confirm()` simple

---

## 3.2 - User Stories Wizard de Création (variants-create.html)

Le wizard de création de variantes est une **fonctionnalité majeure en 7 étapes** qui va bien au-delà des user stories initiales.

### US-VAR-001 : Créer une variante - Étape 1 (Informations générales)

**EN TANT QUE** Super Administrateur, Chef Produits/Magasinier
**JE VEUX** créer une nouvelle variante avec toutes ses informations de base
**AFIN DE** définir l'identité et les propriétés physiques du conditionnement

**CRITÈRES D'ACCEPTATION :**
- ✅ Je peux sélectionner le produit parent via dropdown
- ✅ Je peux saisir le code SKU (obligatoire)
- ✅ Je peux saisir la désignation (obligatoire)
- ✅ Je peux saisir une description détaillée
- ✅ **NOUVEAU** : Je peux sélectionner le type de conditionnement (POT, SAC, SCEAU, BIDON, PALETTE, AUTRE)
- ✅ Je peux saisir le code-barre principal
- ✅ Je peux renseigner les propriétés physiques : poids net (kg), poids brut (kg), volume (m³)
- ✅ Je peux cocher les flags de gestion : Vendable (💰), Achetable (📦), Stockable (📊), Productible (🏭)
- ✅ Je peux cocher "Variante par défaut" (⭐)
- ✅ **NOUVEAU** : Je peux activer et configurer les spécifications techniques :
  - Rendement surfacique avec unité (m²/L, m²/KG, m²/unité)
  - Durée de réalisation (heures/unité)
  - Durée de séchage (heures)
  - Nombre de couches recommandées
  - Quantité de sécurité par défaut
  - Conseils d'application
- ✅ Je peux passer à l'étape suivante si validation OK
- ✅ Je vois la barre de progression (1/7)

**RÈGLES DE GESTION :**
- ✅ **RG-VAR-001** : SKU unique (validation avant sauvegarde finale)
- ✅ **RG-VAR-002** : Barcode unique si renseigné
- ✅ **RG-VAR-003** : Produit parent obligatoire
- ⚠️ **RG-VAR-004/005** : Format et longueur SKU non validés
- ✅ **RG-VAR-009** : Poids et volume > 0 si renseignés
- 🆕 **RG-VAR-053** : Spécifications techniques optionnelles
- 🆕 **RG-VAR-054** : Rendement surfacique > 0
- 🆕 **RG-VAR-055** : Durées ≥ 0

**ÉLÉMENTS D'INTERFACE :**
- **Section** : `#step-1` (visible par défaut)
- **Formulaire** :
  - Select `#productId` (mockProducts)
  - Input `#sku` (required)
  - Input `#designation` (required)
  - Textarea `#detailedDescription`
  - Select `#conditionnementType` (6 options)
  - Input `#barcode`
  - Input `#netWeight`, `#grossWeight`, `#volume` (type number, step 0.01)
  - Checkbox `#isSaleable`, `#isPurchaseable`, `#isStockable`, `#isProducible`, `#isDefaultVariant`
  - Toggle `#hasTechnicalSpecs` (affiche section specs)
  - Input `#surfaceYield`, Select `#surfaceYieldUnit`
  - Input `#realizationTime`, `#dryingTime`, `#recommendedCoats`
  - Input `#defaultSafetyQuantity`
  - Textarea `#productAdvice`
- **Bouton** : "Suivant" → `nextStep()`
- **Progress bar** : 14% (1/7)

---

### US-VAR-002 : Configurer les unités - Étape 2 (Unités & Conversions)

**EN TANT QUE** Chef Produits/Magasinier
**JE VEUX** configurer toutes les unités de gestion et les conversions
**AFIN DE** gérer les transactions dans différentes unités

**CRITÈRES D'ACCEPTATION :**
- ✅ Je peux sélectionner l'unité de stock (UNITE, POT, SAC, SCEAU, BIDON, PALETTE, KG, LITRE, METRE, etc.)
- ✅ Je peux sélectionner l'unité de vente (par défaut = unité stock)
- ✅ Je peux sélectionner l'unité d'achat avec coefficient de conversion
- ✅ Je peux sélectionner l'unité de production (si Productible coché)
- ✅ **NOUVEAU** : Je peux créer une table de conversions personnalisées :
  - Ajouter une conversion via modal
  - Sélectionner unité source (From)
  - Sélectionner unité cible (To)
  - Saisir le facteur de conversion
  - Définir comme conversion par défaut
  - Modifier ou supprimer une conversion
- ✅ Je vois un récapitulatif des unités configurées
- ✅ Je vois des exemples dynamiques (ex: 100 PALETTE = 1 SAC si coefficient 100)
- ✅ Je peux revenir à l'étape précédente
- ✅ Je peux passer à l'étape suivante

**RÈGLES DE GESTION :**
- ✅ **RG-VAR-006** : stockUnit obligatoire si isStockable
- ✅ **RG-VAR-007** : purchaseUnit et coefficient obligatoires si isPurchaseable
- ✅ **RG-VAR-008** : purchaseCoefficient > 0
- 🆕 **RG-VAR-057** : Facteur de conversion > 0
- 🆕 **RG-VAR-058** : Une seule conversion par défaut
- 🆕 **RG-VAR-059** : Conversions utilisées pour mouvements de stock

**ÉLÉMENTS D'INTERFACE :**
- **Section** : `#step-2`
- **Formulaire** :
  - Select `#stockUnit` (20+ unités disponibles)
  - Select `#saleUnit`
  - Select `#purchaseUnit` (désactivé si pas isPurchaseable)
  - Input `#purchaseCoefficient` (type number, min 0.01)
  - Select `#productionUnit` (affiché si isProducible)
- **Table conversions** : `#conversions-table` (affiche conversions ajoutées)
- **Modal** : `#conversion-modal` pour ajouter conversion
  - Select `#conversion-from-unit`
  - Select `#conversion-to-unit`
  - Input `#conversion-factor`
  - Checkbox `#conversion-is-default`
- **Boutons** :
  - "Ajouter conversion" → `openConversionModal()`
  - "Enregistrer conversion" → `saveConversion()`
  - "Modifier" / "Supprimer" sur chaque ligne
- **Récapitulatif** : Bloc affichant résumé des unités
- **Progress bar** : 29% (2/7)

---

### US-VAR-003 : Configurer les paramètres de stock - Étape 3

**EN TANT QUE** Chef Produits/Magasinier
**JE VEUX** configurer tous les paramètres de stock
**AFIN DE** gérer les seuils d'alerte et la valorisation

**CRITÈRES D'ACCEPTATION :**
- ✅ Je peux sélectionner la méthode de valorisation (PMP, FIFO, LIFO)
- ✅ Je peux définir le stock de sécurité (en unité de stock)
- ✅ Je peux définir le point de commande (en unité de stock)
- ✅ **NOUVEAU** : Je peux définir le stock maximum
- ✅ Je peux sélectionner l'emplacement par défaut (dropdown warehouses)
- ✅ **NOUVEAU** : Je peux configurer les lots de production :
  - Taille de lot standard
  - Taille de lot minimum
  - Taille de lot maximum
- ✅ Je vois un indicateur si reorderPoint < securityStock (recommandation)
- ✅ Je peux passer à l'étape suivante

**RÈGLES DE GESTION :**
- ✅ **RG-VAR-010** : Paramètres disponibles si isStockable
- ✅ **RG-VAR-011** : valuationMethod par défaut = PMP
- ✅ **RG-VAR-012** : Seuils exprimés en stockUnit
- ✅ **RG-VAR-013** : reorderPoint ≥ securityStock (recommandation)
- ✅ **RG-VAR-014** : defaultLocationId référence StockLocation
- 🆕 **RG-VAR-061** : Lots de production si isProducible
- 🆕 **RG-VAR-062** : standardLotSize entre min et max

**ÉLÉMENTS D'INTERFACE :**
- **Section** : `#step-3`
- **Formulaire** :
  - Radio `valuationMethod` (PMP/FIFO/LIFO)
  - Input `#securityStock` (type number)
  - Input `#reorderPoint` (type number)
  - Input `#maximumStock` (type number)
  - Select `#defaultLocation` (mock warehouses)
  - Input `#standardLotSize`, `#minimumLotSize`, `#maximumLotSize` (si isProducible)
- **Helper** : Message si reorderPoint < securityStock
- **Progress bar** : 43% (3/7)

---

### US-VAR-004 : Configurer l'approvisionnement - Étape 4 (MASSIVEMENT ENRICHIE)

**EN TANT QUE** Chef Produits/Magasinier
**JE VEUX** configurer tous les paramètres d'approvisionnement
**AFIN DE** optimiser la gestion des achats et la planification

**CRITÈRES D'ACCEPTATION :**
- ✅ **NOUVEAU** : Je peux sélectionner la méthode de réapprovisionnement :
  - Manuel
  - Point de commande (Reorder Point)
  - MRP (Planification des besoins) - futur
  - JIT (Juste-à-temps) - futur
- ✅ **NOUVEAU** : Si Productible ET Achetable, je peux définir la source préférée :
  - MAKE (Fabriquer en priorité)
  - BUY (Acheter en priorité)
  - BOTH (Les deux)
- ✅ Je peux définir le délai de fabrication (manufacturingLeadTime en jours)
- ✅ Je peux sélectionner le fournisseur par défaut (dropdown)
- ✅ **NOUVEAU** : Je peux gérer plusieurs fournisseurs alternatifs :
  - Ajouter un fournisseur alternatif
  - Définir un délai spécifique par fournisseur
  - Supprimer un fournisseur alternatif
- ✅ Je peux définir la quantité minimum de commande (minimumOrderQuantity)
- ✅ Je peux définir le délai d'approvisionnement (leadTimeDays)
- ✅ **NOUVEAU** : Je peux configurer les alertes :
  - Activer alerte stock bas (enableLowStockAlert)
  - Activer alerte point de commande (enableReorderAlert)
  - Activer alerte surstock (enableOverstockAlert)
  - Définir les utilisateurs notifiés
- ✅ **NOUVEAU** : Je peux configurer la prévision de demande :
  - Auto-calculer le point de commande
  - Saisir la demande quotidienne moyenne
  - Sélectionner la méthode de prévision (Manuel, Historique, Pondéré)
- ✅ Je peux passer à l'étape suivante

**RÈGLES DE GESTION :**
- ✅ **RG-VAR-016** : Paramètres disponibles si isPurchaseable
- ✅ **RG-VAR-017** : defaultSupplierId référence Partner SUPPLIER actif
- ✅ **RG-VAR-018** : leadTimeDays ≥ 0
- ✅ **RG-VAR-020** : Délai en jours ouvrés
- 🆕 **RG-VAR-063** : Méthode réapprovisionnement obligatoire
- 🆕 **RG-VAR-064** : Preferred source si isPurchaseable ET isProducible
- 🆕 **RG-VAR-065** : Fournisseurs alternatifs optionnels
- 🆕 **RG-VAR-066** : Méthode prévision utilisée pour calculs MRP

**ÉLÉMENTS D'INTERFACE :**
- **Section** : `#step-4` (TRÈS RICHE)
- **Formulaire** :
  - Radio `replenishmentMethod` (4 options)
  - Radio `preferredSource` (MAKE/BUY/BOTH) - si applicable
  - Input `#manufacturingLeadTime` (jours)
  - Select `#defaultSupplier` (mock suppliers)
  - Bouton "Ajouter fournisseur alternatif" → modal
  - Liste `#alternative-suppliers-list`
  - Input `#minimumOrderQuantity`
  - Input `#leadTimeDays`
  - Checkbox `#enableLowStockAlert`, `#enableReorderAlert`, `#enableOverstockAlert`
  - Multi-select `#notifiedUsers` (mock users)
  - Checkbox `#autoCalculateReorderPoint`
  - Input `#averageDailyDemand`
  - Radio `forecastMethod` (MANUAL/HISTORICAL/WEIGHTED)
- **Modal** : `#alternative-supplier-modal`
- **Progress bar** : 57% (4/7)

---

### US-VAR-008 : Configurer le prix - Étape 5 (NOUVEAU - Non documenté initialement)

**EN TANT QUE** Chef Produits/Magasinier
**JE VEUX** configurer le prix d'achat et le coefficient de marge
**AFIN DE** calculer automatiquement le prix de vente

**CRITÈRES D'ACCEPTATION :**
- ✅ Je peux saisir le prix d'achat unitaire (prixAchat) en XAF
- ✅ Je peux saisir un coefficient multiplicateur
- ✅ Le système calcule automatiquement : prixVenteHT = prixAchat × coefficient
- ✅ Je vois un aperçu en temps réel du calcul avec formatage monétaire
- ✅ Les champs sont optionnels (peuvent être configurés plus tard)
- ✅ Je peux passer à l'étape suivante

**RÈGLES DE GESTION :**
- 🆕 **RG-VAR-046** : prixAchat > 0 si renseigné
- 🆕 **RG-VAR-047** : coefficient > 0 si renseigné
- 🆕 **RG-VAR-048** : prixVenteHT calculé automatiquement
- 🆕 **RG-VAR-049** : Calcul en temps réel au changement

**ÉLÉMENTS D'INTERFACE :**
- **Section** : `#step-5`
- **Formulaire** :
  - Input `#prixAchat` (type number, step 0.01)
  - Input `#coefficient` (type number, step 0.01)
  - Div `#prixVenteHT-preview` (calcul automatique)
- **Fonction** : `calculatePrixVente()` (listeners sur inputs)
- **Formatage** : `new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' })`
- **Progress bar** : 71% (5/7)

---

### US-VAR-005 : Configurer la production - Étape 6 (MASSIVEMENT ENRICHIE)

**EN TANT QUE** Chef Produits/Magasinier
**JE VEUX** configurer toutes les données de production
**AFIN DE** définir comment la variante est fabriquée avec nomenclature et gamme

**CRITÈRES D'ACCEPTATION :**
- ✅ Cette étape n'est affichée que si isProducible = true
- ✅ Je vois un indicateur de statut "Production activée"
- ✅ **NOMENCLATURE (Bill of Materials - BOM)** :
  - Je peux rechercher et ajouter des composants via modal de recherche
  - Je peux sélectionner une variante composant dans la liste
  - Je vois les détails du composant (code, nom, stock actuel, prix PMP)
  - Je peux saisir la quantité nécessaire par unité de production
  - Je vois le coût unitaire et le coût total du composant
  - Je vois le coût total de la nomenclature (somme de tous les composants)
  - Je peux modifier ou supprimer un composant de la BOM
- ✅ **GAMME DE FABRICATION (Routing)** :
  - Je peux ajouter des phases de fabrication via modal
  - Je peux définir le numéro de séquence
  - Je peux saisir le nom de l'opération
  - Je peux saisir la description de l'opération
  - Je peux sélectionner le poste de charge (workstation)
  - Je peux saisir le temps de réglage (setup time en minutes par lot)
  - Je peux saisir le temps unitaire (unit time en minutes par unité)
  - Je vois le coût calculé : (setupTime/lotSize + unitTime) × hourlyRate
  - Je vois le coût total de la gamme (somme de toutes les phases)
  - Je peux modifier ou supprimer une phase
- ✅ Je vois un récapitulatif : Coût BOM + Coût Routing = Coût de revient estimé
- ✅ Je peux passer à l'étape suivante

**RÈGLES DE GESTION :**
- ✅ **RG-VAR-021** : Données disponibles si isProducible
- ✅ **RG-VAR-022** : productionUnit obligatoire (défini à étape 2)
- ✅ **RG-VAR-025** : Composants doivent être des variantes achetables ou productibles
- ✅ **RG-VAR-026** : Pas de référence circulaire (composant ≠ variante elle-même)
- ✅ **RG-VAR-027** : Quantité composant > 0
- ✅ **RG-VAR-028** : Phases numérotées séquentiellement
- ✅ **RG-VAR-029** : chargePostId valide
- ✅ **RG-VAR-030** : Temps ≥ 0
- 🆕 **RG-VAR-067** : Coût BOM calculé automatiquement
- 🆕 **RG-VAR-068** : Coût routing calculé automatiquement
- 🆕 **RG-VAR-069** : Coût de revient = BOM + Routing

**ÉLÉMENTS D'INTERFACE :**
- **Section** : `#step-6` (conditionnelle)
- **BOM Section** :
  - Bouton "Ajouter composant" → modal recherche
  - Modal `#bom-component-modal` avec recherche variantes
  - Table `#bom-table` affichant composants
  - Input quantité par composant
  - Calcul coût total BOM affiché
- **Routing Section** :
  - Bouton "Ajouter phase" → modal phase
  - Modal `#routing-phase-modal`
  - Inputs : sequence, operation, description, workstation, setupTime, unitTime
  - Table `#routing-table` affichant phases
  - Calcul coût total routing affiché
- **Récapitulatif** : Bloc avec coût BOM + Routing + Total
- **Fonctions** :
  - `openBOMModal()` : Recherche composants
  - `addBOMComponent()` : Ajoute composant
  - `removeBOMComponent()` : Supprime
  - `updateBOMCosts()` : Recalcule coûts
  - `openRoutingModal()` : Ajoute phase
  - `addRoutingPhase()` : Enregistre phase
  - `removeRoutingPhase()` : Supprime
  - `updateRoutingCosts()` : Recalcule coûts
- **Progress bar** : 86% (6/7)

---

### US-VAR-009 : Gérer les médias - Étape 7 (NOUVEAU - Non documenté initialement)

**EN TANT QUE** Chef Produits
**JE VEUX** ajouter des images et documents à la variante
**AFIN DE** documenter le produit avec visuels et fiches techniques

**CRITÈRES D'ACCEPTATION :**
- ✅ **IMAGES** :
  - Je peux uploader plusieurs images (drag & drop ou click)
  - Je peux prévisualiser les images dans une grille
  - Je vois le nom et la taille de chaque image
  - Je peux supprimer une image
  - Formats acceptés : JPG, PNG, GIF, WEBP
- ✅ **DOCUMENTS** :
  - Je peux uploader des documents (drag & drop ou click)
  - Je peux typer chaque document :
    - Fiche technique
    - Certificat
    - Notice d'utilisation
    - FDS (Fiche de Données de Sécurité)
    - Catalogue
    - Autre
  - Je vois la liste des documents avec leur type et taille
  - Je peux supprimer un document
  - Formats acceptés : PDF, DOC, DOCX, XLS, XLSX
- ✅ Je peux finaliser la création en cliquant "Terminer et Enregistrer"
- ✅ Je reçois un récapitulatif complet de toutes les étapes

**RÈGLES DE GESTION :**
- 🆕 **RG-VAR-050** : Taille max image 5 MB
- 🆕 **RG-VAR-051** : Taille max document 10 MB
- 🆕 **RG-VAR-052** : Formats images : JPG, PNG, GIF, WEBP
- 🆕 **RG-VAR-053** : Formats documents : PDF, DOC, DOCX, XLS, XLSX
- 🆕 **RG-VAR-054** : Type de document obligatoire pour chaque document
- 🆕 **RG-VAR-055** : Les médias sont optionnels

**ÉLÉMENTS D'INTERFACE :**
- **Section** : `#step-7` (dernière étape)
- **Upload Images** :
  - Zone `#image-drop-zone` (drag & drop)
  - Input `#image-upload` (type file, multiple, accept image/*)
  - Grid `#images-preview` (vignettes avec bouton supprimer)
- **Upload Documents** :
  - Zone `#document-drop-zone` (drag & drop)
  - Input `#document-upload` (type file, multiple, accept .pdf,.doc,.docx,.xls,.xlsx)
  - Select `#document-type` (6 options)
  - Liste `#documents-list` (documents avec type, taille, bouton supprimer)
- **Fonctions** :
  - `handleImageUpload()` : Gère upload images
  - `handleDocumentUpload()` : Gère upload documents
  - `removeImage(index)` : Supprime image
  - `removeDocument(index)` : Supprime document
- **Bouton final** : "Terminer et Enregistrer" → `finishWizard()`
- **Modal récapitulatif** : Affiche résumé de toutes les données avant sauvegarde finale
- **Progress bar** : 100% (7/7)

---

### US-VAR-010 : Spécifications techniques (NOUVEAU - Intégré à Étape 1)

**EN TANT QUE** Chef Produits (produits techniques)
**JE VEUX** saisir les spécifications techniques d'application
**AFIN DE** documenter les caractéristiques de mise en œuvre du produit

**CRITÈRES D'ACCEPTATION :**
- ✅ Je peux activer/désactiver les spécifications techniques (toggle)
- ✅ Si activé, je peux saisir :
  - Rendement surfacique avec unité (m²/L, m²/KG, m²/unité)
  - Durée de réalisation (heures/unité)
  - Durée de séchage (heures)
  - Nombre de couches recommandées
  - Quantité de sécurité par défaut (%)
  - Conseils d'application (textarea)
- ✅ Ces données sont sauvegardées avec la variante
- ✅ Elles sont utilisées pour calculer les quantités dans les devis

**RÈGLES DE GESTION :**
- 🆕 **RG-VAR-070** : Spécifications optionnelles (toggle)
- 🆕 **RG-VAR-071** : Rendement surfacique > 0
- 🆕 **RG-VAR-072** : Durées ≥ 0
- 🆕 **RG-VAR-073** : Quantité sécurité entre 0 et 100%
- 🆕 **RG-VAR-074** : Utilisé pour devis et planification chantier

**ÉLÉMENTS D'INTERFACE :**
- **Toggle** : `#hasTechnicalSpecs` (Étape 1)
- **Section conditionnelle** : Affichée si toggle = ON
- **Inputs** : Tous les champs techniques listés ci-dessus

---

### US-VAR-011 : Table de conversions d'unités (NOUVEAU - Intégré à Étape 2)

**EN TANT QUE** Chef Produits/Magasinier
**JE VEUX** définir des conversions personnalisées entre unités
**AFIN DE** faciliter les transactions dans différentes unités de mesure

**CRITÈRES D'ACCEPTATION :**
- ✅ Je peux ajouter une conversion : unité source → unité cible avec facteur
- ✅ Je peux définir une conversion comme par défaut
- ✅ Je peux éditer une conversion existante
- ✅ Je peux supprimer une conversion
- ✅ Je vois un aperçu de toutes les conversions configurées
- ✅ Le système utilise ces conversions pour les calculs de stock

**RÈGLES DE GESTION :**
- 🆕 **RG-VAR-075** : Facteur de conversion > 0
- 🆕 **RG-VAR-076** : Une seule conversion par défaut
- 🆕 **RG-VAR-077** : Conversions utilisées pour mouvements de stock et transactions
- 🆕 **RG-VAR-078** : Exemple : 100 SAC = 1 PALETTE → facteur = 100

**ÉLÉMENTS D'INTERFACE :**
- **Bouton** : "Ajouter conversion" (Étape 2)
- **Modal** : `#conversion-modal`
- **Table** : `#conversions-table` avec colonnes (From, To, Factor, Default, Actions)
- **Array** : `variantData.conversions = []` stocke toutes les conversions

---

## 3.3 - Fonctionnalités Wizard Additionnelles

### US-VAR-012 : Navigation dans le wizard

**EN TANT QUE** Utilisateur
**JE VEUX** naviguer facilement entre les étapes du wizard
**AFIN DE** créer une variante de manière guidée

**CRITÈRES D'ACCEPTATION :**
- ✅ Je vois une barre de progression visuelle avec 7 étapes
- ✅ Je vois le numéro et le pourcentage de progression
- ✅ Je peux cliquer "Suivant" pour avancer
- ✅ Je peux cliquer "Précédent" pour revenir en arrière
- ✅ Le bouton "Suivant" valide les champs obligatoires avant de passer
- ✅ Les étapes conditionnelles (Production, Spécifications) s'affichent selon les flags
- ✅ La dernière étape affiche "Terminer et Enregistrer"

**ÉLÉMENTS D'INTERFACE :**
- **Progress bar** : Affiche étape actuelle et pourcentage
- **Fonctions** :
  - `nextStep()` : Avance avec validation
  - `previousStep()` : Recule sans validation
  - `goToStep(n)` : Va à l'étape n
  - `updateProgress()` : Met à jour la barre
  - `validateStep(n)` : Valide l'étape n

---

### US-VAR-013 : Sauvegarde et restauration de brouillon

**EN TANT QUE** Utilisateur
**JE VEUX** sauvegarder mon travail en cours
**AFIN DE** ne pas perdre les données si je quitte le wizard

**CRITÈRES D'ACCEPTATION :**
- ✅ Je peux cliquer "Sauvegarder brouillon"
- ✅ Le système enregistre toutes les données dans localStorage
- ✅ Au retour sur la page, je vois un message "Brouillon détecté"
- ✅ Je peux choisir de restaurer ou ignorer le brouillon
- ✅ La restauration recharge toutes les données et revient à l'étape sauvegardée

**ÉLÉMENTS D'INTERFACE :**
- **Bouton** : "💾 Sauvegarder brouillon" (toutes les étapes)
- **Fonctions** :
  - `saveDraft()` : Sauvegarde dans localStorage
  - `checkForDraft()` : Vérifie au chargement
  - `restoreDraft()` : Restaure les données
  - `clearDraft()` : Supprime le brouillon
- **LocalStorage key** : `variant-wizard-draft`

---

### US-VAR-014 : Récapitulatif final avant sauvegarde

**EN TANT QUE** Utilisateur
**JE VEUX** voir un récapitulatif complet avant de finaliser
**AFIN DE** vérifier toutes les informations saisies

**CRITÈRES D'ACCEPTATION :**
- ✅ À l'étape 7, je clique "Terminer et Enregistrer"
- ✅ Une modal s'ouvre avec un récapitulatif de toutes les étapes
- ✅ Je vois : Infos générales, Unités, Stock, Appro, Prix, Production (si applicable), Médias
- ✅ Je peux annuler et revenir au wizard
- ✅ Je peux confirmer et enregistrer définitivement
- ✅ La sauvegarde crée la variante et vide le brouillon

**ÉLÉMENTS D'INTERFACE :**
- **Fonction** : `finishWizard()` (affiche modal récapitulatif)
- **Modal** : Résumé structuré de `variantData`
- **Boutons** : "Annuler" / "Confirmer et Enregistrer"
- **Sauvegarde finale** : Ajoute la variante à la liste globale ou envoie à l'API

---

# 4. RÈGLES DE GESTION CONSOLIDÉES

## 4.1 - Catégories

| Code | Règle | Implémentation |
|------|-------|----------------|
| RG-CAT-001 | Code unique | ✅ Validé (ligne 415-418) |
| RG-CAT-002 | Nom unique dans même niveau | ✅ Validé |
| RG-CAT-003 | Catégorie racine (null, level 0) | ✅ Implémenté |
| RG-CAT-004 | Level auto-calculé | ✅ Implémenté (ligne 422-426) |
| RG-CAT-005 | Profondeur max 5 niveaux | ⚠️ Non validé |
| RG-CAT-006 | Code format A-Z, 0-9, -, _ | ⚠️ Non validé |
| RG-CAT-007 | Code max 30 caractères | ⚠️ Non validé |
| RG-CAT-008 | Pas de référence circulaire | ✅ Validé (ligne 384) |
| RG-CAT-009/010 | isLeaf auto-géré | ✅ Implémenté |
| RG-CAT-011 | Vérification boucle | ✅ Implémenté |
| RG-CAT-012 | Modification parent n'affecte pas produits | ✅ Respecté |
| RG-CAT-013-016 | Règles désactivation | ✅ Implémenté dans delete |
| RG-CAT-017-021 | Règles affichage/recherche | ✅ Implémenté |
| RG-CAT-022 | Impossible supprimer avec sous-catégories | ✅ Validé (ligne 556) |
| RG-CAT-023 | Confirmation si produits | ✅ Validé (ligne 563) |
| RG-CAT-024 | Mise à jour parent après suppression | ✅ Implémenté (ligne 572) |

## 4.2 - Produits

| Code | Règle | Implémentation |
|------|-------|----------------|
| RG-PRD-001 | Code unique | ✅ Validé (ligne 505-508) |
| RG-PRD-002 | Désignation unique dans catégorie | ⚠️ Non strictement validé |
| RG-PRD-003 | Catégorie obligatoire | ✅ Required |
| RG-PRD-004-007 | Format/longueur code et image | ⚠️ Non validé |
| RG-PRD-008 | ProductType obligatoire | ✅ Dropdown |
| RG-PRD-009 | Product sans données opérationnelles | ✅ Respecté |
| RG-PRD-010 | Code non modifiable | ✅ Disabled (ligne 134) |
| RG-PRD-011-014 | Règles modification | ✅ Implémenté |
| RG-PRD-015-019 | Règles duplication | ✅ Implémenté |
| RG-PRD-020-023 | Règles activation/désactivation | ✅ Implémenté |
| RG-PRD-024-028 | Règles liste/recherche | ✅ Implémenté |
| RG-PRD-029-030 | Règles suppression | ✅ Validé (ligne 428) |

## 4.3 - Variantes

| Code | Règle | Implémentation |
|------|-------|----------------|
| RG-VAR-001-045 | Règles originales | ✅ Majoritairement implémentées |
| RG-VAR-046-049 | **Pricing (Étape 5)** | 🆕 Nouvelles règles implémentées |
| RG-VAR-050-055 | **Médias (Étape 7)** | 🆕 Nouvelles règles implémentées |
| RG-VAR-053-056 | **Spécifications techniques** | 🆕 Nouvelles règles implémentées |
| RG-VAR-057-060 | **Table de conversions** | 🆕 Nouvelles règles implémentées |
| RG-VAR-061-062 | **Lots de production** | 🆕 Nouvelles règles implémentées |
| RG-VAR-063-066 | **Approvisionnement avancé** | 🆕 Nouvelles règles implémentées |
| RG-VAR-067-069 | **Coûts BOM et Routing** | 🆕 Nouvelles règles implémentées |
| RG-VAR-070-074 | **Spécifications techniques détaillées** | 🆕 Nouvelles règles implémentées |
| RG-VAR-075-078 | **Conversions unités** | 🆕 Nouvelles règles implémentées |

---

# 5. FONCTIONNALITÉS TRANSVERSES

## 5.1 - Recherche et Filtres (Tous les modules)

**CRITÈRES COMMUNS :**
- ✅ Recherche temps réel (keyup event)
- ✅ Recherche insensible à la casse
- ✅ Filtres combinables (AND logic)
- ✅ Réinitialisation des filtres
- ✅ Compteur de résultats

## 5.2 - Tri (Tous les modules)

**CRITÈRES COMMUNS :**
- ✅ Tri par colonne (click sur en-tête)
- ✅ Tri ascendant/descendant (toggle)
- ✅ Indicateur visuel (flèche ▲▼)
- ✅ Tri alphanumérique et numérique

## 5.3 - Pagination (Tous les modules)

**CRITÈRES COMMUNS :**
- ✅ 10 items par page (configurable)
- ✅ Boutons Précédent/Suivant
- ✅ Indicateur page courante / total pages
- ✅ Désactivation boutons si première/dernière page

## 5.4 - Statistiques (Tous les modules)

**CRITÈRES COMMUNS :**
- ✅ 4 cartes statistiques en haut de page
- ✅ Mise à jour temps réel après chaque action
- ✅ Icônes et couleurs distinctives
- ✅ Animations au hover

## 5.5 - Export (Tous les modules)

**CRITÈRES COMMUNS :**
- ⚠️ Boutons Excel et PDF présents
- ⚠️ Fonctionnalité placeholder (alert message)
- ⚠️ À implémenter avec librairie (SheetJS, jsPDF)

---

# 6. ARCHITECTURE TECHNIQUE

## 6.1 - Pattern JavaScript

**Structure commune à tous les fichiers JS :**
```javascript
// 1. Variables globales d'état
let items = [];
let filteredItems = [];
let currentPage = 1;
let sortColumn = 'code';
let sortDirection = 'asc';
let editingItemId = null;

// 2. Initialisation DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    initializeEventListeners();
});

// 3. Fonctions de chargement
function loadData() { /* ... */ }
function generateMockData() { /* ... */ }

// 4. Fonctions de rendu
function renderTable() { /* ... */ }
function renderTree() { /* ... */ }  // Pour catégories
function renderGrid() { /* ... */ }  // Pour produits

// 5. Fonctions de filtrage
function applyFilters() { /* ... */ }
function filterBySearch() { /* ... */ }

// 6. Fonctions de tri
function sortTable(column) { /* ... */ }

// 7. Fonctions CRUD
function openCreateModal() { /* ... */ }
function saveItem() { /* ... */ }
function editItem(id) { /* ... */ }
function deleteItem(id) { /* ... */ }
function duplicateItem(id) { /* ... */ }
function viewItem(id) { /* ... */ }

// 8. Fonctions de pagination
function renderPagination() { /* ... */ }
function nextPage() { /* ... */ }
function previousPage() { /* ... */ }

// 9. Fonctions utilitaires
function updateStats() { /* ... */ }
function closeModal() { /* ... */ }
```

## 6.2 - Pattern HTML/Modales

**Structure commune à toutes les pages :**
```html
<!-- 1. Header avec logo et user menu -->
<header>...</header>

<!-- 2. Sidebar navigation -->
<aside>...</aside>

<!-- 3. Main content -->
<main>
    <!-- 3.1 Statistiques -->
    <div class="stats-grid">...</div>

    <!-- 3.2 Filtres et actions -->
    <div class="filters-section">...</div>

    <!-- 3.3 Tableau/Grille/Arbre -->
    <div class="data-section">...</div>

    <!-- 3.4 Pagination -->
    <div class="pagination">...</div>
</main>

<!-- 4. Modales -->
<div id="create-modal">...</div>
<div id="view-modal">...</div>
<div id="delete-confirm">...</div>
```

## 6.3 - Classes CSS Communes

**Réutilisées dans `catalogue-common.css` :**
- `.page-header`, `.page-title`
- `.stats-card`
- `.filters-section`
- `.btn-primary`, `.btn-secondary`, `.btn-danger`
- `.badge-active`, `.badge-inactive`
- `.modal`, `.modal-overlay`
- `.form-group`, `.form-label`, `.form-input`

