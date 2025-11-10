function markLostBookings() {
  const SHEET_NAME = "Enquiry Capture";
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) return;

  const data = sheet.getDataRange().getValues();
  const header = data[0];

  const statusCol = header.indexOf("Status") + 1;
  const checkInCol = header.indexOf("Check-in Date") + 1;
  const reasonCol = header.indexOf("Specify Reason for Lost") + 1;
  const editLinkCol = header.indexOf("Edit Form Link") + 1;

  if (statusCol === 0 || checkInCol === 0 || reasonCol === 0 || editLinkCol === 0) {
    Logger.log("❌ Error: Required columns not found. Check header names.");
    return;
  }

  const tz = Session.getScriptTimeZone();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // normalized "today" at midnight

  let updatedCount = 0;

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const status = (row[statusCol - 1] || "").toString().trim();
    const checkInRaw = row[checkInCol - 1];
    const checkInDate = parseDateSafeTwo(checkInRaw);

    if (!checkInDate || status === "Lost") continue;

    // 🧠 Normalize check-in date (ignore time)
    const checkInDay = new Date(checkInDate.getFullYear(), checkInDate.getMonth(), checkInDate.getDate());

    // ✅ Only mark as lost if check-in date is strictly before today
    if (status.toLowerCase() === "pending" && checkInDay.getTime() < today.getTime()) {
      const statusCell = sheet.getRange(i + 1, statusCol);
      const reasonCell = sheet.getRange(i + 1, reasonCol);
      const editLinkCell = sheet.getRange(i + 1, editLinkCol);

      // Update fields and styling
      statusCell.setValue("Lost");
      reasonCell.setValue("Expired - Not Converted in Time");
      statusCell.setBackground("#e05151").setFontColor("#ffffff");
      editLinkCell.clearContent();

      updatedCount++;
    }
  }

  Logger.log(`✅ Updated ${updatedCount} rows as Lost, cleared edit links, and highlighted status.`);
}

// === Safe and flexible date parser ===
function parseDateSafeTwo(input) {
  if (!input) return null;

  if (input instanceof Date && !isNaN(input)) {
    return new Date(input.getFullYear(), input.getMonth(), input.getDate());
  }

  if (typeof input === "string") {
    const parts = input.split(/[-\/]/).map(p => p.trim());
    if (parts.length === 3) {
      const [a, b, c] = parts;
      if (a.length === 4) return new Date(+a, +b - 1, +c); // yyyy-mm-dd
      return new Date(+c, +b - 1, +a); // dd-mm-yyyy
    }
  }

  return null;
}
