# ReturnEasy | Self-Service Returns Center

ReturnEasy is a sleek, responsive customer portal designed to simplify the e-commerce return process. Customers can view their recent orders, submit structured return requests, and track refund progress in real-time with an elegant step-by-step progress stepper.

This project was built for **Round 2** of the Cedcoss technical assessment.

## Key Features

- **Dashboard Overview**: Glassmorphic stats cards showing Total Orders, Delivered, Returns Requested, and Refunds Issued.
- **Dynamic Order History**: Automatically lists seed orders, featuring rich product imagery and custom HSL status badges.
- **Filtering Controls**: Seamless tab controls to toggle between All, Delivered, and active Returns/Refunds.
- **Interactive Multi-Step Return Request Form**:
  - **Item Selection**: Customers can select specific products to return and specify the returning quantity.
  - **Conditional Rules**: When selecting "Damaged", the form dynamically renders a photos/proof upload dropzone.
  - **Form Validation**: Checks that at least one item is selected and that proof is provided for damaged products.
  - **Submission Confirmation**: Renders a custom checkmark SVG drawing animation and summary notes on success.
- **Bonus Feature (Return Status Tracker)**: An interactive progress timeline (Ordered → Requested → Approved → Refund Processed) mapped dynamically to the order's state.
- **Admin Control Simulator**: A collapsible overlay panel allowing reviewers to simulate backend transitions (Approving returns and Processing refunds) and see UI changes updated in real-time.
- **State Persistence**: Synced with the browser's `localStorage` to ensure data persists through page reloads.

---

## Tech Stack & Architecture

- **Structure**: Semantic HTML5.
- **Styles**: Custom Vanilla CSS3. Incorporates modern layout principles (CSS Grid & Flexbox), transition effects, dynamic variables, and custom SVG animations.
- **Logic**: Vanilla ES6+ JavaScript. Implements state tracking, local storage, validation routines, event bubbling, and dynamic template rendering.
- **Fonts & Typography**: Imported `Outfit` (for headings) and `Inter` (for body text) from Google Fonts for a high-end interface.

---

## How to Run the Project

1. **Clone/Download** the repository files to your computer.
2. Locate and open [index.html](file:///Users/sparshkothari/Desktop/Ecommerce/index.html) directly in any modern web browser (Google Chrome, Safari, Firefox, Microsoft Edge, etc.) by double-clicking it.
3. No build step, node installations, or server setups are required!

---

## Tools Used

- **Antigravity AI**: Assisted in structural layouts, drafting CSS styling systems, checking Javascript form validations, and writing the documentation.
- **Google Fonts API**: For the Inter and Outfit typographies.
- **Unsplash API**: Used for placeholder product images.
- **Browser Developer Tools**: For real-time testing of CSS grid layouts and state logging.
