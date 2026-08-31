import { useState, type ReactNode } from "react";

type AccordionProps = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

export default function Accordion({
  title,
  children,
  defaultOpen = false,
}: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="accordion">
      <button className="accordion-header" onClick={() => setOpen((o) => !o)}>
        <span>{title}</span>
        <span className="accordion-chevron">{open ? "▲" : "▼"}</span>
      </button>
      {open && <div className="accordion-body">{children}</div>}
    </div>
  );
}
