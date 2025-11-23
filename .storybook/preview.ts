import type { Preview } from "@storybook/react";
import "../src/styles/globals.css";

const preview: Preview = {
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
    globalTypes: {
        theme: {
            description: "Global theme for components",
            defaultValue: "light",
            toolbar: {
                title: "Theme",
                icon: "circlehollow",
                items: [
                    { value: "light", icon: "circlehollow", title: "Light" },
                    { value: "dark", icon: "circle", title: "Dark" },
                ],
                dynamicTitle: true,
            },
        },
        locale: {
            description: "Internationalization locale",
            defaultValue: "de",
            toolbar: {
                title: "Locale",
                icon: "globe",
                items: [
                    { value: "de", title: "Deutsch" },
                    { value: "en", title: "English" },
                    { value: "es", title: "Español" },
                ],
                dynamicTitle: true,
            },
        },
    },
    decorators: [
        (Story, context) => {
            const theme = context.globals.theme;
            const locale = context.globals.locale;

            return (
                <div className= {`theme-${theme} locale-${locale}`
        }>
        <Story />
        </div>
      );
    },
  ],
};

export default preview; 