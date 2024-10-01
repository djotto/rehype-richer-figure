import { Node } from "unist";
interface Options {
    loading?: "eager" | "lazy";
    figureClass?: string[];
}
/**
 * A rehype plugin to assist in adding rich captions to figures.
 *
 * Used in Quartz, helps turn this
 *
 * ```markdown
 * ![This is the alt text](Image.jpg)
 * : This is the *Caption*
 * ```
 *
 * Into this
 *
 * ```html
 * <figure>
 *   <img alt="This is the alt text" src="Image.jpg" loading="lazy" />
 *   <figcaption>
 *     This is the <em>Caption</em>
 *   </figcaption>
 * </figure>
 * ```
 *
 * @param config - Optional configuration object.
 * @returns A function that applies the transformations to the AST.
 */
export default function rehypeRicherFigure(config?: Options): (tree: Node) => void;
export {};
