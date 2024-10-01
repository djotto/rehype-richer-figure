// rehypeRicherFigure.test.js

import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";
import rehypeRicherFigure from "../index";

describe("rehypeRicherFigure Plugin", () => {
  const processor = unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeRicherFigure)
    .use(rehypeStringify);

  const normalizeHtml = (html: string) =>
    html
      .replace(/>\s+</g, "><") // Remove spaces between HTML tags
      .replace(/\s+/g, " ") // Replace multiple spaces with a single space
      .trim(); // Trim leading/trailing spaces

  /***************************** POSITIVE TESTS *****************************/

  test("transforms image with caption into figure", async () => {
    const inputHtml = `
      <p><img src="Voight-Kampff.jpg" alt="Brion James"></p>
      <p>: It's a test, designed to provoke an emotional response</p>
    `;
    const expectedOutput = `
      <figure>
        <img src="Voight-Kampff.jpg" alt="Brion James">
        <figcaption>It's a test, designed to provoke an emotional response</figcaption>
      </figure>
    `;

    const result = await processor.process(inputHtml);

    const normalizedExpected = normalizeHtml(expectedOutput);
    const normalizedResult = normalizeHtml(result.toString());

    expect(normalizedResult).toBe(normalizedExpected);
  });

  test("adds loading attribute when config is provided", async () => {
    // Overrides processor in parent scope to inject config.
    const processor = unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeRicherFigure, { loading: "lazy" })
      .use(rehypeStringify);

    const inputHtml = `
      <p><img src="Image.jpg" alt="Alt text"></p>
      <p>: Caption text</p>
    `;
    const expectedOutput = `
      <figure>
        <img src="Image.jpg" alt="Alt text" loading="lazy">
        <figcaption>Caption text</figcaption>
      </figure>
    `;

    const result = await processor.process(inputHtml);

    const normalizedExpected = normalizeHtml(expectedOutput);
    const normalizedResult = normalizeHtml(result.toString());

    expect(normalizedResult).toBe(normalizedExpected);
  });

  test("image attributes are preserved", async () => {
    // Overrides processor in parent scope to inject config.
    const inputHtml = `
      <p><img src="Image.jpg" width="640" height="480" loading="lazy" alt="Alt text"></p>
      <p>: Caption text</p>
    `;
    const expectedOutput = `
      <figure>
        <img src="Image.jpg" width="640" height="480" loading="lazy" alt="Alt text">
        <figcaption>Caption text</figcaption>
      </figure>
    `;

    const result = await processor.process(inputHtml);

    const normalizedExpected = normalizeHtml(expectedOutput);
    const normalizedResult = normalizeHtml(result.toString());

    expect(normalizedResult).toBe(normalizedExpected);
  });

  test("loading attribute is overridden", async () => {
    // Overrides processor in parent scope to inject config.
    const processor = unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeRicherFigure, { loading: "eager" })
      .use(rehypeStringify);

    // Overrides processor in parent scope to inject config.
    const inputHtml = `
      <p><img src="Image.jpg" width="640" height="480" loading="lazy" alt="Alt text"></p>
      <p>: Caption text</p>
    `;
    const expectedOutput = `
      <figure>
        <img src="Image.jpg" width="640" height="480" loading="eager" alt="Alt text">
        <figcaption>Caption text</figcaption>
      </figure>
    `;

    const result = await processor.process(inputHtml);

    const normalizedExpected = normalizeHtml(expectedOutput);
    const normalizedResult = normalizeHtml(result.toString());

    expect(normalizedResult).toBe(normalizedExpected);
  });

  test("figure class can be added", async () => {
    // Overrides processor in parent scope to inject config.
    const processor = unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeRicherFigure, { figureClass: ["yan", "tan", "tethera"] })
      .use(rehypeStringify);

    // Overrides processor in parent scope to inject config.
    const inputHtml = `
      <p><img src="Image.jpg" alt="Alt text"></p>
      <p>: Caption text</p>
    `;
    const expectedOutput = `
      <figure class="yan tan tethera">
        <img src="Image.jpg" alt="Alt text">
        <figcaption>Caption text</figcaption>
      </figure>
    `;

    const result = await processor.process(inputHtml);

    const normalizedExpected = normalizeHtml(expectedOutput);
    const normalizedResult = normalizeHtml(result.toString());

    expect(normalizedResult).toBe(normalizedExpected);
  });

  test("handles multiple figures in the content", async () => {
    const inputHtml = `
        <p><img src="Image1.jpg" alt="Alt text 1"></p>
        <p>: Caption 1</p>
        <p><img src="Image2.jpg" alt="Alt text 2"></p>
        <p>: Caption 2</p>
      `;
    const expectedOutput = `
        <figure>
          <img src="Image1.jpg" alt="Alt text 1">
          <figcaption>Caption 1</figcaption>
        </figure>
        <figure>
          <img src="Image2.jpg" alt="Alt text 2">
          <figcaption>Caption 2</figcaption>
        </figure>
      `;

    const result = await processor.process(inputHtml);

    const normalizedExpected = normalizeHtml(expectedOutput);
    const normalizedResult = normalizeHtml(result.toString());

    expect(normalizedResult).toBe(normalizedExpected);
  });

  test("strips leading colons and whitespace from caption", async () => {
    const inputHtml = `
        <p><img src="Image.jpg" alt="Alt text"></p>
        <p>            :    Caption with extra whitespace</p>
      `;
    const expectedOutput = `
        <figure>
          <img src="Image.jpg" alt="Alt text">
          <figcaption>Caption with extra whitespace</figcaption>
        </figure>
      `;

    const result = await processor.process(inputHtml);

    const normalizedExpected = normalizeHtml(expectedOutput);
    const normalizedResult = normalizeHtml(result.toString());

    expect(normalizedResult).toBe(normalizedExpected);
  });

  test("maintains nested elements in caption", async () => {
    const inputHtml = `
        <p><img src="Image.jpg" alt="Alt text"></p>
        <p>: Caption with <strong><em>bold</em></strong> text</p>
      `;
    const expectedOutput = `
        <figure>
          <img src="Image.jpg" alt="Alt text">
          <figcaption>Caption with <strong><em>bold</em></strong> text</figcaption>
        </figure>
      `;

    const result = await processor.process(inputHtml);

    const normalizedExpected = normalizeHtml(expectedOutput);
    const normalizedResult = normalizeHtml(result.toString());

    expect(normalizedResult).toBe(normalizedExpected);
  });

  test("transforms multiline caption into figure", async () => {
    const inputHtml = `
      <p><img src="Image.jpg" alt="This is the alt text"></p>
      <p>: This is the Caption
      and it spreads over two lines</p>
    `;
    const expectedOutput = `
      <figure>
        <img src="Image.jpg" alt="This is the alt text">
        <figcaption>This is the Caption and it spreads over two lines</figcaption>
      </figure>
    `;

    const result = await processor.process(inputHtml);

    const normalizedExpected = normalizeHtml(expectedOutput);
    const normalizedResult = normalizeHtml(result.toString());

    expect(normalizedResult).toBe(normalizedExpected);
  });

  /***************************** NEGATIVE TESTS *****************************/

  test("does not transform when no caption is provided", async () => {
    const inputHtml = `<p><img src="Image.jpg" alt="Alt text"></p>`;
    const expectedOutput = `<p><img src="Image.jpg" alt="Alt text"></p>`;

    const result = await processor.process(inputHtml);

    const normalizedExpected = normalizeHtml(expectedOutput);
    const normalizedResult = normalizeHtml(result.toString());

    expect(normalizedResult).toBe(normalizedExpected);
  });

  test("does not transform when the caption is empty", async () => {
    const inputHtml = `
        <p><img src="Image.jpg" alt="Alt text"></p>
        <p></p>
    `;
    const expectedOutput = `
        <p><img src="Image.jpg" alt="Alt text"></p>
        <p></p>
    `;

    const result = await processor.process(inputHtml);

    const normalizedExpected = normalizeHtml(expectedOutput);
    const normalizedResult = normalizeHtml(result.toString());

    expect(normalizedResult).toBe(normalizedExpected);
  });

  test("does not transform when the caption is not text", async () => {
    const inputHtml = `
        <p><img src="Image.jpg" alt="Alt text"></p>
        <p><em>: Hello World</em></p>
    `;
    const expectedOutput = `
        <p><img src="Image.jpg" alt="Alt text"></p>
        <p><em>: Hello World</em></p>
    `;

    const result = await processor.process(inputHtml);

    const normalizedExpected = normalizeHtml(expectedOutput);
    const normalizedResult = normalizeHtml(result.toString());

    expect(normalizedResult).toBe(normalizedExpected);
  });

  test("does not transform when caption does not start with colon", async () => {
    const inputHtml = `
      <p><img src="Image.jpg" alt="Alt text"></p>
      <p>This is a caption without colon</p>
    `;
    const expectedOutput = inputHtml;

    const result = await processor.process(inputHtml);
    expect(result.toString().trim()).toEqual(expectedOutput.trim());
  });

  test("does not affect other content", async () => {
    const inputHtml = `
        <h1>Title</h1>
        <p>Some introductory text.</p>
        <p><img src="Image.jpg" alt="Alt text"></p>
        <p>: Caption text</p>
        <p>Some concluding text.</p>
      `;
    const expectedOutput = `
        <h1>Title</h1>
        <p>Some introductory text.</p>
        <figure>
          <img src="Image.jpg" alt="Alt text">
          <figcaption>Caption text</figcaption>
        </figure>
        <p>Some concluding text.</p>
      `;

    const result = await processor.process(inputHtml);

    const normalizedExpected = normalizeHtml(expectedOutput);
    const normalizedResult = normalizeHtml(result.toString());

    expect(normalizedResult).toBe(normalizedExpected);
  });

  test("does not transform when image is not inside a paragraph", async () => {
    const inputHtml = `
        <img src="Image.jpg" alt="Alt text">
        <p>: Caption text</p>
    `;
    const expectedOutput = `
        <img src="Image.jpg" alt="Alt text">
        <p>: Caption text</p>
    `;

    const result = await processor.process(inputHtml);

    const normalizedExpected = normalizeHtml(expectedOutput);
    const normalizedResult = normalizeHtml(result.toString());

    expect(normalizedResult).toBe(normalizedExpected);
  });

  test("does not transform when child is not an image", async () => {
    const inputHtml = `
        <p><input type="text" name="username"></p>
        <p>: Caption with <strong>bold</strong> text</p>
    `;
    const expectedOutput = `
        <p><input type="text" name="username"></p>
        <p>: Caption with <strong>bold</strong> text</p>
    `;

    const result = await processor.process(inputHtml);

    const normalizedExpected = normalizeHtml(expectedOutput);
    const normalizedResult = normalizeHtml(result.toString());

    expect(normalizedResult).toBe(normalizedExpected);
  });
});
