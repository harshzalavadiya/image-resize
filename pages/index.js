import dynamic from "next/dynamic";
import React from "react";

const Resizer = dynamic(import("../components/resizer"), { ssr: false });

export default function HomePage() {
  return (
    <div className="container">
      <Resizer />
    </div>
  );
}
