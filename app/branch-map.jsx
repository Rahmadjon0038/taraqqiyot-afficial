"use client";

import { useState } from "react";
import { branchInfo, branchNames } from "@/lib/data";

const order = ["boburshox", "chorsu", "davlatobod"];

export default function BranchMap() {
  const [active, setActive] = useState(order[0]);
  const info = branchInfo[active];

  return (
    <div className="branch-map">
      <div className="branch-side">
        <div className="branch-tabs" role="tablist">
          {order.map((branch) => (
            <button
              key={branch}
              type="button"
              role="tab"
              aria-selected={branch === active}
              className={branch === active ? "branch-tab is-active" : "branch-tab"}
              onClick={() => setActive(branch)}
            >
              <strong>{branchNames[branch]}</strong>
            </button>
          ))}
        </div>

        <dl className="branch-details">
          {info.landmark && (
            <div>
              <dt>Mo'ljal</dt>
              <dd>{info.landmark}</dd>
            </div>
          )}
          <div>
            <dt>Ish vaqti</dt>
            <dd>{info.hours}</dd>
          </div>
          <div>
            <dt>Telefon</dt>
            <dd>
              <a href={`tel:${info.phone.replace(/\s/g, "")}`}>{info.phone}</a>
            </dd>
          </div>
        </dl>

        <a href={info.map} target="_blank" rel="noopener noreferrer" className="btn-block">
          Xaritada ochish ↗
        </a>
      </div>

      <div className="branch-frame">
        <iframe
          key={active}
          src={info.embed}
          title={`${branchNames[active]} filiali xaritada`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </div>
  );
}
