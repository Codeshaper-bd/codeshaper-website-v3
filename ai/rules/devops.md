# DevOps rules (always on for build, deploy and server work)

> Placeholder for the coming DevOps agent. Fill in when the VPS launch (build plan step 3) starts.

1. **Nothing goes live without the owner's explicit OK in that task** (deploys, DNS, SSL, server changes, emails).
2. **Back up before you change:** database dump and config copy before any server or migration change.
3. **Secrets** live in environment files on the server only; never in the repo, chat or logs.
4. **Reversible steps:** every deploy has a written rollback.
5. **Target (owner, 26 Nov 2026):** owner's VPS, website at `codeshaper.net`, CMS admin at `admin.codeshaper.net`. ~~CMS at `codeshaper.net/admin` (same domain)~~ (replaced). Steps and rollback: `../codeshaper-cms/deploy/admin-origin.md`.
6. **Database:** migrations only go forward; back up before every release and restore to go back (`../codeshaper-cms/deploy/database-recovery.md`).
7. **Every deploy:** restart the queue worker (`php artisan queue:restart`) and the scheduler.
