"use client";
import { useI18n } from "../../components/Features/I18nProvider";

export default function Impressum() {
  const { t } = useI18n();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">{t("impressum.titel")}</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("impressum.angaben_tmg")}</h2>
        <div className="bg-hellgrau dark:bg-dunkelgrau p-4 rounded-lg">
          <p className="font-semibold">Ramiro Lopez Rodriguez</p>
          <p>Lopez IT Welt</p>
          <p>Alte Bahnhofstraße 13</p>
          <p>31515 Wunstorf</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("impressum.rechtsform")}</h2>
        <p className="mb-4">{t("impressum.rechtsform_text")}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("impressum.kontakt")}</h2>
        <div className="bg-hellgrau dark:bg-dunkelgrau p-4 rounded-lg">
          <p>
            <strong>Telefon:</strong> +49 (0) 5031 7005576
          </p>
          <p>
            <strong>E-Mail:</strong> info@lopez-it-welt.de
          </p>
          <p>
            <strong>Website:</strong> https://www.lopez-it-welt.de
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("impressum.umsatzsteuer")}</h2>
        <p className="mb-2">{t("impressum.umsatzsteuer_text")}</p>
        <p className="font-semibold mb-4">{t("impressum.umsatzsteuer_nummer")}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("impressum.berufshaftpflicht")}</h2>
        <p className="mb-4">{t("impressum.berufshaftpflicht_text")}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("impressum.verantwortlich")}</h2>
        <div className="bg-hellgrau dark:bg-dunkelgrau p-4 rounded-lg">
          <p className="font-semibold">Ramiro Lopez Rodriguez</p>
          <p>Alte Bahnhofstraße 13</p>
          <p>31515 Wunstorf</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("impressum.berufsbezeichnung")}</h2>
        <p className="mb-2">{t("impressum.berufsbezeichnung_text")}</p>
        <p className="mb-2">{t("impressum.berufsbezeichnung_land")}</p>
        <p className="mb-2">{t("impressum.berufsbezeichnung_verleihung")}</p>
        <p className="mb-2">
          {t("impressum.berufsbezeichnung_gesetz")}
          <a
            href={t("impressum.berufsbezeichnung_gesetz_link")}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blau hover:underline ml-1"
          >
            {t("impressum.berufsbezeichnung_gesetz_link")}
          </a>
        </p>
        <p className="mb-2">{t("impressum.berufsbezeichnung_aufsicht")}</p>
        <p className="mb-2">{t("impressum.berufsbezeichnung_aufsicht_adresse")}</p>
        <p className="mb-2">
          <a
            href={t("impressum.berufsbezeichnung_aufsicht_web")}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blau hover:underline"
          >
            {t("impressum.berufsbezeichnung_aufsicht_web")}
          </a>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("impressum.streitschlichtung")}</h2>
        <p className="mb-2">{t("impressum.streitschlichtung_text")}</p>
        <p className="mb-2">
          <a
            href={t("impressum.streitschlichtung_link")}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blau hover:underline"
          >
            {t("impressum.streitschlichtung_link")}
          </a>
        </p>
        <p className="mb-2">{t("impressum.streitschlichtung_email")}</p>
        <p className="mb-2">{t("impressum.verbraucherstreit")}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("impressum.haftung")}</h2>
        <p className="mb-4">{t("impressum.haftung_text")}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("impressum.haftung_links")}</h2>
        <p className="mb-4">{t("impressum.haftung_links_text")}</p>
        <p className="mb-4">{t("impressum.haftung_links_entfernung")}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("impressum.urheberrecht")}</h2>
        <p className="mb-4">{t("impressum.urheberrecht_text")}</p>
        <p className="mb-4">{t("impressum.urheberrecht_fremd")}</p>
      </section>
    </div>
  );
}
