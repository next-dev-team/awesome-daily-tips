# Awesome Daily Tips

 a meticulously curated collection of resources, website, tools, and frameworks designed to empower and inspire. this repository is dedicated to providing you with an abundance of valuable information.

## Skillspace — AI skill launcher

A small static, dependency-free website for writing a prompt, mentioning one or more GitHub skills with `@skill`, and opening the same compiled prompt in selected AI providers. ChatGPT, Claude and Perplexity offer best-effort URL prefill; other providers use copy and paste. All providers support manual paste. The launcher does not call AI APIs, collect responses or claim to rank them.

- Interface: centered chat composer, collapsible skill library, provider picker and prepared-request conversation view, with ChatGPT-inspired, Claude-inspired and Gemini-inspired appearance options and light/dark/system themes. Inspired by the supplied [chat prompt component](https://ai-component-library-dun.vercel.app/code/chat-prompt.html.txt?v=dc7fc113509f); reimplemented as a responsive live launcher, without the reference's fixed-size animation, remote scripts, fake responses, or missing external skin assets.
- Run locally: `python -m http.server 8000` from the repository root, then visit http://localhost:8000.
- Test: `node site/core.test.js` (Node.js 18+).
- Deploy: use [GitHub Pages settings](https://github.com/next-dev-team/awesome-daily-tips/settings/pages), select **Deploy from a branch**, branch **main**, folder **/ (root)**, and save. The empty `.nojekyll` file disables Jekyll processing so the static files are published unchanged. No custom Actions workflow, backend, keys or build dependencies are required.
- Expected public address after Pages is enabled: https://next-dev-team.github.io/awesome-daily-tips/
- Release workflow: change `develop`, review and merge into `main`; Pages publishes from `main` only. Skill catalog source URLs target `main`, so newly moved skills become available at their canonical URLs after the merge. Verify the [deployment run](https://github.com/next-dev-team/awesome-daily-tips/actions) and test the live launcher, CSS/JS assets, skill links, clipboard and provider redirects before calling the release verified.
- Privacy: URL prefill is opt-in; query strings may be retained by browsers and destination services. Long prompts fall back to manual paste. No prompt persistence or telemetry is implemented.
- The bundled catalog is a snapshot of the actual skill documents, with links to their current sources. When updating a skill, also update its corresponding `site/catalog.js` document content. Compact mode includes source links and short instructions; full mode includes the entire bundled skill text (and audit references) for providers without browsing.

## Useful AI Skills
 - **Translate** — multilingual translation with preserved meaning, tone and formatting. [SKILL.md](skills/translate/SKILL.md)
 - **Khmer dubbing** — natural spoken Khmer adaptation of WhisperX transcripts. [SKILL.md](skills/khmer-dubbing/SKILL.md)
 - **Search any product**  Price Range, Spec + links, contact 
  - Usage Supports 3 output formats: Telegram — default, Table — when you ask for table/Markdown table, General — normal detailed recommendation format
    Eg. Top 3 new phone under 600$ with 2k and snapdragon chip in Phnom Penh, Table
  - SKILL: https://raw.githubusercontent.com/next-dev-team/awesome-daily-tips/refs/heads/main/skills/product-search/SKILL.md
     - **GPT:** [Open in ChatGPT — Top 3 Phones Under $600](https://chatgpt.com/?prompt=Use%20this%20skill%20and%20follow%20its%20instructions%3A%20https%3A%2F%2Fraw.githubusercontent.com%2Fnext-dev-team%2Fawesome-daily-tips%2Frefs%2Fheads%2Fmain%2Fskills%2Fproduct-search%2FSKILL.md%0A%0AFind%20the%20Top%203%20new%20phones%20under%20%24600%20with%20a%202K%20display%20and%20Snapdragon%20chip%20in%20Phnom%20Penh.%20Output%20format%3A%20Table.)

 - **Production Code Audit v2.0** — universal evidence-based verification for AI-generated and human-written production software (web, mobile, desktop, backend, AI, games, CLI, infrastructure and more).
   - [SKILL.md](skills/production-code-audit/SKILL.md) · [Project profiles](skills/production-code-audit/references/project-profiles.md) · [Release policy](skills/production-code-audit/references/release-policy.md)
   - Example: `Use production-code-audit. Mode: AUDIT_FIX_VERIFY. Audit the entire repository, fix verified defects, run real local tests, and enforce evidence-based release gates.`

## CSS Framework
   - Taliwind: Web https://tailwindcss.com/
   - Nativewind: Mobile https://github.com/marklawlor/nativewind

## ReactJs
  is a library to build user interfaces based on components using Virtual DOM and JSX

### Framework
- 
- NextJS: https://github.com/vercel/next.js or https://nextjs.org
  - Maintainer: Vercel 
  - USE CASE: SSR or any website need fast and SEO

### UI 
- Antd: https://github.com/ant-design/ant-design or https://d.umijs.org
  - Antd Pro Components: https://procomponents.ant.design/en-US
  - https://ui.lobehub.com/
- Multiple Tab keep alive https://github.com/d3george/slash-admin/blob/main/src/layouts/dashboard/multi-tabs/index.tsx
- MUI: https://mui.com/
- NextUI: https://nextui.org/
- https://ui.shadcn.com/docs/components/button

### Icon

- Lucide Icon: https://lucide.dev/icons/
- Iconify: 
    - https://icones.js.org/
    - https://icon-sets.iconify.design/
- Tailwindcss Icon: https://github.com/yunsii/tailwindcss-plugin-iconify

### State Management
   - Zustand: https://github.com/pmndrs/zustand
   - Tanstack Sore
   - React Query


### Desktop Web
- Electron Vite
- Tauiri


### Vue
  - Vue3: https://vuejs.org/
  - Nuxt3: https://nuxt.com/
  - Vant: https://github.com/youzan/vant


### Mobile App (Hybrid)

- React Native: https://reactnative.dev/
   - UI:
    - Universal
      - Tamagui: https://tamagui.dev/
      - Nativewind: https://www.nativewind.dev/
      - Uniwind: https://github.com/Unistyles-OSS/uniwind
      - https://rnr-docs.vercel.app/
      - https://gluestack.io/
      - https://github.com/heroui-inc/heroui-native

- Fluter: https://flutter.dev

