# Specification

## Summary
**Goal:** Fix Trade Import file selection and implement an end-to-end trade import that persists uploaded trade data and shows it in the UI.

**Planned changes:**
- Fix the Trade Import > Upload File “Browse Files” control to open the native file picker and confirm the selected filename (works in Chrome-based browsers and Safari).
- Implement frontend parsing for supported trade files and validate required columns/values; show clear English errors with row numbers when validation fails.
- Submit validated trade rows to the backend for batch persistence.
- Add backend APIs to store and list imported trades with existing auth restrictions and write an audit entry for successful imports.
- Wire the Trade Import “Import History” tab (or a section within it) to fetch and display persisted imported trades in a table, including after page reload.

**User-visible outcome:** Users can select and upload a trade file, see clear validation feedback, get a success confirmation with the number of trades imported, and view the persisted imported trades in Import History even after refreshing.
