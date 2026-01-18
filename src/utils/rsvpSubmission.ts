// RSVP Submission Utility
// Gửi dữ liệu RSVP vào Google Sheets

export interface RSVPFormData {
  name: string;
  email?: string;
  attending: 'yes' | 'no';
  guestCount: number;
  message?: string;
  template?: string; // Tên template được sử dụng
  submittedAt?: string; // Thời gian submit
}

// ⚠️ THAY ĐỔI URL NÀY BẰNG GOOGLE SHEETS WEB APP URL CỦA BẠN
// Hướng dẫn tạo Google Sheets Web App:
// 1. Mở Google Sheets
// 2. Extensions > Apps Script
// 3. Paste code từ file googleSheetsScript.gs
// 4. Deploy > New deployment > Web app
// 5. Copy URL và paste vào đây
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbzOeL_AXd9hBEQ19yC01K757pzbhfp80kMp0FbP3j7wzx4whJgKlEofjYay49uGDJjP/exec';
/**
 * Submit RSVP data to Google Sheets
 * @param formData - RSVP form data
 * @returns Promise<boolean> - Success status
 */
export async function submitRSVP(formData: RSVPFormData): Promise<boolean> {
  try {
    // Add timestamp
    const dataWithTimestamp = {
      ...formData,
      submittedAt: new Date().toISOString(),
    };

    // Send to Google Sheets
    const response = await fetch(GOOGLE_SHEETS_URL, {
      method: 'POST',
      mode: 'no-cors', // Important for Google Sheets Web App
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataWithTimestamp),
    });

    // With no-cors mode, we can't read the response
    // So we assume success if no error is thrown
    console.log('✅ RSVP submitted successfully:', dataWithTimestamp);
    return true;
  } catch (error) {
    console.error('❌ Error submitting RSVP:', error);
    return false;
  }
}

/**
 * Submit RSVP with fallback to local storage if API fails
 * @param formData - RSVP form data
 * @returns Promise<boolean> - Success status
 */
export async function submitRSVPWithFallback(formData: RSVPFormData): Promise<boolean> {
  try {
    // Try to submit to Google Sheets
    const success = await submitRSVP(formData);
    
    // Also save to local storage as backup
    saveToLocalStorage(formData);
    
    return success;
  } catch (error) {
    console.error('Error in RSVP submission:', error);
    // Still save to local storage
    saveToLocalStorage(formData);
    return false;
  }
}

/**
 * Save RSVP to local storage as backup
 * @param formData - RSVP form data
 */
function saveToLocalStorage(formData: RSVPFormData): void {
  try {
    const key = `rsvp_${Date.now()}`;
    localStorage.setItem(key, JSON.stringify(formData));
    console.log('💾 RSVP saved to local storage:', key);
  } catch (error) {
    console.error('Error saving to local storage:', error);
  }
}

/**
 * Get all RSVPs from local storage
 * @returns Array of RSVP data
 */
export function getLocalRSVPs(): RSVPFormData[] {
  try {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('rsvp_'));
    return keys.map(key => {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    }).filter(Boolean);
  } catch (error) {
    console.error('Error reading from local storage:', error);
    return [];
  }
}
