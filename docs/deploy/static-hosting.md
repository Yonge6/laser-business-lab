# Maker static hosting: true 404 integration

This change prepares the production Nginx route rules in the repository. It does
not change a running server. The deployment owner must review and apply the
include from their Mac or other existing administration environment after this
PR is merged. A source build alone cannot fix the production homepage fallback.

## Existing deployment contract

- `next.config.ts` uses `output: "export"` and `trailingSlash: true`: `/learn/example/`
  is exported as `out/learn/example/index.html`, not a catch-all SPA.
- `scripts/deploy/deploy-maker-production.sh` builds `out`, creates a release, and
  switches the `/srv/wonderelian/maker.wonderelian.com` symlink by default. It
  runs `nginx -t`, but does not install or reload Nginx configuration.
- `deploy/systemd/maker-business-lab-deploy.service` runs that existing script.
  No service, timer, deployment script or production symlink is changed here.
- The include targets the root-domain Maker deployment with no base path. The
  actual active server block and root must be confirmed before integration.

## Review and integrate on the host

Inspect the effective Nginx configuration privately with the existing host
administration process. Confirm the `maker.wonderelian.com` HTTPS server block,
its active root, certificate settings, and any API proxy locations. Back up only
that site's configuration. Keep the active release available for rollback.

Replace that server block's existing catch-all `location /` and conflicting
`/_next/static/` or `/404.html` rules with `deploy/nginx/maker-static-export.conf`.
Copy the include to the host's established configuration directory, then include
it inside the same server block. Do not create a duplicate server block or leave
the old catch-all in place. Preserve the site's TLS, MIME types, security headers
and any explicitly proxied APIs. Example context, not a complete server file:

```nginx
server {
    # Existing listen, server_name, TLS and API locations stay here.
    root /srv/wonderelian/maker.wonderelian.com;
    include /etc/nginx/snippets/maker-static-export.conf;
}
```

Confirm the selected release contains non-empty `index.html`, `404.html`,
`calculator/laser-roi/index.html`, a known Learn page and its build assets. Run
`nginx -t`; if it fails, restore the site's configuration and do not reload.
If it passes, reload only through the host's existing service procedure. This
step is manual: neither this PR nor the build applies the include automatically.

The rules resolve actual files and exported route `index.html` files. Unknown
routes, empty directories and missing JavaScript cannot resolve to `/index.html`.
`error_page 404 /404.html` preserves status 404; `=200` would reintroduce a soft
404. `/404.html` is internal so a direct request also receives 404.

## Verify before calling it fixed

Run the local regression contract with `pnpm exec vitest run tests/static-hosting.test.ts`.
It also performs real loopback Nginx HTTP tests when `NGINX_BINARY` names an
existing executable. For example on a Mac with Nginx already installed:

```bash
NGINX_BINARY="$(command -v nginx)" pnpm exec vitest run tests/static-hosting.test.ts
```

The HTTP tests create only a temporary fixture server on `127.0.0.1` and stop it
afterwards. Without that variable, the config contract still runs and the Nginx
integration cases are explicitly skipped; this is not production verification.

After manual integration, check both response status and body on the real host:

```bash
curl --silent --show-error --output /dev/null --write-out '%{http_code}\n' \
  'https://maker.wonderelian.com/'
curl --silent --show-error --output /dev/null --write-out '%{http_code}\n' \
  'https://maker.wonderelian.com/calculator/laser-roi/?utm_source=hosting_check'
curl --silent --show-error --output /dev/null --write-out '%{http_code}\n' \
  'https://maker.wonderelian.com/learn/etsy-tumbler-pricing-us/'
curl --silent --show-error --include \
  'https://maker.wonderelian.com/hosting-check-missing-20261013/'
curl --silent --show-error --include \
  'https://maker.wonderelian.com/_next/static/chunks/hosting-check-missing.js'
```

The first three must be 200 with their own content. The last two must be 404 and
must not contain the homepage body. Check a real current `/_next/static/` asset
for 200 and correct MIME type, plus `robots.txt`, `sitemap.xml`,
`operations/latest.json`, representative dated Radar routes and any proxied APIs.
Also verify the not-found page is visibly useful and marked `noindex` in the
exported HTML. Existing homepage metadata on the not-found document, if present,
is a separate source issue; HTTP 404 must not be replaced by page text alone.

If valid routes or APIs regress, restore only the site's backed-up Nginx
configuration, run `nginx -t` and reload using the same procedure. Switching to
an older static release alone does not roll back a changed Nginx include.

References: the bundled Next static export and not-found guides in
`node_modules/next/dist/docs/01-app/`, and the official Nginx
[try_files](https://nginx.org/en/docs/http/ngx_http_core_module.html#try_files),
[error_page](https://nginx.org/en/docs/http/ngx_http_core_module.html#error_page)
and [internal](https://nginx.org/en/docs/http/ngx_http_core_module.html#internal)
directives.
