// function updateDateValidation() {
//   const form = FormApp.getActiveForm();
//   const dateQuestionTitle = "Check-in Date"; // Change to your date field
//   const items = form.getItems(FormApp.ItemType.DATE);
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   for (const item of items) {
//     if (item.getTitle() === dateQuestionTitle) {
//       const dateItem = item.asDateItem();
//       dateItem.setHelpText("Please select today or a future date.");
//       dateItem.setValidation(
//         FormApp.createDateValidation()
//           .requireDateOnOrAfter(today)
//           .build()
//       );
//     }
//   }
// }
