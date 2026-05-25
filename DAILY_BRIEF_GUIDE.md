# DAILY_BRIEF_GUIDE

This repository now includes a scheduled GitHub Actions publisher for a daily AI and global economic briefing issue.

## What it does

- Runs on a GitHub Actions cron schedule at 13:00 Beijing time (05:00 UTC).
- Publishes one issue per day with the label `daily-ai-brief`.
- Closes open briefing issues older than 30 days.
- Retries publication up to two times before creating an error notification issue.

## Required briefing format

The issue body must match the mandated structure exactly:

1. Title: `# Daily AI & Global Economic Briefing | Month Day, Year`
2. Sections I through VI in the prescribed order
3. Footer lines:
   - `*Data Source: GitHub Copilot global public information retrieval*`
   - `*Generated at: YYYY-MM-DD HH:MM:SS UTC+8*`
   - `*This briefing is for informational purposes only and does not constitute investment advice*`

The publisher validates the title, section order, footer, and total word count before posting.

## How to provide briefing content

The workflow accepts three optional sources:

- `briefing_body`: full Markdown content supplied manually at workflow dispatch time
- `briefing_body_file`: a repository path containing the Markdown body, or the repository variable `DAILY_BRIEF_BODY_FILE`
- `briefing_body_url`: a raw Markdown or JSON payload URL, or the repository variable `DAILY_BRIEF_BODY_URL`

For a fully automated deployment, configure `DAILY_BRIEF_BODY_URL` to point at a generated Markdown artifact that already follows the required structure.

## Changing the execution time

Edit `.github/workflows/daily-ai-brief.yml`:

- GitHub cron uses UTC.
- 13:00 Beijing time = 05:00 UTC.
- Update the `schedule.cron` field if the target timezone changes.

## Adding more delivery methods

The current publisher posts to GitHub Issues only. To add another channel:

1. Keep the existing `daily_ai_brief.py` validation and cleanup flow.
2. Add a new publisher function after the issue is created.
3. Preserve the same title, footer, and label contract so downstream automation stays consistent.

Examples of future delivery methods:

- GitHub Discussions
- Repository Releases
- Markdown artifacts in Actions
- Email or webhook relays

## Operational notes

- The automation uses `PyGitHub` and `requests` only.
- Set `GITHUB_TOKEN` and `GITHUB_REPOSITORY` in Actions; the workflow already injects the default token.
- Scheduled runs without any configured body source will automatically switch to `--cleanup-only` mode.
- The error notification issue uses the same `daily-ai-brief` label so failures stay visible in one filtered view.

## Recommended manual checks

- Confirm the issue label exists or let the script create it automatically.
- Validate that the briefing body stays within 1500-2000 words.
- Confirm the source URL or file is reachable before scheduling production runs.
