declare module 'framer-motion' {
  export interface AnimatePresenceProps {
    children?: React.ReactNode;
    custom?: any;
    initial?: boolean;
    mode?: "sync" | "wait" | "popLayout";
    onExitComplete?: () => void;
    exitBeforeEnter?: boolean;
  }

  export interface MotionProps {
    initial?: any;
    animate?: any;
    exit?: any;
    variants?: any;
    transition?: any;
    whileHover?: any;
    style?: React.CSSProperties;
    className?: string;
    children?: React.ReactNode;
    [key: string]: any;
  }

  export const motion: {
    div: React.ComponentType<MotionProps & React.HTMLAttributes<HTMLDivElement>>;
    span: React.ComponentType<MotionProps & React.HTMLAttributes<HTMLSpanElement>>;
    img: React.ComponentType<MotionProps & React.ImgHTMLAttributes<HTMLImageElement>>;
    button: React.ComponentType<MotionProps & React.ButtonHTMLAttributes<HTMLButtonElement>>;
    a: React.ComponentType<MotionProps & React.AnchorHTMLAttributes<HTMLAnchorElement>>;
    ul: React.ComponentType<MotionProps & React.HTMLAttributes<HTMLUListElement>>;
    li: React.ComponentType<MotionProps & React.HTMLAttributes<HTMLLIElement>>;
    header: React.ComponentType<MotionProps & React.HTMLAttributes<HTMLElement>>;
    footer: React.ComponentType<MotionProps & React.HTMLAttributes<HTMLElement>>;
    main: React.ComponentType<MotionProps & React.HTMLAttributes<HTMLElement>>;
    nav: React.ComponentType<MotionProps & React.HTMLAttributes<HTMLElement>>;
    section: React.ComponentType<MotionProps & React.HTMLAttributes<HTMLElement>>;
    article: React.ComponentType<MotionProps & React.HTMLAttributes<HTMLElement>>;
    aside: React.ComponentType<MotionProps & React.HTMLAttributes<HTMLElement>>;
    [key: string]: React.ComponentType<MotionProps & any>;
  };

  export const AnimatePresence: React.ComponentType<AnimatePresenceProps>;
} 