---
name: audit
description: Audit a daisyUI dashboard against UI/UX criteria and daisyUI conventions, and produce a prioritised report.
---

# Audit

Use this when the user asks to review/critique a dashboard, or as the **final pass** before delivering a new one.

## Procedure

1. Read the code/screens fully. Note the page type and the primary user task.
2. Go through `checklist.md` section by section. Mark each item ✅ (ok), ⚠️ (improvable), ❌ (broken), or N/A.
3. Prioritise findings: **P0** blocks usage or accessibility, **P1** hurts clarity/consistency, **P2** polish.
4. Report using the template below. Be specific: quote the class/element, say what to change, give the fix.
5. If asked to fix (or when auditing your own output), apply P0 + P1 fixes and re-check.

## Report template

```
# Audit — <page / project>
Score: <n>/100  (UI/UX <x>/50 · daisyUI <y>/30 · Accessibility <z>/20)

## Summary
2–3 sentences: overall impression, biggest risk, biggest quick win.

## P0 — Must fix
- [Section.ID] Problem → Fix (file/line or selector)

## P1 — Should fix
- …

## P2 — Nice to have
- …

## What works well
- 2–3 strengths to keep
```

Scoring: start at 100 and subtract P0 = 8, P1 = 3, P2 = 1 (floor 0). Do not invent issues to fill the report; an empty section is fine.

## Tips

- Check in both light and dark themes, at 375 px, 768 px and 1280 px widths.
- Tab through the page: if focus is lost or invisible, that's a P0.
- Squint test: blur the page mentally — is the most important info still the most prominent?
- Prefer fixing root causes (a shared block, a token) over patching each instance.
