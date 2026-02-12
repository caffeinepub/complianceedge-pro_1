# Specification

## Summary
**Goal:** Add downloadable CSV sample templates to relevant data-entry modules and publish an in-app “How to use this platform” guide accessible from the dashboard.

**Planned changes:**
- Add four CSV sample templates as static public frontend assets under a downloadable path (e.g., `/assets/samples/`): trade-import-sample.csv, bank-reconciliation-sample.csv, client-bulk-upload-sample.csv, margin-snapshot-sample.csv.
- Add “Download sample file” links/buttons in each relevant page that point to the corresponding static CSV URL: Trade Import, Bank Reconciliation, Client Management, and Margin & Collateral.
- Create a new “How to use this platform” guide view/page with scannable headings/sections in English, and add a prominent entry point from the dashboard (Overview) that navigates to it using the existing router setup.

**User-visible outcome:** Users can download the correct CSV template directly from each upload-related module, and can open a readable “How to use this platform” guide from the dashboard.
