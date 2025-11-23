import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../src/components/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
    "@storybook/addon-viewport",
    "@storybook/addon-backgrounds",
    "@storybook/addon-measure",
    "@storybook/addon-outline",
    "@storybook/addon-docs",
    "@storybook/addon-controls",
    "@storybook/addon-actions",
    "@storybook/addon-toolbars",
    "@storybook/addon-highlight",
    "@storybook/addon-jest",
    "@storybook/addon-coverage",
    "@storybook/addon-storysource",
    "@storybook/addon-knobs",
    "@storybook/addon-notes",
    "@storybook/addon-info",
    "@storybook/addon-contexts",
    "@storybook/addon-queryparams",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
    "@storybook/addon-viewport",
    "@storybook/addon-backgrounds",
    "@storybook/addon-measure",
    "@storybook/addon-outline",
    "@storybook/addon-docs",
    "@storybook/addon-controls",
    "@storybook/addon-actions",
    "@storybook/addon-toolbars",
    "@storybook/addon-highlight",
    "@storybook/addon-jest",
    "@storybook/addon-coverage",
    "@storybook/addon-storysource",
    "@storybook/addon-knobs",
    "@storybook/addon-notes",
    "@storybook/addon-info",
    "@storybook/addon-contexts",
    "@storybook/addon-queryparams",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {
      builder: {
        viteConfigPath: "vite.config.ts",
      },
    },
  },
  docs: {
    autodocs: "tag",
  },
  typescript: {
    check: true,
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
  viteFinal: async (config) => {
    // Optimize Vite config for Storybook
    config.optimizeDeps = {
      ...config.optimizeDeps,
      include: [
        "react",
        "react-dom",
        "@storybook/react",
        "@storybook/addon-essentials",
        "@storybook/addon-interactions",
        "@storybook/addon-a11y",
        "@storybook/addon-viewport",
        "@storybook/addon-backgrounds",
        "@storybook/addon-measure",
        "@storybook/addon-outline",
        "@storybook/addon-docs",
        "@storybook/addon-controls",
        "@storybook/addon-actions",
        "@storybook/addon-toolbars",
        "@storybook/addon-highlight",
        "@storybook/addon-jest",
        "@storybook/addon-coverage",
        "@storybook/addon-storysource",
        "@storybook/addon-knobs",
        "@storybook/addon-notes",
        "@storybook/addon-info",
        "@storybook/addon-contexts",
        "@storybook/addon-queryparams",
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-interactions",
        "@storybook/addon-a11y",
        "@storybook/addon-viewport",
        "@storybook/addon-backgrounds",
        "@storybook/addon-measure",
        "@storybook/addon-outline",
        "@storybook/addon-docs",
        "@storybook/addon-controls",
        "@storybook/addon-actions",
        "@storybook/addon-toolbars",
        "@storybook/addon-highlight",
        "@storybook/addon-jest",
        "@storybook/addon-coverage",
        "@storybook/addon-storysource",
        "@storybook/addon-knobs",
        "@storybook/addon-notes",
        "@storybook/addon-info",
        "@storybook/addon-contexts",
        "@storybook/addon-queryparams",
      ],
    };

    return config;
  },
  core: {
    builder: "@storybook/builder-vite",
    disableTelemetry: true,
  },
  features: {
    storyStoreV7: true,
    interactionsDebugger: true,
    breakingChangesV7: true,
    argTypeTargetsV7: true,
    legacyMdx1: false,
  },
  staticDirs: ["../public"],
  env: (config) => ({
    ...config,
    NODE_ENV: "development",
    STORYBOOK_ENV: "development",
  }),
  managerHead: (entries) => [
    ...entries,
    `<link rel="icon" type="image/svg+xml" href="/favicon.svg" />`,
    `<meta name="theme-color" content="#000000" />`,
    `<meta name="description" content="Lopez IT Welt - Enterprise++ Design System" />`,
  ],
  previewHead: (entries) => [
    ...entries,
    `<link rel="icon" type="image/svg+xml" href="/favicon.svg" />`,
    `<meta name="theme-color" content="#000000" />`,
    `<meta name="description" content="Lopez IT Welt - Enterprise++ Design System" />`,
  ],
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: "light",
      values: [
        {
          name: "light",
          value: "#ffffff",
        },
        {
          name: "dark",
          value: "#1a1a1a",
        },
        {
          name: "blue",
          value: "#3b82f6",
        },
        {
          name: "green",
          value: "#10b981",
        },
        {
          name: "red",
          value: "#ef4444",
        },
      ],
    },
    viewport: {
      viewports: {
        mobile: {
          name: "Mobile",
          styles: {
            width: "375px",
            height: "667px",
          },
        },
        tablet: {
          name: "Tablet",
          styles: {
            width: "768px",
            height: "1024px",
          },
        },
        desktop: {
          name: "Desktop",
          styles: {
            width: "1920px",
            height: "1080px",
          },
        },
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: "color-contrast",
            enabled: true,
          },
          {
            id: "button-name",
            enabled: true,
          },
          {
            id: "image-alt",
            enabled: true,
          },
          {
            id: "label",
            enabled: true,
          },
          {
            id: "list",
            enabled: true,
          },
          {
            id: "listitem",
            enabled: true,
          },
          {
            id: "region",
            enabled: true,
          },
        ],
      },
    },
    docs: {
      toc: true,
      source: {
        type: "dynamic",
        excludeDecorators: true,
      },
    },
    options: {
      storySort: {
        order: [
          "Introduction",
          "Design System",
          "Components",
          ["Core", "Features", "UI", "Layout"],
          "Pages",
          "Examples",
          "Tests",
        ],
      },
    },
  },
};

export default config;
