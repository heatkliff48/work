import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '#i18n/index.js';

function LanguageSwitcher() {
  const { t, i18n } = useTranslation();

  return (
    <div className="bb-lang" role="group" aria-label={t('language')}>
      {SUPPORTED_LANGUAGES.map(({ code, label, name }) => (
        <button
          key={code}
          type="button"
          title={name}
          className={`bb-lang-btn ${
            i18n.resolvedLanguage === code ? 'bb-active' : ''
          }`}
          aria-pressed={i18n.resolvedLanguage === code}
          onClick={() => i18n.changeLanguage(code)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default LanguageSwitcher;
