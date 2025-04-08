/**
 * Props type definition for component properties
 * Can be strings, numbers, or event handlers
 */
export type Props = Record<string, string | number | ((event: Event) => void)>;

/**
 * Children type definition for component children
 * Can be an array of strings/numbers or VDOM elements
 */
export type Children = (string | number)[] | VDOM[];

/**
 * Component function type definition
 * Takes props and children as arguments and returns a VDOM
 */
export type ComponentFunc = ({
  props,
  children,
}: {
  props: Props;
  children: Children;
}) => VDOM;

/**
 * Virtual DOM interface
 * Represents a node in the virtual DOM tree
 */
export interface VDOM {
  /** The type of the element (HTML tag name or component function) */
  type: string | ComponentFunc;
  /** Properties passed to the element */
  props: Props | null;
  /** Child elements or text nodes */
  children: Children;
}

/**
 * Component instance interface
 * Represents a mounted component with its state and lifecycle
 */
export interface ComponentInstance {
  /** The component function */
  component: ComponentFunc;
  /** Props passed to the component */
  props: Props | null;
  /** Child elements or text nodes */
  children: Children;
  /** Component state */
  state: Record<string, any>;
  /** Function to update component state */
  setState: (newState: Record<string, any>) => void;
  /** Unique identifier for the component */
  id: number;
  /** The actual DOM element */
  instance: HTMLElement | null;
}