import { useState, useRef } from "react";
import html2canvas from "html2canvas";

const Body = () => {
  const [inputData, setInputData] = useState({ top: "", bottom: "", imageUrl: "" });
  const [localImage, setLocalImage] = useState<string | null>(null);
  const [containerSize, setContainerSize] = useState({ width: 500, height: 500 });
  const memeRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgImgRef = useRef<HTMLDivElement>(null);

  const updateContainerSize = (naturalWidth: number, naturalHeight: number) => {
    const aspectRatio = naturalHeight / naturalWidth;
    const maxWidth = 500;
    const calculatedHeight = maxWidth * aspectRatio;
    
    setContainerSize({
      width: maxWidth,
      height: calculatedHeight
    });
  };

  const handleImageLoad = (src: string) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      updateContainerSize(img.naturalWidth, img.naturalHeight);
    };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputData.imageUrl) {
      setLocalImage(null);
      handleImageLoad(inputData.imageUrl);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string;
          setLocalImage(dataUrl);
          setInputData(prev => ({ ...prev, imageUrl: "" }));
          handleImageLoad(dataUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadMeme = async () => {
    if (!memeRef.current) return;
    
    try {
      const canvas = await html2canvas(memeRef.current, {
        useCORS: true,
        scale: 2,
        allowTaint: false,
        backgroundColor: null,
        width: containerSize.width,
        height: containerSize.height
      });

      canvas.toBlob((blob) => {
        if (!blob) return;
        const link = document.createElement("a");
        link.download = "meme.png";
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
      }, "image/png");
    } catch (error) {
      console.error("Error generating meme:", error);
      alert("Error generating meme. Please try again.");
    }
  };

  return (
    <div style={{ margin: "0 auto", padding: "20px" }}>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
        <form onSubmit={handleImageSubmit} style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              name="imageUrl"
              value={inputData.imageUrl}
              onChange={handleChange}
              className="form-control input-group-sm" 
              placeholder="Enter image URL"
              style={{ flex: 1 }}
            />
            <button className="btn btn-outline-primary btn-sm rounded" type="submit">Load URL</button>
          </div>
        </form>

        <div>
          <input
            type="file"
            accept="image/*" 
            onChange={handleFileUpload}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
          <button className="btn btn-outline-primary btn-sm rounded" onClick={() => fileInputRef.current?.click()}>
            Upload Image
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          name="top"
          onChange={handleChange}
          className="form-control input-group-sm mb-2"
          placeholder="Top Text"
          value={inputData.top}
          style={{ flex: 1 }}
        />
        <input
          name="bottom"
          onChange={handleChange}
          className="form-control input-group-sm mb-2"
          placeholder="Bottom Text"
          value={inputData.bottom}
          style={{ flex: 1 }}
        />
      </div>

      <button 
      className="btn btn-outline-success btn-sm rounded"
        onClick={downloadMeme} 
        style={{ marginBottom: "20px", width: "100%" }}
      >
        Download Meme
      </button>

      <div
        className="meme-container"
        ref={memeRef}
        style={{
          position: "relative",
          width: `${containerSize.width}px`,
          height: `${containerSize.height}px`,
          margin: "20px auto",
          lineHeight: 0,
          overflow: "hidden",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}
      >
        <div
          ref={bgImgRef}
          style={{
            width: "100%",
            height: "100%",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundImage: localImage 
              ? `url(${localImage})` 
              : inputData.imageUrl 
              ? `url(${inputData.imageUrl})`
              : "none",
            ...(inputData.imageUrl && !localImage ? { crossOrigin: "anonymous" } : {})
          }}
        />
        
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          pointerEvents: "none"
        }}>
          <div style={{
            color: "white",
            textShadow: "2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000",
            fontSize: "2.5em",
            fontWeight: "bold",
            fontFamily: "Impact, sans-serif",
            textTransform: "uppercase",
            lineHeight: 1.1,
            wordBreak: "break-word"
          }}>
            {inputData.top}
          </div>
          
          <div style={{
            color: "white",
            textShadow: "2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000",
            fontSize: "2.5em",
            fontWeight: "bold",
            fontFamily: "Impact, sans-serif",
            textTransform: "uppercase",
            lineHeight: 1.1,
            wordBreak: "break-word"
          }}>
            {inputData.bottom}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;