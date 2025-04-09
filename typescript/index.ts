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

// Input Component
const Input = ({ props }: { props: Props }): VDOM => {
  return createElement("input", { ...props, className: tailwindClasses.input });
};

// Label Component
const Label = ({ props, children }: { props: Props; children: Children }): VDOM => {
  return createElement(
    "label",
    { ...props, className: tailwindClasses.label },
    ...children
  );
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

// Main Counter component with input fields for min/max limits
// Utilizes useState for state management
const Counter = (): VDOM => {
  const [count, setCount] = useState(0);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(100);

  // Function to increment the count
  const increment = () => {
    if (count < max) {
      setCount(count + 1);
    }
  };

  // Function to decrement the count
  const decrement = () => {
    if (count > min) {
      setCount(count - 1);
    }
  };

  // Function to reset the count to the minimum value
  const reset = () => {
    setCount(min);
  };

  // Handles changes to the minimum input field
  const handleMinChange = (event: Event) => {
    let value = Number((event.target as HTMLInputElement).value) || 0
    setMin(value);
    setCount(value > count ? value : count);
  };

  // Handles changes to the maximum input field
  const handleMaxChange = (event: Event) => {
    let value = (Number((event.target as HTMLInputElement).value));
    value = Number.isNaN(value) ? 100 : value;
    console.log(value);
    setMax(value);
    setCount(value < count ? value : count);
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
      ),
      createElement(
        "div",
        null,
        createElement(Label, null, "Min:"),
        createElement(Input, {
          type: "text",
          value: min,
          onChange: handleMinChange,
        })
      ),
      createElement(
        "div",
        null,
        createElement(Label, null, "Max:"),
        createElement(Input, {
          type: "text",
          value: max,
          onChange: handleMaxChange,
        })
      )
    )
  );
};

// Usage example: Render the Counter component into the root element
const root = document.getElementById("root");
builder.render(createElement(Counter, null), root);