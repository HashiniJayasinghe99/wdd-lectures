// js/components/css-check.js
// ---------------------------------------------------------------
// Helps the code lab check CSS that a student wrote inside <style> tags.
//
// readCssRules(page) turns this:
//     <style> h1, h2 { color: blue; } </style>
// into a list like this:
//     [ { selectors: ["h1", "h2"], declarations: { color: "blue" } } ]
//
// hasCssRule(page, "h1", "color") then answers: "is there a rule for h1
// that sets color?". It is a simple reader, enough for beginner activities.
// ---------------------------------------------------------------

// Lower-case the text and squeeze extra spaces so "H1  p" matches "h1 p".
function cleanSelector(text) {
  return text.trim().toLowerCase().replace(/\s+/g, " ");
}

export function readCssRules(page) {
  const rules = [];

  page.querySelectorAll("style").forEach((styleTag) => {
    // Remove /* comments */, then find every   selector { declarations }   block.
    // (Rules inside @media are found too, because we match the innermost braces.)
    const css = styleTag.textContent.replace(/\/\*[\s\S]*?\*\//g, "");
    const blockPattern = /([^{}]+)\{([^{}]*)\}/g;

    let match;
    while ((match = blockPattern.exec(css)) !== null) {
      const selectors = match[1].split(",").map(cleanSelector).filter(Boolean);

      const declarations = {};
      match[2].split(";").forEach((line) => {
        const colon = line.indexOf(":");
        if (colon === -1) return;
        const property = line.slice(0, colon).trim().toLowerCase();
        const value = line.slice(colon + 1).trim();
        if (property && value) declarations[property] = value;
      });

      rules.push({ selectors, declarations });
    }
  });

  return rules;
}

// selector:   the selector to look for, for example "body" or ".box"
// properties: one property name or a list of names (any one is enough)
// valuePattern (optional): a regular expression the value must match
export function hasCssRule(page, selector, properties, valuePattern) {
  const wantedSelector = cleanSelector(selector);
  const wantedProperties = [].concat(properties).map((p) => p.toLowerCase());

  return readCssRules(page).some(
    (rule) =>
      rule.selectors.includes(wantedSelector) &&
      wantedProperties.some((property) => {
        const value = rule.declarations[property];
        if (value === undefined) return false;
        return valuePattern ? valuePattern.test(value) : true;
      })
  );
}

// Collects everything written for one selector into a single object, even when the
// student split it over several rules. Example: ruleDeclarations(page, ".caption")
// might return { position: "relative", top: "10px" }.
export function ruleDeclarations(page, selector) {
  const wantedSelector = cleanSelector(selector);
  const combined = {};
  readCssRules(page).forEach((rule) => {
    if (rule.selectors.includes(wantedSelector)) Object.assign(combined, rule.declarations);
  });
  return combined;
}
