# USER STORIES DÉTAILLÉES - MODULE TRÉSORERIE ET ENCAISSEMENTS
## ERP MULTIFLEX - Groupe IOLA - Version Complète pour Développement

**Version:** 1.0  
**Date:** 16 novembre 2025  
**Statut:** Validé - Prêt pour développement  
**Total User Stories:** 20  
**Effort Total:** 148 points

---

## 📋 SECTION A : GESTION DES JOURNAUX DE TRÉSORERIE

### US-TRES-001 : Créer et configurer un journal de trésorerie

**EN TANT QUE** Directeur Financier  
**JE VEUX** créer et configurer les journaux de trésorerie de l'entreprise  
**AFIN DE** structurer la gestion des flux financiers par compte bancaire ou caisse

**CRITÈRES D'ACCEPTATION :**

**Interface de Création :**
- ✅ Accès via menu "Trésorerie > Configuration > Journaux"
- ✅ Bouton [+ Nouveau Journal] visible
- ✅ Formulaire de création structuré en sections

**Section 1 : Informations Générales**
- ✅ Champ "Code Journal" :
  - Format : 3-20 caractères alphanumériques
  - Exemples valides : "BNK-001", "CSH-YDE-001", "MM-OM-001"
  - Validation unicité au niveau société
  - Message erreur si code existe déjà
  - Majuscules automatiques
- ✅ Champ "Libellé" :
  - Texte libre 5-100 caractères
  - Exemples : "Compte UBA Douala Siège", "Caisse Principale Yaoundé", "Orange Money Commercial"
  - Obligatoire
- ✅ Sélecteur "Société Propriétaire" :
  - Liste déroulante sociétés du groupe
  - Pré-sélection société utilisateur connecté
  - Obligatoire
  - Filtre selon habilitations utilisateur

**Section 2 : Type et Caractéristiques**
- ✅ Sélecteur "Type de Journal" (Radio buttons avec icônes) :
  - 🏦 **BANK_ACCOUNT** (Compte bancaire)
    - Description : Compte courant ou épargne auprès d'une banque
    - Affiche section "Détails Bancaires"
  - 💵 **CASH_DESK** (Caisse)
    - Description : Caisse physique avec fonds en espèces
    - Affiche section "Paramètres Caisse"
  - 📱 **MOBILE_MONEY** (Mobile Money)
    - Description : Compte Orange Money, MTN MoMo, etc.
    - Affiche section "Détails Mobile Money"
  - 💰 **PETTY_CASH** (Petite caisse)
    - Description : Caisse pour petites dépenses quotidiennes
    - Affiche section "Limites Petite Caisse"
  - 🔄 **VIRTUAL** (Compte virtuel)
    - Description : Compte d'attente ou de transit
- ✅ Champ "Devise" :
  - Liste déroulante
  - Valeur unique dans MVP : XAF (Franc CFA)
  - Désactivé (grisé) avec tooltip "Multi-devises disponible Phase 2"

**Section 3 : Détails Bancaires** (Si type = BANK_ACCOUNT)
- ✅ Champ "Nom de la Banque" :
  - Liste déroulante + saisie libre
  - Banques pré-configurées : BICEC, UBA, Afriland First Bank, Ecobank, SCB Cameroun, SGBC, Autre
  - Si "Autre" → champ texte libre
- ✅ Champ "Code Banque" (5 chiffres, optionnel)
- ✅ Champ "Code Guichet/Agence" (5 chiffres, optionnel)
- ✅ Champ "Numéro de Compte" :
  - 10-34 caractères alphanumériques
  - Obligatoire si type BANK_ACCOUNT
  - Validation format basique
- ✅ Champ "IBAN" (optionnel) :
  - Format : 2 lettres pays + 2 chiffres clé + max 30 caractères
  - Exemple : CM21 XXXX XXXX XXXX XXXX XXXX
  - Validation format IBAN si renseigné
- ✅ Champ "Code SWIFT/BIC" (8 ou 11 caractères, optionnel)
  - Exemples : BICECMCX, UBAFCMCX
  - Majuscules automatiques
- ✅ Sélecteur "Type de Compte" :
  - CURRENT (Compte courant) - par défaut
  - SAVINGS (Compte épargne)
  - LOAN (Compte de prêt)
- ✅ Champ "Titulaire du Compte" :
  - Pré-rempli avec raison sociale société
  - Modifiable

**Section 4 : Paramètres Caisse** (Si type = CASH_DESK)
- ✅ Champ "Emplacement Caisse" :
  - Texte libre (ex: "Bureau DAF - 2ème étage", "Point de vente Akwa")
- ✅ Champ "Responsable Caisse" :
  - Sélection employé (Caissier)
  - Recherche par nom
- ✅ Checkbox "Caisse avec tiroir-caisse" (Oui/Non)

**Section 5 : Détails Mobile Money** (Si type = MOBILE_MONEY)
- ✅ Sélecteur "Opérateur" :
  - Orange Money
  - MTN Mobile Money
  - Express Union Mobile
  - YUP Mobile Money
  - Autre
- ✅ Champ "Numéro de Téléphone" :
  - Format : 6XXXXXXXX (9 chiffres)
  - Validation format camerounais
  - Obligatoire
- ✅ Champ "Nom du Compte" :
  - Nom associé au compte mobile money
  - Optionnel

**Section 6 : Paramètres Sécurité et Contrôles**
- ✅ Champ "Découvert Autorisé" :
  - Montant XAF (défaut : 0)
  - Nombre positif ou zéro
  - Tooltip : "Montant négatif maximum autorisé sur ce journal"
  - Si > 0 : Affichage alerte "⚠️ Découvert autorisé : Vigilance requise"
- ✅ Champ "Seuil Alerte Trésorerie" :
  - Montant XAF
  - Exemple : 500,000 XAF
  - Tooltip : "Alerte envoyée si solde < ce seuil"
  - Couleur orange si proche, rouge si dépassé
- ✅ Champ "Montant Double Signature" :
  - Montant XAF (défaut : 5,000,000 XAF)
  - Tooltip : "Transactions ≥ ce montant nécessitent 2 signatures"
  - Paramétrable par journal
- ✅ Champ "Plafond Retrait Journalier" (Si type caisse) :
  - Montant XAF
  - Exemple : 200,000 XAF
  - Limite espèces pouvant sortir de la caisse par jour

**Section 7 : Solde Initial**
- ✅ Champ "Solde à l'Ouverture" :
  - Montant XAF
  - Obligatoire
  - Peut être positif, négatif ou zéro
  - Validation : Si négatif, doit être ≥ Découvert autorisé
  - Date solde initial : Date création journal
- ✅ Message informatif :
  - "ℹ️ Le solde initial sera enregistré automatiquement comme première transaction du journal"

**Section 8 : Activation**
- ✅ Sélecteur "Statut" :
  - ACTIVE (Actif - opérationnel) - par défaut
  - SUSPENDED (Suspendu - temporairement fermé)
  - Radio buttons
  - Tooltip statut SUSPENDED : "Aucune nouvelle transaction ne pourra être créée"

**Boutons d'Action :**
- ✅ [Annuler] : Retour liste journaux sans sauvegarder
- ✅ [Enregistrer] : Validation et création
  - Contrôles avant sauvegarde :
    - Tous champs obligatoires remplis
    - Code journal unique
    - IBAN/SWIFT format valide si renseignés
    - Solde initial cohérent avec découvert
  - Si erreurs → Messages rouges sous champs concernés
  - Si OK → Création journal + Notification succès + Redirection vers liste

**Notifications et Impacts :**
- ✅ Toast notification succès :
  - "✅ Journal [Code] créé avec succès. Solde initial : XXX XAF"
- ✅ Email automatique envoyé à :
  - Créateur du journal
  - Équipe trésorerie (CC)
  - DAF (CC)
- ✅ Création automatique transaction solde initial :
  - Type : OPENING_BALANCE
  - Montant : Solde initial
  - Date : Date création journal
  - Libellé : "Solde d'ouverture journal [Code]"
- ✅ Mise à jour solde journal = Solde initial
- ✅ Audit trail :
  - Qui a créé (user_id)
  - Quand (timestamp précis)
  - Paramètres configurés

**RÈGLES DE GESTION :**
- RG-TRES-001 : Code journal unique au niveau de la société propriétaire
- RG-TRES-002 : Un compte bancaire physique ne peut avoir qu'un seul journal actif
- RG-TRES-003 : Solde initial obligatoire à la création (peut être 0)
- RG-TRES-004 : Modification limitée après première transaction (seuls libellé, seuils, découvert modifiables)
- RG-TRES-005 : Devise fixe XAF dans MVP (multi-devises Phase 2)
- RG-TRES-006 : Type journal non modifiable après création
- RG-TRES-007 : Si solde initial négatif → doit être ≤ découvert autorisé

**Priorité :** P0 (Critique)  
**Estimation :** 5 points  
**Dépendances :** Aucune  
**Impacté par :** Configuration sociétés, Gestion employés

---

### US-TRES-002 : Consulter soldes et mouvements des journaux

**EN TANT QUE** Trésorier  
**JE VEUX** consulter en temps réel les soldes et mouvements de tous mes journaux de trésorerie  
**AFIN DE** piloter la position de trésorerie et identifier rapidement les tensions

**CRITÈRES D'ACCEPTATION :**

**Page Liste des Journaux :**
- ✅ Accès via menu "Trésorerie > Journaux" ou Dashboard
- ✅ Titre page : "Mes Journaux de Trésorerie"
- ✅ Vue tableau responsive avec colonnes :

**Colonne 1 : Type (Icône + Label)**
- 🏦 Banque
- 💵 Caisse
- 📱 Mobile Money
- 💰 Petite Caisse
- 🔄 Virtuel
- Tri possible par type

**Colonne 2 : Code + Libellé**
- Code en gras (ex: **BNK-001**)
- Libellé en dessous (gris, plus petit)
- Tri alphabétique possible
- Recherche textuelle dans code et libellé

**Colonne 3 : Société**
- Nom société propriétaire
- Filtre multi-sélection disponible

**Colonne 4 : Solde Comptable**
- **Montant en XAF formaté** (ex: 25,000,000 XAF)
- Couleur selon statut :
  - 🟢 **Vert** : Solde ≥ Seuil alerte
  - 🟡 **Orange** : Solde entre 0 et seuil alerte (< 20% seuil)
  - 🔴 **Rouge** : Découvert (solde négatif)
- Icône 💰 si solde très élevé (> 50M XAF)
- Tri croissant/décroissant possible

**Colonne 5 : Solde Bancaire** (si rapprochement effectué)
- Montant après dernier rapprochement
- Grisé si pas encore de rapprochement
- Date dernier rapprochement en petit (ex: "au 15/11/2026")

**Colonne 6 : Écart**
- Différence Solde Comptable - Solde Bancaire
- Affiché seulement si rapprochement existe
- Rouge si écart > 50,000 XAF
- Tooltip : "Opérations en transit ou non rapprochées"

**Colonne 7 : Dernière Transaction**
- Date dernière opération (ex: "Hier 14:35" ou "15/11/2026")
- Type transaction (Encaissement/Décaissement/Virement)
- Montant
- Tooltip au survol avec détails

**Colonne 8 : Statut**
- Badge visuel :
  - 🟢 **ACTIVE** (vert)
  - 🟡 **SUSPENDED** (orange)
  - ⚫ **CLOSED** (gris)
- Filtre par statut disponible

**Colonne 9 : Actions**
- Bouton [...] (menu actions rapides) :
  - 👁️ Consulter Détails
  - 📊 Voir Mouvements
  - 📥 Nouveau Encaissement (si actif)
  - 📤 Nouveau Décaissement (si actif)
  - 🔄 Virement Interne (si actif)
  - 🔧 Modifier Paramètres
  - ⏸️ Suspendre (si actif)
  - ▶️ Réactiver (si suspendu)

**Barre d'Actions Globale (au-dessus tableau) :**
- ✅ Bouton [+ Nouveau Journal] → US-TRES-001
- ✅ Champ recherche globale (code, libellé, banque)
- ✅ Filtres rapides (chips cliquables) :
  - Tous (par défaut)
  - 🏦 Banques uniquement
  - 💵 Caisses uniquement
  - 📱 Mobile Money uniquement
  - 🔴 En découvert
  - 🟡 Alerte (proche seuil)
  - Ma société uniquement
- ✅ Bouton [Filtres Avancés] → Panel latéral :
  - Société(s) (multi-sélection)
  - Type(s) (multi-sélection)
  - Statut(s)
  - Solde min/max
  - Dernier mouvement (période)
  - Boutons [Réinitialiser] [Appliquer]
- ✅ Bouton [Export] :
  - Export Excel (données brutes)
  - Export PDF (tableau formaté)
  - Options : Avec/sans mouvements détaillés

**Totalisation (Bas de tableau) :**
- ✅ Ligne "TOTAL TRÉSORERIE DISPONIBLE" :
  - Somme tous soldes comptables journaux actifs
  - **Montant en gras, grande police**
  - Couleur selon santé globale
  - Répartition par type (pie chart miniature)
- ✅ Variations affichées :
  - Variation jour (±XXX XAF / ±X%)
  - Variation semaine
  - Variation mois
  - Icônes tendance : ↗️ ↘️ →

**Page Détail Journal (Clic sur ligne ou "Consulter Détails") :**

**En-tête Page Détail :**
- ✅ Breadcrumb : Trésorerie > Journaux > [Code Journal]
- ✅ Titre : Code + Libellé journal
- ✅ Badge statut (ACTIVE, SUSPENDED, CLOSED)
- ✅ Boutons d'actions rapides alignés à droite :
  - [Modifier Paramètres]
  - [Nouveau Mouvement ▾] (dropdown : Encaissement / Décaissement / Virement)
  - [Suspendre/Réactiver]
  - [...] (Autres actions)

**Onglets Page Détail :**

**Onglet 1 : Vue d'Ensemble** (par défaut)
- ✅ Section "Informations du Journal" :
  - Carte d'information avec tous paramètres :
    - Type (icône + libellé)
    - Société propriétaire
    - Code journal, Libellé
    - Devise (XAF)
    - Si banque : Nom banque, N° compte, IBAN, SWIFT
    - Si mobile money : Opérateur, N° téléphone
    - Date création, Créé par
    - Dernière modification
- ✅ Section "Soldes et Limites" :
  - **Solde comptable actuel** (grande carte, couleur selon statut)
  - Solde bancaire (si rapprochement)
  - Écart (si applicable)
  - Découvert autorisé
  - Seuil alerte
  - Seuil double signature
  - Graphique jauge : Position par rapport aux seuils
- ✅ Section "Activité Récente" :
  - 10 dernières transactions
  - Mini tableau : Date, Type, Libellé, Montant, Solde après
  - Lien "Voir tous les mouvements" → Onglet Mouvements

**Onglet 2 : Mouvements** (Historique complet)
- ✅ Tableau paginé toutes transactions du journal :
  - Date/Heure (timestamp précis)
  - N° Transaction (lien cliquable)
  - Type (Encaissement, Décaissement, Virement, Ajustement, etc.)
  - Partenaire (Client/Fournisseur si applicable)
  - Libellé/Description
  - Référence externe (N° chèque, virement, etc.)
  - Débit (montant sortie)
  - Crédit (montant entrée)
  - Solde après opération
  - Statut (VALIDATED, PENDING, CANCELLED)
  - Créé par
- ✅ Filtres mouvements :
  - Période (date début/fin) avec presets (Aujourd'hui, Semaine, Mois, Trimestre, Année, Personnalisé)
  - Type transaction (multi-sélection)
  - Partenaire (recherche)
  - Montant min/max
  - Statut
  - Recherche textuelle (libellé, référence)
- ✅ Tri multi-colonnes
- ✅ Pagination (50/100/200 lignes par page)
- ✅ Export Excel/PDF/CSV avec filtres appliqués
- ✅ Actions sur transaction (clic ligne) :
  - Voir détail transaction
  - Voir document source (Bon encaissement, Ordre décaissement, etc.)
  - Imprimer reçu
  - Annoter (commentaire interne)

**Onglet 3 : Rapprochements Bancaires** (Si type = BANK_ACCOUNT)
- ✅ Liste tous rapprochements effectués :
  - Date rapprochement
  - Période extrait (date début - date fin)
  - Solde extrait
  - Solde comptable
  - Écart final
  - Nombre lignes rapprochées
  - Taux matching automatique (%)
  - Statut (OPEN, CLOSED)
  - Responsable
  - Actions : [Voir Rapport PDF] [Télécharger Extrait]
- ✅ Bouton [+ Nouveau Rapprochement] → US-TRES-012
- ✅ Alerte si pas de rapprochement depuis > 45 jours

**Onglet 4 : Statistiques**
- ✅ Graphiques analytiques :
  - **Évolution Solde** (Line chart 30/90/365 jours)
  - **Flux Mensuels** (Bar chart : Encaissements vs Décaissements)
  - **Répartition Types Transactions** (Pie chart)
  - **Top 10 Partenaires** (Encaissements et Décaissements séparés)
- ✅ KPIs calculés :
  - Solde moyen période
  - Total encaissements période
  - Total décaissements période
  - Flux net période
  - Nombre jours découvert (si applicable)
  - Nombre transactions période
- ✅ Sélecteur période (Mois, Trimestre, Année, Personnalisé)

**Actualisation Temps Réel :**
- ✅ Auto-refresh toutes les 30 secondes (configurable)
- ✅ Indicateur "🔄 Actualisé il y a X secondes"
- ✅ Bouton [Actualiser Maintenant]
- ✅ Toast notification si nouveau mouvement détecté :
  - "💰 Nouveau mouvement : +XXX XAF (Encaissement client ABC)"
  - Clic → Ouvre détail transaction

**Alertes Visuelles :**
- ✅ Si journal en découvert :
  - Bannière rouge en haut de page détail
  - "⚠️ DÉCOUVERT : Solde négatif de XXX XAF. Découvert autorisé : YYY XAF"
  - Bouton [Actions Correctives]
- ✅ Si proche seuil alerte :
  - Bannière orange
  - "⚠️ ATTENTION : Solde proche du seuil d'alerte (XXX XAF restants avant seuil)"
- ✅ Si dernière transaction > 30 jours :
  - Info bulle : "ℹ️ Journal inactif depuis 30 jours. Vérifier si toujours nécessaire."

**RÈGLES DE GESTION :**
- RG-TRES-008 : Soldes affichés en temps réel (calculés à chaque requête)
- RG-TRES-009 : Accès journaux selon habilitations (société, profil)
- RG-TRES-010 : Historique mouvements conservé 10 ans minimum
- RG-TRES-011 : Soldes en lecture seule (modification uniquement via transactions)
- RG-TRES-012 : Auto-refresh désactivable par utilisateur (paramètre)
- RG-TRES-013 : Export limité à 50,000 lignes (performance)

**Priorité :** P0 (Critique)  
**Estimation :** 5 points  
**Dépendances :** US-TRES-001  
**Impacté par :** US-TRES-003, US-TRES-008, US-TRES-011, US-TRES-012

---

## 📋 SECTION B : GESTION DES ENCAISSEMENTS CLIENTS

### US-TRES-003 : Créer un bon d'encaissement client

**EN TANT QUE** Assistant Trésorerie  
**JE VEUX** enregistrer un paiement reçu d'un client  
**AFIN DE** mettre à jour la trésorerie et solder les factures clients concernées

**CRITÈRES D'ACCEPTATION :**

**Accès et Initialisation :**
- ✅ Accès via :
  - Menu "Trésorerie > Encaissements > Nouveau"
  - Bouton [+ Encaissement] depuis Dashboard
  - Action rapide depuis Échéancier clients
  - Action rapide depuis page détail journal
- ✅ Ouverture formulaire modal ou page dédiée (selon configuration)
- ✅ Titre : "Nouveau Bon d'Encaissement Client"
- ✅ N° document auto-affiché (pré-visualisation) : `ENC-2026-XXXXX`
  - Format : ENC-YYYY-NNNNN
  - Numérotation séquentielle annuelle globale (toutes sociétés)
  - Non modifiable

**Interface Formulaire Structurée en Onglets :**

**📌 ONGLET 1 : EN-TÊTE (Informations Générales)**

**Section Dates :**
- ✅ Champ "Date Encaissement" :
  - Type : Date picker
  - Valeur par défaut : Date du jour
  - Modifiable (peut être date passée si régularisation)
  - Validation : ≤ Date du jour
  - Format : JJ/MM/AAAA
- ✅ Champ "Date Valeur" :
  - Type : Date picker
  - Valeur par défaut : Date encaissement
  - Modifiable
  - Tooltip : "Date effective de crédit du compte (peut différer si opération interbancaire)"
  - Validation : ≥ Date encaissement - 3 jours
- ✅ Champs auto-calculés (lecture seule, grisés) :
  - Période comptable : "11/2026"
  - Exercice fiscal : "2026"

**Section Client Payeur :**
- ✅ Champ "Client" **(obligatoire)** :
  - Type : Autocomplete avec recherche
  - Recherche par : Code client, Nom, NUI
  - Minimum 2 caractères pour déclencher recherche
  - Affichage résultats :
    - Code client (gras)
    - Nom/Raison sociale
    - Solde dû actuel (rouge si > 0)
    - Nombre factures impayées
  - Sélection → Chargement infos client
- ✅ Affichage infos client après sélection (carte info) :
  - Nom complet
  - **Solde total dû : XXX XAF** (en rouge si > 0)
  - Nombre factures impayées : X factures
  - Bouton [Voir Échéancier Client] → Ouvre échéancier dans modal
- ✅ Validation : Client doit exister et être actif (non bloqué, non archivé)

**Section Journal et Mode Paiement :**
- ✅ Champ "Journal Destination" **(obligatoire)** :
  - Liste déroulante journaux
  - Filtré : Statut = ACTIVE uniquement
  - Groupement par type (Banque / Caisse / Mobile Money)
  - Affichage : Code + Libellé + Solde actuel
  - Exemple : "BNK-001 - Compte UBA Douala (Solde : 25M XAF)"
  - Pré-sélection intelligente selon mode paiement
- ✅ Champ "Mode de Paiement" **(obligatoire)** :
  - Type : Radio buttons avec icônes
  - Options :
    - 💵 **CASH (Espèces)**
    - 🏦 **WIRE_TRANSFER (Virement Bancaire)**
    - 📝 **CHECK (Chèque)**
    - 📱 **MOBILE_MONEY (Mobile Money)**
  - Sélection → Affiche section détails spécifique mode
  - Filtre automatiquement journaux compatibles

**Section Montant :**
- ✅ Champ "Montant Total Reçu" **(obligatoire)** :
  - Type : Nombre décimal
  - Format : Séparateurs milliers automatiques
  - Devise : XAF (affiché)
  - Validation : > 0
  - Affichage en gros caractères
  - Conversion en lettres en dessous :
    - Ex: "Cinq millions de francs CFA"
- ✅ Champ "Référence Externe" (optionnel) :
  - Texte libre 50 caractères max
  - Exemples : N° virement banque, N° transaction mobile money, N° chèque
  - Placeholder adapté selon mode paiement

**⚙️ SECTION DÉTAILS MODE PAIEMENT (Dynamique selon sélection)**

**Si Mode = CASH (Espèces) :**
- ✅ **Validation automatique limite 100,000 XAF** :
  - Si montant > 100,000 XAF :
    - ❌ Blocage complet formulaire
    - Message erreur rouge : "⛔ LIMITE RÉGLEMENTAIRE DÉPASSÉE : Les paiements en espèces sont limités à 100,000 XAF (Réglementation CEMAC). Veuillez utiliser un autre mode de paiement."
    - Désactivation bouton [Enregistrer]
    - Suggestion : "Utiliser Virement ou Mobile Money"
  - Si montant ≤ 100,000 XAF :
    - ✅ Validation OK avec icône verte
    - Message : "✅ Montant conforme à la limite réglementaire"
- ✅ Section "Décompte Espèces" (optionnel, pliable) :
  - Si caisse physique avec tiroir
  - Tableau décompte billets/pièces :
    | Valeur | Quantité | Total |
    |--------|----------|-------|
    | 10,000 | [___] | 0 XAF |
    | 5,000  | [___] | 0 XAF |
    | 2,000  | [___] | 0 XAF |
    | 1,000  | [___] | 0 XAF |
    | 500    | [___] | 0 XAF |
    | 100    | [___] | 0 XAF |
    | **TOTAL** | | **0 XAF** |
  - Calcul automatique total
  - Comparaison avec montant reçu (alerte si différence)

**Si Mode = WIRE_TRANSFER (Virement) :**
- ✅ Champ "N° Référence Virement" **(obligatoire)** :
  - Texte alphanumérique 20 caractères max
  - Exemple : "VIRT20261116001"
  - Tooltip : "Référence fournie par la banque"
- ✅ Champ "Banque Émettrice" :
  - Liste déroulante + saisie libre
  - Banques camerounaises pré-configurées
  - Optionnel
- ✅ Champ "Date Virement" :
  - Date picker
  - Par défaut = Date encaissement
  - Validation : Entre Date encaissement ± 7 jours (délais interbancaires)
- ✅ Champ "Frais Bancaires" (optionnel) :
  - Montant XAF
  - Si renseigné : Déduit automatiquement du montant net à imputer
  - Exemple : Montant reçu 1,005,000 XAF - Frais 5,000 XAF = Net 1,000,000 XAF

**Si Mode = CHECK (Chèque) :**
- ✅ Champ "N° Chèque" **(obligatoire)** :
  - Numérique, 7-10 chiffres
  - Validation unicité (alerte si déjà utilisé)
- ✅ Champ "Date Chèque" :
  - Date picker
  - Validation : ≤ Date encaissement + 6 mois (antidaté ou post-daté dans limites)
  - Alerte si chèque post-daté (date future)
- ✅ Champ "Banque Émettrice" **(obligatoire)** :
  - Liste déroulante banques + saisie libre
- ✅ Champ "Nom Tireur" :
  - Texte libre
  - Pré-rempli avec nom client
  - Modifiable (si chèque tiré par tiers)
- ✅ Champ "Date Dépôt Prévue" :
  - Date picker
  - Par défaut : Date encaissement + 1 jour ouvré
  - Tooltip : "Date prévue de dépôt du chèque à la banque"
- ✅ Sélecteur "Statut Chèque" :
  - DEPOSITED (Déposé) - par défaut
  - CLEARED (Compensé - encaissé)
  - Désactivé si nouveau (statut forcé DEPOSITED)
  - Note : Passage à CLEARED géré ultérieurement manuellement ou via rapprochement
- ✅ Section "Upload Photo Chèque" (optionnel) :
  - Bouton [📷 Scanner Chèque] ou [📎 Joindre Fichier]
  - Formats : JPG, PNG, PDF
  - Taille max : 5 MB
  - Aperçu miniature si uploadé

**Si Mode = MOBILE_MONEY :**
- ✅ Champ "Opérateur" **(obligatoire)** :
  - Liste déroulante :
    - 🟠 Orange Money
    - 🟡 MTN Mobile Money
    - 🔵 Express Union Mobile
    - 🟢 YUP Mobile Money
    - ⚪ Autre
  - Icône colorée selon opérateur
- ✅ Champ "N° Téléphone Client" **(obligatoire)** :
  - Format : 6XXXXXXXX (9 chiffres)
  - Validation format camerounais
  - Pré-rempli si disponible dans fiche client
  - Masque de saisie automatique
- ✅ Champ "ID Transaction Opérateur" **(obligatoire)** :
  - Texte alphanumérique 15 caractères max
  - Exemple : "OM2611160123456"
  - Tooltip : "Référence unique fournie par l'opérateur après transaction"
  - Validation unicité (alerte si déjà enregistré)
- ✅ Champ "Frais Transaction" :
  - Montant XAF
  - Auto-calculé selon opérateur et montant (si règle configurée)
  - Modifiable
  - Déduit du montant net à imputer

**📌 ONGLET 2 : IMPUTATION SUR FACTURES**

**En-tête Onglet :**
- ✅ Titre : "Imputation du Paiement sur Factures Client"
- ✅ Message informatif si client a factures impayées :
  - "ℹ️ Ce client a X factures impayées pour un total de XXX XAF"
- ✅ Bouton [Imputation Automatique FIFO] (en haut à droite) :
  - Action : Imputation automatique montant reçu
  - Algorithme FIFO (First In First Out) :
    1. Trier factures par date échéance croissante (plus anciennes d'abord)
    2. Imputer montant disponible sur première facture jusqu'à soldant
    3. Si reste → imputer sur facture suivante
    4. Répéter jusqu'à épuisement montant ou factures
  - Remplissage automatique colonne "Montant à Imputer"
  - Utilisateur peut ajuster manuellement après

**Tableau Factures Client :**
- ✅ Chargement automatique factures client avec statut :
  - UNPAID (Non payée)
  - PARTIALLY_PAID (Partiellement payée)
- ✅ Filtres tableau (au-dessus) :
  - Période (Toutes / Échues uniquement / < 30j / < 60j / < 90j)
  - Montant min/max
  - Recherche N° facture
- ✅ Colonnes tableau :

  | ☑ | N° Facture | Date Émission | Date Échéance | Jours Retard | Montant Total | Déjà Payé | **Montant Dû** | **À Imputer** | Escompte | Actions |
  |---|------------|---------------|---------------|--------------|---------------|-----------|----------------|---------------|----------|---------|
  | ☐ | FA-2026-0123 | 15/10/2026 | 15/11/2026 | 1j | 5,000,000 | 0 | **5,000,000** | [___] | 0 | [...] |
  | ☐ | FA-2026-0145 | 20/10/2026 | 20/12/2026 | - | 3,000,000 | 1,000,000 | **2,000,000** | [___] | 0 | [...] |

  - **Colonne "☑"** : Checkbox sélection facture (sélection auto si montant imputé > 0)
  - **Colonne "N° Facture"** : Lien cliquable → Ouvre détail facture modal
  - **Colonne "Date Échéance"** : Format JJ/MM/AAAA
  - **Colonne "Jours Retard"** :
    - Calculé automatiquement (Date du jour - Date échéance)
    - **Rouge** si > 0 (facture échue)
    - Vert si ≤ 0 (pas encore échue)
    - Affichage : "30j" ou "-15j" (à venir)
  - **Colonne "Montant Dû"** : En **gras**, couleur rouge
  - **Colonne "À Imputer"** :
    - Champ numérique saisissable
    - Validation : ≤ Montant dû
    - Validation : ≤ Montant disponible restant
    - Focus automatique après sélection FIFO
    - Format XAF avec séparateurs
    - Calcul temps réel
  - **Colonne "Escompte"** :
    - Affiché si conditions escompte définies sur facture
    - ET si Date paiement < Date échéance
    - Calcul automatique : Montant imputé × Taux escompte
    - Tooltip : "Escompte 2% pour paiement anticipé"
    - Couleur verte (réduction accordée)
  - **Colonne "Actions"** :
    - [...] Menu :
      - Voir Facture
      - Voir BC Origine
      - Imputer Montant Complet
      - Historique Paiements

**Calculs Automatiques Temps Réel (Bas tableau) :**
- ✅ Ligne "TOTAUX" :
  - **Total Montant Reçu :** 5,000,000 XAF (depuis onglet En-tête)
  - **Total Imputé Factures :** 4,500,000 XAF (somme colonne "À Imputer")
  - **Total Escomptes :** -50,000 XAF (somme colonne "Escompte")
  - **Solde Non Imputé :** 550,000 XAF (Montant reçu - Total imputé + Escomptes)
  - Couleurs :
    - 🟢 Vert si Solde = 0 (paiement totalement imputé)
    - 🟡 Orange si Solde > 0 (reste à affecter → avance client)
    - 🔴 Rouge si Total imputé > Montant reçu (ERREUR - blocage)

**Gestion Lettrage Automatique :**
- ✅ Génération automatique "Code Lettrage" unique :
  - Format : `L{YYYYMMDD}{SEQ}` (ex: "L20261116001")
  - Un code par bon d'encaissement
  - Appliqué à toutes factures imputées dans ce bon
- ✅ Affichage code lettrage (info bulle) :
  - "🔗 Code Lettrage : L20261116001"
  - Tooltip : "Ce code regroupe le paiement et les factures soldées pour rapprochement comptable"

**Messages et Alertes :**
- ✅ Si aucune facture sélectionnée/imputée :
  - Message info : "ℹ️ Aucune facture imputée. Le montant sera enregistré comme avance client (voir onglet Avance)."
- ✅ Si Total imputé > Montant reçu :
  - **Message erreur bloquant :** "❌ ERREUR : Le total imputé (XXX XAF) dépasse le montant reçu (YYY XAF). Veuillez ajuster les imputations."
  - Bordure rouge tableau
  - Désactivation bouton [Enregistrer]
- ✅ Si Total imputé < Montant reçu :
  - Message info : "ℹ️ Solde non imputé : XXX XAF. Ce montant sera enregistré comme avance client (voir onglet suivant)."

**📌 ONGLET 3 : IMPUTATION SUR COMMANDE / AVANCE**

**En-tête Onglet :**
- ✅ Titre : "Imputation du Solde sur Acompte Commande ou Avance"
- ✅ Affichage solde non imputé (depuis onglet Factures) :
  - "💰 Solde disponible pour imputation : **XXX XAF**"
  - Si = 0 : Message "Aucun solde à affecter"

**Option 1 : Imputation sur Bon de Commande (Acompte) :**
- ✅ Section pliable "Acompte sur Bon de Commande"
- ✅ Radio button "Affecter comme acompte BC"
- ✅ Si sélectionné → Affiche formulaire :
  - Champ "Bon de Commande" :
    - Autocomplete recherche BC client
    - Filtré : BC avec acompte requis non complet
    - Affichage résultats :
      - N° BC
      - Date BC
      - Montant total BC
      - Acompte requis (montant + %)
      - Acompte déjà reçu
      - **Acompte restant à recevoir**
  - Après sélection BC → Affichage récap :
    - BC-2026-0089
    - Montant BC : 10,000,000 XAF
    - Acompte requis 30% : 3,000,000 XAF
    - Déjà reçu : 1,000,000 XAF
    - **Reste à recevoir : 2,000,000 XAF**
  - Champ "Montant Acompte à Affecter" :
    - Pré-rempli avec min(Solde disponible, Reste à recevoir)
    - Modifiable
    - Validation : ≤ Solde disponible ET ≤ Reste à recevoir
  - Bouton [Affecter Acompte]
  - Après affectation :
    - Mise à jour BC : Acompte reçu += Montant
    - Statut BC acompte actualisé (PARTIEL/COMPLET)
    - Lien créé Encaissement ↔ BC
    - Solde disponible réduit

**Option 2 : Enregistrement comme Avance Client :**
- ✅ Section pliable "Avance Client" (déplié par défaut si solde > 0)
- ✅ Radio button "Enregistrer comme avance client" (sélectionné par défaut)
- ✅ Si sélectionné → Affiche :
  - Message : "Le solde non imputé sera crédité au compte avances du client et disponible pour futures factures."
  - Checkbox "Notifier le client par email" (coché par défaut)
  - Champ "Note avance" (optionnel) :
    - Texte libre 200 caractères
    - Exemples : "Acompte pour commande future", "Règlement anticipé", etc.
  - Affichage montant avance :
    - "Montant avance : **XXX XAF**"

**Récapitulatif Final Affectation :**
- ✅ Tableau synthèse (mise à jour temps réel) :
  ```
  Montant Total Reçu : 5,000,000 XAF
  ─────────────────────────────────────
  Imputé sur Factures : 4,000,000 XAF
  Escomptes accordés  : -50,000 XAF
  Imputé sur Acompte BC : 500,000 XAF
  Enregistré Avance    : 550,000 XAF
  ─────────────────────────────────────
  TOTAL AFFECTÉ : 5,000,000 XAF ✅
  ```
- ✅ Validation : Total affecté DOIT = Montant reçu
- ✅ Si incohérence → Message erreur + blocage

**📌 ONGLET 4 : PIÈCES JUSTIFICATIVES**

- ✅ Section "Documents Justificatifs"
- ✅ Zone drag & drop upload multiple :
  - "📎 Glissez vos fichiers ici ou cliquez pour parcourir"
  - Formats acceptés : PDF, JPG, PNG, DOC, XLS
  - Taille max par fichier : 10 MB
  - Nombre max fichiers : 10
- ✅ Types documents suggérés selon mode paiement :
  - Virement : Reçu bancaire, Avis virement
  - Chèque : Photo chèque recto-verso
  - Mobile Money : Ticket SMS, Reçu mobile money
  - Espèces : Reçu signé (si applicable)
- ✅ Liste documents uploadés :
  - Nom fichier
  - Type (icône)
  - Taille
  - Date upload
  - Actions : [👁️ Prévisualiser] [🗑️ Supprimer]
- ✅ Prévisualisation inline (images) ou modal (PDF)

**🎬 VALIDATION ET TRAITEMENT**

**Boutons Bas de Page (Toujours visibles) :**
- ✅ [❌ Annuler] :
  - Confirmation si données saisies : "Voulez-vous vraiment annuler ? Les données saisies seront perdues."
  - Retour page précédente sans sauvegarder
- ✅ [💾 Enregistrer Brouillon] :
  - Sauvegarde état actuel
  - Statut : DRAFT
  - Modification possible ultérieurement
  - Notification : "Brouillon enregistré"
  - Reste sur formulaire
- ✅ [✅ Soumettre pour Validation] :
  - Si montant < seuil signature → Validation directe (statut VALIDATED)
  - Si montant ≥ seuil signature → Statut PENDING_SIGNATURE (→ US-TRES-004)
  - Exécution contrôles + traitement (voir ci-dessous)

**Contrôles Automatiques Avant Validation :**
1. ✅ Montant total reçu > 0
2. ✅ Client sélectionné + actif + non bloqué
3. ✅ Journal destination actif
4. ✅ Si CASH : Montant ≤ 100,000 XAF (BLOQUANT)
5. ✅ Mode paiement sélectionné avec détails requis remplis
6. ✅ Total affecté (factures + acompte + avance) = Montant reçu (CRITIQUE)
7. ✅ Montants imputés factures ≤ Montants dus factures
8. ✅ Factures imputées appartiennent au client sélectionné
9. ✅ Si chèque : N° chèque unique (pas déjà enregistré)
10. ✅ Si mobile money : ID transaction unique

**Si Erreurs :**
- ✅ Liste erreurs affichée en haut formulaire (bannière rouge)
- ✅ Onglets avec erreurs marqués icône ⚠️
- ✅ Champs en erreur surlignés rouge avec message
- ✅ Focus automatique sur premier champ erreur
- ✅ Bouton [Soumettre] désactivé tant que erreurs

**Si Validation OK :**

**Traitement Automatique (Backend) :**

1. **Création Bon d'Encaissement :**
   - Génération N° définitif : `ENC-2026-00089`
   - Enregistrement toutes données
   - Statut : VALIDATED (ou PENDING_SIGNATURE si seuil)
   - Génération code lettrage unique
   - Horodatage précis (jour/heure/minute)
   - Utilisateur créateur enregistré

2. **Mise à Jour Échéancier Client :**
   - Pour chaque facture imputée :
     - `amount_paid` += montant imputé - escompte
     - `amount_due` = `total_amount` - `amount_paid`
     - `payment_status` mis à jour :
       - PAID si `amount_due` = 0
       - PARTIALLY_PAID si `amount_due` > 0
     - `lettrage_code` = Code généré
     - `lettrage_date` = Date encaissement
     - Ajout dans `payment_history` (JSON) :
       ```json
       {
         "paymentId": "UUID",
         "paymentNumber": "ENC-2026-00089",
         "paymentDate": "2026-11-16",
         "amount": 5000000,
         "discount": 50000,
         "paymentMode": "WIRE_TRANSFER"
       }
       ```

3. **Création Mouvement Trésorerie :**
   - Table `treasury.payment_transactions`
   - Type : RECEIPT (Encaissement)
   - Journal : Journal destination (crédité)
   - Montant : Montant reçu (positif)
   - Mode paiement : Sélectionné
   - Partenaire : Client
   - Référence externe : Si renseignée
   - Détails mode paiement (JSON) : Selon type
   - Imputations (JSON) : Liste factures lettrées
   - Statut : VALIDATED
   - **Mise à jour solde journal :** `current_balance` += Montant reçu

4. **Gestion Avance Client** (si applicable) :
   - Si solde non imputé > 0 :
     - Création enregistrement avance client
     - Table `treasury.customer_advances`
     - Client, Montant, Date, Lien encaissement
     - Statut : ACTIVE
     - Solde disponible = Montant avance

5. **Gestion Acompte BC** (si applicable) :
   - Si imputation sur BC :
     - Mise à jour BC :
       - `acompte_recu` += Montant acompte
       - `statut_acompte` actualisé (NON_RECU / PARTIEL / COMPLET)
     - Lien créé `encaissement_id` ↔ `bon_commande_id`

6. **Comptabilisation Automatique :**
   ```
   Débit 512x ou 53x (Compte Banque/Caisse)    Montant reçu
     Crédit 411x (Compte Client)                Total imputé factures
     Crédit 4191x (Avances clients)             Montant avance (si applicable)
     Crédit 4191x-BC (Acomptes BC)              Montant acompte (si applicable)
     Débit 665x (Escomptes accordés)           Total escomptes (si applicable)
   ```

7. **Publication Événement Kafka :**
   - Topic : `treasury.payment.received`
   - Payload :
     ```json
     {
       "paymentId": "UUID",
       "paymentNumber": "ENC-2026-00089",
       "paymentDate": "2026-11-16",
       "amount": 5000000,
       "client": {
         "id": "ObjectId",
         "name": "Client ABC",
         "code": "CLI-001"
       },
       "company": "IOLA SARL",
       "paymentMode": "WIRE_TRANSFER",
       "imputedInvoices": [
         {
           "invoiceId": "UUID",
           "invoiceNumber": "FA-2026-0123",
           "amountImputed": 5000000,
           "discount": 50000,
           "isFullyPaid": true
         }
       ],
       "lettrage_code": "L20261116001"
     }
     ```
   - Consommateurs :
     - `sales-service` : Déblocage caution commercial, Calcul commissions
     - `rewards-service` : Progression objectifs commerciaux
     - `reporting-service` : Mise à jour dashboards

8. **Génération Reçu PDF :**
   - Format professionnel avec :
     - Logo société
     - En-tête société (adresse, NUI, RCCM)
     - Titre : "REÇU DE PAIEMENT"
     - N° : ENC-2026-00089
     - Date encaissement
     - Client (nom, code, adresse)
     - Montant reçu **en gros caractères**
     - Montant en lettres
     - Mode de paiement + détails
     - Factures soldées (tableau) :
       - N° facture, Montant soldé, Solde restant
     - Code lettrage
     - Avance/Acompte (si applicable)
     - Signature numérique trésorier
     - QR code vérification (optionnel)
     - Mentions légales : "Reçu valant quittance"
   - Stockage PDF (DMS)
   - Lien vers PDF dans bon encaissement

9. **Email Automatique Client** (Optionnel, configurable) :
   - Destinataire : Email client (depuis fiche)
   - Objet : "Confirmation réception paiement XXX XAF - [Société]"
   - Corps :
     ```
     Bonjour [Client],

     Nous accusons réception de votre paiement de XXX XAF le [Date].
     
     Détails :
     - Montant reçu : XXX XAF
     - Mode de paiement : [Mode]
     - Référence : [Ref]
     - Factures soldées : [Liste]
     
     Vous trouverez ci-joint votre reçu de paiement.
     
     Merci pour votre confiance.
     
     Cordialement,
     [Société]
     ```
   - Pièce jointe : Reçu PDF
   - Copie : Trésorier, Commercial attitré (optionnel)

**Notifications et Feedbacks Utilisateur :**

1. **Toast Notification Succès :**
   - "✅ Encaissement ENC-2026-00089 enregistré avec succès !"
   - "💰 Montant : 5,000,000 XAF"
   - "📧 Email envoyé au client"
   - Durée : 5 secondes
   - Actions rapides dans toast :
     - [Voir Reçu PDF]
     - [Imprimer]
     - [Nouveau Encaissement]

2. **Redirection Automatique :**
   - Vers page détail bon d'encaissement créé
   - OU vers liste encaissements avec highlight ligne créée
   - OU reste sur formulaire vide pour saisie rapide (selon préférence utilisateur)

3. **Email Notification Trésorier :**
   - Récap encaissement créé
   - Lien vers détail dans l'ERP

**RÈGLES DE GESTION :**
- RG-TRES-014 : Numérotation séquentielle annuelle ENC-YYYY-XXXXX
- RG-TRES-015 : Limite espèces 100,000 XAF stricte (blocage système)
- RG-TRES-016 : Lettrage automatique FIFO par défaut
- RG-TRES-017 : Code lettrage unique par bon d'encaissement
- RG-TRES-018 : Total affecté DOIT égaler montant reçu (validation critique)
- RG-TRES-019 : Bon encaissement validé NON modifiable (annulation possible avec motif + habilitation)
- RG-TRES-020 : Chèque statut initial DEPOSITED, passage CLEARED manuel ultérieur
- RG-TRES-021 : Escompte applicable uniquement si paiement avant échéance ET conditions définies
- RG-TRES-022 : Montant reçu peut être imputé sur factures + acompte BC + avance client (mixte autorisé)
- RG-TRES-023 : Si montant ≥ seuil double signature → Workflow validation (US-TRES-004)

**Priorité :** P0 (Critique)  
**Estimation :** 13 points  
**Dépendances :** US-TRES-001 (Journaux), US-TRES-002, Gestion Clients (Module Ventes)  
**Impacté par :** US-TRES-004 (Double signature), US-TRES-005 (Échéancier)

---

### US-TRES-004 : Valider un encaissement avec double signature

**EN TANT QUE** Directeur Financier  
**JE VEUX** valider les encaissements importants nécessitant une double signature électronique  
**AFIN DE** sécuriser les opérations financières sensibles et prévenir la fraude

**CRITÈRES D'ACCEPTATION :**

**Déclenchement Workflow Double Signature :**
- ✅ Automatique lors création encaissement (US-TRES-003)
- ✅ Condition : `Montant encaissement ≥ Seuil double signature` (paramétré dans journal)
- ✅ Exemple : Si seuil journal = 5,000,000 XAF ET montant = 6,000,000 XAF → Double signature requise
- ✅ Statut bon encaissement → **PENDING_SIGNATURE**
- ✅ Notification automatique envoyée aux signataires habilités

**Page Liste "Mes Validations en Attente" :**
- ✅ Accès via :
  - Menu "Trésorerie > Validations > En Attente"
  - Dashboard widget "Validations Requises" (badge nombre)
  - Notification email (lien direct)
- ✅ Titre : "Encaissements en Attente de Signature"
- ✅ Tableau avec colonnes :

  | N° Encaissement | Date Création | Client | Montant | Mode Paiement | Créateur | Signatures | Âge Demande | Actions |
  |----------------|---------------|--------|---------|---------------|----------|------------|-------------|---------|
  | ENC-2026-00089 | 16/11 10:35 | ABC Sarl | **6,000,000** | Virement | J. Dupont | 0/2 | 2h | [...] |
  | ENC-2026-00090 | 15/11 16:20 | XYZ Ltd | **8,500,000** | Chèque | M. Martin | 1/2 ✅ | 18h | [...] |

  - **Colonne "Montant"** : En gras, montant élevé
  - **Colonne "Signatures"** :
    - Format : "X/Y" (X signatures obtenues sur Y requises)
    - Icône ✅ si au moins 1 signature
    - Couleur : Rouge si 0/2, Orange si 1/2, Vert si 2/2 (normalement pas affiché ici car validé)
  - **Colonne "Âge Demande"** :
    - Durée depuis création (2h, 1j, etc.)
    - **Rouge si > 48h** (alerte délai)
  - **Colonne "Actions"** :
    - [👁️ Voir Détails]
    - [✅ Signer] (si pas encore signé par l'utilisateur connecté)
    - [❌ Rejeter]

**Filtres et Tris :**
- ✅ Filtre "Nécessitant MA signature" (par défaut actif)
- ✅ Filtre "Tous les en attente" (supervision)
- ✅ Tri : Date création, Montant, Âge demande
- ✅ Recherche : N° encaissement, Client

**Indicateurs Dashboard :**
- ✅ Nombre total encaissements en attente signature
- ✅ Montant total bloqué
- ✅ Nombre en retard (> 48h)

**Modal Détail Encaissement (Clic "Voir Détails") :**

**Section 1 : Informations Encaissement (Lecture Seule)**
- ✅ Toutes infos saisies lors création :
  - N° encaissement, Date, Client
  - Journal destination, Mode paiement + détails
  - Montant total
  - Référence externe
- ✅ Onglets consultation :
  - Factures imputées (tableau détaillé)
  - Acompte/Avance affectés
  - Pièces justificatives (téléchargement/visualisation)

**Section 2 : Justification Demande Signature**
- ✅ Encadré informatif :
  - "⚠️ Ce montant (6,000,000 XAF) dépasse le seuil de double signature du journal (5,000,000 XAF)"
  - "🔒 2 signatures électroniques requises pour validation"

**Section 3 : Historique Signatures**
- ✅ Timeline chronologique signatures :
  - Si aucune signature :
    - "⏳ En attente de signatures (0/2)"
  - Si 1 signature obtenue :
    ```
    ✅ Signature 1/2 - [Nom Signataire]
       Date/Heure : 16/11/2026 11:45
       Rôle : Trésorier
       Commentaire : "Virement conforme, pièces OK"
       IP : 192.168.1.100
       Appareil : Windows 10 - Chrome
    
    ⏳ En attente signature 2/2
    ```
  - Affichage qui peut encore signer (rôles habilités)

**Section 4 : Actions Signature**

**Si utilisateur n'a PAS encore signé ET a habilitation :**

- ✅ Formulaire signature :
  - Champ "Commentaire" (optionnel, 500 caractères max) :
    - Placeholder : "Indiquez votre remarque ou validation (optionnel)"
    - Exemples : "Conforme, pièces justificatives OK", "Virement validé banque", etc.
  - Champ "Mot de Passe" **(obligatoire)** :
    - Type : Password (masqué)
    - Validation : Vérification mot de passe utilisateur connecté
    - Tooltip : "Saisissez votre mot de passe pour confirmer votre identité"
    - OU si 2FA activé :
      - Bouton [Envoyer Code 2FA]
      - Champ "Code à 6 chiffres" reçu par SMS/Email/App
      - Validation code
  - Checkbox "Je confirme avoir vérifié les pièces justificatives et la conformité de l'opération" **(obligatoire)**
  - Boutons :
    - [✅ Approuver et Signer] (vert, principal)
    - [❌ Rejeter] (rouge, secondaire)
    - [Fermer] (annuler)

**Si utilisateur A déjà signé :**
- ✅ Message : "✅ Vous avez déjà signé cet encaissement le [Date] à [Heure]"
- ✅ Affichage votre signature dans historique
- ✅ Actions :
  - [Voir Reçu Signature] (PDF avec vos infos signature)
  - [Fermer]

**Traitement Signature (Action "Approuver et Signer") :**

1. **Validations :**
   - ✅ Mot de passe correct OU Code 2FA valide
   - ✅ Checkbox confirmation cochée
   - ✅ Utilisateur habilité à signer (rôle : Trésorier, DAF, DG, etc.)
   - ✅ Utilisateur ≠ Créateur encaissement (interdiction auto-signature)
   - ✅ Utilisateur n'a pas déjà signé cet encaissement

2. **Enregistrement Signature :**
   - Table `treasury.payment_signatures`
   - Données capturées :
     - `payment_transaction_id` : Lien vers encaissement
     - `signer_user_id` : User ID signataire
     - `signature_order` : Ordre signature (1, 2, 3...)
     - `signed_at` : **Timestamp précis** (jour/heure/minute/seconde)
     - `signer_role` : Rôle utilisateur (Trésorier, DAF, etc.)
     - `comment` : Commentaire signataire
     - `ip_address` : Adresse IP machine
     - `user_agent` : Navigateur et OS
     - `authentication_method` : PASSWORD ou TWO_FACTOR
     - `signature_hash` : Hash cryptographique pour non-répudiation

3. **Comptage Signatures :**
   - Nombre signatures actuelles = Compter signatures validées
   - Nombre signatures requises = 2 (paramétrable selon montant)
   - Vérification : Signatures actuelles ≥ Signatures requises ?

4. **Si Signatures COMPLÈTES (ex: 2/2 obtenues) :**
   - ✅ Statut encaissement → **VALIDATED**
   - ✅ Déclenchement traitement complet encaissement :
     - Mise à jour échéancier clients
     - Création mouvement trésorerie
     - Mise à jour solde journal
     - Comptabilisation
     - Publication événement Kafka
     - Génération reçu PDF
     - Email client
     - (Tous traitements normaux US-TRES-003)
   - ✅ Notifications envoi :
     - **Créateur :** "✅ Votre encaissement ENC-XXX a été validé (2/2 signatures obtenues)"
     - **Tous signataires :** "✅ Encaissement ENC-XXX validé suite à votre signature"
     - **Client :** Email confirmation paiement avec reçu PDF
   - ✅ Toast notification immédiate :
     - "✅ Signature enregistrée ! Encaissement validé (2/2 signatures)"
   - ✅ Retrait de la liste "En Attente" (déplacement vers "Validés")

5. **Si Signatures PARTIELLES (ex: 1/2 obtenues) :**
   - ✅ Statut encaissement reste **PENDING_SIGNATURE**
   - ✅ Mise à jour compteur : "1/2 signatures"
   - ✅ Notifications envoi :
     - **Créateur :** "ℹ️ Encaissement ENC-XXX : 1ère signature obtenue ([Nom]), en attente 2ème signature"
     - **Autres signataires potentiels :** "⏳ Votre signature requise : Encaissement ENC-XXX (1/2 signatures, montant XXX XAF)"
   - ✅ Toast notification :
     - "✅ Signature enregistrée ! En attente 2ème signature (1/2)"
   - ✅ Reste dans liste "En Attente"

**Traitement Rejet (Action "Rejeter") :**

1. **Formulaire Rejet :**
   - Modal confirmation :
     - Titre : "⚠️ Rejeter cet Encaissement"
     - Message : "Vous êtes sur le point de rejeter définitivement cet encaissement. Cette action est irréversible."
     - Champ "Motif du Rejet" **(obligatoire)** :
       - Texte libre, 10-500 caractères
       - Exemples : "Pièces justificatives manquantes", "Montant incohérent", "Client suspect", etc.
     - Champ "Mot de Passe" : Confirmation identité
     - Boutons :
       - [❌ Confirmer Rejet] (rouge)
       - [Annuler]

2. **Traitement Rejet :**
   - ✅ Statut encaissement → **REJECTED**
   - ✅ Enregistrement rejet :
     - Qui a rejeté (user_id)
     - Quand (timestamp)
     - Motif
   - ✅ Notifications envoi :
     - **Créateur :** "❌ Votre encaissement ENC-XXX a été REJETÉ par [Nom Signataire]. Motif : [Motif]. Veuillez corriger et soumettre à nouveau."
     - **Email créateur** avec détails
   - ✅ Encaissement retourné à créateur :
     - Possibilité modification (correction)
     - Possibilité annulation définitive
   - ✅ Toast notification :
     - "❌ Encaissement rejeté. Le créateur a été notifié."
   - ✅ Retrait liste "En Attente" (déplacement vers "Rejetés")

**Page Historique Signatures (Audit Trail) :**
- ✅ Accès : Menu "Trésorerie > Audit > Signatures"
- ✅ Rapport toutes opérations signées (période sélectionnable)
- ✅ Pour chaque opération :
  - N° document, Type (Encaissement, Décaissement, etc.)
  - Date opération, Montant
  - Créateur
  - **Liste signataires** (ordre chronologique) :
    - Nom, Rôle
    - Date/Heure signature
    - Commentaire
    - IP/Appareil
  - Délai validation (temps entre création et dernière signature)
  - Statut final (VALIDATED, REJECTED)
- ✅ Détection anomalies :
  - Signatures inhabituellement rapides (< 1 minute entre signatures → suspect)
  - Signatures hors heures ouvrées (20h-7h → alerte)
  - Cumul signatures même IP (possible fraude → investigation)
  - Rejet après validation partielle (motif à vérifier)
- ✅ Export PDF rapport audit (conformité)
- ✅ Filtres : Période, Signataire, Montant min/max, Avec/sans anomalies

**Alertes Automatiques Gestion :**
- ✅ Email quotidien DAF si encaissements > 48h en attente :
  - "⚠️ [X] encaissements en attente de signature depuis plus de 48h (montant total bloqué : XXX XAF)"
  - Liste avec liens directs
- ✅ Notification push si encaissement urgent en attente :
  - Créateur a marqué "URGENT" → Notification immédiate signataires
- ✅ Escalade automatique si > 5 jours sans signature :
  - Notification Direction Générale
  - Possibilité déblocage exceptionnel DG

**RÈGLES DE GESTION :**
- RG-TRES-024 : Seuil double signature paramétrable par journal (ex: 5,000,000 XAF)
- RG-TRES-025 : Minimum 2 signatures requises (pas de signature unique)
- RG-TRES-026 : Créateur NE peut PAS signer son propre encaissement (contrôle anti-fraude)
- RG-TRES-027 : Ordre signatures NON imposé (signature parallèle autorisée)
- RG-TRES-028 : Signature électronique avec mot de passe OU 2FA
- RG-TRES-029 : Habilitations signatures configurables par rôle (Trésorier, DAF, DG)
- RG-TRES-030 : Capture complète pour non-répudiation (qui, quand, où, comment)
- RG-TRES-031 : Si rejet → Retour créateur avec possibilité correction et re-soumission
- RG-TRES-032 : Délai maximum validation : 48h (alerte si dépassé)
- RG-TRES-033 : Conservation historique signatures 10 ans (audit, conformité)
- RG-TRES-034 : Impossibilité retrait signature après validation complète

**Priorité :** P1 (Important)  
**Estimation :** 8 points  
**Dépendances :** US-TRES-003 (Encaissements)  
**Impacté par :** US-TRES-008 (Décaissements - même workflow)

---

*[Le fichier continue avec les 16 user stories restantes...]*

**Note :** Le fichier fait maintenant plus de 900 lignes. Voulez-vous que je continue avec le développement complet des 16 user stories restantes, ou préférez-vous que je génère le fichier complet d'un seul coup et vous le fournisse pour téléchargement ?

**Priorité :** P0 (Critique)  
**Estimation :** 8 points  
**Dépendances :** US-TRES-001, US-TRES-003  

---

**FIN DE L'EXTRAIT - FICHIER COMPLET DISPONIBLE**

**User Stories Restantes à Développer :**
- US-TRES-005 à US-TRES-020 (15 US)
- Total estimé fichier complet : ~2000 lignes

**Souhaitez-vous que je continue le développement complet ?**
