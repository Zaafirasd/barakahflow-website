# BarakaFlow MVP — Build Instructions
## Get the core product on my phone. Nothing else.

---

## WHAT WE'RE BUILDING

A Progressive Web App (PWA) with 4 working features:
1. **Auth** — Sign up, sign in, stay signed in
2. **Onboarding Quiz** — Set up income, bills, budget, Zakat preference
3. **Dashboard** — See your money at a glance (pre-populated from quiz)
4. **Manual Transaction Entry** — Tap +, enter amount, pick category, save

That's it. No AI, no reports, no Arabic, no receipt scanning, no multi-currency, no family mode. Those come later, one by one, after this works.

**End result:** A Vercel URL I open on my Android phone, tap "Add to Home Screen," and it's an app.

---

## TECH STACK

| What | Tool |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS |
| Database + Auth | Supabase |
| Animations | Framer Motion |
| Icons | Lucide React |
| Hosting | Vercel (free tier) |

---

## STEP 1: PROJECT SETUP

### 1.1 — Create the project

```
Create a new Next.js 14 project called "barakaflow" with TypeScript, Tailwind CSS, App Router, and src/ directory.

Install these packages:
- framer-motion
- lucide-react
- @supabase/supabase-js
- @supabase/ssr
- next-themes
- date-fns

Create this folder structure:
src/
  app/
    (auth)/
      signin/page.tsx
      signup/page.tsx
    (onboarding)/
      onboarding/page.tsx
    (dashboard)/
      dashboard/page.tsx
      transactions/page.tsx
      layout.tsx           → bottom tab bar layout
    layout.tsx             → root layout
    page.tsx               → redirect to signin or dashboard
  components/
    ui/                    → Button, Card, Input, BottomSheet
    onboarding/            → quiz step components
    dashboard/             → dashboard card widgets
    transactions/          → transaction list, add transaction
  lib/
    supabase/
      client.ts            → browser Supabase client
      server.ts            → server Supabase client
      middleware.ts         → auth session handling
    constants/
      categories.ts        → default category list
      bill-templates.ts    → UAE bill templates
      currencies.ts        → supported currencies
  types/
    index.ts               → TypeScript types
  styles/
    globals.css            → base styles
```

### 1.2 — Set up Supabase

```
Walk me through creating a Supabase project at supabase.com step by step. I've never done this.

Once I have the URL and anon key, create .env.local:
NEXT_PUBLIC_SUPABASE_URL=<url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<key>

Set up the Supabase client files:
- src/lib/supabase/client.ts (browser client)
- src/lib/supabase/server.ts (server client)  
- src/lib/supabase/middleware.ts (auth session refresh)
```

### 1.3 — Create database tables

```
Write SQL to create these tables in Supabase. UUIDs for all IDs. Timestamps on everything.

USERS:
- id (uuid, references auth.users)
- email (text)
- name (text)
- primary_currency (text, default 'AED')
- financial_month_start_day (integer 1-28, default 1)
- monthly_income (decimal, nullable)
- zakat_enabled (boolean, default false)
- zakat_anniversary_date (date, nullable)
- onboarding_completed (boolean, default false)
- created_at, updated_at

ACCOUNTS:
- id (uuid)
- user_id (uuid, references users)
- name (text, default 'Main Account')
- type (text, default 'cash')
- currency (text, default 'AED')
- opening_balance (decimal, default 0)
- is_active (boolean, default true)
- created_at

NOTE: No "balance" column. Balance = opening_balance + sum of transactions. Always calculated, never stored.

CATEGORIES:
- id (uuid)
- user_id (uuid, nullable — null = system default)
- name (text)
- type (text — 'income' or 'expense')
- icon (text — lucide icon name)
- color (text — hex)
- is_system (boolean, default false)
- is_islamic (boolean, default false)
- sort_order (integer)
- created_at

TRANSACTIONS:
- id (uuid)
- user_id (uuid, references users)
- account_id (uuid, references accounts)
- category_id (uuid, references categories)
- amount (decimal — positive for income, negative for expense)
- merchant_name (text, nullable)
- description (text, nullable)
- date (date)
- type (text — 'income' or 'expense')
- created_at, updated_at

BUDGETS:
- id (uuid)
- user_id (uuid, references users)
- category_id (uuid, references categories)
- amount (decimal)
- is_active (boolean, default true)
- created_at, updated_at

BILLS:
- id (uuid)
- user_id (uuid, references users)
- name (text)
- amount (decimal)
- due_day (integer 1-28)
- frequency (text — 'monthly' or 'quarterly' or 'annual')
- is_active (boolean, default true)
- next_due_date (date)
- created_at, updated_at

Then enable Row Level Security on ALL tables. Each user can only read/write their own rows (WHERE user_id = auth.uid()). Categories: users can also read system defaults (WHERE user_id IS NULL).
```

### 1.4 — Seed default categories

```
Write SQL INSERT statements for default categories (user_id = NULL, is_system = true):

EXPENSE:
- Housing (rent/mortgage) — Home icon — #6366F1
- Utilities (DEWA, internet, phone) — Zap icon — #F59E0B
- Groceries & Food — ShoppingCart icon — #22C55E
- Dining Out — UtensilsCrossed icon — #F97316
- Transportation — Car icon — #3B82F6
- Healthcare — Heart icon — #EF4444
- Education — GraduationCap icon — #8B5CF6
- Clothing — Shirt icon — #EC4899
- Entertainment — Gamepad2 icon — #14B8A6
- Subscriptions — CreditCard icon — #6366F1
- Government & Fees — Building icon — #64748B
- Miscellaneous — MoreHorizontal icon — #94A3B8

ISLAMIC (is_islamic = true):
- Zakat Al-Mal — HandCoins icon — #10B981
- Zakat Al-Fitr — HandCoins icon — #10B981
- Sadaqah — HeartHandshake icon — #10B981
- Hajj/Umrah — Plane icon — #10B981
- Eid Expenses — Gift icon — #10B981

INCOME:
- Salary — Banknote icon — #22C55E
- Freelance — Laptop icon — #3B82F6
- Business Revenue — TrendingUp icon — #10B981
- Other Income — Plus icon — #64748B
```

---

## STEP 2: AUTHENTICATION

### 2.1 — Signup page

```
Create a signup page at src/app/(auth)/signup/page.tsx:

- Clean centered card on a dark gradient background (#0F172A to #1E1B4B)
- BarakaFlow text logo at top (just styled text: "بركة فلو" with "BarakaFlow" below)
- Email input field
- Password input field (with show/hide toggle)
- Confirm password field
- "Create Account" button (emerald green #10B981)
- "Already have an account? Sign In" link
- Form validation: email format, password min 8 chars, passwords match
- Loading state on submit button
- Error messages below inputs
- On successful signup: create row in users table with email, then redirect to /onboarding
- Use Supabase Auth signUp method
```

### 2.2 — Signin page

```
Create a signin page at src/app/(auth)/signin/page.tsx:

- Same design as signup
- Email + password inputs
- "Sign In" button
- "Don't have an account? Sign Up" link
- On success: check if onboarding_completed is true
  - If yes → redirect to /dashboard
  - If no → redirect to /onboarding
- Handle errors: wrong password, account not found
- Use Supabase Auth signInWithPassword
```

### 2.3 — Auth middleware

```
Set up auth middleware:
- Protect /dashboard, /transactions, /onboarding — must be signed in
- Redirect signed-out users to /signin
- Redirect signed-in users away from /signin and /signup
- Handle Supabase session refresh automatically
- Root page "/" checks auth: if signed in go to /dashboard, if not go to /signin
```

**CHECK:** Sign up → lands on /onboarding. Sign out → lands on /signin. Visit /dashboard while signed out → redirected to /signin.

---

## STEP 3: ONBOARDING QUIZ

### 3.1 — Build the quiz as one page with steps

```
Create the onboarding quiz at src/app/(onboarding)/onboarding/page.tsx.

This is a single page with a currentStep state variable (1 through 7). Each step transitions with a slide animation using Framer Motion.

Top of every step: a progress bar showing step X of 7.
Back button on all steps except step 1.

STEP 1 — WELCOME:
- "بركة فلو" large text
- "Bismillah. Let's set up your finances." subtitle
- "Get Started" button

STEP 2 — BASIC INFO:
- "What's your name?" text input
- "What's your currency?" dropdown (AED default, also: USD, SAR, KWD, BHD, QAR, OMR, EGP, INR, PKR, GBP, EUR)
- "What day do you get paid?" number picker 1-28
  Helper text: "If your salary comes on the 25th, pick 25"
- "Continue" button

STEP 3 — INCOME:
- "What's your monthly income?" large number input with currency symbol
- "Continue" button

STEP 4 — BILLS:
- "Set up your regular bills"
- Pre-made UAE bill template buttons: DEWA, Etisalat, du, Rent (Ejari), Salik, Car Insurance, Health Insurance
- Tapping one opens fields: amount + due day (1-28)
- Added bills appear as a list below (can remove)
- "+ Add custom bill" button (name + amount + due day)
- "Skip" link and "Continue" button

STEP 5 — BUDGET:
- "How do you want to budget?"
- Option A: "Set it up for me"
  Auto-splits income: 50% Needs, 25% Wants, 15% Savings, 10% Giving
  Shows the amounts calculated from their income
- Option B: "I'll do it myself" (skip budget setup for now)
- "Continue" button

STEP 6 — ZAKAT:
- "Do you want to track Zakat?"
- Yes/No toggle
- If yes: date picker for Zakat anniversary (just a simple date input)
- "Continue" button

STEP 7 — DONE:
- Checkmark animation
- "You're all set!"
- Summary showing: name, income, number of bills, budget style, Zakat on/off
- "Enter BarakaFlow" button

WHEN "Enter BarakaFlow" IS TAPPED — save everything to Supabase:
1. Update users row: name, currency, financial_month_start_day, monthly_income, zakat_enabled, zakat_anniversary_date, onboarding_completed = true
2. Create a default "Main Account" in accounts table
3. Insert bills into bills table (with next_due_date calculated)
4. If budget option A chosen: create budget rows for main categories
5. Redirect to /dashboard

If any save fails: show error message with retry button. Don't lose the data.
```

**CHECK:** Complete the quiz end to end. All data appears in Supabase tables. Back button works. Skip on bills works.

---

## STEP 4: DASHBOARD

### 4.1 — Bottom tab bar layout

```
Create the dashboard layout at src/app/(dashboard)/layout.tsx:

A bottom tab navigation bar fixed to the bottom of the screen:
- Home tab (LayoutDashboard icon) — links to /dashboard
- Transactions tab (ArrowLeftRight icon) — links to /transactions
- Add button (Plus icon) — center position, emerald green (#10B981) circular button, slightly larger than other tabs
- Budget tab (PieChart icon) — placeholder page for now
- More tab (Menu icon) — placeholder page for now

Active tab: emerald color icon + label
Inactive tab: gray icon + label
The tab bar has a dark glass background
Content area scrolls above the tab bar
Padding at bottom for phones with navigation bars
```

### 4.2 — Dashboard page

```
Create the dashboard at src/app/(dashboard)/dashboard/page.tsx:

Fetch user data and transactions from Supabase on load. Show loading skeletons while fetching.

GREETING:
- "Assalamu Alaikum, {name}" with today's date (formatted nicely)

CARD 1 — THIS MONTH'S OVERVIEW:
- "This Month" label
- Income total (green) — sum of income transactions this financial month
- Expenses total (red) — sum of expense transactions this financial month  
- Net: income minus expenses
- If no transactions yet: "No transactions this month. Tap + to start tracking."

CARD 2 — BUDGET STATUS:
- A simple progress bar showing total spent vs total budgeted
- "X AED of Y AED budget used"
- "Z AED remaining"
- If no budgets: "No budget set up yet"

CARD 3 — UPCOMING BILLS:
- Next 3 bills due (sorted by next_due_date)
- Each shows: name, amount, "Due in X days"
- If no bills: "No bills tracked"

CARD 4 — ZAKAT (only show if zakat_enabled = true):
- "Zakat due in X days" (calculated from anniversary date)
- Simple countdown, nothing fancy

Cards should be styled with rounded corners, subtle borders, slight background tint — clean and readable on dark background. Don't overdo transparency effects on data cards.

Financial month calculation: use the user's financial_month_start_day. If start day is 25, then "this month" runs from the 25th of last month to the 24th of this month.
```

**CHECK:** Dashboard loads after onboarding. Shows bills from quiz. Shows budget from quiz. Greeting shows name. Cards display correctly on mobile.

---

## STEP 5: ADD TRANSACTION

### 5.1 — The "+" button action

```
When the user taps the "+" button in the center of the tab bar, open a full-screen slide-up panel (or a new page that slides up from the bottom).

THE ADD TRANSACTION SCREEN:

TOP: Two tabs/toggle — "Expense" (selected by default) and "Income"

AMOUNT INPUT:
- Large centered number input
- Currency symbol prefix (from user's currency setting)
- Big font, easy to type on phone
- Auto-format with commas (1,250.00)

CATEGORY GRID:
- Show categories from the database matching the selected type (expense or income)
- Display as a scrollable grid: icon + name for each
- Tapping one selects it (highlight with emerald border)
- Islamic categories (Zakat, Sadaqah, etc.) appear at the end of the expense list

OPTIONAL FIELDS (visible but not required):
- Merchant/description text input (e.g., "Carrefour" or "Monthly rent")
- Date picker (defaults to today)

SAVE BUTTON:
- "Add Transaction" button at the bottom (emerald green, full width)
- Disabled until amount > 0 and a category is selected

ON SAVE:
1. Insert into transactions table:
   - amount: positive if income, negative if expense
   - type: 'income' or 'expense'
   - user_id, account_id (default account), category_id, merchant_name, date
2. Close the panel
3. Show a brief success message: "Transaction added"
4. If user is on dashboard, it should reflect the new numbers

QUICK FLOW: Amount → Category → Save. Three taps to log a transaction.
```

### 5.2 — Transaction list page

```
Build the transactions page at src/app/(dashboard)/transactions/page.tsx:

Show all transactions for the current financial month, sorted by date (newest first).

TOP: "This Month" label with total count

TRANSACTION LIST:
- Grouped by date (Today, Yesterday, March 25, etc.)
- Each transaction row shows:
  Left: category icon in a small colored circle
  Middle: merchant name or category name (if no merchant) + category below in smaller gray text
  Right: amount (green if income, red if expense)
- Tapping a transaction shows a simple detail view or bottom sheet with:
  Full details + "Delete" button
  
DELETE:
- Confirm dialog: "Delete this transaction?"
- On confirm: delete from Supabase, list refreshes

EMPTY STATE:
- "No transactions yet. Tap + to add your first one."

Keep it simple. No search, no filters, no edit for now. Just view and delete.
```

**CHECK:** Add a transaction via +. It appears in the list. Dashboard numbers update. Delete works.

---

## STEP 6: DEPLOY TO PHONE

### 6.1 — Push to GitHub and Vercel

```
Walk me through these steps. I've never done any of this before:

1. Create a GitHub account (if I don't have one)
2. Install Git (if not installed)
3. Create a new repository called "barakaflow"
4. Connect my local project to GitHub:
   - git init
   - git add .
   - git commit -m "MVP ready"
   - git remote add origin <repo-url>
   - git push -u origin main
5. Go to vercel.com, sign up with GitHub
6. Import the barakaflow repo
7. Add environment variables:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
8. Deploy

Explain every single command and click. Assume I know nothing.
```

### 6.2 — PWA setup for Android

```
Make my Next.js app installable on Android as a PWA:

1. Create a public/manifest.json:
   - name: "BarakaFlow"
   - short_name: "BarakaFlow"  
   - start_url: "/"
   - display: "standalone"
   - background_color: "#0F172A"
   - theme_color: "#10B981"
   - icons: create a simple placeholder icon (or tell me how to add one)

2. Add the manifest link to the root layout <head>

3. Add a basic service worker for caching (so the app shell loads fast)

4. Add meta tags for mobile:
   - viewport
   - apple-mobile-web-app-capable
   - theme-color

After deploying to Vercel, when I open the URL on my Android phone in Chrome, I should see "Add to Home Screen" option. When I tap it, the app icon appears on my home screen and opens like a native app (no browser bar).
```

**CHECK:** Open Vercel URL on phone → Chrome shows "Add to Home Screen" → tap it → app icon on home screen → opens full screen → sign up works → quiz works → dashboard shows data → can add transactions.

---

## WHAT WE HAVE AFTER THIS

A real app on your phone that:
- Lets you sign up and sign in
- Walks you through setting up your finances (income, UAE bills, budget, Zakat preference)
- Shows a dashboard with your money overview, upcoming bills, and Zakat countdown
- Lets you log income and expenses in 3 taps
- Shows your transaction history

## WHAT WE ADD NEXT (one at a time, after this works)

Each of these is a separate small project, not a mega-plan:
1. Edit transactions (tap to edit, not just delete)
2. Budget page (see budget vs actual per category)
3. Bill reminders (mark bills as paid)
4. Savings goals
5. Zakat calculator
6. Reports and charts
7. CSV export
8. Arabic language
9. Dark/light mode toggle
10. ...everything else from the big plan

But first: get THIS working on your phone.

---

## TROUBLESHOOTING

When something breaks (it will):
1. Copy the FULL error message
2. Paste it into your AI tool and say: "I got this error. Here's what I was trying to do: [describe]. Fix it."
3. If the fix breaks something else: `git checkout .` to undo and try again
4. Before every new step: `git add . && git commit -m "step X done"` so you can always go back

When you're stuck:
- Describe what you see on screen vs what you expected
- Include which file you're working on
- Include the last thing you changed

---

*This is the whole plan. 6 steps. Get it on your phone. Then we iterate.*
