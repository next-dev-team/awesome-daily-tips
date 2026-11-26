# Skillspace Bridge — experimental v0.1

Download the reviewed repo release and extract it. Open chrome://extensions or edge://extensions, enable Developer mode, choose Load unpacked and select extension/. Reload https://next-dev-team.github.io/awesome-daily-tips/. Not published to the Chrome Web Store.

1. Select providers and enable Use Skillspace Bridge in the provider menu.
2. Send opens each selected provider in a separate tab without prompt URLs.
3. In each opened tab, click the extension icon and Fill prompt. Review and manually submit. If the experimental selector fails, copy and paste.
4. Once an answer finishes, select the desired text in the provider, open the popup, Preview selected response, review and Import to Skillspace.
5. Compare responses in the originating page. Imports are selected text, not independently verified full responses.

No auto-submit, streaming, full-conversation scraping, cookies, broad provider host permissions, bypassing limits or backend. Uses activeTab and scripting only on explicit popup actions. Extension session storage holds prompts and job records; records expire for access after one hour, are deleted on tab close and stale records are pruned on the next launch. Browser restart clears them. At most 21 active launch tabs. The source app must remain open on the same job. Provider terms and selectors may change; real browser testing is required. Use the manual fallback when necessary.

Test: node extension/protocol.test.js. Before release, test Chrome and Edge, real provider tabs, denied access, origin mismatch, changed job and exact selected-text import.
