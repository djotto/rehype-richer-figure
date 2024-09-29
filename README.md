# rehype-richer-figure

## What is this?

This package is a [unified](https://github.com/unifiedjs/unified) ([rehype](https://github.com/rehypejs/rehype)) plugin
to assist in adding rich captions to figures.

**unified** is a project that transforms content with abstract syntax trees (ASTs). **rehype** adds support for HTML to
unified.

The `rehype-richer-figure` plugin searches a unified AST for a specific non-semantic structure, and transforms it into
a semantic structure.

It searches for and transforms this HTML:

```html
<p><img alt="This is the alt text" src="Image.jpg" /></p>

<p>: This is the <em>Caption</em></p>
```

into this HTML:

```html
<figure>
  <img alt="This is the alt text" src="Image.jpg" />
  <figcaption>This is the <em>Caption</em></figcaption>
</figure>
```

## When should I use this?

`rehype-richer-figure` was written to be embedded in a [Quartz](https://quartz.jzhao.xyz/) application. Quartz is a
static site generator that is most commonly used to generate HTML views of [Obsidian](https://obsidian.md/) vaults. It
may be useful whenever you're using unified to convert Markdown to HTML and want a way to produce &lt;figure&gt;
structures with rich captions.

When used as part of a complete markdown-to-HTML pipeline, it transforms this markdown:

```markdown
![Pencil portrait of Harry Cust (1861-1917) by Violet Manners (1892)](NPG_D23400.jpg)

: **Harry Cust**, after _Violet Manners, Duchess of Rutland_, litho., 1892 (NPG D23400)
```

into this HTML:

```html
<figure>
  <img
    alt="Pencil portrait of Harry Cust (1861-1917) by Violet Manners (1892)"
    src="NPG_D23400.jpg"
  />
  <figcaption>
    <strong>Harry Cust</strong>, after
    <em>Violet Manners, Duchess of Rutland</em>, litho., 1892 (NPG D23400)
  </figcaption>
</figure>
```

## Behavior

This plugin preserves the `<img>` tag's existing HTML attributes (unless overwritten by configuration, see below), but
the attributes of the `<p>` tags are lost. Non-Element nodes (eg Comment, Text) between the two `<p>` nodes are also
lost.

Due to this plugin overloading the `:` syntax for definition lists used by some markdown extensions, I recommend
running it early in your toolchain.

Accepts an optional config object with the following optional properties:

```javascript
{
  loading?: "eager" | "lazy"; // Controls the loading attribute of the `<img>` tag.
  figureClass?: string[]; // Classes to add to the <figure> element.
}
```

## Example

```javascript
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";
import rehypeRicherFigure from "./build/index.js";

const html =
  '<p><img src="NPG_D23400.jpg" alt="Pencil portrait of Harry Cust (1861-1917) by Violet Manners (1892)">\n' +
  "<p>: <strong>Harry Cust</strong>, after <em>Violet Manners, Duchess of Rutland</em>, litho., 1892 (NPG D23400)</p>\n";

unified()
  .use(rehypeParse)
  .use(rehypeRicherFigure, { loading: "lazy" })
  .use(rehypeStringify)
  .process(html)
  .then((file) => {
    console.log(String(file));
  });
```

## Compatibility

It works for me, and it's licensed MIT.

## Related

- Inspired by [rehype-figure](https://github.com/josestg/rehype-figure)
- Similar to [rehype-image-caption](https://github.com/Robot-Inventor/rehype-image-caption)
