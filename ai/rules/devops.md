# DevOps rules (always on for build, deploy and server work)

> Placeholder for the coming DevOps agent. Fill in when the VPS launch (build plan step 3) starts.

1. **Nothing goes live without the owner's explicit OK in that task** (deploys, DNS, SSL, server changes, emails).
2. **Back up before you change:** database dump and config copy before any server or migration change.
3. **Secrets** live in environment files on the server only; never in the repo, chat or logs.
4. **Reversible steps:** every deploy has a written rollback.
5. **Target (agreed):** owner's VPS, website at `codeshaper.net`, CMS at `codeshaper.net/admin` (same domain).
