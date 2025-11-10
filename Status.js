
const SHEET_NAME = "Enquiry Capture";
const STATUS_COL = 26;      
const SOFTWARE_COL = 19;    
const ADVANCE_COL = 20;     
const CHECKIN_COL = 9;      
const STAGE_COL = 18;       


function onFormSubmitTrigger(e) {
  const sheet = e.range.getSheet();
  if (sheet.getName() !== SHEET_NAME) return;

  handleRowUpdate(e);
  SpreadsheetApp.flush();

  Utilities.sleep(6000);

  sendEnquiryToWhatsAppGroup(e.range.getRow());
}


function onEditTrigger(e) {
  const sheet = e.range.getSheet();

  if (sheet.getName() !== SHEET_NAME) return;

  handleRowUpdate(e);
}



function handleRowUpdate(e) {
  try {
    const sheet = e.range.getSheet();
    if (sheet.getName() !== SHEET_NAME) return;

    const row = e.range.getRow();
    if (row < 2) return;

    updateStatusRow(sheet, row);
    Logger.log(` Status updated for row ${row}`);

  } catch (err) {
    Logger.log(` Error in handleRowUpdate: ${err}`);
  }
}


// === Update Status of a Single Row ===
function updateStatusRow(sheet, row) {
  const values = sheet.getRange(row, 1, 1, STATUS_COL).getValues()[0];

  const stageValue = (values[STAGE_COL - 1] || "").toString().trim().toLowerCase();
  const softwareValue = (values[SOFTWARE_COL - 1] || "").toString().trim();
  const advanceValue = (values[ADVANCE_COL - 1] || "").toString().trim().toLowerCase();
  const checkinRaw = values[CHECKIN_COL - 1];
  const checkinDate = parseDateSafe(checkinRaw);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const advanceTruthy = ["yes", "y", "true", "paid", "1"];

  // === Logic ===
  let status = "Pending";
  let bg = "#fff2cc"; // Yellow
  let font = "#000000";

  if (stageValue === "lost") {
    status = "Lost";
    bg = "#e05151"; // Red
    font = "#ffffff";
  } 
  else if (softwareValue) {
    status = "Confirmed";
    bg = "#b6d7a8"; // Green
  } 
  else if (advanceTruthy.includes(advanceValue)) {
    status = "Confirmed";
    bg = "#b6d7a8"; // Green
  } 
  else if (checkinDate && checkinDate < today) {
    status = "Lost";
    bg = "#e05151"; // Red
    font = "#ffffff";
  }

  
  const cell = sheet.getRange(row, STATUS_COL);
  cell.setValue(status);
  cell.setBackground(bg);
  cell.setFontColor(font);
  cell.setHorizontalAlignment("center");
  cell.setVerticalAlignment("middle");
  SpreadsheetApp.flush();
}



function parseDateSafe(input) {
  if (!input) return null;
  if (input instanceof Date && !isNaN(input))
    return new Date(input.getFullYear(), input.getMonth(), input.getDate());
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
