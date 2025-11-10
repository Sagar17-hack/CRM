function updateFormDropdowns() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Enquiry View");   

  
  var mainFormId = "1naObncMTWQoUAYs_QPMfSu7Vcg_RS_jAsRvmZST5JB8"; 
                   

  var lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    Logger.log("No data found in Mastersheet.");
    return;
  }

  
  var managers = sheet.getRange(2, 26, lastRow - 1, 1).getValues()
                     .map(r => r[0])
                     .filter(String);

  
  var mainForm = FormApp.openById(mainFormId);
  var mainItems = mainForm.getItems(FormApp.ItemType.LIST);
  mainItems.forEach(function(item) {
    var title = item.getTitle();
    if (title === "Select Enquiry No") {
      item.asListItem().setChoiceValues(managers);
    }
  
  });
}