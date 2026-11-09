/**
 * IVR Prompts Dictionary (Hindi & English)
 * Automated voice prompts for KarWan keypad IVR system.
 * Designed to be read by TTS or mapped to pre-recorded wav/mp3 audio files.
 */

export const PROMPTS = {
  hi: {
    welcome:
      "Namaste! KarWan mein aapka swagat hai. Apni bhasha chunne ke liye 1 dabayein Hindi ke liye, 2 dabayein English ke liye.",
    mainMenu:
      "Naye transport booking ke liye 1 dabayein. Apne booking ki sthiti janne ke liye 2 dabayein. Sahayata ke liye 3 ya shunya dabayein. Is menu ko dobara sunne ke liye 9 dabayein.",
    askPickupPin:
      "Kripya apne pickup sthan ka 6 anko ka PIN code enter karein aur hash dabayein.",
    askDestPin:
      "Kripya delivery sthan ka 6 anko ka PIN code enter karein aur hash dabayein.",
    askParcelCategory:
      "Parcel ka aakar chunein: Chhote parcel ke liye 1 dabayein. Madhyam parcel ke liye 2 dabayein. Bade ya bulk carton ke liye 3 dabayein.",
    askParcelQuantity:
      "Kripya parcel ki sankhya enter karein aur hash dabayein. Jaise ek parcel ke liye 1 hash dabayein.",
    askPickupDate:
      "Pickup din chunein: Aaj ke pickup ke liye 1 dabayein. Kal ke pickup ke liye 2 dabayein. Parso ke liye 3 dabayein.",
    askPickupTime:
      "Pickup samay chunein: Subah 6 se 10 baje ke liye 1 dabayein. 8 se 12 baje ke liye 2 dabayein. Dopahar 12 se 4 baje ke liye 3 dabayein. Sham 4 se 8 baje ke liye 4 dabayein.",
    readbackIntro:
      "Aapki booking jaankari is prakar hai:",
    readbackConfirm:
      "Booking confirm karne ke liye 1 dabayein. Jaankari badalne ke liye 2 dabayein. Booking radd karne ke liye 3 dabayein.",
    bookingSuccess:
      "Dhanyavaad! Aapki KarWan booking safaltapoorvak darj ho gayi hai. Tracking number aapke mobile par SMS dwara bhej diya gaya hai.",
    bookingCancelled:
      "Aapki booking radd kar di gayi hai. KarWan se judne ke liye dhanyavaad.",
    invalidInput:
      "Aapka input galat hai. Kripya punah prayas karein.",
    maxRetriesExceeded:
      "Adhiktam prayas seema samapt. Kripya kuch samay baad call karein ya sahayata ke liye sampark karein.",
    humanAssistance:
      "Aapka call hamare customer support agent ko transfer kiya ja raha hai. Kripya line par bane rahein.",
    humanAssistanceQueued:
      "Sabhi agent vyast hain. Ek sahayata anurodh darj kar liya gaya hai. Hamara agent shighra hi aapse sampark karega.",
    statusLookupPrompt:
      "Kripya pratiksha karein, aapki active bookings ki jaanch ki ja rahi hai.",
    noActiveBookings:
      "Aapke is mobile number par koi active booking nahi mili.",
    statusReport:
      "Aapki consignment {trackingId} ka status hai: {statusText}. Corridor: {pickup} se {destination}.",
  },

  en: {
    welcome:
      "Welcome to KarWan. Press 1 for Hindi, or press 2 for English.",
    mainMenu:
      "Press 1 for a new transportation booking. Press 2 to check existing booking status. Press 3 for human assistance. Press 9 to repeat this menu.",
    askPickupPin:
      "Please enter your 6-digit pickup location PIN code followed by hash.",
    askDestPin:
      "Please enter the 6-digit destination PIN code followed by hash.",
    askParcelCategory:
      "Select parcel size: Press 1 for small crate or box. Press 2 for medium sacks. Press 3 for large or bulk freight.",
    askParcelQuantity:
      "Please enter the number of parcel units followed by hash. For example, press 1 hash for 1 parcel.",
    askPickupDate:
      "Select pickup date: Press 1 for today. Press 2 for tomorrow. Press 3 for day after tomorrow.",
    askPickupTime:
      "Select preferred pickup window: Press 1 for early morning 6 to 10 AM. Press 2 for morning 8 to 12 PM. Press 3 for afternoon 12 to 4 PM. Press 4 for evening 4 to 8 PM.",
    readbackIntro:
      "Here are your booking details:",
    readbackConfirm:
      "Press 1 to confirm your booking. Press 2 to modify details. Press 3 to cancel.",
    bookingSuccess:
      "Thank you! Your KarWan booking has been confirmed. A tracking SMS has been sent to your mobile phone.",
    bookingCancelled:
      "Your booking has been cancelled. Thank you for choosing KarWan.",
    invalidInput:
      "Invalid key pressed. Please try again.",
    maxRetriesExceeded:
      "Maximum attempts exceeded. Please call again later or contact our helpline.",
    humanAssistance:
      "Connecting your call to a customer support executive. Please stay on the line.",
    humanAssistanceQueued:
      "All operators are currently busy. A callback request has been logged. Our hub team will call you back shortly.",
    statusLookupPrompt:
      "Please hold while we check your active bookings.",
    noActiveBookings:
      "No active bookings were found for your mobile number.",
    statusReport:
      "Your consignment {trackingId} status is: {statusText}. Route: {pickup} to {destination}.",
  },
};

export const STATUS_DESCRIPTIONS = {
  hi: {
    pending_match: "Shared corridor matching jaari hai",
    assigned: "Driver assign ho chuka hai",
    picked_up: "Parcel hub se pick kar liya gaya hai",
    in_transit: "Gaadi destination mandi ki taraf rawana ho chuki hai",
    delivered: "Safaltapoorvak deliver ho chuka hai",
    cancelled: "Booking radd kar di gayi hai",
  },
  en: {
    pending_match: "Shared corridor route aggregation in progress",
    assigned: "Vehicle and driver assigned",
    picked_up: "Parcel verified and collected from pickup hub",
    in_transit: "Vehicle in transit to destination mandi",
    delivered: "Successfully delivered",
    cancelled: "Booking cancelled",
  },
};

export default {
  PROMPTS,
  STATUS_DESCRIPTIONS,
};

