import { visit } from "unist-util-visit";
class BadElement extends Error {
    constructor(message) {
        super(message);
        this.name = "BadTree";
    }
}
/**
 * Type guard to check if a node is an Element.
 *
 * @param node - A node from the abstract syntax tree (AST).
 * @returns True if the node is an Element, else false.
 */
function isElement(node) {
    return node.type === "element";
}
/**
 * Type guard to check if a node is a Text.
 *
 * @param node - A node from the abstract syntax tree (AST).
 * @returns True if the node is a Text, else false.
 */
function isText(node) {
    return node.type === "text";
}
/**
 * Return number of children of element with a type elementType.
 *
 * @param element
 * @param elementType
 */
function countChildrenByType(element, elementType) {
    /* Filter the children to count how many match the provided element type */
    return element.children.filter((child) => child.type === elementType).length;
}
/**
 * Helper function cleans a caption string by stripping leading colons and whitespace.
 *
 * @param text - The text to clean.
 * @returns The cleaned text.
 */
function cleanCaptionText(text) {
    return text.replace(/^\s*:\s*/, "");
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
export default function rehypeRicherFigure(config) {
    return function (tree) {
        /* Walk the tree looking for <p> Elements */
        visit(tree, { tagName: "p" }, (node, index, parent) => {
            /* Reject any <p> Elements that don't have a parent node. */
            /* istanbul ignore if */
            if (!parent) {
                // Don't think this can happen in normal documents. Belt and braces.
                throw new BadElement(`The ${node.tagName} element does not have a parent`);
            }
            /* Reject anything that isn't <p><img></p> */
            if (countChildrenByType(node, "element") !== 1) {
                return; // Only process <p> Elements that have a single child element.
            }
            const firstChild = node.children.find(isElement);
            if (firstChild.tagName !== "img") {
                return; // Only process <p> elements where the child is an <img>.
            }
            // If the 'loading' configuration is set, add it to the <img> element
            if (config?.loading) {
                firstChild.properties.loading = config.loading;
            }
            /* Find the next sibling Element of node (skipping other Node types) */
            let sibling = null;
            let i = index + 1;
            for (; i < parent.children.length; i++) {
                const siblingUnderTest = parent.children[i];
                if (isElement(siblingUnderTest)) {
                    sibling = siblingUnderTest;
                    break;
                }
            }
            /* Reject anything that doesn't match <p>[some content]</p> */
            if (!sibling || sibling.tagName !== "p") {
                return; // Could not find a sibling <p> element after our original <p> element
            }
            if (sibling.children.length === 0) {
                return; // The sibling <p> doesn't have any children
            }
            /* Reject anything where [some content] doesn't start with a ':' */
            const firstChildOfSibling = sibling.children[0];
            if (!isText(firstChildOfSibling)) {
                return; // The first child of the sibling <p> isn't text
            }
            if (!firstChildOfSibling.value.trimStart().startsWith(":")) {
                return; // The sibling <p> doesn't start with ':'
            }
            // Create a new <figure> element
            const figureElement = {
                type: "element",
                tagName: "figure",
                properties: {},
                children: [
                    // The <img> tag with the optional 'loading' attribute
                    firstChild,
                    {
                        type: "element",
                        tagName: "figcaption",
                        properties: {},
                        // Add the children of the sibling <p> element to the <figcaption>
                        children: sibling.children,
                    },
                ],
            };
            // If the 'figureClass' configuration is set, add it to the <img> element
            if (config?.figureClass) {
                figureElement.properties.class = config.figureClass;
            }
            // Strip the leading ':' and any whitespace from the <figcaption>
            const figcaptionElement = figureElement.children[1];
            const figcaptionFirstChild = figcaptionElement.children[0];
            figcaptionFirstChild.value = cleanCaptionText(figcaptionFirstChild.value);
            // If wrap isn't set, we're done.
            if (config?.wrap !== true) {
                // Replace everything between the first and second <p>, inclusive
                parent.children.splice(index, i - index + 1, figureElement);
                return;
            }
            // Create a new <div> element
            const wrapElement = {
                type: "element",
                tagName: "div",
                properties: {},
                children: [figureElement],
            };
            // If the 'wrapClass' configuration is set, add it to the <div> element
            if (config?.wrapClass) {
                wrapElement.properties.class = config.wrapClass;
            }
            parent.children.splice(index, i - index + 1, wrapElement);
        });
    };
}
//# sourceMappingURL=index.js.map