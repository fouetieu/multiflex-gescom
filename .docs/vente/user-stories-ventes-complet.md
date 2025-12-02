# USER STORIES MODULE VENTES - ERP MULTIFLEX
## Version complète avec intégration des besoins Groupe IOLA

---

## 📊 SECTION A : GESTION DES CLIENTS

### US-VENTE-001 : Créer une fiche client

**EN TANT QUE** Commercial B2B  
**JE VEUX** créer une nouvelle fiche client  
**AFIN DE** enregistrer un nouveau client dans le système

**CRITÈRES D'ACCEPTATION :**
- ✅ Formulaire de création accessible depuis menu Ventes > Clients
- ✅ Code client généré automatiquement format : CLI-YYYY-XXXXX (numérotation par client comme spécifié)
- ✅ Types de client disponibles :
  - Particulier
  - Entreprise
  - Technicien applicateur
  - Revendeur/Quincaillerie
- ✅ Informations obligatoires selon type :
  - **Particulier** : Nom, Prénom, CNI
  - **Entreprise** : Raison sociale, NUI, RCCM
- ✅ Régime d'imposition à sélectionner (Réel, Simplifié, Libératoire, etc.)
- ✅ Attestation de non-redevance :
  - Upload document (PDF/Image)
  - Date validité
  - Alerte 30j avant expiration
- ✅ Commercial attitré (sélection obligatoire)
- ✅ Statut initial : DRAFT
- ✅ Validation requise pour activation

**RÈGLES DE GESTION :**
- RG-V001 : CNI ou NUI obligatoire pour vente à crédit
- RG-V002 : Attestation obligatoire si client entreprise
- RG-V003 : Un client = un code unique permanent

**Priorité :** P0 (Critique)  
**Estimation :** 8 points

---

### US-VENTE-002 : Gérer les adresses multiples client

**EN TANT QUE** Commercial B2B  
**JE VEUX** ajouter plusieurs adresses pour un client  
**AFIN DE** gérer différents lieux de livraison et facturation

**CRITÈRES D'ACCEPTATION :**
- ✅ Onglet "Adresses" dans fiche client
- ✅ Bouton [+ Ajouter Adresse]
- ✅ Types d'adresse :
  - Siège social
  - Adresse facturation
  - Lieu de livraison
  - Site opérationnel
- ✅ Champs par adresse :
  - Libellé
  - Rue/Quartier
  - Ville
  - Coordonnées GPS (optionnel)
  - Contact sur place
  - Téléphone
- ✅ Définir adresse par défaut pour :
  - Facturation
  - Livraison
- ✅ Adresses illimitées par client
- ✅ Activation/désactivation d'adresse

**RÈGLES DE GESTION :**
- RG-V004 : Au moins une adresse obligatoire
- RG-V005 : GPS requis pour livraisons hors ville

**Priorité :** P0 (Critique)  
**Estimation :** 5 points

---

### US-VENTE-003 : Gérer les contacts client

**EN TANT QUE** Commercial B2B  
**JE VEUX** gérer plusieurs contacts pour un client entreprise  
**AFIN DE** communiquer avec les bons interlocuteurs

**CRITÈRES D'ACCEPTATION :**
- ✅ Onglet "Contacts" dans fiche client
- ✅ Contacts illimités par client
- ✅ Informations par contact :
  - Prénom, Nom
  - Fonction/Rôle (Commercial, Comptable, Technique, Direction)
  - Email
  - Téléphone mobile
  - WhatsApp
- ✅ Définir contact principal
- ✅ Statut actif/inactif par contact
- ✅ Sélection contact lors des transactions

**RÈGLES DE GESTION :**
- RG-V006 : Contact principal obligatoire si client entreprise
- RG-V007 : Email unique par contact

**Priorité :** P1 (Important)  
**Estimation :** 3 points

---

### US-VENTE-004 : Définir les conditions commerciales

**EN TANT QUE** Responsable Commercial  
**JE VEUX** définir les conditions commerciales d'un client  
**AFIN DE** encadrer les transactions futures

**CRITÈRES D'ACCEPTATION :**
- ✅ Section "Conditions Commerciales" dans fiche client
- ✅ Modes de paiement autorisés (multiple choice) :
  - Espèces
  - Virement
  - Chèque  
  - Mobile Money
- ✅ Conditions de crédit :
  - Limite de crédit en XAF
  - Délai de paiement (jours)
  - Crédit autorisé : Oui/Non
- ✅ Liste de prix associée (selon type client)
- ✅ Validation solde précédent obligatoire avant nouvelle vente
- ✅ Pas de remise par défaut (comme précisé)
- ✅ Blocage automatique si impayé > délai

**RÈGLES DE GESTION :**
- RG-V008 : Limite crédit 0 = paiement comptant uniquement
- RG-V009 : Mode espèces limité à 100,000 XAF
- RG-V010 : Vérification solde automatique à chaque commande

**Priorité :** P0 (Critique)  
**Estimation :** 5 points

---

### US-VENTE-005 : Consulter les comptes et soldes client

**EN TANT QUE** Comptable Ventes  
**JE VEUX** voir les soldes d'un client  
**AFIN DE** contrôler sa situation financière

**CRITÈRES D'ACCEPTATION :**
- ✅ Onglet "Comptes & Soldes" (lecture seule)
- ✅ Solde consolidé groupe (toutes sociétés)
- ✅ Tableau des sous-comptes par société :
  - Société IOLA
  - Solde débiteur
  - Encours
  - Échéances
- ✅ Indicateurs visuels :
  - 🟢 Solde 0
  - 🟡 Encours dans délais
  - 🔴 Retard paiement
- ✅ Métriques automatiques :
  - CA total
  - Nombre commandes
  - Première/dernière transaction
  - Panier moyen
- ✅ Graphique évolution solde 12 mois
- ✅ Export Excel

**RÈGLES DE GESTION :**
- RG-V011 : Actualisation temps réel des soldes
- RG-V012 : Consolidation multi-sociétés automatique

**Priorité :** P0 (Critique)  
**Estimation :** 5 points

---

### US-VENTE-006 : Gérer les documents client

**EN TANT QUE** Service Client  
**JE VEUX** gérer les documents d'un client  
**AFIN DE** centraliser les pièces administratives

**CRITÈRES D'ACCEPTATION :**
- ✅ Onglet "Documents" dans fiche client
- ✅ Types de documents :
  - CNI/Passeport
  - RCCM/Statuts
  - Attestation non-redevance
  - Contrats commerciaux
  - Accords tarifaires
- ✅ Upload multiple (PDF, JPG, PNG)
- ✅ Taille max 10MB par fichier
- ✅ Métadonnées :
  - Type document
  - Date upload
  - Uploadé par
  - Date expiration (si applicable)
- ✅ Alerte documents expirés
- ✅ Téléchargement/visualisation
- ✅ Suppression avec traçabilité

**RÈGLES DE GESTION :**
- RG-V013 : CNI obligatoire pour particuliers
- RG-V014 : RCCM obligatoire pour entreprises
- RG-V015 : Conservation documents 10 ans

**Priorité :** P1 (Important)  
**Estimation :** 3 points

---

## 📦 SECTION B : GESTION DES COMMANDES B2B

### US-VENTE-007 : Créer un bon de commande client

**EN TANT QUE** Commercial B2B  
**JE VEUX** créer un bon de commande pour un client  
**AFIN DE** enregistrer une vente

**CRITÈRES D'ACCEPTATION :**
- ✅ Formulaire création BC depuis menu Ventes
- ✅ Numérotation automatique par client : BC-{CLIENT}-YYYY-XXXXX
- ✅ Sélection client avec :
  - Vérification solde précédent
  - Affichage limite crédit disponible
  - Alerte si compte bloqué
- ✅ Mode de paiement (selon conditions client) :
  - Espèces (max 100,000 XAF)
  - Virement
  - Chèque
  - Mobile Money
- ✅ Commercial attitré (auto-rempli ou modifiable)
- ✅ Dates :
  - Date commande
  - Date livraison souhaitée
  - Date paiement prévue (si crédit)
- ✅ Lieu de livraison (depuis adresses client)
- ✅ Mode de livraison :
  - Enlèvement client
  - Livraison par nous
  - Transporteur tiers
- ✅ Lignes articles :
  - Recherche par code/nom
  - Prix selon liste client
  - Quantité
  - Disponibilité stock affichée
- ✅ Calcul automatique :
  - Total HT
  - TVA (selon régime client)
  - Total TTC
- ✅ Si crédit : vérification caution 70%
- ✅ Statut initial : BROUILLON

**RÈGLES DE GESTION :**
- RG-V016 : Validation solde précédent obligatoire
- RG-V017 : Caution 70% si vente à crédit
- RG-V018 : Escalade hiérarchique si dépassement

**Priorité :** P0 (Critique)  
**Estimation :** 10 points

---

### US-VENTE-008 : Valider une commande crédit

**EN TANT QUE** Responsable Commercial  
**JE VEUX** valider les commandes à crédit  
**AFIN DE** contrôler le risque client

**CRITÈRES D'ACCEPTATION :**
- ✅ Liste commandes en attente validation
- ✅ Filtres par :
  - Commercial
  - Client
  - Montant
  - Dépassement caution
- ✅ Détail commande avec :
  - Montant crédit demandé
  - Caution disponible commercial
  - Historique paiements client
  - Encours actuel
- ✅ Actions possibles :
  - Valider → statut VALIDÉ
  - Rejeter → retour commercial avec motif
  - Escalader → niveau supérieur
- ✅ Commentaire obligatoire
- ✅ Notification commercial et client
- ✅ Traçabilité validation

**RÈGLES DE GESTION :**
- RG-V019 : Gérants peuvent valider sans limite
- RG-V020 : Validation N+1 si dépassement > 30%
- RG-V021 : PDG validation finale si besoin

**Priorité :** P0 (Critique)  
**Estimation :** 5 points

---

### US-VENTE-009 : Modifier une commande

**EN TANT QUE** Commercial B2B  
**JE VEUX** modifier une commande non livrée  
**AFIN DE** ajuster selon les besoins client

**CRITÈRES D'ACCEPTATION :**
- ✅ Modification possible si statut ≠ LIVRÉ/FACTURÉ
- ✅ Éléments modifiables :
  - Quantités articles
  - Ajout/suppression lignes
  - Date livraison
  - Lieu livraison
- ✅ Éléments non modifiables :
  - Client
  - Mode paiement (si crédit validé)
  - Commercial
- ✅ Si augmentation > 10% :
  - Nouvelle validation requise
  - Vérification caution
- ✅ Historique modifications tracé
- ✅ Notification client si commande validée

**RÈGLES DE GESTION :**
- RG-V022 : Recalcul automatique totaux
- RG-V023 : Nouvelle validation si changement significatif

**Priorité :** P1 (Important)  
**Estimation :** 5 points

---

### US-VENTE-010 : Annuler une commande

**EN TANT QUE** Commercial B2B  
**JE VEUX** annuler une commande  
**AFIN DE** gérer les désistements clients

**CRITÈRES D'ACCEPTATION :**
- ✅ Annulation possible si non livrée
- ✅ Motif annulation obligatoire :
  - Client a annulé
  - Stock insuffisant
  - Problème crédit
  - Erreur saisie
  - Autre (préciser)
- ✅ Si partiellement livrée :
  - Confirmation requise
  - Génération avoir si facturée
- ✅ Libération stock réservé
- ✅ Statut → ANNULÉ
- ✅ Notification client
- ✅ Impact sur commissions

**RÈGLES DE GESTION :**
- RG-V024 : Annulation tracée définitivement
- RG-V025 : Commission annulée si pas livrée

**Priorité :** P1 (Important)  
**Estimation :** 3 points

---

## 🚚 SECTION C : GESTION DES LIVRAISONS

### US-VENTE-011 : Créer un bon de livraison

**EN TANT QUE** Responsable Logistique  
**JE VEUX** créer un bon de livraison depuis une commande  
**AFIN DE** organiser l'expédition des marchandises

**CRITÈRES D'ACCEPTATION :**
- ✅ Création depuis BC validé
- ✅ Numérotation auto par client : BL-{CLIENT}-YYYY-XXXXX
- ✅ Informations pré-remplies depuis BC :
  - Client
  - Adresse livraison
  - Articles commandés
- ✅ Sélection entrepôt source
- ✅ Vérification disponibilité stock
- ✅ Informations transport :
  - **Chauffeur** :
    - Nom
    - Téléphone
    - CNI (optionnel)
  - **Véhicule** :
    - Immatriculation
    - Type
  - **Chargeur(s)** si applicable
- ✅ Magasinier responsable
- ✅ Date/heure livraison prévue
- ✅ Affichage jour, heure, minute livraison
- ✅ Possibilité livraison partielle
- ✅ Génération PDF pour impression
- ✅ Statut : EN_PREPARATION

**RÈGLES DE GESTION :**
- RG-V026 : Stock réservé à la validation BC
- RG-V027 : Sortie stock à la validation BL
- RG-V028 : Commercial du BC repris automatiquement

**Priorité :** P0 (Critique)  
**Estimation :** 8 points

---

### US-VENTE-012 : Confirmer une livraison

**EN TANT QUE** Chauffeur/Livreur  
**JE VEUX** confirmer la livraison effectuée  
**AFIN DE** finaliser le processus de livraison

**CRITÈRES D'ACCEPTATION :**
- ✅ Interface mobile/tablette
- ✅ Scan ou saisie N° BL
- ✅ Confirmation articles livrés :
  - Quantité livrée par article
  - État (bon état/endommagé)
- ✅ Signature client :
  - Nom signataire
  - Fonction
  - Signature électronique
  - Cachet (optionnel)
- ✅ Photo BL signé
- ✅ Heure réelle livraison (auto)
- ✅ Géolocalisation livraison
- ✅ Commentaires éventuels
- ✅ Statut → LIVRÉ

**RÈGLES DE GESTION :**
- RG-V029 : Signature obligatoire pour validation
- RG-V030 : GPS requis pour traçabilité

**Priorité :** P1 (Important)  
**Estimation :** 5 points

---

### US-VENTE-013 : Gérer une livraison partielle

**EN TANT QUE** Responsable Logistique  
**JE VEUX** gérer les livraisons en plusieurs fois  
**AFIN DE** livrer selon disponibilité stock

**CRITÈRES D'ACCEPTATION :**
- ✅ Option "Livraison partielle" lors création BL
- ✅ Sélection articles/quantités à livrer
- ✅ BC reste "EN_COURS" après livraison partielle
- ✅ Création nouveau BL pour reliquat
- ✅ Suivi quantités :
  - Commandé
  - Livré
  - Restant à livrer
- ✅ Consolidation sur facture unique possible
- ✅ Notification client des livraisons partielles

**RÈGLES DE GESTION :**
- RG-V031 : Maximum 3 livraisons partielles par BC
- RG-V032 : Client doit accepter livraisons partielles

**Priorité :** P1 (Important)  
**Estimation :** 5 points

---

## 💰 SECTION D : FACTURATION

### US-VENTE-014 : Créer une facture de vente

**EN TANT QUE** Comptable Ventes  
**JE VEUX** créer une facture depuis un bon de livraison  
**AFIN DE** constater la créance client

**CRITÈRES D'ACCEPTATION :**
- ✅ Création depuis BL livré
- ✅ Numérotation par client : FA-{CLIENT}-YYYY-XXXXX
- ✅ Reprise automatique :
  - Client et adresse facturation
  - Articles livrés
  - Prix depuis BC
  - Commercial
  - BL référence
- ✅ Calcul automatique :
  - Base HT
  - TVA selon régime client
  - Total TTC
- ✅ Échéance selon conditions client
- ✅ Possibilité regrouper plusieurs BL
- ✅ Mentions légales obligatoires
- ✅ Format PDF pour impression/envoi
- ✅ Statut : NON_PAYÉE

**RÈGLES DE GESTION :**
- RG-V033 : TVA 19.25% sauf exonération
- RG-V034 : Facture définitive non modifiable
- RG-V035 : Commercial du BC = bénéficiaire commission

**Priorité :** P0 (Critique)  
**Estimation :** 5 points

---

### US-VENTE-015 : Créer une facture de transport

**EN TANT QUE** Comptable Ventes  
**JE VEUX** créer une facture transport séparée  
**AFIN DE** facturer les frais de livraison distinctement

**CRITÈRES D'ACCEPTATION :**
- ✅ Création si "livraison à notre charge"
- ✅ Numérotation : FT-{CLIENT}-YYYY-XXXXX
- ✅ Lien avec facture marchandises
- ✅ Informations transport :
  - Distance
  - Tarif applicable
  - Zone livraison
- ✅ Calcul frais transport
- ✅ TVA 19.25% sur transport
- ✅ Possibilité subvention transport
- ✅ Séparation comptable transport/marchandises

**RÈGLES DE GESTION :**
- RG-V036 : Transport facturable si > 50,000 XAF
- RG-V037 : Subvention déduite si applicable

**Priorité :** P1 (Important)  
**Estimation :** 5 points

---

### US-VENTE-016 : Gérer un avoir client

**EN TANT QUE** Service Client  
**JE VEUX** créer un avoir suite à un retour  
**AFIN DE** créditer le compte client

**CRITÈRES D'ACCEPTATION :**
- ✅ Création depuis :
  - Bon de retour validé
  - Réclamation client
  - Erreur facturation
- ✅ Numérotation : AV-{CLIENT}-YYYY-XXXXX
- ✅ Référence facture origine obligatoire
- ✅ Motifs avoir :
  - Retour marchandise
  - Produit défectueux
  - Erreur prix
  - Erreur quantité
  - Remise commerciale
- ✅ Validation hiérarchique selon montant
- ✅ Impact automatique solde client
- ✅ Notification client
- ✅ Format PDF

**RÈGLES DE GESTION :**
- RG-V038 : Avoir > 100,000 XAF validation direction
- RG-V039 : Impact commission si retour

**Priorité :** P1 (Important)  
**Estimation :** 5 points

---

### US-VENTE-017 : Gérer le transport subventionné

**EN TANT QUE** Comptable Ventes  
**JE VEUX** gérer les subventions transport  
**AFIN DE** suivre les avances et compensations

**CRITÈRES D'ACCEPTATION :**
- ✅ Activation "Transport subventionné" sur BC
- ✅ Calcul acompte 100% transport :
  - Part client
  - Part subvention entreprise
- ✅ Génération automatique :
  - Facture transport totale
  - Répartition acompte
- ✅ Compte avances subventions :
  - Débit à chaque utilisation
  - Crédit lors compensations
  - Solde visible
- ✅ Rapport mensuel subventions
- ✅ Réconciliation avec ristournes

**RÈGLES DE GESTION :**
- RG-V040 : Acompte obligatoire avant livraison
- RG-V041 : Compensation mensuelle avec ristournes

**Priorité :** P2 (Souhaitable)  
**Estimation :** 8 points

---

## 🛍️ SECTION E : VENTES POS (Point de Vente)

### US-VENTE-018 : Ouvrir une session de caisse

**EN TANT QUE** Caissier POS  
**JE VEUX** ouvrir ma caisse pour la journée  
**AFIN DE** commencer les ventes

**CRITÈRES D'ACCEPTATION :**
- ✅ Authentification caissier (login/mot de passe)
- ✅ Saisie fond de caisse initial (espèces)
- ✅ Vérification caisse pas déjà ouverte
- ✅ Sélection point de vente/magasin
- ✅ Génération N° session : SES-{POS}-YYYY-XXXXX
- ✅ Heure ouverture automatique
- ✅ Statut session : OUVERTE
- ✅ Blocage autres caissiers sur même caisse
- ✅ Affichage dashboard ventes temps réel

**RÈGLES DE GESTION :**
- RG-V042 : Une session par caissier par jour
- RG-V043 : Fond de caisse obligatoire

**Priorité :** P0 (Critique)  
**Estimation :** 3 points

---

### US-VENTE-019 : Effectuer une vente POS

**EN TANT QUE** Caissier POS  
**JE VEUX** enregistrer une vente rapide  
**AFIN DE** servir les clients au comptoir

**CRITÈRES D'ACCEPTATION :**
- ✅ Interface tactile optimisée
- ✅ Recherche article :
  - Scanner code-barres
  - Recherche par nom
  - Catégories visuelles
- ✅ Panier de vente :
  - Ajout/suppression articles
  - Modification quantités
  - Prix automatique (liste POS)
  - Total temps réel
- ✅ Client :
  - Vente anonyme par défaut
  - Possibilité identifier client
- ✅ Modes de paiement :
  - **Espèces**
  - **Mobile Money** (Orange, MTN)
  - **Virement**
  - **Chèque**
  - Paiement multiple possible
- ✅ Si espèces : calcul monnaie à rendre
- ✅ Impression ticket automatique
- ✅ Mise à jour stock immédiate
- ✅ Numérotation : TIC-{POS}-YYYY-XXXXX

**RÈGLES DE GESTION :**
- RG-V044 : Vente espèces max 500,000 XAF
- RG-V045 : Stock point de vente mis à jour

**Priorité :** P0 (Critique)  
**Estimation :** 8 points

---

### US-VENTE-020 : Annuler/Retourner une vente POS

**EN TANT QUE** Superviseur POS  
**JE VEUX** annuler ou retourner une vente  
**AFIN DE** gérer les erreurs et retours clients

**CRITÈRES D'ACCEPTATION :**
- ✅ Recherche vente par :
  - N° ticket
  - Date/heure
  - Montant
- ✅ Deux options :
  - **Annulation** (même jour)
  - **Retour** (jours suivants)
- ✅ Autorisation superviseur requise
- ✅ Motif obligatoire :
  - Erreur caisse
  - Client mécontent
  - Produit défectueux
  - Autre
- ✅ Remboursement :
  - Même mode que paiement
  - Ou avoir client
- ✅ Remise en stock automatique
- ✅ Ticket annulation/retour imprimé
- ✅ Impact sur session caisse

**RÈGLES DE GESTION :**
- RG-V046 : Annulation jour même uniquement
- RG-V047 : Retour max 7 jours avec ticket

**Priorité :** P1 (Important)  
**Estimation :** 5 points

---

### US-VENTE-021 : Clôturer une session de caisse

**EN TANT QUE** Caissier POS  
**JE VEUX** clôturer ma caisse en fin de journée  
**AFIN DE** faire le rapprochement des ventes

**CRITÈRES D'ACCEPTATION :**
- ✅ Bouton "Clôturer session"
- ✅ Comptage physique par mode paiement :
  - Espèces (billets et pièces)
  - Chèques (nombre et montant)
  - Tickets Mobile Money
  - Justificatifs virements
- ✅ Calcul automatique :
  - Total ventes théorique
  - Total déclaré
  - Écart par mode
- ✅ Si écart :
  - Justification obligatoire
  - Validation superviseur si > 1%
- ✅ Génération rapport session :
  - Détail ventes
  - Modes paiement
  - Annulations
  - Écarts
- ✅ Impression Z (rapport fiscal)
- ✅ Remise fond de caisse
- ✅ Statut → CLÔTURÉE

**RÈGLES DE GESTION :**
- RG-V048 : Clôture obligatoire quotidienne
- RG-V049 : Écart > 5% = alerte direction

**Priorité :** P0 (Critique)  
**Estimation :** 5 points

---

### US-VENTE-022 : Consulter l'historique des sessions

**EN TANT QUE** Superviseur POS  
**JE VEUX** consulter l'historique des sessions de caisse  
**AFIN DE** contrôler l'activité des caisses

**CRITÈRES D'ACCEPTATION :**
- ✅ Liste des sessions avec filtres :
  - Date/période
  - Caissier
  - Point de vente
  - Statut
- ✅ Informations par session :
  - N° session
  - Caissier
  - Ouverture/clôture
  - Total ventes
  - Écarts
  - Statut
- ✅ Détail session consultable :
  - Toutes les transactions
  - Chronologie
  - Modes paiement
- ✅ Indicateurs :
  - 🟢 Sans écart
  - 🟡 Écart < 1%
  - 🔴 Écart > 1%
- ✅ Export Excel
- ✅ Impression rapports

**RÈGLES DE GESTION :**
- RG-V050 : Conservation 5 ans minimum

**Priorité :** P1 (Important)  
**Estimation :** 3 points

---

## 📈 SECTION F : COMMISSIONS ET PERFORMANCES

### US-VENTE-023 : Calculer les commissions commerciales

**EN TANT QUE** Système  
**JE VEUX** calculer automatiquement les commissions  
**AFIN DE** rémunérer les commerciaux

**CRITÈRES D'ACCEPTATION :**
- ✅ Calcul automatique sur BC validé
- ✅ Commercial = bénéficiaire (depuis BC)
- ✅ Base de calcul paramétrable :
  - % sur CA HT
  - % sur marge
  - Montant fixe par vente
- ✅ Commission en attente jusqu'à :
  - Livraison effective
  - Paiement client (paramétrable)
- ✅ Statuts commission :
  - PROVISOIRE (BC validé)
  - CONFIRMÉE (livré)
  - EXIGIBLE (payé)
  - PAYÉE
- ✅ Compte commission par commercial
- ✅ Déduction caution si configuré

**RÈGLES DE GESTION :**
- RG-V051 : Commission confirmée après livraison
- RG-V052 : 30% retenu pour caution (paramétrable)

**Priorité :** P1 (Important)  
**Estimation :** 5 points

---

### US-VENTE-024 : Consulter mes commissions

**EN TANT QUE** Commercial B2B  
**JE VEUX** consulter mes commissions  
**AFIN DE** suivre ma rémunération variable

**CRITÈRES D'ACCEPTATION :**
- ✅ Dashboard personnel commissions
- ✅ Vue par période :
  - Mois en cours
  - Mois précédents
  - Année
- ✅ Détail par vente :
  - Client
  - N° BC
  - Montant vente
  - Taux commission
  - Montant commission
  - Statut
- ✅ Totaux :
  - Commissions provisoires
  - Commissions confirmées
  - Commissions payées
  - Solde disponible
- ✅ Export détail Excel
- ✅ Historique paiements

**RÈGLES DE GESTION :**
- RG-V053 : Visible uniquement par commercial concerné

**Priorité :** P1 (Important)  
**Estimation :** 3 points

---

## 📊 SECTION G : TABLEAUX DE BORD ET REPORTING

### US-VENTE-025 : Dashboard ventes temps réel

**EN TANT QUE** Direction Commerciale  
**JE VEUX** voir les ventes en temps réel  
**AFIN DE** piloter l'activité commerciale

**CRITÈRES D'ACCEPTATION :**
- ✅ KPIs principaux :
  - CA jour/mois/année
  - Nombre ventes
  - Panier moyen
  - Évolution vs N-1
- ✅ Graphiques :
  - Évolution temporelle
  - Répartition par produit
  - Top clients
  - Performance commerciaux
- ✅ Filtres :
  - Période
  - Société
  - Commercial
  - Type client
  - Zone
- ✅ Actualisation temps réel
- ✅ Drill-down vers détails
- ✅ Export PDF rapport
- ✅ Accès selon profil

**RÈGLES DE GESTION :**
- RG-V054 : Consolidation multi-sociétés
- RG-V055 : Séparation B2B/POS

**Priorité :** P0 (Critique)  
**Estimation :** 8 points

---

### US-VENTE-026 : Rapport des ventes périodique

**EN TANT QUE** Contrôleur de Gestion  
**JE VEUX** générer des rapports de ventes détaillés  
**AFIN DE** analyser la performance commerciale

**CRITÈRES D'ACCEPTATION :**
- ✅ Types de rapports :
  - Ventes par période
  - Ventes par client
  - Ventes par produit
  - Ventes par commercial
  - Analyse marges
- ✅ Paramètres :
  - Période (dates début/fin)
  - Sociétés
  - Critères spécifiques
- ✅ Format rapport :
  - Tableaux détaillés
  - Sous-totaux
  - Graphiques
  - Comparaisons N-1
- ✅ Formats export :
  - PDF
  - Excel
  - CSV
- ✅ Planification automatique :
  - Quotidien
  - Hebdomadaire
  - Mensuel
- ✅ Envoi email automatique

**RÈGLES DE GESTION :**
- RG-V056 : Données définitives J+1

**Priorité :** P1 (Important)  
**Estimation :** 5 points

---

### US-VENTE-027 : Pipeline des ventes

**EN TANT QUE** Responsable Commercial  
**JE VEUX** voir le pipeline des ventes  
**AFIN DE** prévoir l'activité future

**CRITÈRES D'ACCEPTATION :**
- ✅ Vue pipeline par statut :
  - Devis
  - BC en validation
  - BC validés
  - En livraison
  - Livrés
  - Facturés
- ✅ Montants par étape
- ✅ Nombre de jours moyen par étape
- ✅ Taux conversion entre étapes
- ✅ Prévisions mensuelles
- ✅ Filtres par :
  - Commercial
  - Client
  - Produit
- ✅ Actions rapides depuis pipeline
- ✅ Export données

**RÈGLES DE GESTION :**
- RG-V057 : Mise à jour temps réel

**Priorité :** P2 (Souhaitable)  
**Estimation :** 5 points

---

### US-VENTE-028 : Analyse des impayés

**EN TANT QUE** Responsable Crédit  
**JE VEUX** suivre les impayés clients  
**AFIN DE** gérer le recouvrement

**CRITÈRES D'ACCEPTATION :**
- ✅ Liste factures impayées avec :
  - Client
  - Montant
  - Échéance
  - Jours retard
  - Commercial
- ✅ Classification :
  - 🟢 < 30 jours
  - 🟡 30-60 jours
  - 🔴 > 60 jours
- ✅ Actions disponibles :
  - Relance email
  - Génération courrier
  - Blocage client
  - Plan de paiement
- ✅ Historique relances
- ✅ Provision créances douteuses
- ✅ Export liste recouvrement
- ✅ Dashboard impayés

**RÈGLES DE GESTION :**
- RG-V058 : Blocage automatique après 60 jours
- RG-V059 : Relances à J+7, J+30, J+60

**Priorité :** P1 (Important)  
**Estimation :** 5 points

---

## 📱 SECTION H : RETOURS ET SERVICE CLIENT

### US-VENTE-029 : Créer un bon de retour client

**EN TANT QUE** Service Client  
**JE VEUX** enregistrer un retour marchandise  
**AFIN DE** traiter les réclamations clients

**CRITÈRES D'ACCEPTATION :**
- ✅ Création depuis :
  - Facture
  - BL
  - Réclamation client
- ✅ Numérotation : BR-{CLIENT}-YYYY-XXXXX
- ✅ Informations retour :
  - Client
  - Articles retournés
  - Quantités
  - Motif retour
  - État marchandise
- ✅ Motifs possibles :
  - Produit défectueux
  - Non conforme
  - Erreur livraison
  - Client insatisfait
- ✅ Validation responsable
- ✅ Mise en quarantaine stock
- ✅ Génération avoir si validé
- ✅ Notification client

**RÈGLES DE GESTION :**
- RG-V060 : Retour max 30 jours après livraison
- RG-V061 : Photos obligatoires si défaut

**Priorité :** P1 (Important)  
**Estimation :** 5 points

---

### US-VENTE-030 : Gérer les réclamations clients

**EN TANT QUE** Service Client  
**JE VEUX** enregistrer et suivre les réclamations  
**AFIN DE** améliorer la satisfaction client

**CRITÈRES D'ACCEPTATION :**
- ✅ Formulaire réclamation :
  - Client
  - Type réclamation
  - Description détaillée
  - Documents joints
  - Urgence
- ✅ Types réclamation :
  - Qualité produit
  - Livraison
  - Facturation
  - Service commercial
  - Autre
- ✅ Attribution automatique selon type
- ✅ Workflow traitement :
  - OUVERTE
  - EN_COURS
  - RÉSOLUE
  - CLÔTURÉE
- ✅ Suivi actions et communications
- ✅ Délai résolution (SLA)
- ✅ Satisfaction client post-résolution
- ✅ Tableau de bord réclamations

**RÈGLES DE GESTION :**
- RG-V062 : SLA 48h pour première réponse
- RG-V063 : Escalade si non résolu dans délai

**Priorité :** P2 (Souhaitable)  
**Estimation :** 5 points

---

## 📋 RÉCAPITULATIF ET PRIORISATION

### **Statistiques globales**
- **Total User Stories** : 30
- **Points totaux estimés** : 173 points
- **Durée estimée** : 17-20 sprints (2 semaines/sprint)

### **Répartition par priorité**
- **P0 (Critique)** : 10 US - 61 points
  - Gestion clients de base
  - Cycle commande-livraison-facturation
  - Sessions caisse POS
  - Dashboard principal

- **P1 (Important)** : 17 US - 87 points
  - Gestion avancée clients
  - Livraisons partielles
  - Commissions
  - Retours et avoirs
  - Reporting

- **P2 (Souhaitable)** : 3 US - 25 points
  - Transport subventionné
  - Pipeline avancé
  - Gestion réclamations

### **Plan de livraison suggéré**

**Phase 1 (MVP) - 3 mois**
- Gestion clients basique
- Cycle vente B2B complet
- POS basique
- Dashboard essentiel

**Phase 2 - 2 mois**
- Gestion avancée clients
- Commissions
- Retours/avoirs
- Reporting complet

**Phase 3 - 1 mois**
- Transport subventionné
- Réclamations
- Optimisations

---

## ✅ VALIDATIONS INTÉGRÉES

### **Du document "Informatisation Activité Groupe IOLA"**
- ✅ Numérotation par client (BC, BL, Facture)
- ✅ Mode paiement avec limite espèces
- ✅ Attestation non-redevance et régime imposition
- ✅ Identification chauffeur avec téléphone
- ✅ Identification chargeur
- ✅ Identification magasinier
- ✅ Commercial sur tous documents
- ✅ Immatriculation véhicule
- ✅ Date, heure, minute livraison
- ✅ Validation solde précédent
- ✅ Facture transport séparée
- ✅ Gestion avoirs

### **Exclusions confirmées**
- ❌ Remises par défaut (pas de remise automatique)
- ❌ Livraison via entrepôts virtuels (géré dans Stock)
- ❌ Ordre de préparation détaillé (hors MVP)

Cette documentation complète couvre l'ensemble des besoins du module Ventes avec une approche progressive et pragmatique pour l'implémentation.
