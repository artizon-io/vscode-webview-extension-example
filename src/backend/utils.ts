export const html = (
  template: TemplateStringsArray,
  ...templateElements: any[]
) =>
  template.reduce((acc, str, i) => acc + str + (templateElements[i] ?? ""), "");
