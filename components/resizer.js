import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import ReactTooltip from "react-tooltip";

import { resizeMultiple } from "./resize";

const Resizer = () => {
  const [urlz, setUrlz] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const onDrop = async (acceptedFiles) => {
    setIsLoading(true);
    const all = await resizeMultiple(acceptedFiles);
    setUrlz([...urlz, ...all]);
    setIsLoading(false);
  };
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div>
      <h1>🖼️ PoC in-browser image resize preserving EXIF (update 1) ⚡</h1>
      <h3>💡 Click on image thumbnail to view EXIF of resized image</h3>
      {isLoading && <div>Loading...</div>}
      <div className="dropzone" {...getRootProps()}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      {urlz.map(([img, exif]) => (
        <div style={{ display: "inline-block" }} key={img}>
          <img
            data-place="bottom"
            style={{
              height: "200px",
              width: "200px",
              objectFit: "contain",
              marginRight: "0.5rem",
              marginBottom: "0.5rem",
              background: "#ddd",
              borderRadius: "0.25rem",
            }}
            data-event="click focus"
            data-tip
            data-for={img}
            src={img}
          />
          <ReactTooltip clickable={true} id={img}>
            <div style={{ maxHeight: "200px", overflow: "auto" }}>
              <pre>{JSON.stringify(exif, null, 2)}</pre>
            </div>
          </ReactTooltip>
        </div>
      ))}
    </div>
  );
};

export default Resizer;
