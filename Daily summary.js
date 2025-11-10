
function sendDailySummaryToWhatsApp() {
  const SHEET_NAME = "Enquiry Capture";
  const API_URL = "https://gate.whapi.cloud/messages/text";
  const API_KEY = "your api";
  const GROUP_ID = "id"; 


  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();

  const IST = "Asia/Kolkata";
  const today = new Date();
  const todayStr = Utilities.formatDate(today, IST, "yyyy-MM-dd");

  let earlierPending = 0;
  let newEnquiries = 0;
  let convertedToday = 0;
  let lostToday = 0;
  let totalPending = 0;

  // Column indexes (0-based)
  const TIMESTAMP_COL = 0;  // timestamp
  const STAGE_COL = 17;     // Stage
  const STATUS_COL = 25;    // Status

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const timestamp = row[TIMESTAMP_COL];
    if (!(timestamp instanceof Date)) continue;

    const dateStr = Utilities.formatDate(timestamp, IST, "yyyy-MM-dd");
    const stage = String(row[STAGE_COL] || "").trim().toLowerCase();
    const status = String(row[STATUS_COL] || "").trim().toLowerCase();

    // Count totals
    if (status.includes("pending")) totalPending++;

    // Earlier pending
    if (status.includes("pending") && dateStr < todayStr) earlierPending++;

    // New enquiries today
    if (stage.includes("new enquiry") && dateStr === todayStr) newEnquiries++;

    // Converted today
    if (status.includes("confirmed") && dateStr === todayStr) convertedToday++;

    // Lost today
    if (status.includes("lost") && dateStr === todayStr) lostToday++;
  }

  // Message body
  const message =
    `📊 *Daily Summary*\n\n` +
    `Earlier Pending Enquiries : ${earlierPending}\n` +
    `New Enquiries Received today : ${newEnquiries}\n` +
    `Enquiries Converted Today : ${convertedToday}\n` +
    `Enquiries Lost today : ${lostToday}\n` +
    `Total Pending Enquiries : ${totalPending}`;

  // Send to WhatsApp group
  const payload = {
    to: GROUP_ID,
    body: message,
  };

  const options = {
    method: "post",
    contentType: "application/json",
    headers: { Authorization: `Bearer ${API_KEY}` },
    payload: JSON.stringify(payload),
  };

  UrlFetchApp.fetch(API_URL, options);
  Logger.log("✅ Daily summary sent successfully:\n" + message);
}




