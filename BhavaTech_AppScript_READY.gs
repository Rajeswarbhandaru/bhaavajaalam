// ============================================================
// Bhāva Tech — Google Apps Script
// Paste THIS entire code into Code.gs in Apps Script
// Sheet: Bhāva Tech Student Records (already created ✅)
// ============================================================

const SHEET_NAME = "Student Records";
const SHEET_ID   = "1uQI4ElNefSmFzvjGRsJsX3-Kbk_eFuGIJ-ZgluFwoSU";  // ✅ Your Sheet ID — already set!

function doPost(e) {
  try {
    const data  = JSON.parse(e.postData.contents);
    const ss    = SpreadsheetApp.openById(SHEET_ID);
    let   sheet = ss.getSheetByName(SHEET_NAME);

    // Auto-create sheet with headers if first time
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      const headers = [
        "Timestamp","Student ID","Full Name","Age","Grade","School",
        "Screen Time (hrs/day)","Sleep (hrs/night)","Academic Level",
        "Parent Name","Relation","Parent Occupation","Phone",
        "Visit Date","Status",
        "G1","G2","G3","G4","G5","G6","G7",
        "C1","C2","C3","C4","C5",
        "E1","E2","E3","E4","E5","E6",
        "P1","P2","P3","P4","P5",
        "GASA Total /35","IQ Score /25","EQ Score /30","Physical /25",
        "Risk Level","Program Assigned","Sessions Done","Notes"
      ];
      sheet.appendRow(headers);
      sheet.getRange(1,1,1,headers.length)
        .setBackground("#00858c")
        .setFontColor("#ffffff")
        .setFontWeight("bold");
      sheet.setFrozenRows(1);
    }

    const idNum     = Date.now() % 9999;
    const studentId = "BT" + String(idNum).padStart(4,"0");
    const timestamp = new Date().toISOString();

    sheet.appendRow([
      timestamp, studentId,
      data.name, data.age, data.grade, data.school,
      data.screenT, data.sleep, data.acad,
      data.parentName, data.parentRel, data.parentOcc, data.parentPhone,
      data.visitDate, "Active",
      data.g1||"", data.g2||"", data.g3||"", data.g4||"", data.g5||"", data.g6||"", data.g7||"",
      data.c1||"", data.c2||"", data.c3||"", data.c4||"", data.c5||"",
      data.e1||"", data.e2||"", data.e3||"", data.e4||"", data.e5||"", data.e6||"",
      data.p1||"", data.p2||"", data.p3||"", data.p4||"", data.p5||"",
      data.gasaTotal, data.cogTotal, data.eqTotal, data.phyTotal,
      data.riskLevel, data.program, 0, data.notes||""
    ]);

    // Optional: email alert for new assessment
    // MailApp.sendEmail("bhaavatech@gmail.com",
    //   "New Assessment: " + data.name,
    //   "Risk: " + data.riskLevel + " | Parent: " + data.parentPhone
    // );

    return ContentService
      .createTextOutput(JSON.stringify({ status:"ok", id:studentId }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status:"error", msg:err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput("✅ Bhāva Tech Assessment API is running.")
    .setMimeType(ContentService.MimeType.TEXT);
}
