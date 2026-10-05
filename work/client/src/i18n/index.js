import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { registerLocale } from 'react-datepicker';
import { enUS, es as esDateLocale } from 'date-fns/locale';

import enCommon from './locales/en/common.json';
import enRawMaterialsWarehouse from './locales/en/rawMaterialsWarehouse.json';
import enCasting from './locales/en/casting.json';
import esCommon from './locales/es/common.json';
import esRawMaterialsWarehouse from './locales/es/rawMaterialsWarehouse.json';
import esCasting from './locales/es/casting.json';

// Языки интерфейса. Чтобы добавить новый — положить переводы в locales/<code>
// и дописать язык сюда
export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'EN', name: 'English', dateLocale: enUS },
  { code: 'es', label: 'ES', name: 'Español', dateLocale: esDateLocale },
];

export const DEFAULT_LANGUAGE = 'en';

// react-datepicker: названия месяцев/дней на выбранном языке (<DatePicker locale={i18n.language} />)
SUPPORTED_LANGUAGES.forEach(({ code, dateLocale }) =>
  registerLocale(code, dateLocale),
);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        rawMaterialsWarehouse: enRawMaterialsWarehouse,
        casting: enCasting,
      },
      es: {
        common: esCommon,
        rawMaterialsWarehouse: esRawMaterialsWarehouse,
        casting: esCasting,
      },
    },
    ns: ['common', 'rawMaterialsWarehouse', 'casting'],
    defaultNS: 'common',
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES.map((l) => l.code),
    detection: {
      // выбранный пользователем язык хранится в localStorage, иначе — язык браузера
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'lang',
      caches: ['localStorage'],
      // 'es-ES' -> 'es'
      convertDetectedLanguage: (lng) => lng.split('-')[0],
    },
    interpolation: {
      escapeValue: false, // React сам экранирует
    },
  });

const syncHtmlLang = (lng) => {
  document.documentElement.lang = lng;
};
syncHtmlLang(i18n.language);
i18n.on('languageChanged', syncHtmlLang);

// Названия сырья приходят с сервера на английском и используются как ключи
// (material_type), поэтому переводим только при отображении.
// Тип с подтипом склада ('Aluminum|7040-10/70WB28') показываем как 'Aluminio (7040-10/70WB28)'
export const translateMaterial = (t, materialType) => {
  if (!materialType) return '';

  const [base, subtype] = String(materialType).split('|');
  const label = t(`materials.${base}`, { ns: 'common', defaultValue: base });

  return subtype ? `${label} (${subtype})` : label;
};

export default i18n;
