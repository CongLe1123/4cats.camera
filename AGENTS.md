# AGENTS.md

## Project overview

This project is a **Camera Store Website** offering two main services:

1. **Camera Rental & Camera Sale** (Rent or buy available cameras)
2. **Camera Ordering / Proxy Buying Service**
   (Customers request a camera model, the store purchases it on their behalf, adds a service fee, and ships it.)

The website must visually follow a **cute, pastel, Instagram-style aesthetic** inspired by the provided reference image.

Target users include **students, content creators, travelers, beginners, and casual photographers**.

---

## Design & style requirements

### Visual aesthetic

- Pastel pink dominant theme
- Cute, playful, cozy look
- Rounded corners on cards, buttons, and inputs
- Soft shadows
- Sticker-style icons and camera illustrations
- Light grid or tiled background

### Typography

- Rounded sans-serif fonts
- Friendly and simple wording
- Playful micro-copy

### Tone

- Friendly and trustworthy
- Non-technical
- Beginner-friendly

---

## Website structure & pages

### Homepage

- Hero headline:

  - **“Rent, Buy, or Order Your Perfect Camera”**

- Primary CTAs:

  - **Rent a Camera**
  - **Buy a Camera**
  - **Order a Camera**

- Short explanation of services:

  - Rent cameras easily for short-term use
  - Buy ready-to-use cameras directly from the store
  - Request any camera model and get it shipped

---

### Camera rental & sale page

This page supports **camera rental** and **direct camera sales**.

- Camera listing cards:

  - Image
  - Model name
  - Condition (New / Like New / Used)
  - Rental price (per day)
  - Sale price (if available)
  - **Rent Now** button
  - **Buy Now** button

- Filter options:

  - Rent only / Buy only / Both
  - Brand
  - Budget range

- Rent & buy process section:

  **Rental**

  1. Choose a camera
  2. Select rental dates
  3. Pay & receive

  **Purchase**

  1. Choose a camera
  2. Confirm price & condition
  3. Pay & ship

- Rental deposit and usage policy displayed clearly

- Clear notice when a camera is **sale-only**, **rent-only**, or **both**

---

### Camera ordering / proxy buying page

This page allows users to **request the purchase of any camera** not currently listed for sale.

- Order request form fields:

  - Camera brand
  - Camera model (or product link)
  - Condition (new / used)
  - Budget range
  - Preferred store (optional)
  - Shipping address
  - Contact information
  - Notes or special requests

- Explanation section:

  - “You tell us the camera you want”
  - “We purchase it for you”
  - “We handle checking & communication”
  - “We ship it to your address”

- Clear notice:

  - Camera price + service fee + shipping cost
  - Transparent pricing confirmation before purchase

---

### Pricing & policies

- Rental pricing rules (daily rate, late fees)

- Deposit details and refund conditions

- Camera sale policy (condition grading, warranty if any)

- Proxy buying service fee explanation

- Refund and cancellation policies for:

  - Rentals
  - Direct purchases
  - Proxy buying orders

- Simple, friendly language (no legal jargon)

---

### Contact page

- Social-media-first layout
- Instagram-style cards
- Chat buttons (Messenger / WhatsApp / Zalo)
- Friendly call-to-action text

---

## Dev environment tips

- Use `pnpm create vite@latest <project_name> -- --template react-ts`

- Prefer Tailwind CSS for pastel UI styling

- Build reusable UI components:

  - Product cards (rent & sale variants)
  - Forms
  - Buttons
  - Price tags & condition badges

- Keep spacing, colors, and border radius consistent with the design theme

---

## Testing instructions

- Test rental, purchase, and order forms thoroughly
- Validate form submissions and edge cases
- Ensure clear distinction between rent vs buy flows
- Ensure mobile-first responsiveness
- Run before merge:

  - `pnpm lint`
  - `pnpm test`

---

## PR instructions

- Title format: `[camera-store] <Title>`

- UI changes must follow the pastel/cute style guide

- Avoid sharp edges, dark themes, or aggressive colors

- Always run:

  - `pnpm lint`
  - `pnpm test`

- Include screenshots for UI changes when possible
