# AGENTS.md

## Project overview

This project is a **Camera Store Website** offering two main services:

1. **Camera Rental**
2. **Camera Ordering / Proxy Buying Service**
   (Customers request a camera model, the store purchases it on their behalf, adds a service fee, and ships it.)

The website must visually follow a **cute, pastel, Instagram-style aesthetic** inspired by the provided reference image.

Target users include **students, content creators, travelers, beginners, and casual photographers**.

---

## Design & style requirements

- **Visual aesthetic**

  - Pastel pink dominant theme
  - Cute, playful, cozy look
  - Rounded corners on cards, buttons, and inputs
  - Soft shadows
  - Sticker-style icons and camera illustrations
  - Light grid or tiled background

- **Typography**

  - Rounded sans-serif fonts
  - Friendly and simple wording
  - Playful micro-copy

- **Tone**

  - Friendly and trustworthy
  - Non-technical
  - Beginner-friendly

---

## Website structure & pages

### Homepage

- Hero headline:

  - **“Rent or Order Your Perfect Camera”**

- Primary CTAs:

  - **Rent a Camera**
  - **Order a Camera**

- Short explanation of both services:

  - Rent cameras easily
  - Request any camera model and get it shipped

---

### Camera rental page

- Camera listing cards:

  - Image
  - Model name
  - Daily rental price
  - “Rent Now” button

- Rental process section:

  1. Choose a camera
  2. Select rental dates
  3. Pay & receive

- Deposit and rental policy displayed clearly

---

### Camera ordering / proxy buying page

This page allows users to **request the purchase of any camera**.

- Order request form fields:

  - Camera brand
  - Camera model (or link to product)
  - Condition (new / used)
  - Budget range
  - Preferred store (optional)
  - Shipping address
  - Contact information
  - Notes or special requests

- Explanation section:

  - “You tell us the camera you want”
  - “We purchase it for you”
  - “We ship it to your address”
  - “Service fee applied on top of camera price”

- Clear notice:

  - Camera price + service fee + shipping cost
  - Transparent pricing communication before purchase

---

### Pricing & policies

- Rental pricing rules
- Deposit details
- Proxy buying service fee explanation
- Refund and cancellation policies
- Simple and friendly language (no legal jargon)

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

  - Product cards
  - Forms
  - Buttons

- Keep spacing, colors, and border radius consistent with the design theme

---

## Testing instructions

- Test rental and order forms thoroughly
- Validate form submissions and edge cases
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
