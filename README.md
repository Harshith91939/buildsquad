# BuildSquad 🚀 | NxtWave Student Growth Campaign

BuildSquad is a growth campaign web application crafted for the **NxtWave Growth Intern Assignment**. It models and drives a simulated 7-day viral acquisition sprint targeting **500 unique student registrations** under a strict **₹2,000 budget cap** (Target CAC = **₹4.00 per student**).

---

## 🛠 Technology Stack

- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS** (Custom dark-mode aesthetic with student tech branding)
- **React Router (v6)** (Client-side routing across all four primary views)
- **Recharts** (Visualizing cumulative registration velocity, pacing trajectory, and channel CAC)
- **@supabase/supabase-js** (Supabase client strictly utilizing publishable/anon keys)
- **Lucide React** (Icons)

---

## 🔒 Security & Database Integrity

In strict adherence to assignment requirements:
1. **Zero Service-Role Key Exposure**: Only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are accessed in browser code.
2. **Untouched Database Schema**: Existing tables (`registrations`, `ambassadors`, `campaign`) and stored procedures remain unaltered.
3. **RPC Boundary**:
   - `register_student(p_name, p_email, p_college, p_year, p_ref, p_channel)`: Handles transactional registration, generating unique referral codes and returning duplicate collision notices without exposing private table writes.
   - `get_registrations_public()`: Returns only anonymized telemetry (`created_at`, `referral_code`, `source_channel`, `is_demo`). Student PII (name, email) is never exposed to the frontend.
4. **Environment Safety**: `.gitignore` strictly blocks all `.env*` files from version control.

---

## 🗺 Application Routes

- `/` — **Registration Landing Page**: Value propositions, live progress bar, atomic registration form with referral and channel capture, and instant squad sharing modal.
- `/ambassador` — **Ambassador Hub & Leaderboard**: Milestone rewards ladder (Bronze, Silver, Gold), unique code lookup/generator, 1-click WhatsApp/LinkedIn share kits, and ranked captain leaderboard.
- `/dashboard` — **Campaign Performance Analytics**: Real-time KPI cards, ₹2,000 budget burn tracking, effective CAC calculation, daily velocity area chart vs target trajectory, channel distribution, and viral $K$-factor loop metrics.
- `/about` — **Strategic Framework & Unit Economics**: In-depth documentation of student personas, ₹4.00 CAC unit economics, attribution model, security posture, and demo simulation mode.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional for Live DB)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Populate your Supabase project credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-anon-key
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

---

## 💡 Demo Simulation Mode
If the application is launched without Supabase credentials or when live records are empty, BuildSquad automatically runs in **Demo Simulation Mode**. You can also toggle this mode at any time using the header badge to evaluate real-time analytics with 382 simulated student records across 5 sprint days.

