# Specification

## Summary
**Goal:** Make it clear to authenticated users when they are not using the configured bootstrap admin email, so they understand why Super Admin rights are not granted and how to fix it.

**Planned changes:**
- Add a prominent, persistent warning banner in the main authenticated app shell when `userProfile` exists and `userProfile.email` is not exactly `"sanjeev.vohra@gmail.com"`, including both the current saved email and the expected admin email, plus next steps to update/save Profile email and use “Refresh Profile” to re-check.
- Ensure the banner is hidden when `userProfile.email` exactly matches `"sanjeev.vohra@gmail.com"` (case-sensitive) and when the profile setup dialog is shown due to `userProfile === null`.
- Add an informational inline hint/validation message in `ProfileSetupDialog` when the Email field is non-empty and not exactly `"sanjeev.vohra@gmail.com"`, warning that Super Admin access requires using the admin email (without blocking saving for non-admin emails).

**User-visible outcome:** Logged-in users will always see a clear warning if their saved Profile email doesn’t match the bootstrap admin email, and the Profile Setup dialog will proactively inform them when they enter a non-admin email that Super Admin access won’t be granted unless they use `"sanjeev.vohra@gmail.com"`.
