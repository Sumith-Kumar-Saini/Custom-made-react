# Custom-made-react

A lightweight custom implementation of React's core concepts including Virtual DOM, Components, and Hooks. This project is designed for educational purposes to understand how React works under the hood.

## Features

- Virtual DOM implementation
- Component-based architecture
- State management with hooks
- Event handling
- TypeScript support

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/custom-made-react.git
cd custom-made-react
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

## Project Structure

```
custom-made-react/
├── types/              # TypeScript type definitions
├── typescript/         # Source code
│   ├── custom.ts      # Core implementation
│   └── index.ts       # Entry point
├── dist/              # Compiled output
├── index.html         # HTML template
└── package.json       # Project configuration
```

## Usage

```typescript
import { ComponentBuilder } from './typescript/custom';

const builder = new ComponentBuilder();
const { createElement, useState } = builder;

// Create a component
const Counter = ({ props, children }) => {
  const [count, setCount] = useState(0);
  
  return createElement('div', null,
    createElement('h1', null, 'Counter'),
    createElement('p', null, count),
    createElement('button', { onClick: () => setCount(count + 1) }, 'Increment')
  );
};

// Render the component
const root = document.getElementById('root');
builder.render(createElement(Counter, null), root);
```

## Known Issues

1. **State Management**
   - State updates may not be batched efficiently
   - Complex state objects might not update correctly

2. **Performance**
   - Virtual DOM diffing is not optimized for large trees
   - No memoization of components

3. **Features**
   - Limited hook support (only useState implemented)
   - No context API
   - No error boundaries
   - No server-side rendering

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by React's architecture
- Built for educational purposes
