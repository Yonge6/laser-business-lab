#!/usr/bin/env bash
set -euo pipefail
readonly target=/etc/nginx/snippets/maker-static-export.conf
readonly stage=/srv/wonderelian/.seo-fix-20261026/maker-static-export.conf
readonly backup=/etc/nginx/snippets/maker-static-export.conf.before-20261026-seo
readonly before=2593519ad8deefe2975e80df464e5bd5118788374cc4798409d734d306898694
readonly after=48364f78c0671a0f2f0878cf5a97e6e6fa40457cc6f2c2bfa8977542229eaaaf
test -f "$target" && test ! -L "$target" && test -f "$stage" && test ! -L "$stage"
test "$(sha256sum "$target" | cut -d' ' -f1)" = "$before"
test "$(sha256sum "$stage" | cut -d' ' -f1)" = "$after"
nginx -t
if test -e "$backup"; then cmp -s "$target" "$backup"; else cp -p "$target" "$backup"; fi
rollback(){ cp -p "$backup" "$target"; nginx -t && systemctl reload nginx; echo MAKER_ROLLED_BACK; }
trap rollback ERR
install -m 0644 "$stage" "$target"
nginx -t
systemctl reload nginx
# Graceful reload can briefly leave old workers accepting requests.
verified=false
for attempt in 1 2 3 4 5 6 7 8 9 10; do
  code="$(curl -sS --resolve maker.wonderelian.com:443:127.0.0.1 -o /dev/null -w '%{http_code}' 'https://maker.wonderelian.com/radar/2026-09-27?ct=seo-check')"
  if test "$code" = 308; then verified=true; break; fi
  sleep 0.5
done
test "$verified" = true
test "$(curl -sS --resolve maker.wonderelian.com:443:127.0.0.1 -o /dev/null -w '%{http_code}' 'https://maker.wonderelian.com/radar/2026-09-27/')" = 200
test "$(curl -sS --resolve maker.wonderelian.com:443:127.0.0.1 -o /dev/null -w '%{http_code}' 'https://maker.wonderelian.com/seo-check-absent-20261026')" = 404
trap - ERR
echo MAKER_CANONICAL_DEPLOY_VERIFIED
