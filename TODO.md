# NOVA VAULT MVP — Redesign Implementation Checklist

## Foundation
- [x] 1. Update tailwind.config.js with new design tokens
- [x] 2. Update src/app/globals.css with new design system + background FX
- [x] 3. Update src/app/layout.tsx with fonts (Inter + JetBrains Mono)

## New Layout Components
- [x] 4. Create src/components/BackgroundFX.tsx
- [x] 5. Create src/components/Sidebar.tsx
- [x] 6. Create src/components/Topbar.tsx
- [x] 7. Create src/components/MobileNav.tsx

## Dashboard Components Redesign
- [x] 8. Redesign src/components/StatsCards.tsx
- [x] 9. Redesign src/components/SearchBar.tsx
- [x] 10. Redesign src/components/AccountTable.tsx
- [x] 11. Redesign src/components/AccountCard.tsx

## Modals & Feedback Redesign
- [x] 12. Redesign src/components/AddAccountModal.tsx
- [x] 13. Redesign src/components/QuickUseModal.tsx
- [x] 14. Redesign src/components/AccountDetailModal.tsx
- [x] 15. Redesign src/components/DeleteConfirmModal.tsx
- [x] 16. Redesign src/components/Toast.tsx

## Pages Integration
- [x] 17. Redesign src/app/login/page.tsx
- [x] 18. Update src/app/page.tsx with new layout (Sidebar + Topbar + MobileNav + BackgroundFX)

## QA & Verification
- [x] 19. Run npm run build — fix any TypeScript errors
- [x] 20. Visual QA at all breakpoints (360/375/390/412/430/768/1024/1280+)
- [x] 21. Fix issues found during QA (MobileNav w-4.5, Topbar mobile search, MobileNav 'more' button, AccountTable tooltips/td)
