
import React, { createContext, useContext, useState } from 'react';

type Language = 'fr' | 'en';

const translations = {
  fr: {
    // Nav & Header
    app_title: "Matrice",
    nav_dashboard: "Tableau de bord",
    nav_sync: "Synchronisation",
    nav_audit: "Audit",
    nav_report: "Signaler",
    nav_summary: "Résumé",
    search_placeholder: "Filtrer les salles...",
    
    // Sidebar
    sidebar_subtitle: "Salle Monitore",
    sidebar_search: "Chercher Cohortes...",
    sidebar_active: "Cohortes Actives",
    sidebar_missing: "Fichiers Manquants",
    sidebar_sync_verified: "Sync CMC Vérifié",
    sidebar_pending: "En attente",
    sidebar_compliance: "Statut de Conformité",
    sidebar_synced: "Synchronisé",
    sidebar_no_data: "Aucune donnée CMC",

    // Matrix
    overview_title: "Vue d'ensemble",
    overview_subtitle: "État des salles en temps réel",
    cohort_focus: "Cohorte en focus",
    table_room_id: "Identifiant Salle",
    filter_all: "Tous",
    filter_free: "Libre",
    filter_busy: "Occupé",
    room_free: "Salle Libre",
    no_result_title: "Aucun résultat",
    no_result_desc: "Ajustez vos filtres segmentés",

    // Uploader
    upload_title: "Sync Emploi du Temps CMC",
    upload_subtitle: "Déposez vos fichiers PDF. Le système extraira automatiquement les identifiants de cohorte via Gemini AI.",
    upload_btn: "Parcourir les fichiers",
    upload_overwrite_title: "Remplacer l'enregistrement CMC",
    upload_overwrite_desc: "Un emploi du temps existant pour",
    upload_overwrite_confirm: "a été trouvé. Voulez-vous le remplacer ?",
    btn_confirm: "Confirmer",
    btn_cancel: "Annuler",
    ingestion_title: "Ingestion du Registre",
    ingestion_desc: "Validation CMC via IA...",
    success_title: "CMC Sync Réussi",
    success_desc: "emplois du temps CMC traités.",
    card_standards: "Standards CMC",
    card_standards_desc: "Extraction automatique basée sur les métadonnées de Cité des métiers.",
    card_inventory: "Inventaire Campus",
    card_inventory_desc: "Filtrage strict pour les salles DIA. Isolation régionale CMC.",
    card_mapping: "Mapping Instantané",
    card_mapping_desc: "Alignement piloté par l'IA pour le CMC Salle Monitore.",

    // Report/Audit
    audit_title: "Rapport d'Intégration CMC",
    audit_finalized: "Audit CMC Finalisé",
    audit_validated: "CMC Validé",
    audit_missing: "Fichiers Manquants",
    audit_updated: "Registres Actualisés",
    audit_critial: "Critique : Fichiers CMC Manquants",
    audit_synced: "Registre Synchronisé",
    audit_none_title: "Aucun audit généré",
    audit_none_desc: "Veuillez exécuter l'importateur par lots CMC pour générer un audit.",

    // Group Detail
    detail_missing_title: "Données CMC introuvables",
    detail_missing_desc: "Aucun fichier d'emploi du temps CMC n'a encore été associé à la cohorte",
    detail_revision: "Révision CMC",
    detail_download: "Télécharger l'emploi du temps",
    detail_weekly: "Aperçu hebdomadaire (Lundi)",
    detail_no_slots: "Aucun créneau cartographié pour lundi",
    detail_metadata: "Métadonnées CMC",
    detail_status: "Statut",
    detail_operational: "Opérationnel",
    detail_integrity: "Intégrité du fichier",
    detail_verified: "Vérifié • Standard CMC",
    detail_system_sync: "Sync Système",
    detail_auto_gen: "Cette page de cohorte est générée automatiquement à partir de l'audit centralisé CMC Salle Monitore.",

    // Problem Modal
    modal_problem_title: "Signaler un Problème",
    modal_problem_subtitle: "Rapport d'incident campus",
    label_location: "Localisation du Problème",
    label_desc: "Description de l'Incident",
    placeholder_desc: "Décrivez l'anomalie (ex: Panne projecteur...)",
    label_priority: "Niveau de Priorité",
    priority_important: "Important",
    priority_urgent: "Urgent",
    priority_plus_urgent: "Plus Urgent",
    btn_send: "Envoyer le Rapport",

    // Summary Modal
    summary_title: "Aperçu Campus",
    summary_subtitle: "État du Hub • Monitorage en direct",
    card_available: "Salles Disponibles",
    unit_units: "Unités",
    status_operational: "Opérationnel",
    card_incidents: "Incidents Actifs",
    unit_alerts: "Alertes",
    btn_show: "Afficher",
    btn_hide: "Masquer",
    log_title: "Journal des Incidents",
    log_empty: "Hub Sécurisé • Aucune alerte",
    time_elapsed: "Temps écoulé",
    detail_anomaly: "Détails de l'anomalie",
    btn_waiting: "En Attente",
    btn_resolved: "Marquer Résolu",
    btn_export: "Exporter le rapport du Hub",
    status_reported: "Signalé",
    status_waiting: "En attente",
    status_handled: "Traité"
  },
  en: {
    // Nav & Header
    app_title: "Matrix",
    nav_dashboard: "Dashboard",
    nav_sync: "Sync",
    nav_audit: "Audit",
    nav_report: "Report",
    nav_summary: "Summary",
    search_placeholder: "Filter rooms...",

    // Sidebar
    sidebar_subtitle: "Room Monitor",
    sidebar_search: "Search Cohorts...",
    sidebar_active: "Active Cohorts",
    sidebar_missing: "Missing Files",
    sidebar_sync_verified: "CMC Sync Verified",
    sidebar_pending: "Pending",
    sidebar_compliance: "Compliance Status",
    sidebar_synced: "Synced",
    sidebar_no_data: "No CMC data synced",

    // Matrix
    overview_title: "Overview",
    overview_subtitle: "Real-time Room Status",
    cohort_focus: "Cohort Focus",
    table_room_id: "Room ID",
    filter_all: "All",
    filter_free: "Free",
    filter_busy: "Busy",
    room_free: "Room Free",
    no_result_title: "No Results",
    no_result_desc: "Adjust your segment filters",

    // Uploader
    upload_title: "CMC Timetable Sync",
    upload_subtitle: "Drop your PDF files. The system will automatically extract cohort IDs via Gemini AI.",
    upload_btn: "Browse Files",
    upload_overwrite_title: "Overwrite CMC Record",
    upload_overwrite_desc: "An existing schedule for",
    upload_overwrite_confirm: "was found. Do you want to overwrite it?",
    btn_confirm: "Confirm",
    btn_cancel: "Cancel",
    ingestion_title: "Registry Ingestion",
    ingestion_desc: "CMC Validation via AI...",
    success_title: "CMC Sync Successful",
    success_desc: "CMC schedules processed.",
    card_standards: "CMC Standards",
    card_standards_desc: "Automatic extraction based on City of Trades metadata.",
    card_inventory: "Campus Inventory",
    card_inventory_desc: "Strict filtering for DIA rooms. Regional CMC isolation.",
    card_mapping: "Instant Mapping",
    card_mapping_desc: "AI-driven alignment for CMC Room Monitor.",

    // Report/Audit
    audit_title: "CMC Integration Report",
    audit_finalized: "CMC Audit Finalized",
    audit_validated: "CMC Validated",
    audit_missing: "Missing Files",
    audit_updated: "Registers Updated",
    audit_critial: "Critical: Missing CMC Files",
    audit_synced: "Register Synced",
    audit_none_title: "No Audit Generated",
    audit_none_desc: "Please run the CMC batch importer to generate an audit.",

    // Group Detail
    detail_missing_title: "CMC Data Not Found",
    detail_missing_desc: "No CMC timetable file has been associated with cohort",
    detail_revision: "CMC Revision",
    detail_download: "Download Timetable",
    detail_weekly: "Weekly Overview (Monday)",
    detail_no_slots: "No slots mapped for Monday",
    detail_metadata: "CMC Metadata",
    detail_status: "Status",
    detail_operational: "Operational",
    detail_integrity: "File Integrity",
    detail_verified: "Verified • CMC Standard",
    detail_system_sync: "System Sync",
    detail_auto_gen: "This cohort page is automatically generated from the centralized CMC Room Monitor audit.",

    // Problem Modal
    modal_problem_title: "Report an Issue",
    modal_problem_subtitle: "Campus Incident Report",
    label_location: "Issue Location",
    label_desc: "Incident Description",
    placeholder_desc: "Describe the anomaly (e.g., Projector failure...)",
    label_priority: "Priority Level",
    priority_important: "Important",
    priority_urgent: "Urgent",
    priority_plus_urgent: "Critical",
    btn_send: "Submit Report",

    // Summary Modal
    summary_title: "Campus Overview",
    summary_subtitle: "Hub Status • Live Monitoring",
    card_available: "Available Rooms",
    unit_units: "Units",
    status_operational: "Operational",
    card_incidents: "Active Incidents",
    unit_alerts: "Alerts",
    btn_show: "Show",
    btn_hide: "Hide",
    log_title: "Incident Log",
    log_empty: "Hub Secure • No alerts",
    time_elapsed: "Time elapsed",
    detail_anomaly: "Anomaly Details",
    btn_waiting: "Pending",
    btn_resolved: "Mark Resolved",
    btn_export: "Export Hub Report",
    status_reported: "Reported",
    status_waiting: "Waiting",
    status_handled: "Handled"
  }
};

const LanguageContext = createContext<{
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations['fr']) => string;
}>({
  language: 'fr',
  setLanguage: () => {},
  t: (key) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fr');

  const t = (key: keyof typeof translations['fr']) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
