# Specification

## Summary
**Goal:** Restore predictable visibility and behavior of the margin upload area on the Margin & Collateral page for users without upload permissions, and fix file-picker issues caused by duplicate DOM ids.

**Planned changes:**
- Update the Margin Snapshots tab to always render the upload card/section container, even when the user lacks the `manage_margin` capability.
- When `manage_margin` is missing, show an in-place English message indicating the user does not have permission to upload margin/collateral data and must contact an admin; ensure upload controls are disabled or not actionable.
- Remove DOM id collisions in `BulkUploadSection` by generating a unique file input id per instance so multiple sections on the same page work independently (e.g., Margin Snapshots and Pledged Securities).

**User-visible outcome:** Users who can view Margin & Collateral but cannot manage margin will still see the upload area with a clear permission message, and the “Choose File” control will reliably open the correct file picker in both Margin Snapshots and Pledged Securities.
