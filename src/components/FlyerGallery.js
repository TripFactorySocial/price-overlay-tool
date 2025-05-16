import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import PriceOverlayTool from "./App"; // Our existing price overlay tool
import "./FlyerGallery.css";

// This function will scan the public/images directory for flyer images
// In a real application, this would typically be done server-side
// For this demo, we'll use our predefined FLYERS array but enhanced with logic to ensure images exist
const FLYERS = [
  {
    id: 1,
    title: "Bhutan Cultural Tour",
    image: "/images/bhutan-cultural-tour.jpg",
    description:
      "Explore the mystical land of Bhutan with our 7-day cultural immersion package.",
    category: "adventure",
    tags: ["culture", "mountains", "spiritual"],
    // todo
  },
  {
    id: 2,
    title: "Thailand Beach Getaway",
    image: "/images/thailand-beach.jpg",
    description:
      "Relax on pristine beaches and enjoy the tropical paradise of Thailand.",
    category: "beach",
    tags: ["relaxation", "beach", "tropical"],
  },
  {
    id: 3,
    title: "Paris Weekend Escape",
    image: "/images/paris-weekend.jpg",
    description:
      "Experience the romance of Paris with our curated weekend package.",
    category: "city",
    tags: ["romantic", "culture", "food"],
  },
  {
    id: 4,
    title: "Safari Adventure - Kenya",
    image: "/images/kenya-safari.jpg",
    description:
      "Witness the majestic wildlife of Kenya in their natural habitat.",
    category: "adventure",
    tags: ["wildlife", "nature", "photography"],
  },
  {
    id: 5,
    title: "Greek Islands Cruise",
    image: "/images/greek-islands.jpg",
    description:
      "Island hop through the stunning Greek archipelago on a luxury cruise.",
    category: "cruise",
    tags: ["islands", "mediterranean", "relaxation"],
  },
  {
    id: 6,
    title: "Japan Cherry Blossom Tour",
    image: "/images/japan-cherry-blossom.jpg",
    description:
      "Experience the magical cherry blossom season in Japan with our spring tour.",
    category: "cultural",
    tags: ["spring", "flowers", "tradition"],
  },
];

// Main component for managing flyers
const FlyerGallery = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [flyers, setFlyers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate loading flyers from public/images directory
  useEffect(() => {
    // In a real application, you might fetch this from an API
    // For now, we'll validate the FLYERS data to simulate this process

    const validateAndLoadFlyers = async () => {
      setLoading(true);

      // This would normally check if images exist in the public directory
      // For demo purposes, we'll just use a timeout to simulate loading
      setTimeout(() => {
        // Add image loading validation to each flyer
        const enhancedFlyers = FLYERS.map((flyer) => ({
          ...flyer,
          imageLoaded: true, // In a real app, you would check if the image exists
        }));

        setFlyers(enhancedFlyers);
        setLoading(false);
      }, 800); // Simulate network delay
    };

    validateAndLoadFlyers();
  }, []);

  // Get unique categories for filter buttons
  const categories = ["all", ...new Set(FLYERS.map((flyer) => flyer.category))];

  // Filter flyers based on active category and search term
  const filteredFlyers = flyers.filter((flyer) => {
    const matchesCategory =
      activeCategory === "all" || flyer.category === activeCategory;
    const matchesSearch =
      flyer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flyer.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flyer.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flyer-gallery">
      <header className="gallery-header">
        <h1>Tour & Travel Marketing Flyers</h1>
        <p>
          Browse our collection of marketing flyers for your next travel
          promotion
        </p>

        <div className="search-filter-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search flyers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-container">
            {categories.map((category) => (
              <button
                key={category}
                className={`filter-button ${
                  activeCategory === category ? "active" : ""
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="flyers-container">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading flyers...</p>
          </div>
        ) : filteredFlyers.length > 0 ? (
          filteredFlyers.map((flyer) => (
            <FlyerCard key={flyer.id} flyer={flyer} />
          ))
        ) : (
          <div className="no-results">
            <h2>No matching flyers found</h2>
            <p>Try adjusting your search terms or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Individual flyer card component
const FlyerCard = ({ flyer }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const handlePriceOverlayClick = () => {
    // Navigate to price overlay tool with flyer image URL as state
    navigate("/price-overlay", {
      state: { flyerImageUrl: flyer.image, flyerTitle: flyer.title },
    });
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="flyer-card">
      <div className="flyer-image-container">
        {!imageError ? (
          <img
            src={flyer.image}
            alt={flyer.title}
            className="flyer-image"
            onError={handleImageError}
          />
        ) : (
          <div className="image-placeholder">
            <p>Image not available</p>
          </div>
        )}
        <div className="category-badge">{flyer.category}</div>
      </div>

      <div className="flyer-content">
        <h2 className="flyer-title">{flyer.title}</h2>
        <p className="flyer-description">{flyer.description}</p>

        <div className="flyer-tags">
          {flyer.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>

        <div className="flyer-actions">
          <Link
            to={`/package-details/${flyer.id}`}
            className="btn view-details-btn"
          >
            View Package Details
          </Link>
          <button
            onClick={handlePriceOverlayClick}
            className="btn download-price-btn"
          >
            Download Flyer with Price
          </button>
        </div>
      </div>
    </div>
  );
};

// Modified Price Overlay tool that accepts an image URL
const PriceOverlayWrapper = () => {
  const location = useLocation();
  const { flyerImageUrl, flyerTitle } = location.state || {};

  // If a flyer was selected, pass its image URL to the PriceOverlayTool
  return (
    <PriceOverlayTool
      preloadedImage={flyerImageUrl}
      preloadedTitle={flyerTitle}
    />
  );
};

// Package details page component
const PackageDetails = () => {
  const { id } = useParams();
  const flyer = FLYERS.find((f) => f.id === parseInt(id));

  if (!flyer) {
    return <div className="not-found">Package not found</div>;
  }

  return (
    <div className="package-details">
      <h1>{flyer.title}</h1>
      <img src={flyer.image} alt={flyer.title} className="detail-image" />
      <p>{flyer.description}</p>

      <div className="package-details-content">
        <h2>Package Highlights</h2>
        <ul>
          <li>7-day all-inclusive tour</li>
          <li>Expert local guides</li>
          <li>Luxury accommodations</li>
          <li>All meals included</li>
          <li>Airport transfers</li>
        </ul>

        <h2>Itinerary Overview</h2>
        <p>Day 1: Arrival and Welcome Dinner</p>
        <p>Day 2-6: Guided Tours and Activities</p>
        <p>Day 7: Departure with Farewell Ceremony</p>

        <div className="booking-section">
          <h2>Ready to Book?</h2>
          <button className="btn download-price-btn">Book Now</button>
          <p>Or call us at: 1-800-TRAVEL</p>
        </div>
      </div>
    </div>
  );
};

// Main App component with routing
const App = () => {
  return (
    <Router>
      <div className="app">
        <nav className="main-nav">
          <div className="logo">
            <Link to="/">TravelFlyers</Link>
          </div>
          <ul className="nav-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/gallery">Flyer Gallery</Link>
            </li>
            <li>
              <Link to="/price-overlay">Price Tool</Link>
            </li>
          </ul>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<FlyerGallery />} />
            <Route path="/gallery" element={<FlyerGallery />} />
            <Route path="/price-overlay" element={<PriceOverlayWrapper />} />
            <Route path="/package-details/:id" element={<PackageDetails />} />
          </Routes>
        </main>

        <footer className="main-footer">
          <p>&copy; 2025 TravelFlyers. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
