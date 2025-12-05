/**
 * Rechnungs-Konfiguration - Lopez IT Welt
 * 
 * Zentrale Konfiguration für Firmendaten und Bankverbindung
 * Verwendet in der PDF-Generierung für Rechnungen v1.0
 */

export const INVOICE_COMPANY = {
  name: "Lopez IT Welt",
  owner: "Ramiro Lopez Rodriguez",
  address: "Alte Bahnhofstraße 13",
  city: "31515 Wunstorf",
  phone: "+49 (0) 5031 7005576",
  email: "info@lopez-it-welt.de",
  website: "https://www.lopez-it-welt.de",
  vatId: "DE264851464",
} as const;

export const INVOICE_BANK = {
  accountHolder: "Lopez IT Welt",
  iban: "DE89 3704 0044 0532 0130 00",
  bic: "COBADEFFXXX",
  bank: "Commerzbank AG",
} as const;

export const INVOICE_PAYMENT_TERMS_DEFAULT = "Zahlbar innerhalb 14 Tage ohne Abzug";



