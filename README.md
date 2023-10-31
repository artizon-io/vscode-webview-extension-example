# vscode webview extension example

An example of an extension that uses:
- React, vite, and tailwind for the webview
- Vitest for unit testing the webview
- [redhat-developer/vscode-extension-tester](https://github.com/redhat-developer/vscode-extension-tester/) for E2E testing of the whole extension

This project started off as an extension that aims to provide a feature-rich outline view as a replacement to the default one. It is important to know that [the use of the Webview API is discouraged](https://code.visualstudio.com/api/ux-guidelines/webviews). Please consult the [UX-guidelines](https://code.visualstudio.com/api/ux-guidelines/overview) for more information.

## Structure

The extension is composed of two parts: the webview (located at `src/webview`) and the extension "backend" (located at `src/outline`).

Before the extension is packaged, the JS/TS source of the webview would undergo a series of module-bundling/transpiling steps. This build process is driven by vite.

The backend requires a build step too, which is simply a Typescript compilation step.

The build can be invoked by executing:

```shell
npm run build:backend
# or
npm run build:webview
# or
npm run build  # run both
```

## Testing

The testing of this extension is composed of two parts: unit testing for logic inside the webview and e2e testing for the whole extension.

The unit testing is driven by vitest, whereas the e2e tests are driven by the [redhat-developer/vscode-extension-tester](https://github.com/redhat-developer/vscode-extension-tester/wiki/) framework, which uses mocha and the selenium w/ chromium driver behind the scene.

The tests are can ran by executing:

```shell
npm run test:webview
# or
npm run test:e2e
# or
npm run test  # run both
```
