import loadImage from "blueimp-load-image";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { parse } from "exifr";
import ReactTooltip from "react-tooltip";

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const Resizer = () => {
  const [urlz, setUrlz] = useState([]);
  const onDrop = async (acceptedFiles) => {
    let urls = [];
    await asyncForEach(acceptedFiles, async (af) => {
      const blobUrl = await resize(af);
      urls.push(blobUrl);
    });
    console.log("done", urls);
    setUrlz([...urlz, ...urls]);
  };
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const resize = async (file) => {
    const blob = await new Promise((resolve) => {
      loadImage(
        file,
        function (img, data) {
          //   if (data.imageHead && data.exif) {
          // Reset Exif Orientation data:
          try {
            // loadImage.writeExifData(data.imageHead, data, "Orientation", 1);
            img.toBlob(function (blob) {
              try {
                loadImage.replaceHead(blob, data.imageHead, function (newBlob) {
                  parse(newBlob).then((metadata) => {
                    resolve([URL.createObjectURL(newBlob), metadata || {}]);
                  });
                  // do something with newBlob
                });
              } catch (e) {
                resolve([URL.createObjectURL(blob), {}]);
              }
            }, file.type);
          } catch (ex) {
            console.log(ex);
          }
          //   }
        },
        { meta: true, canvas: true, orientation: true, maxWidth: 200 }
      );
    });
    return blob;
  };

  return (
    <div>
      <h1>🖼️ PoC in-browser image resize preserving EXIF ⚡</h1>
      <h3>💡 Click on image thumbnail to view EXIF of resized image</h3>
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
      {/* <img alt="Drop image to view" src={url} /> */}
    </div>
  );
};

export default Resizer;
