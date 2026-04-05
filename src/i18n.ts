import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      "app_name": "SahyogAI",
      "tagline": "AI-Powered Crisis Management",
      "home": "Home",
      "issues": "Issues",
      "alerts": "Alerts",
      "map": "Map",
      "profile": "Profile",
      "report_issue": "Report Issue",
      "emergency": "Emergency",
      "loading": "Loading...",
      "ai_assistant": "AI Assistant",
      "active_missions": "Active Missions",
      "nearby_issues": "Nearby Issues",
      "live_crisis_map": "Live Crisis Map",
      "network_status": "Network Status",
      "performance": "Performance",
      "settings": "Settings",
      "broadcast": "Broadcast",
      "overview": "Overview",
      "volunteers": "Volunteers",
      "ngos": "NGOs",
      "chat_placeholder": "Ask AI for help...",
      "language": "Language"
    }
  },
  hi: {
    translation: {
      "app_name": "सहयोगAI",
      "tagline": "एआई-आधारित संकट प्रबंधन",
      "home": "मुख्य पृष्ठ",
      "issues": "समस्याएं",
      "alerts": "चेतावनी",
      "map": "मानचित्र",
      "profile": "प्रोफ़ाइल",
      "report_issue": "समस्या की रिपोर्ट करें",
      "emergency": "आपातकालीन",
      "loading": "लोड हो रहा है...",
      "ai_assistant": "एआई सहायक",
      "active_missions": "सक्रिय मिशन",
      "nearby_issues": "आस-पास की समस्याएं",
      "live_crisis_map": "लाइव संकट मानचित्र",
      "network_status": "नेटवर्क स्थिति",
      "performance": "प्रदर्शन",
      "settings": "सेटिंग्स",
      "broadcast": "प्रसारण",
      "overview": "अवलोकन",
      "volunteers": "स्वयंसेवक",
      "ngos": "एनजीओ",
      "chat_placeholder": "एआई से मदद मांगें...",
      "language": "भाषा"
    }
  },
  mr: {
    translation: {
      "app_name": "सहयोगAI",
      "tagline": "AI-आधारित संकट व्यवस्थापन",
      "home": "मुख्यपृष्ठ",
      "issues": "समस्या",
      "alerts": "सतर्कता",
      "map": "नकाशा",
      "profile": "प्रोफाइल",
      "report_issue": "समस्येची तक्रार करा",
      "emergency": "आणीबाणी",
      "loading": "लोड होत आहे...",
      "ai_assistant": "AI सहाय्यक",
      "active_missions": "सक्रिय मोहिमा",
      "nearby_issues": "जवळील समस्या",
      "live_crisis_map": "लाइव संकट नकाशा",
      "network_status": "नेटवर्क स्थिती",
      "performance": "कामगिरी",
      "settings": "सेटिंग्ज",
      "broadcast": "प्रसारण",
      "overview": "आढावा",
      "volunteers": "स्वयंसेवक",
      "ngos": "NGO",
      "chat_placeholder": "AI कडे मदत मागा...",
      "language": "भाषा"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
