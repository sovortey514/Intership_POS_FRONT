import { KHQR, CURRENCY, COUNTRY, TAG } from "ts-khqr";
const API_URL = "http://localhost:6060/auth";
export async function getBakongQR(amountDue) {
 
  if (isNaN(amountDue) || amountDue <= 0) {
    throw new Error("Invalid amount provided.");
  }
   const amountWithTax = parseFloat((amountDue * 1.05).toFixed(2));
  try {
    const result = KHQR.generate({
      tag: TAG.INDIVIDUAL, 
      accountID: "sovortey_sorporn@aclb",
      merchantName: "VTFOOD", 
      merchantID: "087609971", 
      acquiringBank: "AC Bank",  
      merchantCity: "Phnom Penh", 
      currency: CURRENCY.USD, 
      amount: amountWithTax,  
      countryCode: COUNTRY.KH,  
      additionalData: {
        mobileNumber: "855087609971",  
        billNumber: "INV-2022-12-25",  
        storeLabel: "VTFoodShop",
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

export const Paymentbakong = async (paymentData) => {
  try {
    const response = await fetch(`${API_URL}/processwithbakong`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
       body: JSON.stringify(paymentData),
    });


    if (!response.ok) {
      const errorMessage = await response.json();
      console.error("Error Payment:", errorMessage);
      throw new Error(errorMessage.message || "Failed to Payment.");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error Payment:", error);
    throw new Error(error.message || "An unknown error occurred.");
  }
};

export const sendTelegramMessage = async (message) => {
  const telegramApiUrl = `https://api.telegram.org/bot7128384877:AAHUWtKgeZ0ZayZxoSeVPpsAdtDp5mc0IPk/sendMessage`;

  const payload = {
    chat_id: '1040676915',
    text: message,
  };

  try {
    await fetch(telegramApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

export const sendPdfToTelegram = async (pdfBlob, fileName) => {
  const formData = new FormData();

  // Convert the Blob to a File with a filename and correct MIME type
  const pdfFile = new File([pdfBlob], fileName, { type: "application/pdf" });

  formData.append('chat_id', 1040676915);
  formData.append('document', pdfFile);

  const telegramApiUrl = `https://api.telegram.org/bot7128384877:AAHUWtKgeZ0ZayZxoSeVPpsAdtDp5mc0IPk/sendDocument`;

  try {
    const response = await fetch(telegramApiUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.statusText}`);
    }

    console.log('✅ PDF sent to Telegram successfully.');
  } catch (error) {
    console.error('❌ Telegram API error:', error);
    throw error;
  }
};

