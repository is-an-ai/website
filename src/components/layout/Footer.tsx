import { useTranslation } from "react-i18next";
import { GITHUB_REPOSITORY_URL, DOMAIN_SUFFIX } from "@/lib/constants";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-sm font-mono font-semibold text-gray-900 mb-2">
              is-an.ai
            </h3>
            <p className="text-xs text-gray-600 max-w-md font-mono">
              {t("footer.tagline", { domain: DOMAIN_SUFFIX })}{" "}
              <a
                href={GITHUB_REPOSITORY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:no-underline"
              >
                {t("footer.contributeGithub")}
              </a>
            </p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center text-xs font-mono text-gray-500">
          <p>{t("footer.openSource")}</p>
          <div className="flex items-center gap-4">
            <a
              href="mailto:security@is-an.ai"
              className="underline hover:no-underline"
              target="_blank"
            >
              {t("footer.reportAbuse")}
            </a>
            <p className="mt-2 md:mt-0">
              {t("footer.inspiredBy")}{" "}
              <a
                href="https://is-a.dev"
                className="underline hover:no-underline"
                target="_blank"
              >
                is-a.dev
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
