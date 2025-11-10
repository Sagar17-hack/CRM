function sendEnquiryToWhatsAppGroup(row) {
  const SHEET_NAME = "Enquiry Capture";


  const API_URL = "https://gate.whapi.cloud/messages/text";
  const API_KEY = "your Api";
  const GROUP_ID =" you group id";

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);

  const lastRow = row || sheet.getLastRow();


  let status = sheet.getRange(lastRow, 26).getValue();
  let attempts = 0;
  const maxAttempts = 20; 

  while (
    (!status ||
      status === "-" ||
      status.toString().trim() === "" ||
      status.toString().toLowerCase() === "not updated") &&
    attempts < maxAttempts
  ) {
    Utilities.sleep(1000); // wait 1s between checks
    attempts++;
    SpreadsheetApp.flush(); 
    status = sheet.getRange(lastRow, 26).getValue();
    Logger.log(`⏳ Waiting for Status... attempt ${attempts}, value: ${status}`);
  }

  SpreadsheetApp.flush();
  Utilities.sleep(500);
  const values = sheet.getRange(lastRow, 1, 1, 28).getValues()[0];
  const latestStatus = sheet.getRange(lastRow, 26).getValue(); // final guaranteed value

  const [
    timestamp, enquiryNumber, customerName, enquirySource, followUpBy, phone, email,
    property, checkIn, checkOut, rooms, rateOffered, taxes, notes, pax, children,
    customerType, stage, softwareConfNo, advanceReceived, amount, paymentMode,
    photoOfAdvance, reasonForLost, totalAmount
  ] = values;

  const formatDate = (d) => {
    if (Object.prototype.toString.call(d) === "[object Date]" && !isNaN(d)) {
      return Utilities.formatDate(d, Session.getScriptTimeZone(), "dd-MMM-yyyy");
    }
    return d || "-";
  };

  // 💬 Base message
  let message =
    `📩 New Enquiry Received:\n\n` +
    `Enquiry Number:- ${enquiryNumber || "-"}\n` +
    `Name:- ${customerName || "-"}\n` +
    `Source:- ${enquirySource || "-"}\n` +
    `Follow Up by:- ${followUpBy || "-"}\n` +
    `Phone:- ${phone || "-"}\n` +
    `Email:- ${email || "-"}\n\n` +
    `Check-in:- ${formatDate(checkIn)}\n` +
    `Check-out:- ${formatDate(checkOut)}\n` +
    `Rooms:- ${rooms || "-"}\n` +
    `Rate:- ${rateOffered || "-"}\n` +
    `Taxes:- ${taxes || "-"}\n` +
    `Total Amount:- ₹${totalAmount || "-"}\n` +
    `Pax:- ${pax || "-"} | Child:- ${children || "-"}\n` +
    `Stage:- ${stage || "-"}\n\n` +
    `Notes:- ${notes || "-"}\n\n` ;
    
  if (stage === "Confirm With Advance") {
    message +=
      `Software Confirmation No:- ${softwareConfNo || "-"}\n` +
      `Advance Received?:- ${advanceReceived || "Yes"}\n` +
      `Amount:- ₹${amount || "-"}\n` +
      `Payment Mode/Date:- ${paymentMode || "-"}\n`;
  } else if (stage === "Confirm Without Advance") {
    message +=
      `Software Confirmation No:- ${softwareConfNo || "-"}\n` +
      `Advance Received?:- No\n`;
  } else if (stage === "Lost") {
    message += `Reason for Lost:- ${reasonForLost || "-"}\n`;
  } else {
    message += `Advance Received?:- ${advanceReceived || "No"}\n`;
  }


  message +=
    `Status:- ${latestStatus || "(Not Updated)"}`;

  // Prepare payload for WHAPI
  const payload = { to: GROUP_ID, body: message };
  const headers = {
    "Authorization": `Bearer ${API_KEY}`,
    "Content-Type": "application/json"
  };
  const options = {
    method: "POST",
    headers,
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    const response = UrlFetchApp.fetch(API_URL, options);
    const result = response.getContentText();
    Logger.log("📤 Response: " + result);

    if (response.getResponseCode() === 200 || result.includes("sent")) {
      sheet.getRange(lastRow, 28).setValue("Sent ✔");
    } else {
      sheet.getRange(lastRow, 28).setValue("Failed ❌");
    }
  } catch (error) {
    Logger.log("❌ Error: " + error.message);
    sheet.getRange(lastRow, 28).setValue("Error ❌");
  }
}
