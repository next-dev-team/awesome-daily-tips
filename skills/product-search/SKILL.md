---
name: product-search
description: Research current product buying shortlists with verified prices, specifications, seller contacts, and location links.
---

# Buying Shortlist Skill

## Name
buying-shortlist

## Purpose
Create a current, practical product buying shortlist with verified price, specs, store/contact details, and location links.

## Trigger
Use this skill when the user asks to:
- find products to buy
- compare products
- give a top 3 / top 5 / top 10 shortlist
- recommend a laptop, phone, PC part, appliance, or other purchasable product
- re-check current price, stock, store, phone, or map

## Output Format Options

The skill supports 3 output formats:

1. **Telegram** — DEFAULT
2. **Table**
3. **General**

If the user does not specify a format, always use **Telegram**.

The user can request formats naturally, for example:
- "telegram"
- "telegram format"
- "table"
- "markdown table"
- "general"
- "normal format"
- "normal answer"

If the user asks for a specific format, follow that format instead of the default.

---

# 1. Telegram Format — DEFAULT

Use this by default because it is easy to copy and paste into Telegram.

Example:

💻 **Top {N} {Product Type} Under ${Budget} for {Use Case}**

🥇 **1. {Product Name}**
• CPU/Chip: {CPU or main processor}
• RAM: {RAM}
• Storage: {Storage}
• Screen / Key Spec: {Display or important spec}
• Price: **${Price}**
🔗 [Product]({Direct Product URL})
🏪 {Shop Name}
📞 {Phone if available}
📍 [Google Maps]({Google Maps URL if available})

==============

🥈 **2. {Product Name}**
• CPU/Chip: {CPU or main processor}
• RAM: {RAM}
• Storage: {Storage}
• Screen / Key Spec: {Display or important spec}
• Price: **${Price}**
🔗 [Product]({Direct Product URL})
🏪 {Shop Name}
📞 {Phone if available}
📍 [Google Maps]({Google Maps URL if available})

==============

Continue the same structure for all ranked products.

At the end:

==============
✅ **Best Overall:** {Product} — ${Price}
💰 **Best Value:** {Product} — ${Price}
🎯 **Best for {Use Case}:** {Product}

### Telegram separator
Always use exactly this between products:

==============

Do not replace it with dashes or another separator unless the user explicitly asks.

---

# 2. Table Format

Use when the user asks for "table", "markdown table", or similar.

Example:

| # | Product | CPU / Chip | RAM / Storage | Key Spec | Price | Product Link | Shop / Phone | Map |
|---|---|---|---|---|---:|---|---|---|
| 🥇 1 | **{Product}** | {CPU} | {RAM / Storage} | {Key spec} | **${Price}** | [Product]({URL}) | {Shop} — {Phone} | [Map]({Map URL}) |
| 🥈 2 | **{Product}** | {CPU} | {RAM / Storage} | {Key spec} | **${Price}** | [Product]({URL}) | {Shop} — {Phone} | [Map]({Map URL}) |

After the table, add a short recommendation:
- **Best Overall**
- **Best Value**
- **Best for the user's use case**

Keep the table readable. Avoid too many low-value columns.

---

# 3. General Format

Use when the user asks for a normal/general answer.

Structure:

## Top {N} {Product Type}

### 1. {Product Name} — ${Price}
Brief explanation of why it ranks here.

**Key specs**
- CPU/Chip: ...
- RAM: ...
- Storage: ...
- Display / important feature: ...
- Warranty / upgradeability if relevant

**Buy:** [Product]({URL})  
**Shop:** {Shop Name}  
**Phone:** {Phone if available}  
**Map:** [Google Maps]({Map URL if available})

Repeat for each product.

Finish with a short buying recommendation explaining which product is best overall, best value, and best for the user's use case.

---

## Required Research Behavior

1. Verify current product listings when information can change.
2. Respect the user's budget and minimum requirements exactly.
3. Rank options by the user's stated use case, not only raw specifications.
4. Prefer direct retailer product pages over category/search pages.
5. Include store contact details and Google Maps links when available.
6. Flag stale, inconsistent, suspicious, or unavailable listings.
7. Do not rank an item highly only because its model name sounds newer.
8. If a listing redirects, appears out of stock, or has conflicting specs, mention it.
9. Do not guess phone numbers, prices, addresses, stock, or specifications.
10. When current information matters, verify before answering.

---

## Ranking Guidance for Laptops

For IT students, prioritize:

1. **16GB RAM minimum**
2. CPU performance for coding, Docker, VMs, Android Studio, databases, and multitasking
3. **512GB SSD minimum**
4. Good IPS/OLED display; 16:10 is especially useful for coding
5. RAM/SSD upgradeability
6. Battery life and portability
7. Warranty and local brand/service quality
8. Price/value

Do not overvalue weak CPUs with newer-looking names.

Compare:
- CPU architecture
- core/thread count
- sustained performance
- integrated graphics where relevant
- power efficiency
- actual benchmark/performance class

For IT/student use, give extra weight to:
- Docker
- WSL/Linux
- VMware/VirtualBox
- Android Studio
- VS Code / IntelliJ / Visual Studio
- local databases
- many browser tabs
- multi-tasking

---

## Ranking Guidance for Other Product Types

Adapt ranking criteria to the actual use case.

Examples:

### Phones
Prioritize:
- chipset/performance
- display
- camera
- battery
- software support
- storage/RAM
- warranty
- value

### Monitors
Prioritize:
- panel type
- resolution
- refresh rate
- color quality
- ports
- size
- warranty
- price

### PC Parts
Prioritize:
- compatibility
- performance
- thermals/power
- warranty
- upgrade path
- value

Do not blindly reuse laptop criteria for other categories.

---

## Link Rules

### Product Link
- Prefer a direct retailer product page.
- Avoid category/search pages if a direct product page exists.
- If only a marketplace listing is available, say so.

### Map Link
- Include a Google Maps link when the shop location is available.
- Prefer the exact store or exact branch where possible.

### Phone
- Use a verified store/business phone number.
- If unavailable, omit it rather than guessing.

### Missing Data
If a phone, map, warranty, or exact stock status cannot be verified, omit that field or mark it as:
- `Not confirmed`

Never invent missing details.

---

## Recommendation Ending

Whenever useful, finish with:

✅ **Best Overall:** {Product} — ${Price}  
💰 **Best Value:** {Product} — ${Price}  
🎯 **Best for {Use Case}:** {Product}

For general format, this can be written as a short paragraph instead.

---

## Style

- Default: **Telegram**
- Concise and practical
- Easy to copy/share
- Emoji allowed
- Use **bold** for product names and prices
- Avoid unnecessary long explanations
- Explain meaningful trade-offs
- Be decisive when evidence supports a clear winner
- Mention uncertainty when listings or specs are not fully verified
