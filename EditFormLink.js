function onFormSubmit(e) {
  try {
    const FORM_ID = 'Form id';
    const SHEET_NAME = 'Enquiry Capture';
    const STATUS_COL = 26;     // Column Y
    const EDIT_LINK_COL = 27;  // Column Z

    const sheet = e.range.getSheet();


    if (sheet.getName() !== SHEET_NAME) {
      Logger.log(` Ignored form submission from sheet: ${sheet.getName()}`);
      return;
    }

    const row = e.range.getRow();


    Utilities.sleep(2000);


    const status = sheet.getRange(row, STATUS_COL).getValue().toString().trim().toLowerCase();


    const form = FormApp.openById(FORM_ID);
    const responses = form.getResponses();
    const response = responses[responses.length - 1];
    const editUrl = response.getEditResponseUrl();

    // === Logic based on Status ===
    if (status === 'pending') {
      sheet.getRange(row, EDIT_LINK_COL).setValue(editUrl);
    } else if (['confirmed', 'lost'].includes(status)) {
      sheet.getRange(row, EDIT_LINK_COL).clearContent();
    }

  } catch (err) {
    Logger.log(` Error in onFormSubmit (EditLink.gs): ${err}`);
  }
}


