import type { ReactNode } from "react";

type DreamBubbleProps = {
  size?: "small" | "medium" | "large";
  intensity?: number;
  interactive?: boolean;
  selected?: boolean;
  children?: ReactNode;
};

export default function DreamBubble({size="medium",intensity=.5,interactive=false,selected=false,children}:DreamBubbleProps){
  const Tag=interactive?"button":"div";
  return <Tag className={`dream-bubble bubble-${size}${selected?" is-selected":""}`} style={{"--bubble-intensity":intensity} as React.CSSProperties}>{children}</Tag>;
}
