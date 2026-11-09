# Velqora — Premium Rural Shared-Logistics Platform

> **“One Route. Many Businesses.”**  
> A production-quality, multi-persona shared freight aggregation platform engineered for rural Maharashtra (Baramati, Indapur, Daund, Shirur, Jejuri, and Phaltan).

---

## 🌟 Overview

Rural entrepreneurs, farmers, dairy unions, textile sellers, and grocery shops often pay for an entire tempo or truck (₹1,200–₹2,500) even when transporting a single small consignment (20–100 kg).

**Velqora** aggregates compatible parcels originating from nearby village clusters along shared highway corridors into one vehicle and calculates each parcel’s fair share of the load.

### Key Capabilities
- **Entrepreneur PWA App**: Book parcels, choose Shared Economy vs. Priority transport, view live savings, simulate UPI payments, and track shipments live on a dark night map.
- **Driver Partner PWA App**: Review available rural corridors, accept shipments, perform parcel verification at pickup, advance status through delivery, and audit earnings.
- **Admin Operations HQ**: Executive regional dashboard with real-time GMV and farmer savings KPIs, 5-rule Corridor Matching Engine, parcel item registry, carrier compliance management, interactive Recharts analytics, and a Keypad IVR Phone simulator.
- **Rural-First Infrastructure**: Standardized 3-letter village codes, landmarks, and registered pickup pins rather than brittle GPS road coordinates.
- **Tri-Lingual Localization**: Instant runtime switching across Marathi (मराठी), Hindi (हिंदी), and English.

---

## 🚀 Quick Setup & Run Instructions

### 1. Terminal Commands
```bash
# Clone or navigate to the project directory
cd velqora

# Install dependencies (already installed in the repository)
npm install

# Run the development server
npm run dev
```

The application will run locally at `http://localhost:5173/`.

### 2. Build & Production Validation
```bash
# Build production bundle with Vite
npm run build

# Preview production build locally
npm run preview
```

---

## 📁 Project Architecture & Folder Tree

```
velqora/
├── index.html
├── jsconfig.json
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
├── README.md
├── docs/
│   └── IDEA_LAB_REPORT.md             # Formal IDEA LAB Project Report
└── src/
    ├── App.css
    ├── App.jsx                        # Master multi-persona router & providers
    ├── index.css                      # Leaflet CSS, tokens, dark map tile filters
    ├── main.jsx                       # React 19 root bootstrap
    ├── assets/
    │   └── hero.png
    ├── components/
    │   ├── design/
    │   │   ├── BrandMark.jsx          # Extrabold logo wordmark & dot badge
    │   │   ├── EmptyState.jsx         # Accessible empty state container
    │   │   ├── InputBox.jsx           # Styled input component
    │   │   ├── LanguageSwitcher.jsx   # Live Marathi / Hindi / English toggle
    │   │   ├── LoadingState.jsx       # Pulse/spinner loading state
    │   │   ├── Modal.jsx              # Framer Motion accessible dialog
    │   │   ├── PillButton.jsx         # Coral, black, & ghost pill buttons
    │   │   ├── Screen.jsx             # Mobile stage container (max-w 460px)
    │   │   ├── ScreenHeader.jsx       # Back navigation & display header
    │   │   ├── SelectBox.jsx          # Dropdown selector
    │   │   ├── SplashOverlay.jsx      # Initial startup splash screen
    │   │   ├── StatusPill.jsx         # Color-coded status badge
    │   │   ├── StatusTimeline.jsx     # Chronological milestone timeline
    │   │   └── TabLayout.jsx          # Mobile bottom tab layout (Home, Bookings, Profile)
    │   ├── domain/
    │   │   ├── AdminStatCard.jsx      # Admin metric KPI card
    │   │   ├── AdminTable.jsx         # Reusable search table
    │   │   ├── BookingFormCard.jsx    # Consolidated parcel input card
    │   │   ├── BookingRow.jsx         # Consignment row with Track & Invoice CTAs
    │   │   ├── CapacityBar.jsx        # Vehicle load factor progress indicator
    │   │   ├── DriverCard.jsx         # Verified carrier profile & call card
    │   │   ├── FareEstimateCard.jsx   # Live savings & load factor estimate
    │   │   ├── InvoiceDialog.jsx      # Itemized tax & allocation invoice modal
    │   │   ├── PriceBreakup.jsx       # Base, allocation, extras, & tax summary
    │   │   ├── TrackingMap.jsx        # Leaflet night-mode route & vehicle map
    │   │   └── VehicleCard.jsx        # Mini Tempo, Pickup Van, Cargo Truck cards
    │   └── ui/                        # Re-exported headless primitives
    ├── contexts/
    │   ├── DataContext.jsx            # Mock backend, localStorage persistence, matching engine
    │   ├── LanguageContext.jsx        # Trilingual translation engine (MR/HI/EN)
    │   └── ProfileContext.jsx         # Auth state & rural enterprise profile
    ├── hooks/
    │   ├── useBookings.js
    │   ├── useProfile.js
    │   └── useTracking.js
    ├── lib/
    │   ├── draft.js                   # Session storage draft builder
    │   ├── fare.js                    # Deterministic fare calculation formula
    │   ├── mock-data.js               # 6 Villages, 12 Pickup Points, 3 Vehicles, 3 Drivers
    │   ├── storage.js                 # Safe localStorage wrapper
    │   ├── utils.js                   # Currency formatting & helpers
    │   └── api/
    │       ├── base44Adapter.js       # Base44 entity CRUD abstraction
    │       ├── matchingEngine.js      # 5-condition deterministic matching algorithm
    │       ├── paymentAdapter.js      # Simulated UPI & QR gateway
    │       ├── smsAdapter.js          # Simulated dispatch SMS notifications
    │       └── telephonyAdapter.js    # Rural keypad DTMF IVR booking simulator
    ├── pages/
    │   ├── auth/
    │   │   ├── ForgotPassword.jsx
    │   │   ├── Login.jsx              # Demo one-click & credential auth
    │   │   ├── Register.jsx
    │   │   └── ResetPassword.jsx
    │   ├── onboarding/
    │   │   ├── Language.jsx           # Language setup screen
    │   │   ├── ProfileSetup.jsx       # Enterprise & pickup point onboarding
    │   │   └── Welcome.jsx            # Full-bleed visual welcome screen
    │   ├── app/
    │   │   ├── BookingMode.jsx        # Shared Economy vs Priority mode selection
    │   │   ├── Bookings.jsx           # Active, Completed, Cancelled tabs
    │   │   ├── BookingSummary.jsx     # Route, parcel specs, & fare breakup
    │   │   ├── Home.jsx               # New shipment booking hero & calculator
    │   │   ├── Payment.jsx            # UPI gateway, QR code, and settlement
    │   │   ├── Profile.jsx            # Enterprise card, language switch, support
    │   │   └── Tracking.jsx           # Dark tracking screen, live map, driver card
    │   ├── driver/
    │   │   ├── DriverEarnings.jsx     # Payouts & settlement ledger
    │   │   ├── DriverHome.jsx         # On/Off duty toggle & available corridor runs
    │   │   ├── DriverProfile.jsx      # Carrier compliance & vehicle details
    │   │   └── DriverTripDetails.jsx  # QR verification & status advancement
    │   └── admin/
    │       ├── AdminAnalytics.jsx     # Recharts corridor volume & savings charts
    │       ├── AdminBookings.jsx      # Consignment master register & inspection
    │       ├── AdminDashboard.jsx     # Ops overview & matching engine trigger
    │       ├── AdminDrivers.jsx       # Driver compliance & suspension controls
    │       ├── AdminEntrepreneurs.jsx  # Directory of registered village enterprises
    │       ├── AdminIVR.jsx           # Keypad DTMF feature phone simulator
    │       ├── AdminParcels.jsx       # Granular parcel inventory
    │       ├── AdminPayments.jsx      # Escrow ledger & transaction receipts
    │       └── AdminSharedTrips.jsx   # Multi-shipper vehicle cluster views
    └── routes/
        ├── AdminRoute.jsx             # Admin sidebar & topbar layout
        ├── DriverRoute.jsx            # Driver mobile layout & bottom bar
        ├── ProtectedRoute.jsx         # Auth protection guard
        └── RequireProfile.jsx         # Profile setup redirection guard
```

---

## 💡 Deterministic Fare Calculation Engine

The system strictly executes the standard mathematical allocation formula defined in `src/lib/fare.js`:

1. **Routing Distance**:
   $$\text{distance\_km} = \text{round}\left(R \times c \times 1.25\right)$$
   *(Great-circle distance between village coordinates multiplied by 1.25 rural detour routing factor)*.
2. **Base Vehicle Charge**:
   $$\text{fare\_base} = \text{rate\_per\_km} \times \text{distance\_km}$$
3. **Shared Transport Allocation**:
   $$\text{shareRatio} = \min\left(0.75, 0.25 + 0.5 \times \frac{\text{weight\_kg}}{\text{capacity\_kg}}\right)$$
   $$\text{fare\_allocation} = \text{round}\left(\text{fare\_base} \times \text{shareRatio}\right)$$
4. **Additional Surcharges**:
   - Handling Fee: ₹30
   - Weight Surcharge: ₹20 per 5 kg above 10 kg
   $$\text{fare\_extras} = 30 + \text{surcharge}$$
5. **Tax & Total**:
   $$\text{fare\_tax} = 10\% \times (\text{fare\_allocation} + \text{fare\_extras})$$
   $$\text{fare\_total} = \text{fare\_allocation} + \text{fare\_extras} + \text{fare\_tax}$$
   $$\text{individual\_total} = \text{fare\_base} + \text{fare\_extras}$$
   $$\text{savings} = \text{individual\_total} - \text{fare\_total}$$

---

## 🧪 Demo Flow Walkthrough

### 1. Entrepreneur Flow (Mobile PWA)
1. Open `http://localhost:5173/` (Splash screen displays for 1.7s, then auto-transitions).
2. Click **Demo Login (Instant Access)** on `/login`.
3. In **Home**, specify:
   - Pickup Village: **Baramati** (Pickup Landmark: **Main Bazaar Pickup**).
   - Destination: **Phaltan**.
   - Weight: **35 kg** (Category: **Produce**).
   - Vehicle: **Mini Tempo**.
   - Notice the live estimate card updates dynamically showing: **Shared Fare**, **Savings**, and **Capacity Share Bar**.
4. Click **Continue** → `/booking/new`.
5. Select **Shared Economy** card (highlights savings badge).
6. Click **Continue** → `/booking/:id` (Review route, specs, price breakup, and rural pricing disclaimer).
7. Click **Continue to Payment** → `/booking/:id/pay`. Select UPI or QR, click **Pay Now**.
8. Automatically navigates to `/track/:id` (Dark premium interface with night map, polyline route, ETA, and progress timeline).

### 2. Driver Partner Flow
1. Navigate to `/driver` (or click "🚚 Driver App" from Login/Profile).
2. Toggle duty status between **On Duty** and **Off Duty**.
3. View **Available Rural Corridors** and click **Accept & Add to Route**.
4. In Trip Details (`/driver/trips/:id`):
   - Enter or click "Simulate Quick Barcode Scan" to verify physical parcel at pickup.
   - Click **Start Pickup Run** → **Confirm Parcel Picked Up** → **Depart on Route** → **Mark Delivered**.
   - Notice real-time status transitions and timeline event logs.
5. Visit `/driver/earnings` to review trip settlements and daily bank payout schedule.

### 3. Admin Operations HQ Flow
1. Navigate to `/admin` (or click "⚙️ Admin Dashboard" from any screen).
2. Overview shows high-level KPIs: **Total Bookings**, **Active Shipments**, **Settled Revenue**, and **Rural Savings**.
3. Click the coral **Run Matching Engine** button in the header or sidebar:
   - The engine automatically aggregates compatible pending shared bookings within 30 km pickup radius and 40 km destination corridor.
4. Explore **Shared Route Runs** (`/admin/shared-trips`) to inspect multi-shipper load consolidation and capacity progress bars.
5. Open **Analytics & KPIs** (`/admin/analytics`) to view Recharts charts for weekly revenue vs. savings, status distribution pie chart, and corridor volume.
6. Open **Keypad IVR Simulator** (`/admin/ivr`) to test feature phone telephone bookings via DTMF village codes without internet.

---

## 🎨 Design System Tokens

- **Primary Coral**: `#FF7958` (`bg-primary`, `text-primary`)
- **Secondary Warm Coral**: `#FF9E85` (`bg-primary-warm`)
- **Light Coral Wash**: `#FFF0EC` (`bg-primary-wash`)
- **Ink Black**: `#202020` (`bg-ink`, `text-ink`)
- **Off-White Canvas**: `#F7F7F7` (`bg-canvas`)
- **Muted Gray**: `#858585` (`text-muted`)
- **Hairline Border**: `#E8E8E8` (`border-hairline`)
- **Destructive Red**: `#D92D20` (`text-destructive`, `bg-destructive`)
- **Typography**: Manrope for headings (500–800) and Inter for body copy.
- **Card Shadow**: `0 20px 44px -28px rgba(17,17,17,0.30)` (`shadow-card`)
- **Border Radius**: `1.25rem` (`rounded-lg`)
