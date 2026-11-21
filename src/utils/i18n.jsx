import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { LANGUAGES } from "./languages";

const dictionaries = {
  en: {
    language: "Language",
    support: "Support",
    contact: "Contact us",
    signIn: "Log in",
    signUp: "Sign up",
    search: "Search developers",
    noUsers: "No users found",
    notifications: "Notifications",
    caughtUp: "You are all caught up.",
    requests: "Requests",
    messages: "Messages",
    sentRequest: "sent a request",
    tapReview: "Tap to review",
    profile: "Profile",
    connections: "Connections",
    logout: "Log out",
    welcome: "Welcome back",
    signInHint: "Sign in to keep matching",
    signUpHint: "Create your developer profile",
    firstName: "First name",
    lastName: "Last name",
    email: "Email",
    password: "Password",
    show: "Show",
    hide: "Hide",
    createAccount: "Create account",
    wait: "Please wait",
    heroTitle: "Match with developers who ship.",
    heroText:
      "Swipe through profiles, send requests, and start chatting with people who actually want to build together.",
    supportTitle: "We're here to help",
    supportText: "Find answers fast, or reach the DevTinder team.",
    contactTitle: "Contact us",
    contactText: "Questions, feedback, or a bug? Drop a message.",
    send: "Send message",
    name: "Name",
    message: "Message",
    sent: "Message sent. We’ll get back to you soon.",
  },
  hi: {
    language: "भाषा",
    support: "सहायता",
    contact: "संपर्क करें",
    signIn: "लॉग इन",
    signUp: "साइन अप",
    search: "डेवलपर्स खोजें",
    noUsers: "कोई यूज़र नहीं मिला",
    notifications: "सूचनाएँ",
    caughtUp: "आप अप टू डेट हैं।",
    requests: "रिक्वेस्ट",
    messages: "मैसेज",
    sentRequest: "ने रिक्वेस्ट भेजी",
    tapReview: "देखने के लिए टैप करें",
    profile: "प्रोफ़ाइल",
    connections: "कनेक्शन",
    logout: "लॉग आउट",
    welcome: "वापसी पर स्वागत है",
    signInHint: "मैच करते रहने के लिए साइन इन करें",
    signUpHint: "अपनी डेवलपर प्रोफ़ाइल बनाएँ",
    firstName: "पहला नाम",
    lastName: "उपनाम",
    email: "ईमेल",
    password: "पासवर्ड",
    show: "दिखाएँ",
    hide: "छिपाएँ",
    createAccount: "अकाउंट बनाएँ",
    wait: "कृपया प्रतीक्षा करें",
    heroTitle: "उन डेवलपर्स से मिलें जो शिप करते हैं।",
    heroText: "प्रोफ़ाइल स्वाइप करें, रिक्वेस्ट भेजें, और साथ में बिल्ड करने वाले लोगों से चैट शुरू करें।",
    supportTitle: "हम मदद के लिए यहाँ हैं",
    supportText: "जल्दी जवाब पाएँ, या DevTinder टीम से बात करें।",
    contactTitle: "संपर्क करें",
    contactText: "सवाल, फीडबैक या बग? मैसेज भेजें।",
    send: "मैसेज भेजें",
    name: "नाम",
    message: "संदेश",
    sent: "मैसेज भेज दिया गया। हम जल्द जवाब देंगे।",
  },
  es: {
    language: "Idioma",
    support: "Ayuda",
    contact: "Contáctanos",
    signIn: "Iniciar sesión",
    signUp: "Registrarse",
    search: "Buscar desarrolladores",
    profile: "Perfil",
    connections: "Conexiones",
    logout: "Cerrar sesión",
    supportTitle: "Estamos para ayudarte",
    contactTitle: "Contáctanos",
    send: "Enviar mensaje",
  },
  fr: {
    language: "Langue",
    support: "Assistance",
    contact: "Nous contacter",
    signIn: "Connexion",
    signUp: "S’inscrire",
    search: "Rechercher des développeurs",
    profile: "Profil",
    connections: "Connexions",
    logout: "Déconnexion",
    supportTitle: "Nous sommes là pour vous aider",
    contactTitle: "Nous contacter",
    send: "Envoyer",
  },
  de: {
    language: "Sprache",
    support: "Support",
    contact: "Kontakt",
    signIn: "Anmelden",
    signUp: "Registrieren",
    search: "Entwickler suchen",
    profile: "Profil",
    connections: "Verbindungen",
    logout: "Abmelden",
  },
  ar: {
    language: "اللغة",
    support: "الدعم",
    contact: "اتصل بنا",
    signIn: "تسجيل الدخول",
    signUp: "إنشاء حساب",
  },
  ja: {
    language: "言語",
    support: "サポート",
    contact: "お問い合わせ",
    signIn: "ログイン",
    signUp: "登録",
  },
  ko: {
    language: "언어",
    support: "고객지원",
    contact: "문의하기",
    signIn: "로그인",
    signUp: "회원가입",
  },
  zh: {
    language: "语言",
    support: "帮助",
    contact: "联系我们",
    signIn: "登录",
    signUp: "注册",
  },
  pt: {
    language: "Idioma",
    support: "Suporte",
    contact: "Fale conosco",
    signIn: "Entrar",
    signUp: "Cadastrar",
  },
  ru: {
    language: "Язык",
    support: "Поддержка",
    contact: "Связаться",
    signIn: "Войти",
    signUp: "Регистрация",
  },
};

const I18nContext = createContext(null);

export const I18nProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem("devtinder-lang") || "en");

  useEffect(() => {
    localStorage.setItem("devtinder-lang", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = ["ar", "fa", "he", "ur", "ps", "sd"].includes(lang)
      ? "rtl"
      : "ltr";
  }, [lang]);

  const value = useMemo(() => {
    const current = LANGUAGES.find((item) => item.code === lang) || LANGUAGES.find((item) => item.code === "en");
    const t = (key) => dictionaries[lang]?.[key] || dictionaries.en[key] || key;
    return { lang, setLang, t, current };
  }, [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => useContext(I18nContext);
