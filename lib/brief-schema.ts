export type TextBlock = {
  id: string;
  type: "text";
  heading: string;
  content: string;
};

export type MultiSelectBlock = {
  id: string;
  type: "multi-select";
  heading?: string;
  prompt: string;
  options: string[];
  freeTextLabel?: string;
  freeTextPlaceholder?: string;
};

export type SingleSelectBlock = {
  id: string;
  type: "single-select";
  heading?: string;
  prompt: string;
  options: string[];
  freeTextLabel?: string;
  freeTextPlaceholder?: string;
};

export type GroupedSelectGroup = {
  label: string;
  options: string[];
  selectionMode: "single" | "multi";
};

export type GroupedSelectBlock = {
  id: string;
  type: "grouped-select";
  heading?: string;
  prompt: string;
  groups: GroupedSelectGroup[];
  freeTextLabel?: string;
  freeTextPlaceholder?: string;
};

export type NotesBlock = {
  id: string;
  type: "notes";
  heading?: string;
  prompt: string;
  bullets?: string[];
  textareaLabel?: string;
  textareaPlaceholder?: string;
};

export type FreeTextField = {
  id: string;
  label: string;
  placeholder?: string;
};

export type FreeTextBlock = {
  id: string;
  type: "free-text";
  heading?: string;
  prompt: string;
  fields: FreeTextField[];
};

export type QuestionLeafBlock =
  | MultiSelectBlock
  | SingleSelectBlock
  | GroupedSelectBlock
  | FreeTextBlock
  | NotesBlock;

export type CompositeBlock = {
  id: string;
  type: "composite";
  heading: string;
  prompt?: string;
  blocks: QuestionLeafBlock[];
  freeTextLabel?: string;
  freeTextPlaceholder?: string;
};

export type Block = TextBlock | QuestionLeafBlock | CompositeBlock;

export type Step = {
  id: string;
  label: string;
  intro?: string;
  blocks: Block[];
};

const INTRO = "Survolez un paragraphe pour le modifier.";

export const brief: Step[] = [
  {
    id: "activite",
    label: "L'activité",
    intro: INTRO,
    blocks: [
      {
        id: "activite-1",
        type: "text",
        heading: "Positionnement",
        content:
          "Maison de location de villas ultra-luxe sur deux destinations : Saint-Barthélemy et Saint-Tropez. Gestion sous mandat, jamais en propriété — mandats non-exclusifs.",
      },
      {
        id: "activite-2",
        type: "text",
        heading: "Portefeuille et équipe",
        content:
          "80 villas sous mandat aujourd'hui. Petite équipe gérant jusqu'à 15 dossiers clients en simultané.",
      },
      {
        id: "activite-3",
        type: "text",
        heading: "Clientèle et acquisition",
        content:
          "Clientèle à 90% américaine. Deux canaux d'acquisition : direct et travel designers / advisors commissionnés. Conciergerie incluse dans la location, pas vendue à la carte.",
      },
    ],
  },
  {
    id: "existant",
    label: "L'existant",
    intro: INTRO,
    blocks: [
      {
        id: "existant-1",
        type: "text",
        heading: "Stack actuel",
        content:
          "Notion pour la coordination des tâches conciergerie avec les prestataires externes. Monday pour la même fonction de coordination, mais spécifique aux restaurants. HubSpot comme CRM basique. Panneau admin du site qui gère les fiches villas et le contenu du site.",
      },
      {
        id: "existant-2",
        type: "text",
        heading: "Canaux entrants",
        content:
          "Demandes guests entrantes principalement par email, complétées par WhatsApp.",
      },
      {
        id: "existant-3",
        type: "text",
        heading: "Prestataires et dispatch",
        content:
          "100% prestataires externes : chefs, restaurants, capitaines, chauffeurs. Aucun staff interne. Dispatch des demandes aux prestataires fait manuellement, sans système central.",
      },
    ],
  },
  {
    id: "cahier-des-charges",
    label: "Le cahier des charges",
    intro: INTRO,
    blocks: [
      {
        id: "cahier-1",
        type: "text",
        heading: "Périmètre de remplacement",
        content:
          "Remplacement total de Notion, Monday, HubSpot et du panneau admin du site par une plateforme unifiée.",
      },
      {
        id: "cahier-2",
        type: "text",
        heading: "Modules opérationnels",
        content:
          "Deux modules à construire. Premier module : CRM et pipeline de réservation, en remplacement propre de HubSpot. Second module : hub conciergerie pour la réception des demandes guests, leur dispatch aux prestataires et le suivi.",
      },
      {
        id: "cahier-3",
        type: "text",
        heading: "Fonctions transverses",
        content:
          "Tracking automatique des commissions advisors. Relevés propriétaires, puisque les villas sont gérées sous mandat. Reporting financier et opérationnel.",
      },
      {
        id: "cahier-4",
        type: "text",
        heading: "Standard recherché",
        content:
          "Passer d'un setup amateur à un standard professionnel. L'efficacité opérationnelle est la priorité absolue de la plateforme.",
      },
    ],
  },
  {
    id: "vision",
    label: "La vision",
    intro: INTRO,
    blocks: [
      {
        id: "vision-1",
        type: "text",
        heading: "Trajectoire de croissance",
        content:
          "Objectif 500 villas d'ici 2 ans — croissance x6 que la plateforme doit absorber sans refonte. Densification sur Saint-Barth et Saint-Tropez, plus éventuellement nouvelles destinations — l'architecture doit être pensée multi-destinations dès le départ.",
      },
      {
        id: "vision-2",
        type: "text",
        heading: "Évolution de l'équipe",
        content:
          "Embauche d'un admin à terme : la plateforme doit permettre un onboarding en quelques semaines. Capacité à gérer simultanément plus de dossiers clients sans grossir l'équipe en proportion.",
      },
      {
        id: "vision-3",
        type: "text",
        heading: "Timeline",
        content: "1 mois pour l'UI/UX, approche design-first.",
      },
    ],
  },
  {
    id: "q1",
    label: "Le dossier client",
    blocks: [
      {
        id: "q1-dossier-client",
        type: "multi-select",
        heading: "Le dossier client",
        prompt:
          "Du premier contact à la fin du séjour, qu'est-ce qui doit absolument vivre dans un dossier client unique ? Cochez ce qui s'applique et complétez si besoin.",
        options: [
          "Identité du guest (nom, contact, nationalité, langue)",
          "Composition du séjour (nombre d'adultes, enfants, dates, villa retenue)",
          "Travel advisor associé (le cas échéant)",
          "Historique des séjours précédents avec la maison",
          "Préférences personnelles (alimentaires, allergies, ambiance, marques préférées)",
          "Documents administratifs (contrat, copies pièces d'identité, manifeste invités)",
          "Statut financier (devis, acompte, solde, encaissements)",
          "Demandes conciergerie passées et en cours",
          "Notes internes équipe sur le client",
          "Coordonnées d'urgence",
        ],
        freeTextLabel: "Autre — précisez",
        freeTextPlaceholder: "Ajoutez ce qui manque dans la liste",
      },
    ],
  },
  {
    id: "q3",
    label: "Les commissions advisors",
    blocks: [
      {
        id: "q3-commissions",
        type: "grouped-select",
        heading: "Les commissions advisors",
        prompt: "Le fonctionnement des commissions versées aux travel advisors.",
        groups: [
          {
            label: "Structure de taux",
            selectionMode: "single",
            options: ["Taux uniforme", "Négocié par advisor", "Mix selon le volume"],
          },
          {
            label: "Moment du paiement",
            selectionMode: "single",
            options: ["À la confirmation", "Au début du séjour", "Après le séjour"],
          },
          {
            label: "Base de calcul",
            selectionMode: "single",
            options: ["Brut", "Brut hors taxes", "Net après frais"],
          },
          {
            label: "Partage entre plusieurs advisors",
            selectionMode: "single",
            options: ["Oui", "Non", "Cas exceptionnels"],
          },
        ],
        freeTextLabel: "Précisions",
        freeTextPlaceholder: "Précisez",
      },
    ],
  },
  {
    id: "q9",
    label: "Le reporting",
    blocks: [
      {
        id: "q9-reporting",
        type: "composite",
        heading: "Le reporting",
        blocks: [
          {
            id: "indicateurs",
            type: "multi-select",
            prompt: "Indicateurs suivis aujourd'hui",
            options: [
              "CA par période",
              "Nombre de réservations",
              "Taux de conversion",
              "Taux d'occupation",
              "Commissions versées",
              "Marge nette par villa",
              "Performance par destination",
              "Performance par advisor",
              "Aucun suivi structuré",
            ],
          },
          {
            id: "cadence",
            type: "single-select",
            prompt: "Cadence souhaitée",
            options: [
              "Hebdomadaire",
              "Mensuelle",
              "Trimestrielle",
              "Annuelle",
              "À la demande",
            ],
          },
        ],
        freeTextLabel: "Indicateurs manquants à ajouter",
        freeTextPlaceholder: "Précisez",
      },
    ],
  },
  {
    id: "q11",
    label: "Les documents à signer",
    blocks: [
      {
        id: "q11-documents",
        type: "grouped-select",
        heading: "Les documents à signer",
        prompt:
          "Documents à signer dans le cadre de l'activité, et par qui. Cochez ce qui s'applique.",
        groups: [
          {
            label: "Côté guests",
            selectionMode: "multi",
            options: [
              "Contrat de location",
              "Conditions générales",
              "Caution, autorisation de prélèvement",
              "Décharge de responsabilité (piscine, nautique)",
              "Manifeste invités",
              "Inventaire d'entrée et de sortie",
            ],
          },
          {
            label: "Côté propriétaires",
            selectionMode: "multi",
            options: [
              "Mandat de gestion ou de commercialisation",
              "Avenant tarifaire saisonnier",
              "Procès-verbal de mise à disposition",
            ],
          },
          {
            label: "Côté advisors",
            selectionMode: "multi",
            options: [
              "Accord de commissionnement",
              "NDA, accord de confidentialité",
            ],
          },
          {
            label: "Côté prestataires",
            selectionMode: "multi",
            options: ["Contrat cadre prestataire", "Bon de commande ponctuel"],
          },
          {
            label: "Niveau de signature requis",
            selectionMode: "multi",
            options: [
              "Signature électronique simple (SES)",
              "Signature électronique avancée (AES)",
              "Signature électronique qualifiée (QES)",
            ],
          },
        ],
        freeTextLabel:
          "Précisez si différents documents requièrent différents niveaux de signature",
        freeTextPlaceholder: "Précisez",
      },
    ],
  },
  {
    id: "q12",
    label: "Le tableau de bord d'accueil",
    blocks: [
      {
        id: "q12-dashboard",
        type: "multi-select",
        heading: "Le tableau de bord d'accueil",
        prompt:
          "Quand un membre de l'équipe se connecte, qu'est-ce qu'il doit voir en premier ?",
        options: [
          "Les séjours en cours actuellement",
          "Les arrivées et départs des 7 prochains jours",
          "Les devis en attente de réponse client",
          "Les acomptes en retard",
          "Les demandes conciergerie non traitées",
          "Les alertes du jour (urgences, échéances dépassées)",
          "Les chiffres clés (CA du mois, taux de conversion)",
          "Les nouvelles tâches assignées personnellement",
        ],
        freeTextLabel:
          "Précisez ce qui doit être prioritaire selon le rôle (commercial, conciergerie, direction, admin)",
        freeTextPlaceholder: "Précisez",
      },
    ],
  },
  {
    id: "q13",
    label: "Les sujets périphériques",
    blocks: [
      {
        id: "q13-peripherique",
        type: "multi-select",
        heading: "Les sujets périphériques",
        prompt:
          "Sur les thèmes suivants, cochez ceux qui sont importants pour vous.",
        options: [
          "Templates d'emails et communication sortante",
          "Tâches et checklists internes par séjour",
          "Recherche et filtrage avancé des villas",
          "Notifications et alertes (in-app, push, email)",
          "Historique des modifications et audit",
          "Reconnaissance guest et anti-doublons",
          "Échéancier acomptes et relances automatiques",
          "Documentation interne et aide intégrée",
          "Export et partage externe (PDF, liens temporaires)",
          "Favoris et raccourcis personnalisés",
        ],
        freeTextLabel: "Pour chaque sujet coché, précisez ce qui compte le plus",
        freeTextPlaceholder: "Précisez",
      },
    ],
  },
  {
    id: "anything-to-add",
    label: "Anything to add",
    blocks: [
      {
        id: "anything-to-add-notes",
        type: "notes",
        heading: "Quelque chose à ajouter ?",
        prompt:
          "Un sujet qui n'a pas été couvert, un contexte utile, une contrainte à connaître — tout est bienvenu.",
        textareaPlaceholder: "Écrivez ce qui vous vient",
      },
    ],
  },
  {
    id: "rappels",
    label: "Éléments à envoyer",
    blocks: [
      {
        id: "rappels-notes",
        type: "notes",
        heading: "À envoyer pour compléter le brief",
        prompt:
          "Merci d'envoyer par WhatsApp les éléments suivants — ils servent à comprendre les workflows actuels et à dimensionner la plateforme.",
        bullets: [
          "Capture d'écran Notion — workflow conciergerie",
          "Capture d'écran HubSpot — pipeline CRM",
          "Capture d'écran Monday — workflow restaurants",
          "Exemple de devis envoyé sur WhatsApp",
        ],
        textareaLabel: "Notes ou liens",
        textareaPlaceholder: "Précisions, liens partagés, contexte",
      },
    ],
  },
];
