# Skillspace Bridge v0.4.2 — direct provider send

## Install
Chrome 116+ / compatible Edge (Edge integration unverified). Download reviewed source and extract it. Open chrome://extensions or edge://extensions, enable Developer mode, choose Load unpacked, select extension/. Disable the older extension. Pin Skillspace and click the toolbar icon to open the native side panel. No Chrome Web Store release.

## Send directly to AI
1. Type a message, optionally use @skill, select one or more target AI providers, and click Send to N AIs.
2. Grant the selected provider permissions when Chrome asks. Denying access cancels the launch. Each successful click creates fresh provider tabs.
3. The extension attempts to identify a unique composer on each selected provider, insert and verify the compiled prompt, and click its Send button once. It does not forward drafts to the Skillspace website. No website tab is required.
4. The side panel displays the actual job state and observed provider response. Click Open conversation to inspect the original provider. Use Copy to copy actual observed text.
5. Returning answers to the website is optional: open exactly one Skillspace page with no different active job, then click Send to Main Chat. The result is imported with explicit acknowledgement; the prompt is never resubmitted. An imported partial response is a snapshot, not an active website stream.
6. Alternatively send from the Skillspace website. A compatible v0.4.2+ extension is selected on first connection; disable Bridge for direct URL fallback. Grant permissions in the panel first. The website Send action itself authorizes auto-submit when Bridge is enabled. Manual, automatic or live response sync options apply to website-originated jobs.

## Safety and compatibility
All seven provider adapters (ChatGPT, Claude, Gemini, DeepSeek, Perplexity, Grok, Copilot) are experimental and have not been live-verified here. Unknown or ambiguous selectors, unexpected fresh-chat route, existing text, login/CAPTCHA, missing permission or response attribution failure stop automation or mark it uncertain. Inspect the original tab before manually submitting; no automatic retries after a possible click. Revocation cannot undo an already authorized click. No credential extraction, private API interception, broad all-site permission, or fake answers. Records use temporary extension session storage, expire for access after an hour and are pruned on later launches; browser restart clears storage. The side panel uses compact skill instructions and source URLs, while the website also offers full bundled text. Responses are plain text. Use manual copy/selected-text import when a provider UI changes. Direct launch starts new conversations, not follow-up turns in existing conversations.

## Local validation
From a full checkout run node site/core.test.js, node extension/protocol.test.js, node extension/automation.test.js, node extension/stability.test.js, node extension/bridge-transport.test.js, node extension/panel-direct.test.js and node extension/catalog.test.js. For local website testing, run node scripts/build-dev-extension.mjs, then python -m http.server 8000, load dist/extension-dev/ unpacked and open http://localhost:8000/. The normal extension can run independently of the website. Reload the extension after updates.

Before releasing, run real Chrome/Edge tests for each target, permission prompts, exact submitted text, one-click behavior, answer attribution, optional return, old version rejection, denied permissions and no duplicate submissions. Fixture checks do not establish actual browser compatibility. See docs/audit/DIRECT_SEND_V042.md.
