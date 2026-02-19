import React, { useState } from "react";
import "../../styles/MissingFeeMappingsCollapse.css"

const MissingFeeMappingsCollapse = ({
  title = "Missing fee mappings",
  children,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="missing-collapse" style={{ marginBottom: 24 }}>
      <button
        type="button"
        className="missing-collapse__header"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <h3>{title}</h3>
        <span
          className={`missing-collapse__icon ${open ? "open" : ""}`}
        >
          ▾
        </span>
      </button>

      {open && (
        <div className="missing-collapse__content">
          {children ?? <div>Missing fee mappings</div>}
        </div>
      )}
    </div>
  );
};

export default MissingFeeMappingsCollapse;
