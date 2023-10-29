# VSCode Outline

A vscode extension that provides a feature-rich outline view.

<!-- ![Showcase]() -->

VSCode comes with an outline view by default. But it has very limited features and there is no extensible API for it. Features provided by this outline view extension include:

- Symbols that are under the editor cursor are auto highlighted and revealed in the outline view.
- Currently selected symbols in the outline view are auto revealed in the editor.
- Symbols filtering
- Syntax highlighted symbols
- Sticky symbols: parent symbol will stick to the top while its children symbols are visible

**Why not use [Tree View API](https://code.visualstudio.com/api/extension-guides/tree-view)?**

Tree view API only allows for a very limited degree of customisation. This extension is implemented by rolling its own [webview](https://code.visualstudio.com/api/extension-guides/webview) which means that the tree would have to be made from scratch. The downside is that it is tricky to get the style to align with other existing tree views such as the file explorer. As such, [the use of webview is discouraged](https://code.visualstudio.com/api/ux-guidelines/webviews).
