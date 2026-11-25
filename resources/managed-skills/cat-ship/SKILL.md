---
name: cat-ship
description: Review a project change, diagnose its failing checks, and prepare a tested fix and pull request handoff.
---

# Cat-Ship

Start with the repository and pull request the user selected. For a working tree, read its contribution instructions and inspect the branch, status, merge base, and diff. For a hosted pull request, use the connected repository tools to read its current head, changed files, reviewer feedback, and CI results. The public report at https://eqbot.everestqai.com/cat-ship accepts public pull request links.

Review behavior changes, compatibility, failure paths, and the tests that cover them. Give each finding a file, the affected behavior, and a concrete check. Distinguish failing checks from checks that never ran.

When the user asks for fixes, work on the selected branch, preserve unrelated edits, and run the narrowest test that demonstrates the fix followed by the repository's required checks. Report what ran and what still requires access. Push or open a pull request when requested. Respect repository approval rules and the current head commit. Finish with the commit, test results, unresolved findings, and the next review decision.
