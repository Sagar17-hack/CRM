# 🏢 Room CRM — Google Sheets + Apps Script Automation

A fully functional, automation-driven CRM system built using **Google Sheets** and **Google Apps Script**, developed by **Sagar Chakre**.  
Room CRM helps small hospitality or property teams manage enquiries, automate follow-ups, and visualize live booking pipelines — all without paid CRM tools.

---

## 🚀 Features

✅ **Google Form Integration**
- Captures enquiries from Google Forms into the “Enquiry Capture” sheet.  
- Automatically generates enquiry IDs (EQ-XXX).

✅ **Automated Status Flow**
- Moves enquiries across stages:  
  **New Enquiry → Waiting List → Proposal / Negotiation → Advance Payment Sent**  
- Updates rows instantly on form submissions or edits.

✅ **WhatsApp Messaging Integration**
- Sends instant WhatsApp notifications via Apps Script.  
- Supports automatic updates to team groups or customers.

✅ **Dynamic Dashboards**
- `Tab View` shows a color-coded pipeline of all active enquiries.  
- `Enquiry View` displays a detailed summary card for each enquiry.  
- Visualizes live data from the Sheets backend.

✅ **Reports & Automation**
- Generates daily summaries automatically.  
- Detects and flags lost bookings.  
- Uses time-based triggers for daily automation.

✅ **Zero Third-Party CRM**
- 100% powered by **Google Sheets + Apps Script** — lightweight, fast, and free.

---

## 🧩 Project Structure

| Folder / File | Description |
|----------------|-------------|
| `Status.js` | Handles status updates and form triggers |
| `LostBooking.js` | Detects lost or inactive enquiries |
| `EditFormLink.js` | Generates editable Google Form URLs |
| `Daily summary.js` | Produces daily summaries |
| `Date Validation.js` | Ensures booking dates are valid |
| `dropdown.js` | Manages dropdown lists dynamically |
| `test whatpp.js` | Handles WhatsApp integration logic |
| `appsscript.json` | Google Apps Script project configuration |
| `data/Room CRM - Enquiry Capture.csv` | Sample Sheet data backup |
| `dashboard screenshot/Enquriy view.pgn.png` | Screenshot of detailed enquiry view |
| `dashboard screenshot/tab view.pgn.jpg` | Screenshot of main dashboard view |

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Sagar17-hack/CRM.git
