import { KHQR, CURRENCY, COUNTRY, TAG } from "ts-khqr";

export async function getBakongQR(amountDue) {
  if (isNaN(amountDue) || amountDue <= 0) {
    throw new Error("Invalid amount provided.");
  }

  try {
    const result = KHQR.generate({
      tag: TAG.INDIVIDUAL,
      accountID: "sovatey_sorporn@acld",
      merchantName: "VTFOOD",
      merchantID: "087609971",
      acquiringBank: "AC Bank",
      merchantCity: "Phnom Penh",
      currency: CURRENCY.USD,
      amount: amountDue,
      countryCode: COUNTRY.KH,
      additionalData: {
        mobileNumber: "855087609971",
        billNumber: "INV-2022-12-25",
        storeLabel: "Ishin Shop",
        terminalLabel: "012345",
        purposeOfTransaction: "Payment",
      },
      languageData: {
        languagePreference: "ZH",
        merchantNameAlternateLanguage: "文山",
        merchantCityAlternateLanguage: "金边",
      },
      upiMerchantAccount: "",
    });

    return result.data;  
  } catch (error) {
    console.error("Error generating Bakong QR code:", error);
    throw new Error("Failed to generate QR code.");
  }
}
