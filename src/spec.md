# Specification

## Summary
**Goal:** Ensure the Internet Identity user whose saved profile email matches sanjeev.vohra@gmail.com is always treated as an application administrator.

**Planned changes:**
- Add a backend “bootstrap admin” rule in the existing backend actor so authorization checks using `AccessControl.isAdmin(...)` succeed for the matching user.
- Enforce that when a profile email matches sanjeev.vohra@gmail.com (case-insensitive, trimmed), the stored `UserProfile.extendedRole` is set to `"Super Admin"` (including correcting existing stored profiles).
- Ensure frontend admin-gated capabilities (e.g., `manage_users`, `manage_config`) become available for that user after refresh/refetch by relying on the enforced `"Super Admin"` role.

**User-visible outcome:** When signed in as the user whose profile email is sanjeev.vohra@gmail.com, they have admin access throughout the app (including admin-gated pages like User Management) and their role shows/enables “Super Admin” capabilities.
