"use client";

import { useState } from "react";
import { branchInfo } from "@/lib/data";
import { getDictionary } from "@/lib/i18n";

const order = ["boburshox", "chorsu", "davlatobod"];

export default function BranchMap({ lang }) {
  const t = getDictionary(lang);
  const [active, setActive] = useState(order[0]);
  const info = branchInfo[active];
  const landmark = t.landmarks[active];

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
              <strong>{t.branchNames[branch]}</strong>
            </button>
          ))}
        </div>

        <dl className="branch-details">
          {landmark && (
            <div>
              <dt>{t.branches.landmark}</dt>
              <dd>{landmark}</dd>
            </div>
          )}
          <div>
            <dt>{t.branches.hours}</dt>
            <dd>{info.hours}</dd>
          </div>
          <div>
            <dt>{t.branches.phone}</dt>
            <dd>
              <a href={`tel:${info.phone.replace(/\s/g, "")}`}>{info.phone}</a>
            </dd>
          </div>
        </dl>

        <a href={info.map} target="_blank" rel="noopener noreferrer" className="btn-block">
          {t.branches.openMap}
        </a>
      </div>

      <div className="branch-frame">
        <iframe
          key={active}
          src={info.embed}
          title={t.branches.mapTitle(t.branchNames[active])}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </div>
  );
}
