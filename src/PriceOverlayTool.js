import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import "./PriceOverlayToolModified.css";
import "./styles.css";

const PriceOverlayTool = ({ preloadedImage, preloadedTitle }) => {
  // Price-related state variables
  const [price, setPrice] = useState("1,499");
  const [currencySymbol, setCurrencySymbol] = useState("₹");
  const [fontSize, setFontSize] = useState(120);
  const [fontWeight, setFontWeight] = useState(700);
  const [fontColor, setFontColor] = useState("#ffffff");
  const [textStroke, setTextStroke] = useState(true);
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [textShadow, setTextShadow] = useState(true);
  const [xPosition, setXPosition] = useState(50);
  const [yPosition, setYPosition] = useState(60);

  // NEW: Separate bounding box for price
  const [priceBoundingBox, setPriceBoundingBox] = useState({
    x: 6,
    y: 53,
    width: 36,
    height: 6,
    visible: true,
  });

  // Company name state variables - completely separate from price
  const [showCompanyName, setShowCompanyName] = useState(true);
  const [companyName, setCompanyName] = useState("GFS Travel");
  const [companyNameFontSize, setCompanyNameFontSize] = useState(100);
  const [companyNameFontWeight, setCompanyNameFontWeight] = useState(700);
  const [companyNameColor, setCompanyNameColor] = useState("#ffffff");
  const [companyNameStroke, setCompanyNameStroke] = useState(true);
  const [companyNameStrokeColor, setCompanyNameStrokeColor] =
    useState("#000000");
  const [companyNameStrokeWidth, setCompanyNameStrokeWidth] = useState(2);
  const [companyNameShadow, setCompanyNameShadow] = useState(true);
  const [companyNamePosition, setCompanyNamePosition] = useState({
    x: 50,
    y: 50,
  });

  // NEW: Separate bounding box for company name
  const [companyBoundingBox, setCompanyBoundingBox] = useState({
    x: 10,
    y: 60,
    width: 30,
    height: 15,
    visible: true,
  });

  // Common state variables
  const [imageLoaded, setImageLoaded] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);

  // Drag and resize functionality states
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isDraggingPriceBox, setIsDraggingPriceBox] = useState(false);
  const [isDraggingCompanyBox, setIsDraggingCompanyBox] = useState(false);
  const [isDraggingCompanyName, setIsDraggingCompanyName] = useState(false);
  const [isResizingCompanyName, setIsResizingCompanyName] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [dragStartPriceBoxPos, setDragStartPriceBoxPos] = useState({
    x: 0,
    y: 0,
  });
  const [dragStartCompanyBoxPos, setDragStartCompanyBoxPos] = useState({
    x: 0,
    y: 0,
  });
  const [dragStartCompanyNamePos, setDragStartCompanyNamePos] = useState({
    x: 0,
    y: 0,
  });
  const [dragMode, setDragMode] = useState("position");
  const [resizeStartSize, setResizeStartSize] = useState(0);
  const [resizeStartCompanyNameSize, setResizeStartCompanyNameSize] =
    useState(0);
  const [interactionEnabled, setInteractionEnabled] = useState(true);
  const [activeDragElement, setActiveDragElement] = useState(null);

  // References
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const fileInputRef = useRef(null);
  const canvasContainerRef = useRef(null);

  // Track if we're using a preloaded image from the gallery
  const [isPreloadedImage, setIsPreloadedImage] = useState(false);
  const [flyerTitle, setFlyerTitle] = useState("");

  // Handle preloaded image (from gallery selection)
  useEffect(() => {
    if (preloadedImage) {
      setUploadedImage(preloadedImage);
      setIsPreloadedImage(true);
      setFlyerTitle(preloadedTitle || "Travel Flyer");

      // Set appropriate bounding box positions for preloaded image
      setPriceBoundingBox({
        x: 6,
        y: 53,
        width: 36,
        height: 6,
        visible: true,
      });

      setCompanyBoundingBox({
        x: 5,
        y: 94.5,
        width: 90,
        height: 5,
        visible: true,
      });
    }
  }, [preloadedImage, preloadedTitle]);

  // Event handlers for price settings
  const handlePriceChange = (e) => {
    setPrice(e.target.value.replace(/^[\$\₹\€\£\¥]/, ""));
  };

  const handleCurrencyChange = (e) => {
    setCurrencySymbol(e.target.value);
    // Immediately trigger redraw
    setTimeout(() => {
      if (imageLoaded) {
        drawImageWithOverlays();
      }
    }, 0);
  };

  const handleFontSizeChange = (e) => {
    setFontSize(parseInt(e.target.value));
  };

  const handleFontWeightChange = (e) => {
    setFontWeight(parseInt(e.target.value));
  };

  const handleColorChange = (e) => {
    setFontColor(e.target.value);
  };

  // Event handlers for company name settings
  const handleCompanyNameChange = (e) => {
    setCompanyName(e.target.value);
  };

  const handleCompanyNameFontSizeChange = (e) => {
    setCompanyNameFontSize(parseInt(e.target.value));
  };

  const handleCompanyNameFontWeightChange = (e) => {
    setCompanyNameFontWeight(parseInt(e.target.value));
  };

  const handleCompanyNameColorChange = (e) => {
    setCompanyNameColor(e.target.value);
  };

  // Position handlers for text within boxes
  const handleXPositionChange = (e) => {
    setXPosition(parseInt(e.target.value));
  };

  const handleYPositionChange = (e) => {
    setYPosition(parseInt(e.target.value));
  };

  const handleCompanyNameXPositionChange = (e) => {
    setCompanyNamePosition((prev) => ({
      ...prev,
      x: parseInt(e.target.value),
    }));
  };

  const handleCompanyNameYPositionChange = (e) => {
    setCompanyNamePosition((prev) => ({
      ...prev,
      y: parseInt(e.target.value),
    }));
  };

  // Handlers for price bounding box
  const handlePriceBoundingBoxChange = (property, value) => {
    setPriceBoundingBox((prev) => ({
      ...prev,
      [property]: parseFloat(value),
    }));
  };

  const togglePriceBoundingBoxVisibility = () => {
    setPriceBoundingBox((prev) => ({
      ...prev,
      visible: !prev.visible,
    }));
  };

  // Handlers for company bounding box
  const handleCompanyBoundingBoxChange = (property, value) => {
    setCompanyBoundingBox((prev) => ({
      ...prev,
      [property]: parseFloat(value),
    }));
  };

  const toggleCompanyBoundingBoxVisibility = () => {
    setCompanyBoundingBox((prev) => ({
      ...prev,
      visible: !prev.visible,
    }));
  };

  // File handling
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.match("image.*")) {
      const reader = new FileReader();

      reader.onload = (event) => {
        setUploadedImage(event.target.result);
        setImageLoaded(false);
        setIsPreloadedImage(false); // Reset preloaded state
      };

      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Cursor interaction detection functions
  const isCursorOverPriceBoundingBox = (x, y) => {
    const canvas = canvasRef.current;
    if (!canvas) return false;

    const boxX = (canvas.width * priceBoundingBox.x) / 100;
    const boxY = (canvas.height * priceBoundingBox.y) / 100;
    const boxWidth = (canvas.width * priceBoundingBox.width) / 100;
    const boxHeight = (canvas.height * priceBoundingBox.height) / 100;

    const borderWidth = 8;

    return (
      ((Math.abs(x - boxX) <= borderWidth ||
        Math.abs(x - (boxX + boxWidth)) <= borderWidth) &&
        y >= boxY &&
        y <= boxY + boxHeight) ||
      ((Math.abs(y - boxY) <= borderWidth ||
        Math.abs(y - (boxY + boxHeight)) <= borderWidth) &&
        x >= boxX &&
        x <= boxX + boxWidth)
    );
  };

  const isCursorOverCompanyBoundingBox = (x, y) => {
    const canvas = canvasRef.current;
    if (!canvas) return false;

    const boxX = (canvas.width * companyBoundingBox.x) / 100;
    const boxY = (canvas.height * companyBoundingBox.y) / 100;
    const boxWidth = (canvas.width * companyBoundingBox.width) / 100;
    const boxHeight = (canvas.height * companyBoundingBox.height) / 100;

    const borderWidth = 8;

    return (
      ((Math.abs(x - boxX) <= borderWidth ||
        Math.abs(x - (boxX + boxWidth)) <= borderWidth) &&
        y >= boxY &&
        y <= boxY + boxHeight) ||
      ((Math.abs(y - boxY) <= borderWidth ||
        Math.abs(y - (boxY + boxHeight)) <= borderWidth) &&
        x >= boxX &&
        x <= boxX + boxWidth)
    );
  };

  // Function to check if cursor is over price text
  const isCursorOverPriceText = (x, y) => {
    const canvas = canvasRef.current;
    if (!canvas) return false;

    const boxX = (canvas.width * priceBoundingBox.x) / 100;
    const boxY = (canvas.height * priceBoundingBox.y) / 100;
    const boxWidth = (canvas.width * priceBoundingBox.width) / 100;
    const boxHeight = (canvas.height * priceBoundingBox.height) / 100;

    const textX = boxX + (boxWidth * xPosition) / 100;
    const textY = boxY + (boxHeight * yPosition) / 100;

    const ctx = canvas.getContext("2d");
    ctx.font = `${fontWeight} ${fontSize}px Arial, sans-serif`;
    const textMetrics = ctx.measureText(currencySymbol + price);
    const textWidth = textMetrics.width;
    const textHeight = fontSize;

    const handleSize = 12;
    const handleX = textX + textWidth / 2;
    const handleY = textY + textHeight / 2;

    const padding = 12;
    const isOverMainText =
      x >= textX - textWidth / 2 - padding &&
      x <= textX + textWidth / 2 + padding &&
      y >= textY - textHeight / 2 - padding &&
      y <= textY + textHeight / 2 + padding;

    const isOverResizeHandle =
      x >= handleX - handleSize / 2 &&
      x <= handleX + handleSize / 2 &&
      y >= handleY - handleSize / 2 &&
      y <= handleY + handleSize / 2;

    if (isOverResizeHandle) {
      return "resize";
    } else if (isOverMainText) {
      return "position";
    } else {
      return false;
    }
  };

  // Function to check if cursor is over company name
  const isCursorOverCompanyName = (x, y) => {
    if (!showCompanyName) return false;

    const canvas = canvasRef.current;
    if (!canvas) return false;

    const boxX = (canvas.width * companyBoundingBox.x) / 100;
    const boxY = (canvas.height * companyBoundingBox.y) / 100;
    const boxWidth = (canvas.width * companyBoundingBox.width) / 100;
    const boxHeight = (canvas.height * companyBoundingBox.height) / 100;

    const companyNameX = boxX + (boxWidth * companyNamePosition.x) / 100;
    const companyNameY = boxY + (boxHeight * companyNamePosition.y) / 100;

    const ctx = canvas.getContext("2d");
    ctx.font = `${companyNameFontWeight} ${companyNameFontSize}px Arial, sans-serif`;
    const textMetrics = ctx.measureText(companyName);
    const textWidth = textMetrics.width;
    const textHeight = companyNameFontSize;

    // Check for resize handle for company name
    const handleSize = 12;
    const handleX = companyNameX + textWidth / 2;
    const handleY = companyNameY + textHeight / 2;

    const padding = 12;
    const isOverCompanyText =
      x >= companyNameX - textWidth / 2 - padding &&
      x <= companyNameX + textWidth / 2 + padding &&
      y >= companyNameY - textHeight / 2 - padding &&
      y <= companyNameY + textHeight / 2 + padding;

    const isOverResizeHandle =
      x >= handleX - handleSize / 2 &&
      x <= handleX + handleSize / 2 &&
      y >= handleY - handleSize / 2 &&
      y <= handleY + handleSize / 2;

    if (isOverResizeHandle) {
      return "resize";
    } else if (isOverCompanyText) {
      return "position";
    } else {
      return false;
    }
  };

  // Helper functions for canvas interactions
  const canvasToPercentForPrice = (x, y) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const boxX = (canvas.width * priceBoundingBox.x) / 100;
    const boxY = (canvas.height * priceBoundingBox.y) / 100;
    const boxWidth = (canvas.width * priceBoundingBox.width) / 100;
    const boxHeight = (canvas.height * priceBoundingBox.height) / 100;

    const percentX = ((x - boxX) / boxWidth) * 100;
    const percentY = ((y - boxY) / boxHeight) * 100;

    return {
      x: Math.max(0, Math.min(100, percentX)),
      y: Math.max(0, Math.min(100, percentY)),
    };
  };

  const canvasToPercentForCompany = (x, y) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const boxX = (canvas.width * companyBoundingBox.x) / 100;
    const boxY = (canvas.height * companyBoundingBox.y) / 100;
    const boxWidth = (canvas.width * companyBoundingBox.width) / 100;
    const boxHeight = (canvas.height * companyBoundingBox.height) / 100;

    const percentX = ((x - boxX) / boxWidth) * 100;
    const percentY = ((y - boxY) / boxHeight) * 100;

    return {
      x: Math.max(0, Math.min(100, percentX)),
      y: Math.max(0, Math.min(100, percentY)),
    };
  };

  const getCursorPosition = (canvas, event) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  };

  // Mouse event handlers
  const handleMouseDown = (e) => {
    if (!interactionEnabled || !imageLoaded) return;

    const canvas = canvasRef.current;
    const cursorPos = getCursorPosition(canvas, e);

    // Check if cursor is within price bounding box first
    if (priceBoundingBox.visible) {
      // Check for price text interaction first (within the price box)
      const priceInteraction = isCursorOverPriceText(cursorPos.x, cursorPos.y);
      if (priceInteraction) {
        if (priceInteraction === "resize") {
          setIsResizing(true);
          setDragMode("resize-price");
          setResizeStartSize(fontSize);
          setDragStartPos(cursorPos);
          setActiveDragElement("resize-price");
          canvas.style.cursor = "nwse-resize";
          return;
        } else {
          setIsDragging(true);
          setDragMode("position-price");
          setDragStartPos(cursorPos);
          setActiveDragElement("text-price");
          canvas.style.cursor = "move";
          return;
        }
      }

      // Check for price bounding box interaction
      if (isCursorOverPriceBoundingBox(cursorPos.x, cursorPos.y)) {
        setIsDraggingPriceBox(true);
        setDragMode("box-price");
        setDragStartPos(cursorPos);
        setDragStartPriceBoxPos({
          x: priceBoundingBox.x,
          y: priceBoundingBox.y,
        });
        setActiveDragElement("box-price");
        canvas.style.cursor = "move";
        return;
      }
    }

    // Then check if cursor is within company name bounding box
    if (companyBoundingBox.visible && showCompanyName) {
      // Check for company name text interaction
      const companyNameInteraction = isCursorOverCompanyName(
        cursorPos.x,
        cursorPos.y
      );
      if (companyNameInteraction) {
        if (companyNameInteraction === "resize") {
          setIsResizingCompanyName(true);
          setDragMode("resize-company");
          setResizeStartCompanyNameSize(companyNameFontSize);
          setDragStartPos(cursorPos);
          setActiveDragElement("resize-company");
          canvas.style.cursor = "nwse-resize";
          return;
        } else {
          setIsDraggingCompanyName(true);
          setDragMode("position-company");
          setDragStartPos(cursorPos);
          setDragStartCompanyNamePos({
            x: companyNamePosition.x,
            y: companyNamePosition.y,
          });
          setActiveDragElement("text-company");
          canvas.style.cursor = "move";
          return;
        }
      }

      // Check for company bounding box interaction
      if (isCursorOverCompanyBoundingBox(cursorPos.x, cursorPos.y)) {
        setIsDraggingCompanyBox(true);
        setDragMode("box-company");
        setDragStartPos(cursorPos);
        setDragStartCompanyBoxPos({
          x: companyBoundingBox.x,
          y: companyBoundingBox.y,
        });
        setActiveDragElement("box-company");
        canvas.style.cursor = "move";
        return;
      }
    }
  };

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // No active dragging - just update cursor
    if (
      !isDragging &&
      !isResizing &&
      !isDraggingPriceBox &&
      !isDraggingCompanyBox &&
      !isDraggingCompanyName &&
      !isResizingCompanyName
    ) {
      if (interactionEnabled && imageLoaded) {
        const cursorPos = getCursorPosition(canvas, e);

        // Check price elements first
        if (priceBoundingBox.visible) {
          // Check price text interaction
          const priceInteraction = isCursorOverPriceText(
            cursorPos.x,
            cursorPos.y
          );
          if (priceInteraction === "resize") {
            canvas.style.cursor = "nwse-resize";
            return;
          } else if (priceInteraction === "position") {
            canvas.style.cursor = "move";
            return;
          }

          // Check price box interaction
          if (isCursorOverPriceBoundingBox(cursorPos.x, cursorPos.y)) {
            canvas.style.cursor = "move";
            return;
          }
        }

        // Then check company elements
        if (companyBoundingBox.visible && showCompanyName) {
          // Check company name interaction
          const companyNameInteraction = isCursorOverCompanyName(
            cursorPos.x,
            cursorPos.y
          );
          if (companyNameInteraction === "resize") {
            canvas.style.cursor = "nwse-resize";
            return;
          } else if (companyNameInteraction === "position") {
            canvas.style.cursor = "move";
            return;
          }

          // Check company box interaction
          if (isCursorOverCompanyBoundingBox(cursorPos.x, cursorPos.y)) {
            canvas.style.cursor = "move";
            return;
          }
        }

        // Default cursor
        canvas.style.cursor = "default";
      }
      return;
    }

    // Active dragging - handle element movement
    const cursorPos = getCursorPosition(canvas, e);

    if (isDragging && dragMode === "position-price") {
      // Moving price text within its bounding box
      const newPos = canvasToPercentForPrice(cursorPos.x, cursorPos.y);
      setXPosition(newPos.x);
      setYPosition(newPos.y);
    } else if (isResizing && dragMode === "resize-price") {
      // Resizing price text
      const dragDistance = Math.sqrt(
        Math.pow(cursorPos.x - dragStartPos.x, 2) +
          Math.pow(cursorPos.y - dragStartPos.y, 2)
      );

      const dragDirection =
        cursorPos.x > dragStartPos.x || cursorPos.y > dragStartPos.y ? 1 : -1;

      const scaleFactor = 0.2;
      const sizeDelta = dragDistance * scaleFactor * dragDirection;
      const newSize = Math.max(16, Math.min(120, resizeStartSize + sizeDelta));

      setFontSize(Math.round(newSize));
    } else if (isDraggingPriceBox && dragMode === "box-price") {
      // Moving price bounding box
      const deltaX = cursorPos.x - dragStartPos.x;
      const deltaY = cursorPos.y - dragStartPos.y;

      const percentDeltaX = (deltaX / canvas.width) * 100;
      const percentDeltaY = (deltaY / canvas.height) * 100;

      const newX = Math.max(
        0,
        Math.min(
          100 - priceBoundingBox.width,
          dragStartPriceBoxPos.x + percentDeltaX
        )
      );
      const newY = Math.max(
        0,
        Math.min(
          100 - priceBoundingBox.height,
          dragStartPriceBoxPos.y + percentDeltaY
        )
      );

      setPriceBoundingBox((prev) => ({
        ...prev,
        x: newX,
        y: newY,
      }));
    } else if (isDraggingCompanyName && dragMode === "position-company") {
      // Moving company name within its bounding box
      const newPos = canvasToPercentForCompany(cursorPos.x, cursorPos.y);
      setCompanyNamePosition({
        x: newPos.x,
        y: newPos.y,
      });
    } else if (isResizingCompanyName && dragMode === "resize-company") {
      // Resizing company name
      const dragDistance = Math.sqrt(
        Math.pow(cursorPos.x - dragStartPos.x, 2) +
          Math.pow(cursorPos.y - dragStartPos.y, 2)
      );

      const dragDirection =
        cursorPos.x > dragStartPos.x || cursorPos.y > dragStartPos.y ? 1 : -1;

      const scaleFactor = 0.2;
      const sizeDelta = dragDistance * scaleFactor * dragDirection;
      const newSize = Math.max(
        12,
        Math.min(100, resizeStartCompanyNameSize + sizeDelta)
      );

      setCompanyNameFontSize(Math.round(newSize));
    } else if (isDraggingCompanyBox && dragMode === "box-company") {
      // Moving company bounding box
      const deltaX = cursorPos.x - dragStartPos.x;
      const deltaY = cursorPos.y - dragStartPos.y;

      const percentDeltaX = (deltaX / canvas.width) * 100;
      const percentDeltaY = (deltaY / canvas.height) * 100;

      const newX = Math.max(
        0,
        Math.min(
          100 - companyBoundingBox.width,
          dragStartCompanyBoxPos.x + percentDeltaX
        )
      );
      const newY = Math.max(
        0,
        Math.min(
          100 - companyBoundingBox.height,
          dragStartCompanyBoxPos.y + percentDeltaY
        )
      );

      setCompanyBoundingBox((prev) => ({
        ...prev,
        x: newX,
        y: newY,
      }));
    }
  };

  const handleMouseUp = () => {
    if (
      isDragging ||
      isResizing ||
      isDraggingPriceBox ||
      isDraggingCompanyBox ||
      isDraggingCompanyName ||
      isResizingCompanyName
    ) {
      setIsDragging(false);
      setIsResizing(false);
      setIsDraggingPriceBox(false);
      setIsDraggingCompanyBox(false);
      setIsDraggingCompanyName(false);
      setIsResizingCompanyName(false);
      setActiveDragElement(null);

      const canvas = canvasRef.current;
      if (canvas) {
        canvas.style.cursor = "default";
      }
    }
  };

  const handleMouseLeave = () => {
    handleMouseUp();
  };

  const toggleInteraction = () => {
    setInteractionEnabled(!interactionEnabled);
  };

  // Main drawing function that draws everything on the canvas
  const drawImageWithOverlays = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const image = imageRef.current;

    if (image && image.complete && image.naturalHeight !== 0) {
      // Set canvas dimensions to match the image
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      // Draw the original image on the canvas
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      // Draw price bounding box and text
      if (priceBoundingBox.visible) {
        drawPriceBoundingBox(ctx);
        drawPriceText(ctx);
      } else {
        // If box is not visible, still draw the price text
        drawPriceText(ctx);
      }

      // Draw company name bounding box and text if enabled
      if (showCompanyName) {
        if (companyBoundingBox.visible) {
          drawCompanyBoundingBox(ctx);
          drawCompanyName(ctx);
        } else {
          // If box is not visible, still draw the company name
          drawCompanyName(ctx);
        }
      }
    }
  };

  // Helper function to draw price bounding box
  const drawPriceBoundingBox = (ctx) => {
    const canvas = canvasRef.current;

    // Calculate bounding box in pixels
    const boxX = (canvas.width * priceBoundingBox.x) / 100;
    const boxY = (canvas.height * priceBoundingBox.y) / 100;
    const boxWidth = (canvas.width * priceBoundingBox.width) / 100;
    const boxHeight = (canvas.height * priceBoundingBox.height) / 100;

    // Draw semi-transparent background for the box
    ctx.fillStyle = "rgba(52, 152, 219, 0.1)"; // Blue tint for price box
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

    // Draw box border
    ctx.strokeStyle =
      isDraggingPriceBox || activeDragElement === "box-price"
        ? "#3498db"
        : "rgba(52, 152, 219, 0.7)";
    ctx.lineWidth =
      isDraggingPriceBox || activeDragElement === "box-price" ? 3 : 2;
    ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

    // Draw corner handles if dragging the box
    if (
      isDraggingPriceBox ||
      activeDragElement === "box-price" ||
      (interactionEnabled && isCursorOverPriceBoundingBox(boxX, boxY))
    ) {
      const handleSize = 8;
      const corners = [
        { x: boxX, y: boxY },
        { x: boxX + boxWidth, y: boxY },
        { x: boxX, y: boxY + boxHeight },
        { x: boxX + boxWidth, y: boxY + boxHeight },
      ];

      ctx.fillStyle = "#3498db";
      corners.forEach((corner) => {
        ctx.beginPath();
        ctx.arc(corner.x, corner.y, handleSize, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Add a visual label to the box
    ctx.fillStyle = "rgba(52, 152, 219, 0.9)";
    ctx.fillRect(boxX, boxY - 20, 60, 20);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 12px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("PRICE", boxX + 30, boxY - 10);
  };

  // Helper function to draw company bounding box
  const drawCompanyBoundingBox = (ctx) => {
    const canvas = canvasRef.current;

    // Calculate bounding box in pixels
    const boxX = (canvas.width * companyBoundingBox.x) / 100;
    const boxY = (canvas.height * companyBoundingBox.y) / 100;
    const boxWidth = (canvas.width * companyBoundingBox.width) / 100;
    const boxHeight = (canvas.height * companyBoundingBox.height) / 100;

    // Draw semi-transparent background for the box
    ctx.fillStyle = "rgba(155, 89, 182, 0.1)"; // Purple tint for company box
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

    // Draw box border
    ctx.strokeStyle =
      isDraggingCompanyBox || activeDragElement === "box-company"
        ? "#9b59b6"
        : "rgba(155, 89, 182, 0.7)";
    ctx.lineWidth =
      isDraggingCompanyBox || activeDragElement === "box-company" ? 3 : 2;
    ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

    // Draw corner handles if dragging the box
    if (
      isDraggingCompanyBox ||
      activeDragElement === "box-company" ||
      (interactionEnabled && isCursorOverCompanyBoundingBox(boxX, boxY))
    ) {
      const handleSize = 8;
      const corners = [
        { x: boxX, y: boxY },
        { x: boxX + boxWidth, y: boxY },
        { x: boxX, y: boxY + boxHeight },
        { x: boxX + boxWidth, y: boxY + boxHeight },
      ];

      ctx.fillStyle = "#9b59b6";
      corners.forEach((corner) => {
        ctx.beginPath();
        ctx.arc(corner.x, corner.y, handleSize, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Add a visual label to the box
    ctx.fillStyle = "rgba(155, 89, 182, 0.9)";
    ctx.fillRect(boxX, boxY - 20, 90, 20);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 12px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("COMPANY", boxX + 45, boxY - 10);
  };

  // Helper function to draw price text
  const drawPriceText = (ctx) => {
    const canvas = canvasRef.current;

    // Calculate bounding box in pixels
    const boxX = (canvas.width * priceBoundingBox.x) / 100;
    const boxY = (canvas.height * priceBoundingBox.y) / 100;
    const boxWidth = (canvas.width * priceBoundingBox.width) / 100;
    const boxHeight = (canvas.height * priceBoundingBox.height) / 100;

    // Set text properties for price
    ctx.font = `${fontWeight} ${fontSize}px Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Calculate text position within the bounding box
    const textX = boxX + (boxWidth * xPosition) / 100;
    const textY = boxY + (boxHeight * yPosition) / 100;

    // Combine currency symbol and price
    const displayPrice = currencySymbol + price;

    // Apply text shadow if enabled
    if (textShadow) {
      ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
    } else {
      // Reset shadow if disabled
      ctx.shadowColor = "rgba(0, 0, 0, 0)";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }

    // Apply text stroke if enabled
    if (textStroke) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.lineJoin = "round"; // Makes corners smoother
      ctx.miterLimit = 2;
      ctx.strokeText(displayPrice, textX, textY);
    }

    // Draw the price text
    ctx.fillStyle = fontColor;
    ctx.fillText(displayPrice, textX, textY);

    // Draw text selection highlight if text is being dragged
    if (isDragging && activeDragElement === "text-price") {
      const textMetrics = ctx.measureText(displayPrice);
      const textWidth = textMetrics.width + 10; // Add padding
      const textHeight = fontSize + 10;

      // Save context
      ctx.save();

      // Draw highlight around text
      ctx.fillStyle = "rgba(52, 152, 219, 0.3)";
      ctx.fillRect(
        textX - textWidth / 2,
        textY - textHeight / 2,
        textWidth,
        textHeight
      );

      // Draw border
      ctx.strokeStyle = "#3498db";
      ctx.lineWidth = 2;
      ctx.strokeRect(
        textX - textWidth / 2,
        textY - textHeight / 2,
        textWidth,
        textHeight
      );

      // Restore context
      ctx.restore();
    }

    // Draw resize handle for price
    if (
      interactionEnabled &&
      (isResizing ||
        activeDragElement === "resize-price" ||
        isCursorOverPriceText(textX, textY) === "resize")
    ) {
      // Measure text width
      const textMetrics = ctx.measureText(displayPrice);
      const textWidth = textMetrics.width;
      // Approximate text height using fontSize
      const textHeight = fontSize;

      // Draw a resize handle at the bottom-right of the text
      const handleSize = 14;
      const handleX = textX + textWidth / 2;
      const handleY = textY + textHeight / 2;

      // Save context state
      ctx.save();

      // Reset shadow and stroke
      ctx.shadowColor = "rgba(0, 0, 0, 0)";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Create a glow effect for better visibility
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 5;

      // Draw resize handle
      ctx.fillStyle = isResizing ? "#e74c3c" : "#3498db";
      ctx.beginPath();
      ctx.arc(handleX, handleY, handleSize, 0, Math.PI * 2);
      ctx.fill();

      // Add resize icon
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2.5;

      // Draw corner arrows
      const arrowOffset = 5;

      // Draw a double-headed arrow icon
      ctx.beginPath();
      // Top-left part
      ctx.moveTo(handleX - arrowOffset, handleY - arrowOffset - 2);
      ctx.lineTo(handleX - arrowOffset, handleY - arrowOffset + 4);
      ctx.lineTo(handleX - arrowOffset + 6, handleY - arrowOffset);
      ctx.closePath();
      ctx.fill();

      // Bottom-right part
      ctx.beginPath();
      ctx.moveTo(handleX + arrowOffset, handleY + arrowOffset + 2);
      ctx.lineTo(handleX + arrowOffset, handleY + arrowOffset - 4);
      ctx.lineTo(handleX + arrowOffset - 6, handleY + arrowOffset);
      ctx.closePath();
      ctx.fill();

      // Connecting line
      ctx.beginPath();
      ctx.moveTo(handleX - arrowOffset, handleY - arrowOffset);
      ctx.lineTo(handleX + arrowOffset, handleY + arrowOffset);
      ctx.stroke();

      // Restore context state
      ctx.restore();

      // Add tooltip when hovering
      if (!isResizing && activeDragElement === "resize-price") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.beginPath();
        ctx.roundRect(handleX - 45, handleY - 40, 90, 25, 5);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.font = "12px Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Resize Price", handleX, handleY - 25);
      }
    }
  };

  // Helper function to draw company name
  const drawCompanyName = (ctx) => {
    const canvas = canvasRef.current;

    // Calculate bounding box in pixels
    const boxX = (canvas.width * companyBoundingBox.x) / 100;
    const boxY = (canvas.height * companyBoundingBox.y) / 100;
    const boxWidth = (canvas.width * companyBoundingBox.width) / 100;
    const boxHeight = (canvas.height * companyBoundingBox.height) / 100;

    // Calculate company name position within the bounding box
    const companyNameX = boxX + (boxWidth * companyNamePosition.x) / 100;
    const companyNameY = boxY + (boxHeight * companyNamePosition.y) / 100;

    // Set text properties for company name
    ctx.font = `${companyNameFontWeight} ${companyNameFontSize}px Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Apply text shadow
    if (companyNameShadow) {
      ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
    } else {
      ctx.shadowColor = "rgba(0, 0, 0, 0)";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }

    // Apply text stroke
    if (companyNameStroke) {
      ctx.strokeStyle = companyNameStrokeColor;
      ctx.lineWidth = companyNameStrokeWidth;
      ctx.lineJoin = "round";
      ctx.miterLimit = 2;
      ctx.strokeText(companyName, companyNameX, companyNameY);
    }

    // Draw the company name text
    ctx.fillStyle = companyNameColor;
    ctx.fillText(companyName, companyNameX, companyNameY);

    // Draw highlight if company name is being dragged
    if (isDraggingCompanyName && activeDragElement === "text-company") {
      const textMetrics = ctx.measureText(companyName);
      const textWidth = textMetrics.width + 10;
      const textHeight = companyNameFontSize + 10;

      // Save context
      ctx.save();

      // Draw highlight around company name
      ctx.fillStyle = "rgba(155, 89, 182, 0.3)"; // Different color to distinguish from price
      ctx.fillRect(
        companyNameX - textWidth / 2,
        companyNameY - textHeight / 2,
        textWidth,
        textHeight
      );

      // Draw border
      ctx.strokeStyle = "#9b59b6"; // Different color to distinguish from price
      ctx.lineWidth = 2;
      ctx.strokeRect(
        companyNameX - textWidth / 2,
        companyNameY - textHeight / 2,
        textWidth,
        textHeight
      );

      // Restore context
      ctx.restore();
    }

    // Draw resize handle for company name
    if (
      interactionEnabled &&
      (isResizingCompanyName ||
        activeDragElement === "resize-company" ||
        isCursorOverCompanyName(companyNameX, companyNameY) === "resize")
    ) {
      // Measure text width
      const textMetrics = ctx.measureText(companyName);
      const textWidth = textMetrics.width;
      const textHeight = companyNameFontSize;

      // Draw a resize handle at the bottom-right of the text
      const handleSize = 14;
      const handleX = companyNameX + textWidth / 2;
      const handleY = companyNameY + textHeight / 2;

      // Save context state
      ctx.save();

      // Reset shadow and stroke
      ctx.shadowColor = "rgba(0, 0, 0, 0)";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Create a glow effect for better visibility
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 5;

      // Draw resize handle with different color
      ctx.fillStyle = isResizingCompanyName ? "#e67e22" : "#9b59b6";
      ctx.beginPath();
      ctx.arc(handleX, handleY, handleSize, 0, Math.PI * 2);
      ctx.fill();

      // Add resize icon
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2.5;

      // Draw corner arrows
      const arrowOffset = 5;

      // Draw a double-headed arrow icon
      ctx.beginPath();
      ctx.moveTo(handleX - arrowOffset, handleY - arrowOffset - 2);
      ctx.lineTo(handleX - arrowOffset, handleY - arrowOffset + 4);
      ctx.lineTo(handleX - arrowOffset + 6, handleY - arrowOffset);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(handleX + arrowOffset, handleY + arrowOffset + 2);
      ctx.lineTo(handleX + arrowOffset, handleY + arrowOffset - 4);
      ctx.lineTo(handleX + arrowOffset - 6, handleY + arrowOffset);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(handleX - arrowOffset, handleY - arrowOffset);
      ctx.lineTo(handleX + arrowOffset, handleY + arrowOffset);
      ctx.stroke();

      // Restore context state
      ctx.restore();

      // Add tooltip when hovering
      if (!isResizingCompanyName && activeDragElement === "resize-company") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.beginPath();
        ctx.roundRect(handleX - 60, handleY - 40, 120, 25, 5);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.font = "12px Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Resize Company Name", handleX, handleY - 25);
      }
    }
  };

  // Function to download the image with overlays
  const downloadImage = () => {
    // Create a new canvas for download (without bounding boxes)
    const downloadCanvas = document.createElement("canvas");
    downloadCanvas.width = canvasRef.current.width;
    downloadCanvas.height = canvasRef.current.height;
    const downloadCtx = downloadCanvas.getContext("2d");

    // Draw the base image
    downloadCtx.drawImage(
      imageRef.current,
      0,
      0,
      downloadCanvas.width,
      downloadCanvas.height
    );

    // Draw price text (without bounding box)
    const priceBoxX = (downloadCanvas.width * priceBoundingBox.x) / 100;
    const priceBoxY = (downloadCanvas.height * priceBoundingBox.y) / 100;
    const priceBoxWidth = (downloadCanvas.width * priceBoundingBox.width) / 100;
    const priceBoxHeight =
      (downloadCanvas.height * priceBoundingBox.height) / 100;

    const textX = priceBoxX + (priceBoxWidth * xPosition) / 100;
    const textY = priceBoxY + (priceBoxHeight * yPosition) / 100;

    downloadCtx.font = `${fontWeight} ${fontSize}px Arial, sans-serif`;
    downloadCtx.textAlign = "center";
    downloadCtx.textBaseline = "middle";

    const displayPrice = currencySymbol + price;

    if (textShadow) {
      downloadCtx.shadowColor = "rgba(0, 0, 0, 0.7)";
      downloadCtx.shadowBlur = 4;
      downloadCtx.shadowOffsetX = 2;
      downloadCtx.shadowOffsetY = 2;
    }

    if (textStroke) {
      downloadCtx.strokeStyle = strokeColor;
      downloadCtx.lineWidth = strokeWidth;
      downloadCtx.lineJoin = "round";
      downloadCtx.miterLimit = 2;
      downloadCtx.strokeText(displayPrice, textX, textY);
    }

    downloadCtx.fillStyle = fontColor;
    downloadCtx.fillText(displayPrice, textX, textY);

    // Draw company name (without bounding box)
    if (showCompanyName) {
      const companyBoxX = (downloadCanvas.width * companyBoundingBox.x) / 100;
      const companyBoxY = (downloadCanvas.height * companyBoundingBox.y) / 100;
      const companyBoxWidth =
        (downloadCanvas.width * companyBoundingBox.width) / 100;
      const companyBoxHeight =
        (downloadCanvas.height * companyBoundingBox.height) / 100;

      const companyNameX =
        companyBoxX + (companyBoxWidth * companyNamePosition.x) / 100;
      const companyNameY =
        companyBoxY + (companyBoxHeight * companyNamePosition.y) / 100;

      downloadCtx.font = `${companyNameFontWeight} ${companyNameFontSize}px Arial, sans-serif`;

      if (companyNameShadow) {
        downloadCtx.shadowColor = "rgba(0, 0, 0, 0.7)";
        downloadCtx.shadowBlur = 4;
        downloadCtx.shadowOffsetX = 2;
        downloadCtx.shadowOffsetY = 2;
      }

      if (companyNameStroke) {
        downloadCtx.strokeStyle = companyNameStrokeColor;
        downloadCtx.lineWidth = companyNameStrokeWidth;
        downloadCtx.lineJoin = "round";
        downloadCtx.miterLimit = 2;
        downloadCtx.strokeText(companyName, companyNameX, companyNameY);
      }

      downloadCtx.fillStyle = companyNameColor;
      downloadCtx.fillText(companyName, companyNameX, companyNameY);
    }

    // Create download link
    const link = document.createElement("a");
    link.download = isPreloadedImage
      ? `${flyerTitle.toLowerCase().replace(/\s+/g, "-")}-branded.png`
      : "tour-flyer-branded.png";
    link.href = downloadCanvas.toDataURL("image/png");
    link.click();
  };

  // Redraw canvas when state changes
  useEffect(() => {
    if (imageLoaded) {
      drawImageWithOverlays();
    }
  }, [
    // Price-related dependencies
    price,
    fontSize,
    fontWeight,
    fontColor,
    xPosition,
    yPosition,
    textStroke,
    strokeColor,
    strokeWidth,
    textShadow,
    priceBoundingBox,

    // Company name dependencies
    showCompanyName,
    companyName,
    companyNameFontSize,
    companyNameFontWeight,
    companyNameColor,
    companyNamePosition,
    companyNameStroke,
    companyNameStrokeColor,
    companyNameStrokeWidth,
    companyNameShadow,
    companyBoundingBox,

    // Common dependencies
    imageLoaded,
    isDragging,
    isResizing,
    isDraggingPriceBox,
    isDraggingCompanyBox,
    isDraggingCompanyName,
    isResizingCompanyName,
    interactionEnabled,
    activeDragElement,
  ]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const resetToDefaults = () => {
    // Reset price settings
    setPrice("1,499");
    setCurrencySymbol("$");
    setFontSize(28);
    setFontWeight(700);
    setFontColor("#ffffff");
    setTextStroke(true);
    setStrokeColor("#000000");
    setStrokeWidth(2);
    setTextShadow(true);
    setXPosition(50);
    setYPosition(50);

    // Reset price bounding box
    setPriceBoundingBox({
      x: 10,
      y: 10,
      width: 30,
      height: 15,
      visible: true,
    });

    // Reset company name settings
    setCompanyName("GFS Travel");
    setCompanyNameFontSize(22);
    setCompanyNameFontWeight(700);
    setCompanyNameColor("#ffffff");
    setCompanyNameStroke(true);
    setCompanyNameStrokeColor("#000000");
    setCompanyNameStrokeWidth(2);
    setCompanyNameShadow(true);
    setCompanyNamePosition({
      x: 50,
      y: 50,
    });

    // Reset company bounding box
    setCompanyBoundingBox({
      x: 10,
      y: 60,
      width: 30,
      height: 15,
      visible: true,
    });

    // Reset interaction states
    setIsDragging(false);
    setIsResizing(false);
    setIsDraggingPriceBox(false);
    setIsDraggingCompanyBox(false);
    setIsDraggingCompanyName(false);
    setIsResizingCompanyName(false);
    setActiveDragElement(null);
  };

  const handleReturnToGallery = () => {
    window.history.back();
  };

  return (
    <div className="app-container price-overlay-tool">
      <div className="header">
        <h1>
          {isPreloadedImage
            ? `Customize Flyer: ${flyerTitle}`
            : "Travel Flyer Branding Tool"}
        </h1>
        {isPreloadedImage && (
          <button className="return-button" onClick={handleReturnToGallery}>
            ← Return to Gallery
          </button>
        )}
      </div>

      <div className="main-content">
        <div className="controls-panel">
          {!isPreloadedImage && (
            <div className="control-section">
              <h2>Upload Flyer</h2>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden-input"
              />
              <button onClick={triggerFileInput} className="upload-button">
                Upload Image
              </button>
              {uploadedImage && (
                <span className="success-text">Image uploaded!</span>
              )}
            </div>
          )}

          {/* Price settings section */}
          <div className="control-section price-section">
            <h2>Price Settings</h2>
            <div className="control-item">
              <label>Currency Symbol:</label>
              <select
                value={currencySymbol}
                onChange={handleCurrencyChange}
                className="select-input"
              >
                <option value="$">$ (Dollar)</option>
                <option value="₹">₹ (Rupee)</option>
                <option value="€">€ (Euro)</option>
                <option value="£">£ (Pound)</option>
                <option value="¥">¥ (Yen/Yuan)</option>
                <option value="₩">₩ (Won)</option>
                <option value="₽">₽ (Ruble)</option>
                <option value="₺">₺ (Lira)</option>
                <option value="฿">฿ (Baht)</option>
                <option value="">None</option>
              </select>
            </div>

            <div className="control-item">
              <label>Price Amount:</label>
              <input
                type="text"
                value={price}
                onChange={handlePriceChange}
                className="text-input"
                placeholder="Enter price (without currency symbol)"
              />
            </div>

            <div className="control-item">
              <label>Font Size: {fontSize}px</label>
              <input
                type="range"
                min="16"
                max="120"
                value={fontSize}
                onChange={handleFontSizeChange}
                className="slider"
              />
            </div>

            <div className="control-item">
              <label>Font Weight:</label>
              <select
                value={fontWeight}
                onChange={handleFontWeightChange}
                className="select-input"
              >
                <option value="400">Normal (400)</option>
                <option value="700">Bold (700)</option>
                <option value="900">Extra Bold (900)</option>
              </select>
            </div>

            <div className="control-item">
              <label>Font Color:</label>
              <div className="color-picker-container">
                <input
                  type="color"
                  value={fontColor}
                  onChange={handleColorChange}
                  className="color-picker"
                />
                <span className="color-value">{fontColor}</span>
              </div>
            </div>

            <div className="control-item checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={textStroke}
                  onChange={() => setTextStroke(!textStroke)}
                />
                Text Outline
              </label>
            </div>

            {textStroke && (
              <>
                <div className="control-item">
                  <label>Outline Color:</label>
                  <div className="color-picker-container">
                    <input
                      type="color"
                      value={strokeColor}
                      onChange={(e) => setStrokeColor(e.target.value)}
                      className="color-picker"
                    />
                    <span className="color-value">{strokeColor}</span>
                  </div>
                </div>

                <div className="control-item">
                  <label>Outline Width: {strokeWidth}px</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.5"
                    value={strokeWidth}
                    onChange={(e) => setStrokeWidth(parseFloat(e.target.value))}
                    className="slider"
                  />
                </div>
              </>
            )}

            <div className="control-item checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={textShadow}
                  onChange={() => setTextShadow(!textShadow)}
                />
                Text Shadow
              </label>
            </div>

            <div className="positioning-section">
              <h3>Price Text Position (within box)</h3>
              <div className="control-item">
                <label>Horizontal: {Math.round(xPosition)}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={xPosition}
                  onChange={handleXPositionChange}
                  className="slider"
                />
              </div>

              <div className="control-item">
                <label>Vertical: {Math.round(yPosition)}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={yPosition}
                  onChange={handleYPositionChange}
                  className="slider"
                />
              </div>
            </div>

            <div className="bounding-box-section">
              <h3>Price Box Position & Size</h3>
              <div className="control-item checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={priceBoundingBox.visible}
                    onChange={togglePriceBoundingBoxVisibility}
                  />
                  Show Price Box
                </label>
              </div>

              <div className="control-item">
                <label>X Position: {priceBoundingBox.x.toFixed(1)}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.5"
                  value={priceBoundingBox.x}
                  onChange={(e) =>
                    handlePriceBoundingBoxChange("x", e.target.value)
                  }
                  className="slider"
                />
              </div>

              <div className="control-item">
                <label>Y Position: {priceBoundingBox.y.toFixed(1)}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.5"
                  value={priceBoundingBox.y}
                  onChange={(e) =>
                    handlePriceBoundingBoxChange("y", e.target.value)
                  }
                  className="slider"
                />
              </div>

              <div className="control-item">
                <label>Width: {priceBoundingBox.width.toFixed(1)}%</label>
                <input
                  type="range"
                  min="5"
                  max="90"
                  step="0.5"
                  value={priceBoundingBox.width}
                  onChange={(e) =>
                    handlePriceBoundingBoxChange("width", e.target.value)
                  }
                  className="slider"
                />
              </div>

              <div className="control-item">
                <label>Height: {priceBoundingBox.height.toFixed(1)}%</label>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="0.5"
                  value={priceBoundingBox.height}
                  onChange={(e) =>
                    handlePriceBoundingBoxChange("height", e.target.value)
                  }
                  className="slider"
                />
              </div>
            </div>
          </div>

          {/* Company Name settings section */}
          <div className="control-section company-section">
            <h2>Company Name</h2>
            <div className="control-item checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={showCompanyName}
                  onChange={() => setShowCompanyName(!showCompanyName)}
                />
                Show Company Name
              </label>
            </div>

            {showCompanyName && (
              <>
                <div className="control-item">
                  <label>Company Name:</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={handleCompanyNameChange}
                    className="text-input"
                    placeholder="Enter your company name"
                  />
                </div>

                <div className="control-item">
                  <label>Font Size: {companyNameFontSize}px</label>
                  <input
                    type="range"
                    min="12"
                    max="100"
                    value={companyNameFontSize}
                    onChange={handleCompanyNameFontSizeChange}
                    className="slider"
                  />
                </div>

                <div className="control-item">
                  <label>Font Weight:</label>
                  <select
                    value={companyNameFontWeight}
                    onChange={handleCompanyNameFontWeightChange}
                    className="select-input"
                  >
                    <option value="400">Normal (400)</option>
                    <option value="700">Bold (700)</option>
                    <option value="900">Extra Bold (900)</option>
                  </select>
                </div>

                <div className="control-item">
                  <label>Font Color:</label>
                  <div className="color-picker-container">
                    <input
                      type="color"
                      value={companyNameColor}
                      onChange={handleCompanyNameColorChange}
                      className="color-picker"
                    />
                    <span className="color-value">{companyNameColor}</span>
                  </div>
                </div>

                <div className="control-item checkbox">
                  <label>
                    <input
                      type="checkbox"
                      checked={companyNameStroke}
                      onChange={() => setCompanyNameStroke(!companyNameStroke)}
                    />
                    Text Outline
                  </label>
                </div>

                {companyNameStroke && (
                  <>
                    <div className="control-item">
                      <label>Outline Color:</label>
                      <div className="color-picker-container">
                        <input
                          type="color"
                          value={companyNameStrokeColor}
                          onChange={(e) =>
                            setCompanyNameStrokeColor(e.target.value)
                          }
                          className="color-picker"
                        />
                        <span className="color-value">
                          {companyNameStrokeColor}
                        </span>
                      </div>
                    </div>

                    <div className="control-item">
                      <label>Outline Width: {companyNameStrokeWidth}px</label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="0.5"
                        value={companyNameStrokeWidth}
                        onChange={(e) =>
                          setCompanyNameStrokeWidth(parseFloat(e.target.value))
                        }
                        className="slider"
                      />
                    </div>
                  </>
                )}

                <div className="control-item checkbox">
                  <label>
                    <input
                      type="checkbox"
                      checked={companyNameShadow}
                      onChange={() => setCompanyNameShadow(!companyNameShadow)}
                    />
                    Text Shadow
                  </label>
                </div>

                <div className="positioning-section">
                  <h3>Company Text Position (within box)</h3>
                  <div className="control-item">
                    <label>
                      Horizontal: {Math.round(companyNamePosition.x)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={companyNamePosition.x}
                      onChange={handleCompanyNameXPositionChange}
                      className="slider"
                    />
                  </div>

                  <div className="control-item">
                    <label>
                      Vertical: {Math.round(companyNamePosition.y)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={companyNamePosition.y}
                      onChange={handleCompanyNameYPositionChange}
                      className="slider"
                    />
                  </div>
                </div>

                <div className="bounding-box-section">
                  <h3>Company Box Position & Size</h3>
                  <div className="control-item checkbox">
                    <label>
                      <input
                        type="checkbox"
                        checked={companyBoundingBox.visible}
                        onChange={toggleCompanyBoundingBoxVisibility}
                      />
                      Show Company Box
                    </label>
                  </div>

                  <div className="control-item">
                    <label>
                      X Position: {companyBoundingBox.x.toFixed(1)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="0.5"
                      value={companyBoundingBox.x}
                      onChange={(e) =>
                        handleCompanyBoundingBoxChange("x", e.target.value)
                      }
                      className="slider"
                    />
                  </div>

                  <div className="control-item">
                    <label>
                      Y Position: {companyBoundingBox.y.toFixed(1)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="0.5"
                      value={companyBoundingBox.y}
                      onChange={(e) =>
                        handleCompanyBoundingBoxChange("y", e.target.value)
                      }
                      className="slider"
                    />
                  </div>

                  <div className="control-item">
                    <label>Width: {companyBoundingBox.width.toFixed(1)}%</label>
                    <input
                      type="range"
                      min="5"
                      max="90"
                      step="0.5"
                      value={companyBoundingBox.width}
                      onChange={(e) =>
                        handleCompanyBoundingBoxChange("width", e.target.value)
                      }
                      className="slider"
                    />
                  </div>

                  <div className="control-item">
                    <label>
                      Height: {companyBoundingBox.height.toFixed(1)}%
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="30"
                      step="0.5"
                      value={companyBoundingBox.height}
                      onChange={(e) =>
                        handleCompanyBoundingBoxChange("height", e.target.value)
                      }
                      className="slider"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Interaction settings */}
          <div className="control-section interaction-section">
            <h2>Interaction Settings</h2>
            <div className="control-item checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={interactionEnabled}
                  onChange={toggleInteraction}
                />
                Enable Drag & Resize
              </label>
            </div>

            {interactionEnabled && imageLoaded && (
              <div className="drag-hint">
                <p>
                  <strong>Drag Interactions:</strong>
                </p>
                <p>• Drag the price text to position it within its box</p>
                <p>• Drag the blue dot to resize the price</p>
                <p>• Drag the blue box border to move the price box</p>
                {showCompanyName && (
                  <>
                    <p>• Drag the company name to position it within its box</p>
                    <p>• Drag the purple dot to resize the company name</p>
                    <p>• Drag the purple box border to move the company box</p>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="action-buttons">
            <button onClick={resetToDefaults} className="reset-button">
              Reset to Defaults
            </button>
            <button onClick={downloadImage} className="download-button">
              Download Image
            </button>
          </div>
        </div>

        <div className="preview-panel">
          <h2>{isPreloadedImage ? "Preview Your Branded Flyer" : "Preview"}</h2>
          <div className="preview-container" ref={canvasContainerRef}>
            {!uploadedImage && !imageLoaded && !isPreloadedImage && (
              <div className="upload-prompt">
                <p>Upload an image to get started</p>
              </div>
            )}
            <canvas
              ref={canvasRef}
              className={`preview-canvas ${
                isDragging ||
                isResizing ||
                isDraggingPriceBox ||
                isDraggingCompanyBox ||
                isDraggingCompanyName ||
                isResizingCompanyName
                  ? "dragging"
                  : ""
              }`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
            />
          </div>
          <div className="preview-info">
            {imageLoaded ? (
              <div>
                <p>
                  Interactive editing is{" "}
                  {interactionEnabled ? "enabled" : "disabled"}.
                </p>
                <p>Bounding boxes will be hidden in the downloaded image.</p>
              </div>
            ) : (
              <p>
                {isPreloadedImage
                  ? "Loading your flyer..."
                  : "Upload an image to preview your branded flyer."}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Hidden image element */}
      <div
        style={{
          display: "none",
          position: "absolute",
          visibility: "hidden",
          pointerEvents: "none",
        }}
      >
        <img
          ref={imageRef}
          src={uploadedImage || preloadedImage || "/api/placeholder/900/1200"}
          alt="Tour Flyer"
          onLoad={handleImageLoad}
          crossOrigin="anonymous"
        />
      </div>
    </div>
  );
};

PriceOverlayTool.propTypes = {
  preloadedImage: PropTypes.string,
  preloadedTitle: PropTypes.string,
};

PriceOverlayTool.defaultProps = {
  preloadedImage: null,
  preloadedTitle: "",
};

export default PriceOverlayTool;
