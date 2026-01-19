/**
 * GOOGLE SHEETS APPS SCRIPT
 * 
 * HƯỚNG DẪN SỬ DỤNG:
 * 1. Mở Google Sheets của bạn
 * 2. Chọn Extensions > Apps Script
 * 3. Xóa code mặc định và paste toàn bộ code này vào
 * 4. Chọn Deploy > New deployment
 * 5. Chọn type: Web app
 * 6. Execute as: Me
 * 7. Who has access: Anyone
 * 8. Click Deploy và copy URL
 * 9. Paste URL vào file src/utils/rsvpSubmission.ts
 */

function doPost(e) {
  try {
    // Get the active spreadsheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the incoming data
    var data = JSON.parse(e.postData.contents);
    
    // If this is the first entry, add headers
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp',
        'Name',
        'Email',
        'Attending',
        'Guest Count',
        'Message',
        'Template'
      ]);
      
      // Format header row
      var headerRange = sheet.getRange(1, 1, 1, 7);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#C29B43');
      headerRange.setFontColor('#FFFFFF');
    }
    
    // Add the new row
    sheet.appendRow([
      data.submittedAt || new Date().toISOString(),
      data.name || '',
      data.email || '',
      data.attending || '',
      data.guestCount || 0,
      data.message || '',
      data.template || ''
    ]);
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, 7);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'RSVP submitted successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function (optional)
function testDoPost() {
  var testData = {
    postData: {
      contents: JSON.stringify({
        name: 'Nguyễn Văn A',
        email: 'test@example.com',
        attending: 'yes',
        guestCount: 2,
        message: 'Chúc mừng cô dâu chú rể!',
        template: 'Luxury Gold Cinematic',
        submittedAt: new Date().toISOString()
      })
    }
  };
  
  var result = doPost(testData);
  Logger.log(result.getContent());
}
