# Stylesheets

**One file per section.** Hero CSS is in `06-hero.css` and nowhere else; work
experience is in `08-work.css` and nowhere else. To change a section, open its
file — there are no separate override or "refinement" files to hunt through.

| File | Section |
| --- | --- |
| `01-base.css` | Reset and `@font-face` |
| `02-tokens.css` | The `:root` palette every other file reads |
| `03-globals.css` | Body type, scrollbars, page shell, shared animations |
| `04-loader.css` | Loading screen |
| `05-navbar.css` | Navbar |
| `06-hero.css` | Hero |
| `07-journey.css` | Journey timeline and map |
| `08-work.css` | Work experience |
| `09-skills.css` | Skills and tech tags |
| `10-education.css` | Education timeline |
| `11-projects.css` | Projects grid and the all-projects table |
| `12-profiles.css` | Developer profile cards |
| `13-contact.css` | Contact cards |
| `14-footer.css` | Footer |

## Build

`main.min.css` is generated and is the only stylesheet the pages load. After
editing any numbered file:

```
node build.js
```

It concatenates in filename order, minifies, and fails if braces are
unbalanced, the rule count changes, or a `calc()` loses the whitespace its `+`
operator needs.

## Two things to know before editing

**Order still matters inside a file.** A section's file is a slice of one
cascade: later rules in it deliberately override earlier ones. Within a file
you will find a base rule and then, further down, a rule that overrides it.
That is intentional, not duplication.

**`background-clip: text` headings must never be given a `background`.**
Setting one replaces the gradient the text is painted from, and the text
vanishes. Use `box-shadow: inset 0 0 0 999px <colour>` to tint instead.

Decorative animations are switched off under
`@media (prefers-reduced-motion: reduce)`.
