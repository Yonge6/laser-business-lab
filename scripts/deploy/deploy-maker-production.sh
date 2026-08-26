#!/usr/bin/env bash

set -euo pipefail

repository_url="${MAKER_REPOSITORY_URL:-https://github.com/Yonge6/laser-business-lab.git}"
checkout_dir="${MAKER_CHECKOUT_DIR:-/srv/wonderelian/build/maker-business-lab}"
releases_dir="${MAKER_RELEASES_DIR:-/srv/wonderelian/releases}"
current_link="${MAKER_CURRENT_LINK:-/srv/wonderelian/maker.wonderelian.com}"
site_url="${MAKER_SITE_URL:-https://maker.wonderelian.com}"
lock_file="${MAKER_DEPLOY_LOCK:-/run/lock/maker-business-lab-deploy.lock}"

exec 9>"$lock_file"
flock -n 9 || exit 0

mkdir -p "$(dirname "$checkout_dir")" "$releases_dir"

if [[ ! -d "$checkout_dir/.git" ]]; then
  git clone --filter=blob:none --branch main "$repository_url" "$checkout_dir"
else
  git -C "$checkout_dir" fetch --prune origin main
  git -C "$checkout_dir" checkout --force main
  git -C "$checkout_dir" reset --hard origin/main
fi

expected_date="$(TZ=Asia/Shanghai date +%F)"
source_date="$(node -p 'require(process.argv[1]).lastRunDate' "$checkout_dir/content/operations/state.json")"

if [[ "$source_date" != "$expected_date" ]]; then
  printf 'Maker Radar source is not ready: expected=%s source=%s\n' "$expected_date" "$source_date"
  exit 0
fi

revision="$(git -C "$checkout_dir" rev-parse --short=7 HEAD)"
release_dir="$releases_dir/maker-${expected_date//-/}-$revision-radar"

if [[ "$(readlink -f "$current_link" 2>/dev/null || true)" == "$release_dir" ]]; then
  printf 'Maker Radar release is already active: %s\n' "$release_dir"
  exit 0
fi

(
  cd "$checkout_dir"
  pnpm install --frozen-lockfile
  NEXT_PUBLIC_SITE_URL="$site_url" \
    NEXT_PUBLIC_GA_ID="${NEXT_PUBLIC_GA_ID:-}" \
    NEXT_PUBLIC_LEAD_ENDPOINT="${NEXT_PUBLIC_LEAD_ENDPOINT:-}" \
    pnpm run build:pages
)

built_date="$(node -p 'require(process.argv[1]).generatedFor' "$checkout_dir/out/operations/latest.json")"
if [[ "$built_date" != "$expected_date" ]]; then
  printf 'Maker Radar build date mismatch: expected=%s built=%s\n' "$expected_date" "$built_date" >&2
  exit 1
fi

if [[ ! -d "$release_dir" ]]; then
  staging_dir="$releases_dir/.maker-${expected_date//-/}-$revision.staging.$$"
  trap 'rm -rf "$staging_dir"' EXIT
  mkdir -p "$staging_dir"
  rsync -a --delete "$checkout_dir/out/" "$staging_dir/"
  mv "$staging_dir" "$release_dir"
  trap - EXIT
fi

test -s "$release_dir/index.html"
test -s "$release_dir/radar/$expected_date/index.html"
test -s "$release_dir/operations/latest.json"
nginx -t

previous_target="$(readlink -f "$current_link" 2>/dev/null || true)"
next_link="$(dirname "$current_link")/.maker.wonderelian.com.next.$revision.$$"
ln -s "$release_dir" "$next_link"
mv -Tf "$next_link" "$current_link"

live_date="$(curl --silent --show-error --fail --max-time 20 "$site_url/operations/latest.json?release=$revision" | node -e 'let body="";process.stdin.on("data",chunk=>body+=chunk).on("end",()=>process.stdout.write(JSON.parse(body).generatedFor))')"
if [[ "$live_date" != "$expected_date" ]]; then
  if [[ -n "$previous_target" && -d "$previous_target" ]]; then
    rollback_link="$(dirname "$current_link")/.maker.wonderelian.com.rollback.$revision.$$"
    ln -s "$previous_target" "$rollback_link"
    mv -Tf "$rollback_link" "$current_link"
  fi
  printf 'Maker Radar live date mismatch: expected=%s live=%s\n' "$expected_date" "$live_date" >&2
  exit 1
fi

printf 'Maker Radar deployed: date=%s revision=%s release=%s\n' "$expected_date" "$revision" "$release_dir"
