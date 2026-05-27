#!/usr/bin/env python3
"""Publish a daily AI and macroeconomic briefing to GitHub Issues."""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Iterable
from zoneinfo import ZoneInfo

import requests
from github import Github
from github.GithubException import GithubException, UnknownObjectException

from generate_daily_ai_brief import build_briefing, utc8_now


LABEL_NAME = "daily-ai-brief"
STALE_DAYS_DEFAULT = 30
MAX_RETRIES_DEFAULT = 3
UTC8 = ZoneInfo("Asia/Shanghai")

TITLE_PREFIX = "Daily AI & Global Economic Briefing | "
FOOTER_SOURCE = "*Data Source: GitHub Copilot global public information retrieval*"
FOOTER_NOTICE = "*This briefing is for informational purposes only and does not constitute investment advice*"

SECTION_TITLES = [
    "## I. Top Story of the Day (1-2 most impactful events)",
    "## II. Artificial Intelligence Industry Developments (4-5 key stories)",
    "## III. Global Macroeconomic & Financial News (3-4 key stories)",
    "## IV. Global Market Performance",
    "## V. Tomorrow's Key Events",
    "## VI. Daily Conclusion",
]


@dataclass(slots=True)
class BriefingInput:
    body: str
    source: str


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--body", help="Full briefing markdown body.")
    parser.add_argument("--body-file", help="Path to a markdown file containing the briefing body.")
    parser.add_argument("--body-url", help="URL to a markdown or JSON payload containing the briefing body.")
    parser.add_argument("--cleanup-only", action="store_true", help="Only close stale briefing issues.")
    parser.add_argument("--label", default=LABEL_NAME, help="Issue label to apply and manage.")
    parser.add_argument("--stale-days", type=int, default=STALE_DAYS_DEFAULT, help="Close issues older than this many days.")
    parser.add_argument("--max-retries", type=int, default=MAX_RETRIES_DEFAULT, help="Maximum total attempts for publication.")
    return parser


def utc8_now() -> datetime:
    return datetime.now(tz=UTC8)


def formatted_timestamp(now: datetime) -> str:
    return now.strftime("%Y-%m-%d %H:%M:%S UTC+8")


def load_text_from_file(path: str) -> str:
    return Path(path).expanduser().read_text(encoding="utf-8")


def load_text_from_url(url: str) -> str:
    response = requests.get(url, timeout=30)
    response.raise_for_status()
    content_type = response.headers.get("content-type", "").lower()
    if "application/json" in content_type:
        payload = response.json()
        if isinstance(payload, dict):
            for key in ("body", "content", "markdown", "text"):
                value = payload.get(key)
                if isinstance(value, str) and value.strip():
                    return value
        raise ValueError("JSON payload did not contain a usable text field.")
    return response.text


def load_briefing_input(args: argparse.Namespace) -> BriefingInput:
    if args.body:
        return BriefingInput(body=args.body, source="--body")
    if args.body_file:
        return BriefingInput(body=load_text_from_file(args.body_file), source=args.body_file)
    if args.body_url:
        return BriefingInput(body=load_text_from_url(args.body_url), source=args.body_url)
    try:
        return BriefingInput(body=build_briefing(utc8_now()), source="official-feeds")
    except (requests.RequestException, ValueError) as exc:
        raise ValueError(f"Failed to generate the default briefing from official feeds: {exc}") from exc


def normalize_body(body: str) -> str:
    return body.replace("\r\n", "\n").replace("\r", "\n").strip() + "\n"


def count_words(text: str) -> int:
    tokens = re.findall(r"[A-Za-z0-9\u4e00-\u9fff]+(?:[./-][A-Za-z0-9\u4e00-\u9fff]+)*", text)
    return len(tokens)


def validate_briefing_body(body: str) -> None:
    lines = [line.rstrip() for line in body.strip().splitlines()]
    if not lines:
        raise ValueError("Briefing body is empty.")

    title_pattern = rf"^# {re.escape(TITLE_PREFIX)}.+$"
    if not re.fullmatch(title_pattern, lines[0]):
        raise ValueError("Briefing title must match the required heading format.")

    missing_sections = [section for section in SECTION_TITLES if section not in lines]
    if missing_sections:
        raise ValueError(f"Missing required sections: {', '.join(missing_sections)}")

    footer_ok = FOOTER_SOURCE in lines and FOOTER_NOTICE in lines
    if not footer_ok:
        raise ValueError("Briefing footer must include the source note and investment disclaimer.")

    word_count = count_words(body)
    if word_count < 1500 or word_count > 2000:
        raise ValueError(f"Briefing must be between 1500 and 2000 words; found {word_count}.")


def ensure_label(repo, label_name: str) -> None:
    try:
        repo.get_label(label_name)
    except UnknownObjectException:
        repo.create_label(label_name, "1d76db", "Daily AI briefing automation label")


def iter_matching_issues(repo, label_name: str, state: str = "open") -> Iterable:
    return repo.get_issues(state=state, labels=[label_name], sort="created", direction="asc")


def cleanup_stale_issues(repo, label_name: str, stale_days: int, now: datetime) -> int:
    cutoff = now - timedelta(days=stale_days)
    closed = 0
    for issue in iter_matching_issues(repo, label_name, state="open"):
        created_at = issue.created_at
        if created_at.tzinfo is None:
            created_at = created_at.replace(tzinfo=timezone.utc)
        if created_at.astimezone(UTC8) < cutoff:
            issue.edit(state="closed")
            closed += 1
    return closed


def find_open_issue_by_title(repo, label_name: str, title: str):
    for issue in iter_matching_issues(repo, label_name, state="open"):
        if issue.title == title:
            return issue
    return None


def create_or_update_issue(repo, label_name: str, title: str, body: str):
    existing = find_open_issue_by_title(repo, label_name, title)
    if existing is not None:
        if existing.body != body:
            existing.edit(body=body)
        return existing, False
    return repo.create_issue(title=title, body=body, labels=[label_name]), True


def create_error_body(now: datetime, label_name: str, error: Exception) -> str:
    return normalize_body(
        "\n".join(
            [
                f"# Daily AI & Global Economic Briefing | Automation Error | {now.strftime('%B')} {now.day}, {now.year}",
                "",
                "## I. Top Story of the Day (1-2 most impactful events)",
                "- **Event Overview**: Briefing publication failed before the issue could be created.",
                "- **Root Causes**: 1) Invalid or missing briefing body source; 2) API failure while publishing; 3) Validation error against the required structure.",
                "- **Immediate Impacts**: The scheduled issue did not post and the repository retained an incomplete daily output.",
                "- **Long-Term Implications**: A persistent source or generator must be configured before the automation can produce daily research briefs.",
                "",
                "## II. Artificial Intelligence Industry Developments (4-5 key stories)",
                "- **Event Title**: Automation failure",
                "- **Core Facts**: The workflow was unable to publish a valid briefing issue.",
                "- **Technical Significance**: The publisher enforces the required markdown structure, label policy, and word-count guardrails.",
                "- **Industry Impact**: No daily market narrative was delivered.",
                "- **Market Reaction**: Not applicable.",
                "",
                "## III. Global Macroeconomic & Financial News (3-4 key stories)",
                "- **Event Title**: Scheduling interruption",
                "- **Core Data**: The run ended with an exception before issue creation.",
                "- **Economic Analysis**: Operational failures reduce the consistency of the information feed.",
                "- **Cross-Sector Impacts**: Readers receive no current macro or AI market update.",
                "",
                "## IV. Global Market Performance",
                "- Major stock indices closing prices: unavailable.",
                "- Key commodity prices: unavailable.",
                "- Major currency exchange rates: unavailable.",
                "- AI sector index performance: unavailable.",
                "",
                "## V. Tomorrow's Key Events",
                "- Automation recovery task: restore the briefing body source and rerun the workflow.",
                "",
                "## VI. Daily Conclusion",
                "The automation was unable to complete publication. The workflow should be treated as healthy only after a valid briefing body source is provided and the issue posting step succeeds. The publisher will continue to close stale issues and validate future outputs once configuration is corrected.",
                "",
                "---",
                FOOTER_SOURCE,
                f"*Generated at: {formatted_timestamp(now)}*",
                FOOTER_NOTICE,
                "",
                f"Error detail: {type(error).__name__}: {error}",
                f"Managed label: {label_name}",
            ]
        )
    )


def publish_with_retries(repo, label_name: str, title: str, body: str, max_retries: int):
    last_error: Exception | None = None
    for attempt in range(1, max_retries + 1):
        try:
            return create_or_update_issue(repo, label_name, title, body)
        except (GithubException, requests.RequestException) as exc:
            last_error = exc
            if attempt >= max_retries:
                break
            time.sleep(min(2 ** (attempt - 1), 8))
    assert last_error is not None
    raise last_error


def resolve_github_repo():
    token = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")
    if not token:
        raise ValueError("GITHUB_TOKEN or GH_TOKEN is required.")
    repository_name = os.environ.get("GITHUB_REPOSITORY")
    if not repository_name:
        raise ValueError("GITHUB_REPOSITORY is required.")
    gh = Github(token, per_page=100)
    return gh.get_repo(repository_name)


def run(args: argparse.Namespace) -> int:
    now = utc8_now()
    repo = resolve_github_repo()
    ensure_label(repo, args.label)
    closed = cleanup_stale_issues(repo, args.label, args.stale_days, now)
    print(json.dumps({"closed_stale_issues": closed, "label": args.label}))

    if args.cleanup_only:
        return 0

    briefing_input = load_briefing_input(args)
    body = normalize_body(briefing_input.body)
    validate_briefing_body(body)
    title = body.splitlines()[0].lstrip("# ").strip()
    if not title.startswith(TITLE_PREFIX):
        raise ValueError("Briefing title must use the canonical prefix.")

    issue, created = publish_with_retries(repo, args.label, title, body, args.max_retries)
    action = "created" if created else "updated"
    print(json.dumps({"issue_number": issue.number, "action": action, "source": briefing_input.source}))
    return 0


def main() -> int:
    args = build_parser().parse_args()
    try:
        return run(args)
    except Exception as exc:  # noqa: BLE001
        try:
            repo = resolve_github_repo()
            ensure_label(repo, args.label)
            now = utc8_now()
            error_title = f"Daily AI & Global Economic Briefing | Automation Error | {now.strftime('%B')} {now.day}, {now.year}"
            error_body = create_error_body(now, args.label, exc)
            issue, created = publish_with_retries(repo, args.label, error_title, error_body, args.max_retries)
            print(json.dumps({"error_issue_number": issue.number, "created": created, "error": str(exc)}))
        except Exception as secondary_exc:  # noqa: BLE001
            print(f"fatal: {type(exc).__name__}: {exc}", file=sys.stderr)
            print(f"secondary failure: {type(secondary_exc).__name__}: {secondary_exc}", file=sys.stderr)
            return 1
        print(f"fatal: {type(exc).__name__}: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
