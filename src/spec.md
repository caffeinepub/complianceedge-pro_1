# Specification

## Summary
**Goal:** Prepare the Trade Import page’s Manual Entry tab for entering a single trade via a functional, validated form and managing entries in-session.

**Planned changes:**
- Replace the Manual Entry tab empty state on `frontend/src/pages/data-entry/TradeImportPage.tsx` with a responsive form containing labeled inputs for: client_code, trade_date, exchange, segment, security, side, quantity, price, order_id, trade_id.
- Add client-side validation with clear inline error messages for required fields, date validity (trade_date), positive numeric inputs (quantity, price), and an explicit allowed set for side (e.g., Buy/Sell).
- Add an in-page, session-only list/table that shows submitted trades (including the collected fields), supports removing entries, and resets the form after successful add.
- Add a non-blocking informational callout in the Manual Entry tab noting that entries are currently kept in-page and not persisted to the backend.

**User-visible outcome:** Users can manually enter a trade on the Trade Import Manual Entry tab, get immediate validation feedback, add valid entries to an on-page list, remove entries, and see a note that the workflow is UI-only for now.
