import { Children, Props, VDOM } from "types/index";
import { ComponentBuilder } from "./custom.js";

const builder = new ComponentBuilder();
const { createElement } = ComponentBuilder;
const { useState } = builder;

// Tailwind CSS classes
const tailwindClasses = {
  container:
    "flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 w-full",
  card: "bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md",
  heading:
    "text-2xl font-semibold mb-4 text-center text-gray-800 dark:text-gray-200",
  count: "text-4xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100",
  buttons: "flex justify-center space-x-4",
  button: "px-4 py-2 rounded-md transition-colors duration-200",
  buttonIncrement: "bg-blue-500 hover:bg-blue-600 text-white",
  buttonDecrement: "bg-red-500 hover:bg-red-600 text-white",
  buttonReset: "bg-gray-300 hover:bg-gray-400 text-gray-800",
  input: "border p-2 rounded-md",
  label: "block text-sm font-medium text-gray-700 dark:text-gray-300",
};

// Button Component
const Button = ({ props, children }: { props: Props; children: Children }): VDOM => {
  const buttonClasses = `${tailwindClasses.button} ${props.className || ""}`;
  return createElement(
    "button",
    { ...props, className: buttonClasses },
    ...children
  );
};

// Counter Component with Input and Min/Max Limits
const Counter = (): VDOM => {
  const [count, setCount] = useState(0);

  const increment = () => {
      setCount(count + 1);
  };

  const decrement = () => {
      setCount(count == 0 ? 0 : count - 1);
  };

  const reset = () => {
    setCount(0);
  };

  return createElement(
    "div",
    { className: tailwindClasses.container },
    createElement(
      "div",
      { className: tailwindClasses.card },
      createElement("h2", { className: tailwindClasses.heading }, "Counter"),
      createElement("div", { className: tailwindClasses.count }, count),
      createElement(
        "div",
        { className: tailwindClasses.buttons },
        createElement(
          Button,
          { className: tailwindClasses.buttonIncrement, onClick: increment },
          "Increment"
        ),
        createElement(
          Button,
          { className: tailwindClasses.buttonDecrement, onClick: decrement },
          "Decrement"
        ),
        createElement(
          Button,
          { className: tailwindClasses.buttonReset, onClick: reset },
          "Reset"
        )
      )
    )
  );
};

// Usage example
const root = document.getElementById("root");
builder.render(createElement(Counter, null), root);
