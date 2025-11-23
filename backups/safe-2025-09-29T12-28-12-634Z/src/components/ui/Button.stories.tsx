import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Eine barrierefreie, responsive Button-Komponente mit verschiedenen Varianten und Größen.",
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["primary", "secondary", "outline", "ghost", "text"],
      description: "Die visuelle Variante des Buttons",
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg", "xl"],
      description: "Die Größe des Buttons",
    },
    disabled: {
      control: { type: "boolean" },
      description: "Deaktiviert den Button",
    },
    loading: {
      control: { type: "boolean" },
      description: "Zeigt einen Ladezustand an",
    },
    onClick: {
      action: "clicked",
      description: "Callback-Funktion bei Klick",
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basis-Story
export const Default: Story = {
  args: {
    children: "Button",
  },
};

// Primary-Button
export const Primary: Story = {
  args: {
    children: "Primary Button",
    variant: "primary",
  },
};

// Secondary-Button
export const Secondary: Story = {
  args: {
    children: "Secondary Button",
    variant: "secondary",
  },
};

// Outline-Button
export const Outline: Story = {
  args: {
    children: "Outline Button",
    variant: "outline",
  },
};

// Ghost-Button
export const Ghost: Story = {
  args: {
    children: "Ghost Button",
    variant: "ghost",
  },
};

// Größen-Varianten
export const Small: Story = {
  args: {
    children: "Small Button",
    size: "sm",
  },
};

export const Medium: Story = {
  args: {
    children: "Medium Button",
    size: "md",
  },
};

export const Large: Story = {
  args: {
    children: "Large Button",
    size: "lg",
  },
};

// Deaktivierter Button
export const Disabled: Story = {
  args: {
    children: "Disabled",
    disabled: true,
  },
};

// Ladezustand
export const Loading: Story = {
  args: {
    children: "Loading...",
    loading: true,
  },
};

// Mit Icon
export const WithIcon: Story = {
  args: {
    children: (
      <>
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        With Icon
      </>
    ),
  },
};

// Alle Varianten
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
      <div className="flex flex-wrap gap-4">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </div>
      <div className="flex flex-wrap gap-4">
        <Button disabled>Disabled</Button>
        <Button loading>Loading...</Button>
      </div>
    </div>
  ),
};

// Accessibility-Test
export const AccessibilityTest: Story = {
  args: {
    children: "Accessibility Test",
    "aria-label": "Zusätzliches Label für Screen Reader",
  },
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: "button-name",
            enabled: true,
          },
          {
            id: "color-contrast",
            enabled: true,
          },
        ],
      },
    },
  },
};

// Interaktiver Test
export const Interactive: Story = {
  args: {
    children: "Click me!",
  },
};

// Responsive Test
export const Responsive: Story = {
  args: {
    children: "Responsive Button",
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

// Dark Mode Test
export const DarkMode: Story = {
  args: {
    children: "Dark Mode Button",
  },
  parameters: {
    backgrounds: {
      default: "dark",
    },
  },
};

// Performance Test
export const Performance: Story = {
  args: {
    children: "Performance Test",
  },
  parameters: {
    chromatic: { delay: 300 },
  },
};

// Visual Regression Test
export const VisualRegression: Story = {
  args: {
    children: "Visual Regression Test",
  },
  parameters: {
    chromatic: {
      viewports: [320, 1200],
      delay: 300,
    },
  },
};
