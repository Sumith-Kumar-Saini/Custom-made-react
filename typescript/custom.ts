import {
  Children,
  ComponentFunc,
  ComponentInstance,
  Props,
  VDOM,
} from "types/index";

/**
 * ComponentBuilder is the core class that implements React-like functionality
 * including Virtual DOM, Components, and Hooks.
 */
export class ComponentBuilder {
  private vdom: VDOM | null = null;
  private root: HTMLElement | null = null;
  private componentCounter: number = 0;
  private components: { [key: number]: ComponentInstance } = {};
  private currentComponentId: number | null = null;

  /**
   * Creates a new Virtual DOM element
   * @param type - The type of element (string for HTML elements, function for components)
   * @param props - Properties to be passed to the element
   * @param children - Child elements or text nodes
   * @returns A Virtual DOM object
   */
  public static createElement = (
    type: string | ComponentFunc,
    props: Props | null,
    ...children: Children
  ): VDOM => {
    return { type, props, children };
  };

  public createElement = ComponentBuilder.createElement;

  /**
   * Creates a DOM instance from a Virtual DOM object
   * @param vdom - The Virtual DOM object to render
   * @returns The rendered HTMLElement
   */
  private createInstance = (vdom: VDOM): HTMLElement => {
    if (typeof vdom.type === "function") {
      return this.createComponent(vdom);
    } else if (typeof vdom.type === "string") {
      return this.renderElement(vdom);
    }
    throw new Error("Invalid VDOM type: must be a string or function");
  };

  /**
   * Creates a component instance and manages its lifecycle
   * @param vdom - The Virtual DOM object representing a component
   * @returns The rendered HTMLElement
   */
  private createComponent = (vdom: VDOM): HTMLElement => {
    if (typeof vdom.type !== "function") {
      return this.renderElement(vdom);
    }

    const componentID = this.componentCounter++;
    const componentInstance: ComponentInstance = {
      component: vdom.type,
      children: vdom.children,
      props: vdom.props || {},
      id: componentID,
      state: {},
      setState: (newState: Record<string, any>) => {
        Object.assign(componentInstance.state, newState);
      },
      instance: null,
    };

    this.components[componentID] = componentInstance;
    componentInstance.instance = this.renderComponent(componentID);
    return componentInstance.instance;
  };

  /**
   * Renders a component by its ID
   * @param componentId - The ID of the component to render
   * @returns The rendered HTMLElement
   */
  private renderComponent = (componentId: number): HTMLElement => {
    const componentInstance = this.components[componentId];
    this.currentComponentId = componentId;

    const element = componentInstance.component({
      props: componentInstance.props || {},
      children: componentInstance.children,
    });

    return this.createInstance(element);
  };

  /**
   * Renders an HTML element from a Virtual DOM object
   * @param vdom - The Virtual DOM object to render
   * @returns The rendered HTMLElement
   */
  private renderElement = (vdom: VDOM): HTMLElement => {
    if (typeof vdom.type !== "string") {
      return this.createComponent(vdom);
    }

    const element = document.createElement(vdom.type);
    const { props } = vdom;

    if (props) {
      Object.keys(props).forEach((key) => {
        if (key.startsWith("on")) {
          element.addEventListener(
            key.substring(2).toLowerCase(),
            props[key] as (event: Event) => void
          );
        } else if (key === "className") {
          element.setAttribute("class", String(props[key]));
        } else {
          element.setAttribute(key, String(props[key]));
        }
      });
    }

    vdom.children.forEach((child) => {
      if (typeof child === "string" || typeof child === "number") {
        element.appendChild(document.createTextNode(String(child)));
      } else {
        element.appendChild(this.createInstance(child));
      }
    });

    return element;
  };

  /**
   * React-like useState hook implementation
   * @param initialState - The initial state value
   * @returns A tuple containing the current state and a function to update it
   */
  public useState = <T>(
    initialState: T
  ): [T, (newState: T | ((prevState: T) => T)) => void] => {
    const componentID = this.currentComponentId;
    if (componentID === null) {
      throw new Error("useState must be called inside a component render");
    }

    const componentInstance = this.components[componentID];
    const stateKey = `state_${Object.keys(componentInstance.state).length}`;
    
    if (!(stateKey in componentInstance.state)) {
      componentInstance.state[stateKey] = initialState;
    }

    const setState = (newState: T | ((prevState: T) => T)) => {
      const prev = componentInstance.state[stateKey];
      const value =
        typeof newState === "function"
          ? (newState as (prevState: T) => T)(prev)
          : newState;

      if (value !== prev) {
        componentInstance.state[stateKey] = value;
        const element = this.renderComponent(componentID);
        componentInstance.instance?.replaceWith(element);
        componentInstance.instance = element;
      }
    };

    return [componentInstance.state[stateKey], setState];
  };

  /**
   * Renders a Virtual DOM tree into a DOM element
   * @param vdom - The root Virtual DOM object
   * @param root - The DOM element to render into
   */
  public render = (vdom: VDOM, root: HTMLElement | null): void => {
    if (!vdom) {
      throw new Error("VDOM is null and cannot be used to create an instance.");
    }
    
    this.vdom = vdom;
    if (root !== null) {
      this.root = root;
      this.root.innerHTML = "";
      this.appendChild();
    } else {
      this.root = document.createElement("div");
      this.root.id = "root";
      this.appendChild();
    }
  };

  /**
   * Appends the rendered Virtual DOM to the root element
   */
  private appendChild = () => {
    if (!this.vdom) {
      throw new Error("VDOM is null and cannot be used to create an instance.");
    }
    const element = this.createInstance(this.vdom);
    this.root?.appendChild(element);
  };
}

// Create Component Instance
class CCInstance {
  private component: ComponentFunc | null = null;
  private props: Props | null = null;
  private children: Children | null = null;
  private state: Record<string, any> = {};

  // I think this line is not needed!
  public setState = (newState: Record<string, any>) => {
    Object.assign(this.state, newState);
  };

  private id: number = 0;
  private currentState: string | null = null;
  private _instance: HTMLElement | null = null;

  public get instance(): HTMLElement {
    if (this._instance == null) throw new Error("Instance is given");
    return this._instance;
  }
  public set instance(v: HTMLElement) {
    this._instance = v;
  }

  public next: () => number = () => {
    if (!this.currentState) throw new Error("The currentState is set");
    // if (!this.currentState) this.currentState = `state_0`;
    // fix: state_ as a dynamic value.
    let currentCount = Number(this.currentState.split("state_")[1]);
    currentCount++;
    this.currentState = `state_${currentCount}`;
    return currentCount;
  };

  public set = ({
    component,
    props,
    children,
    id,
    state,
  }: {
    component: ComponentFunc;
    props: Props | null;
    children: Children;
    state: Record<string, any>;
    id: number;
  }) => {
    this.component = component;
    this.props = props;
    this.children = children;
    this.id = id;
    this.state = state;
  };

  public get = () => {
    return {
      component: this.component,
      props: this.props,
      children: this.children,
      id: this.id,
      state: this.state,
    };
  };
}

// now make renderElement, createInstance
