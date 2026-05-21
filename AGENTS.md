<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Layout conventions

- **Every step must fit within a single phone viewport** — no vertical scrolling on mobile. Size headings, spacing, inputs, and option lists so the header, body, and footer all render within `100dvh` on a typical phone (~375×667). Prefer tight vertical rhythm (e.g. `py-6` over `py-12`) and keep option/pill lists short enough not to overflow.
- Content max width is **540px** for both the form flow and the brief flow.
- Apply width consistently across header, body, and footer so all three resolve to the same content width on tablet and desktop.
- Pattern: put horizontal padding (`px-6`) on the outer element (`<header>`, `<main>`, `<footer>`) and `max-w-[540px] mx-auto` on the inner content wrapper. Do **not** combine `max-w-[540px]` and `px-*` on the same element — that subtracts the padding from the effective content width and makes the bar look narrower than the body.
