// App.js - Main application component with routing
import React from "react";
import {
  // BrowserRouter as Router,
  HashRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import PriceOverlayTool from "./PriceOverlayTool";
import "./components/FlyerGallery.css";

// Updated FLYERS array with concise, catchy descriptions (max 60 chars)
const FLYERS = [
  {
    id: 1,
    title: "Western Bhutan Tour",
    image:
      "/price-overlay-tool/images/3707858-3707857_bf--western-bhutan-tour-5085304.jpg",
    description:
      "Mystical monasteries & mountain magic in the Land of Thunder.",
    category: "asia",
    tags: ["asia", "bhutan", "cultural"],
    link: "https://www.nexusdmc.com/package/western-bhutan-tour-5085304",
  },
  {
    id: 2,
    title: "Best of Switzerland",
    image:
      "/price-overlay-tool/images/3130243-3130242_best-of-switzerland-with-flights_blank-flyer.jpg",
    description: "Alpine peaks, crystal lakes & chocolate dreams await!",
    category: "europe",
    tags: ["europe", "switzerland", "alps"],
    link: "https://www.nexusdmc.com/package/best-of-switzerland-3410052",
  },
  {
    id: 3,
    title: "Romantic Bali with Private Pool Villa Stay",
    image:
      "/price-overlay-tool/images/3130251-3130250_romantic-bali-with-private-pool-villa-stay-flyer-blank.jpg",
    description: "Paradise pools & sunset kisses in the Island of Gods.",
    category: "asia",
    tags: ["asia", "indonesia", "bali", "romantic"],
    link: "https://www.nexusdmc.com/package/romantic-bali-with-private-pool-villa-stay-3415447",
  },
  {
    id: 4,
    title: "Glimpses of Vietnam",
    image:
      "/price-overlay-tool/images/3133214-3133213_glimpses-of-vietnam-blank-flyer-1.jpg",
    description: "Ancient pagodas to floating markets: Vietnam essentials.",
    category: "asia",
    tags: ["asia", "vietnam", "cultural"],
    link: "https://www.nexusdmc.com/package/glimpses-of-vietnam-3429316",
  },
  {
    id: 5,
    title: "Express Vietnam Tour",
    image:
      "/price-overlay-tool/images/3133216-3133215_express-vietnam-tour_blank-flyer-1.jpg",
    description: "Fast-track Vietnam: bustling cities to tranquil bays.",
    category: "asia",
    tags: ["asia", "vietnam", "express"],
    link: "https://www.nexusdmc.com/package/express-vietnam-tour-3428285",
  },
  {
    id: 6,
    title: "Flavor of North & South Vietnam",
    image:
      "/price-overlay-tool/images/3134131-3134130_flavor-of-north-and-south-vietnam-blank-flyer.jpg",
    description: "Hanoi's grace to Saigon's pace: a complete Vietnam journey.",
    category: "asia",
    tags: ["asia", "vietnam", "comprehensive"],
    link: "https://www.nexusdmc.com/package/flavor-of-north-and-south-vietnam-3415719",
  },
  {
    id: 7,
    title: "Unbelievable Australia",
    image: "/price-overlay-tool/images/3163595-3163594_australia.jpg",
    description: "Reef to rock: Australia's wild wonders & urban treasures.",
    category: "oceania",
    tags: ["oceania", "australia", "wildlife"],
    link: "https://www.nexusdmc.com/package/unbelievable-australia-3557956",
  },
  {
    id: 8,
    title: "Unbelievable Japan",
    image:
      "/price-overlay-tool/images/3163597-3163596_whatsapp-image-2023-10-07-at-81021-pm.jpg",
    description: "Neon cities to zen temples: Japan's perfect contrasts.",
    category: "asia",
    tags: ["asia", "japan", "culture"],
    link: "https://www.nexusdmc.com/package/unbelievable-japan-3558409",
  },
  {
    id: 9,
    title: "Himachal Delight",
    image:
      "/price-overlay-tool/images/3246925-3246924_himachal-delight-blank.jpg",
    description: "Himalayan hideaways & apple orchards in India's mountains.",
    category: "asia",
    tags: ["asia", "india", "mountains"],
    link: "https://www.nexusdmc.com/package/himachal-delight-3904126",
  },
  {
    id: 10,
    title: "Sikkim Delight",
    image:
      "/price-overlay-tool/images/3246929-3246928_sikkim-delight-blank.jpg",
    description: "Monasteries & mountains in India's hidden Himalayan gem.",
    category: "asia",
    tags: ["asia", "india", "northeast"],
    link: "https://www.nexusdmc.com/package/sikkim-delight-3904000",
  },
  {
    id: 11,
    title: "Memorable Andaman",
    image:
      "/price-overlay-tool/images/3246932-3246931_memorable-andaman-blank.jpg",
    description: "Turquoise waters & secluded beaches of India's paradise.",
    category: "asia",
    tags: ["asia", "india", "islands"],
    link: "https://www.nexusdmc.com/package/memorable-andaman-3903911",
  },
  {
    id: 12,
    title: "Wonders of Europe",
    image:
      "/price-overlay-tool/images/3246944-3246943_wonders-of-europe-2024---veg-special-blank.jpg",
    description: "Iconic capitals, alpine vistas & Mediterranean charm.",
    category: "europe",
    tags: ["europe", "cultural", "historical"],
    link: "https://www.nexusdmc.com/package/wonders-of-europe-2024-3410406",
  },
  {
    id: 13,
    title: "Glimpses of Europe",
    image:
      "/price-overlay-tool/images/3246961-3246960_glimpses-of-europe-summer-2024---blank.jpg",
    description: "Europe's greatest hits: castles, canals & cafés.",
    category: "europe",
    tags: ["europe", "highlights", "summer"],
    link: "https://www.nexusdmc.com/package/glimpses-of-europe-2024-3412363",
  },
  {
    id: 14,
    title: "Romantic Switzerland & Paris",
    image:
      "/price-overlay-tool/images/3315642-3315641_romantic-switzerland-and-paris-2024---flyer---blank.jpg",
    description: "Alpine romance to Parisian elegance: love in Europe.",
    category: "europe",
    tags: ["europe", "switzerland", "france", "romantic"],
    link: "https://www.nexusdmc.com/package/romantic-switzerland-and-paris-2871653",
  },
  {
    id: 15,
    title: "Chalo Thailand",
    image: "/price-overlay-tool/images/3328274-3328273_thailand---1-1.jpg",
    description: "Golden temples, azure waters & spicy street feasts.",
    category: "asia",
    tags: ["asia", "thailand", "beach"],
    link: "https://www.nexusdmc.com/package/chalo-thailand-2730625",
  },
  {
    id: 16,
    title: "Fabulous HongKong & Macau",
    image:
      "/price-overlay-tool/images/3332058-3332057_fabulous-hong-kong-and-macau-1074228.jpg",
    description: "Skyscrapers to casinos: Asia's urban playgrounds.",
    category: "asia",
    tags: ["asia", "hong kong", "macau"],
    link: "https://www.nexusdmc.com/package/fabulous-hong-kong-and-macau-1074228",
  },
  {
    id: 17,
    title: "Magnificient New Zealand",
    image:
      "/price-overlay-tool/images/3449542-3449541_magnificent-new-zealand-9099.jpg",
    description: "Middle-earth magic: fjords, geysers & Maori culture.",
    category: "oceania",
    tags: ["oceania", "new zealand", "nature"],
    link: "https://www.nexusdmc.com/package/magnificent-new-zealand-4179099",
  },
  {
    id: 18,
    title: "Wonders of Europe 2025",
    image:
      "/price-overlay-tool/images/3477117-3477116_wonders-of-europe-2025---4864377.jpg",
    description: "Tomorrow's European classics: new experiences await.",
    category: "europe",
    tags: ["europe", "tour", "2025"],
    link: "https://www.nexusdmc.com/package/wonders-of-europe-2025-4864377",
  },
  {
    id: 19,
    title: "Wonders of Europe (VEG) - KITCHEN CARAVAN",
    image:
      "/price-overlay-tool/images/3477122-3477121_wonders-of-europe-veg---kitchen-caravan---3899060.jpg",
    description: "Plant-based pleasures across Europe's culinary capitals.",
    category: "europe",
    tags: ["europe", "vegetarian", "food"],
    link: "https://www.nexusdmc.com/package/wonders-of-europe-veg--%C2%A0kitchen%C2%A0caravan-3899060",
  },
  {
    id: 20,
    title: "Grand Tour of Europe 2025",
    image:
      "/price-overlay-tool/images/3477136-3477135_grand-tour-of-europe-2025---4881265.jpg",
    description: "Epic European odyssey spanning 10 countries.",
    category: "europe",
    tags: ["europe", "grand tour", "multiple countries"],
    link: "https://www.nexusdmc.com/package/grand-tour-of-europe-2025-4881265",
  },
  {
    id: 21,
    title: "Glimpses of Europe 2025",
    image:
      "/price-overlay-tool/images/3477141-3477140_glimpses-of-europe-2025---4891559.jpg",
    description: "Europe's essentials: picture-perfect cities & countryside.",
    category: "europe",
    tags: ["europe", "highlights", "2025"],
    link: "https://www.nexusdmc.com/package/glimpses-of-europe-2025-4891559",
  },
  {
    id: 22,
    title: "Unbeatable Europe",
    image:
      "/price-overlay-tool/images/3477163-3477162_unbeatable-europe---3477186.jpg",
    description: "Elite European experiences with exclusive access.",
    category: "europe",
    tags: ["europe", "premium", "luxury"],
    link: "https://www.nexusdmc.com/package/unbeatable-europe-3477186",
  },
  {
    id: 23,
    title: "Wonders of Australia",
    image:
      "/price-overlay-tool/images/3477188-3477187_wonders-of-australia---4178899.jpg",
    description: "Down Under delights: from outback to opera house.",
    category: "oceania",
    tags: ["oceania", "australia", "nature"],
    link: "https://www.nexusdmc.com/package/wonders-of-australia-with-indian-meals-4178899",
  },
  {
    id: 24,
    title: "Best of Turkey with Antalya",
    image:
      "/price-overlay-tool/images/3477192-3477191_best-of-turkey-with-antalya---2468184.jpg",
    description: "Ancient ruins to turquoise coasts: complete Turkish dream.",
    category: "asia",
    tags: ["asia", "turkey", "antalya"],
    link: "https://www.nexusdmc.com/package/best-of-turkey-with-antalya-2468184",
  },
  {
    id: 25,
    title: "Flavor of North and South Vietnam",
    image:
      "/price-overlay-tool/images/3477209-3477208_flavor-of-north-and-south-vietnam---3415719.jpg",
    description: "Rice terraces to Mekong Delta: taste all of Vietnam.",
    category: "asia",
    tags: ["asia", "vietnam", "north-south"],
    link: "https://www.nexusdmc.com/package/flavor-of-north-and-south-vietnam-3415719",
  },
  {
    id: 26,
    title: "Unbelievable Singapore and Malaysia",
    image:
      "/price-overlay-tool/images/3477216-3477215_unbelievable-singapore-and-malaysia---3560248.jpg",
    description: "Urban marvels to rainforest magic in Southeast Asia.",
    category: "asia",
    tags: ["asia", "singapore", "malaysia"],
    link: "https://www.nexusdmc.com/package/unbelievable-singapore-and-malaysia-3560248",
  },
  {
    id: 27,
    title: "Wonders of UK & Scotland",
    image:
      "/price-overlay-tool/images/3484951-3484950_wonders-of-uk-and-scotland---blank-1741438.jpg",
    description: "Royal heritage to highland mystery: British splendor.",
    category: "europe",
    tags: ["europe", "uk", "scotland"],
    link: "https://www.nexusdmc.com/package/wonders-of-uk-and-scotland-1741438",
  },
  {
    id: 28,
    title: "Romantic Bali on a Budget",
    image:
      "/price-overlay-tool/images/3484960-3484959_romantic-bali-on-a-budget---blank-4863651.jpg",
    description: "Paradise without the price tag: affordable Bali love.",
    category: "asia",
    tags: ["asia", "bali", "budget", "romantic"],
    link: "https://www.nexusdmc.com/package/romantic-bali-on-a-budget-4863651",
  },
  {
    id: 29,
    title: "Glimpses of Bali",
    image:
      "/price-overlay-tool/images/3484972-3484971_glimpses-of-bali---blank-2731647.jpg",
    description: "Rice terraces, temple gates & beachside sunsets.",
    category: "asia",
    tags: ["asia", "bali", "highlights"],
    link: "https://www.nexusdmc.com/package/glimpses-of-bali-2731647",
  },
  {
    id: 30,
    title: "Memorable Bali for Couples with Pool Villa",
    image:
      "/price-overlay-tool/images/3484981-3484980_memorable-bali-for-couples-with-pool-villa---blank-4893872.jpg",
    description: "Private paradise: luxury Bali villas for two.",
    category: "asia",
    tags: ["asia", "bali", "luxury", "couples"],
    link: "https://www.nexusdmc.com/package/memorable-bali-for-couples-with-pool-villa-4893872",
  },
  {
    id: 31,
    title: "Asian Extravaganza",
    image:
      "/price-overlay-tool/images/3485008-3485007_asian-extravaganza---4135737.jpg",
    description: "Ancient temples to futuristic cities across Asia.",
    category: "asia",
    tags: ["asia", "multiple countries", "cultural"],
    link: "https://www.nexusdmc.com/package/asian-extravaganza-4135737",
  },
  {
    id: 32,
    title: "Wonders of Japan Tour Premium",
    image:
      "/price-overlay-tool/images/3487762-3487761_wonders-of-japan-tour-premium-4959326.jpg",
    description: "Elite Japan: from samurai castles to Michelin stars.",
    category: "asia",
    tags: ["asia", "japan", "premium"],
    link: "https://www.nexusdmc.com/package/best-of-japan-cherry-blossom-4959326",
  },
  {
    id: 33,
    title: "Finland with Northern Lights",
    image:
      "/price-overlay-tool/images/3508989-3508988_finland-with-northern-lights---4857026.jpg",
    description: "Arctic magic: chase the aurora in Lapland's wilderness.",
    category: "europe",
    tags: ["europe", "finland", "northern lights"],
    link: "https://www.nexusdmc.com/package/finland-with-northern-lights-4857026",
  },
  {
    id: 34,
    title: "Europe Winter Carnival with Christmas Markets",
    image:
      "/price-overlay-tool/images/3509010-3509009_europe-winter-carnival-with-christmas-markets---blank-4888438.jpg",
    description: "Festive magic: mulled wine and market treasures.",
    category: "europe",
    tags: ["europe", "winter", "christmas markets"],
    link: "https://www.nexusdmc.com/package/europe-winter-carnival-with-christmas-markets-4888438",
  },
  {
    id: 35,
    title: "Majestic Australia",
    image:
      "/price-overlay-tool/images/3510507-3510506_majestic-australia---5079110.jpg",
    description: "From reef to rock: Australia's natural masterpieces.",
    category: "oceania",
    tags: ["oceania", "australia", "landscapes"],
    link: "https://www.nexusdmc.com/package/majestic-australia-with-indian-meals-5079110",
  },
  {
    id: 36,
    title: "Grand Tour of Europe Premium",
    image:
      "/price-overlay-tool/images/3516476-3516475_grand-tour-of-europe---premium-4887366.jpg",
    description: "Europe's crown jewels with five-star luxury.",
    category: "europe",
    tags: ["europe", "premium", "grand tour"],
    link: "https://www.nexusdmc.com/package/grand-tour-of-europe---premium-4887366",
  },
  {
    id: 37,
    title: "Wonders of Europe Premium",
    image:
      "/price-overlay-tool/images/3516486-3516485_wonders-of-europe---premium---4868595.jpg",
    description: "VIP Europe: skip-the-line access to iconic treasures.",
    category: "europe",
    tags: ["europe", "premium", "luxury"],
    link: "https://www.nexusdmc.com/package/wonders-of-europe---premium-4868595",
  },
  {
    id: 38,
    title: "Swiss Paris at a Glance",
    image:
      "/price-overlay-tool/images/3518298-3518297_swiss-paris-at-a-glance---5100728.jpg",
    description: "Alpine charm to Parisian style in one elegant journey.",
    category: "europe",
    tags: ["europe", "switzerland", "paris", "highlights"],
    link: "https://www.nexusdmc.com/package/swiss-paris-at-a-glance-5100728",
  },
  {
    id: 39,
    title: "Glimpses of Europe",
    image:
      "/price-overlay-tool/images/3518306-3518305_glimpses-of-europe-2024---3412363.jpg",
    description: "European greatest hits: castles, cafés & canals.",
    category: "europe",
    tags: ["europe", "highlights", "quick tour"],
    link: "https://www.nexusdmc.com/package/glimpses-of-europe-2024-3412363",
  },
  {
    id: 40,
    title: "Italy Swiss Paris",
    image:
      "/price-overlay-tool/images/3518314-3518313_italy-swiss-paris---3418425.jpg",
    description: "Romance trilogy: pasta, peaks & Parisian elegance.",
    category: "europe",
    tags: ["europe", "italy", "switzerland", "paris"],
    link: "https://www.nexusdmc.com/package/italy-swiss-paris-3418425",
  },
  {
    id: 41,
    title: "Cherry Blossom Bliss",
    image:
      "/price-overlay-tool/images/3557670-3557669_cherry-blossom---budget.jpg",
    description: "Pink petal paradise: spring magic in Japan.",
    category: "asia",
    tags: ["asia", "japan", "cherry blossom", "spring"],
    link: "https://www.nexusdmc.com/package/cherry-blossom-bliss-budget-friendly-japan-tour-5221657",
  },
  {
    id: 42,
    title: "Singapore Malaysia Delight",
    image:
      "/price-overlay-tool/images/3575522-3575521_singapore-malaysia-delight---get-visa-free-901949.jpg",
    description: "City splendor to tropical escapes: no visa required!",
    category: "asia",
    tags: ["asia", "singapore", "malaysia", "visa-free"],
    link: "https://www.nexusdmc.com/package/singapore-malaysia-delight---get-visa-free-901949",
  },
  {
    id: 43,
    title: "Facinating Dubai with Abu Dhabi",
    image:
      "/price-overlay-tool/images/3578122-3578121_bf-fascinating-dubai-with-abu-dhabi---5350662.jpg",
    description: "Desert skyscrapers to grand mosques: UAE magnificence.",
    category: "asia",
    tags: ["asia", "uae", "dubai", "abu dhabi"],
    link: "https://www.nexusdmc.com/package/fascinating-dubai-with-abu-dhabi-5350662",
  },
  {
    id: 44,
    title: "Austria Swiss Adventure",
    image:
      "/price-overlay-tool/images/3580782-3580781_bf-austria-swiss-adventure-private-van-tour-5307206.jpg",
    description: "Alpine freedom: exclusive mountain tour with private van.",
    category: "europe",
    tags: ["europe", "austria", "switzerland", "adventure"],
    link: "https://www.nexusdmc.com/package/austria-swiss-adventure-private-van-tour-5307206",
  },
  {
    id: 45,
    title: "Paris Swiss Getaways",
    image:
      "/price-overlay-tool/images/3580789-3580788_bf-paris-swiss-getaway---private-van-tour-5307174.jpg",
    description: "Eiffel to Matterhorn: private European escape.",
    category: "europe",
    tags: ["europe", "paris", "switzerland", "private tour"],
    link: "https://www.nexusdmc.com/package/paris-swiss-getaway---private-van-tour-5307174",
  },
  {
    id: 46,
    title: "Vietnam Adventure Quest",
    image:
      "/price-overlay-tool/images/3586326-3586325_bf-vietnam-adventure-quest-3770945.jpg",
    description: "Limestone caves to hillside treks: active Vietnam.",
    category: "asia",
    tags: ["asia", "vietnam", "adventure"],
    link: "https://www.nexusdmc.com/package/vietnam-adventure-quest-3770945",
  },
  {
    id: 47,
    title: "Vietnam Adventure Quest",
    image:
      "/price-overlay-tool/images/3586330-3586329_bf-vietnam-adventure-quest-with-halong-bay-3771014.jpg",
    description: "Kayak karst bays & conquer mountain trails in Vietnam.",
    category: "asia",
    tags: ["asia", "vietnam", "halong bay", "adventure"],
    link: "https://www.nexusdmc.com/package/vietnam-adventure-quest-with-halong-bay-3771014",
  },
  {
    id: 48,
    title: "Dubai Extravaganza",
    image:
      "/price-overlay-tool/images/3591125-3591124_bf-dubai-extravaganza-3448708.jpg",
    description: "Desert luxury: tallest, biggest & most dazzling Dubai.",
    category: "asia",
    tags: ["asia", "dubai", "luxury"],
    link: "https://www.nexusdmc.com/package/dubai-extravaganza-3448708",
  },
  {
    id: 49,
    title: "Dubai Jain Tour",
    image:
      "/price-overlay-tool/images/3591128-3591127_bf-dubai-jain-tour-3016478.jpg",
    description: "Dubai wonders with pure veg meals: Jain-friendly travel.",
    category: "asia",
    tags: ["asia", "dubai", "jain"],
    link: "https://www.nexusdmc.com/package/dubai-jain-tour-jain-food-only-3016478",
  },
  {
    id: 50,
    title: "Simply Krabi & Phuket",
    image:
      "/price-overlay-tool/images/3591132-3591131_bf-simply-krabi--phuket-5178462.jpg",
    description: "Thailand's beach bliss: karst cliffs & turquoise seas.",
    category: "asia",
    tags: ["asia", "thailand", "krabi", "phuket", "beach"],
    link: "https://www.nexusdmc.com/package/simply-krabi--phuket-5178462",
  },
  {
    id: 51,
    title: "Goa Getaway",
    image:
      "/price-overlay-tool/images/3606419-3606418_goa-getaway-adamo-the-bellus--5455405.jpg",
    description: "Sunset beaches, spice markets & Portuguese charm.",
    category: "asia",
    tags: ["asia", "india", "goa", "beach"],
    link: "https://www.nexusdmc.com/package/goa-getaway-adamo-the-bellus----4-star-5455405",
  },
  {
    id: 52,
    title: "Unbeatable Vietnam Premium",
    image:
      "/price-overlay-tool/images/3621940-3621939_new-blank-unbeatable-vietnam-premium-5360968.jpg",
    description: "Five-star Vietnam: luxury amid stunning landscapes.",
    category: "asia",
    tags: ["asia", "vietnam", "premium"],
    link: "https://www.nexusdmc.com/package/unbeatable-vietnam-premium-5360968",
  },
  {
    id: 53,
    title: "Chalo Thailand",
    image:
      "/price-overlay-tool/images/3631087-3631086_bf-chalo-thailand-2730625.jpg",
    description: "From buzzing Bangkok to serene island retreats.",
    category: "asia",
    tags: ["asia", "thailand", "adventure"],
    link: "https://www.nexusdmc.com/package/chalo-thailand-2730625",
  },
  {
    id: 54,
    title: "Ultimate Europe",
    image:
      "/price-overlay-tool/images/3671579-3671578_bf-ultimate-europe-3591176-nov-2024.jpg",
    description: "Seven countries, countless memories: complete Europe.",
    category: "europe",
    tags: ["europe", "ultimate", "multiple countries"],
    link: "https://www.nexusdmc.com/package/ultimate-europe-3591176",
  },
];

// Helper function to format category names for display
const formatCategoryName = (category) => {
  if (category === "all") return "All Destinations";

  // Format names like north_america to North America
  return category
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Filter button component that uses React Router navigation
const FilterButton = ({ category, activeCategory, setActiveCategory }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    setActiveCategory(category);
    // Update URL when category is changed
    if (category === "all") {
      navigate("/gallery");
    } else {
      navigate(`/gallery?region=${category}`);
    }
  };

  return (
    <button
      className={`filter-button ${activeCategory === category ? "active" : ""}`}
      onClick={handleClick}
    >
      {formatCategoryName(category)}
    </button>
  );
};

const FlyerGallery = () => {
  const [activeCategory, setActiveCategory] = React.useState("all");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [flyers, setFlyers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const location = useLocation();

  // Parse query parameters to get the region
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const regionParam = params.get("region");
    if (regionParam) {
      setActiveCategory(regionParam);
    }
  }, [location.search]);

  React.useEffect(() => {
    setTimeout(() => {
      const enhancedFlyers = FLYERS.map((flyer) => ({
        ...flyer,
        imageLoaded: true,
      }));
      setFlyers(enhancedFlyers);
      setLoading(false);
    }, 800);
  }, []);

  // Get unique categories and sort them alphabetically
  const categories = [
    "all",
    ...new Set(FLYERS.map((flyer) => flyer.category)),
  ].sort();

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
        <h1>Discover Your Perfect Journey</h1>
        <p>
          Browse our collection of handcrafted travel experiences from around
          the world
        </p>

        <div className="search-filter-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search destinations, experiences, or interests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <div className="search-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>

          <div className="filter-container">
            {categories.map((category) => (
              <FilterButton
                key={category}
                category={category}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
              />
            ))}
          </div>
        </div>
      </header>

      <div className="flyers-container">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Discovering amazing destinations...</p>
          </div>
        ) : filteredFlyers.length > 0 ? (
          filteredFlyers.map((flyer) => (
            <FlyerCard key={flyer.id} flyer={flyer} />
          ))
        ) : (
          <div className="no-results">
            <h2>No matching destinations found</h2>
            <p>Try adjusting your search terms or filters</p>
            <button
              className="reset-search-btn"
              onClick={() => {
                setSearchTerm("");
                setActiveCategory("all");
              }}
            >
              Reset Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const FlyerCard = ({ flyer }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const handlePriceOverlayClick = () => {
    navigate("/price-overlay", {
      state: { flyerImageUrl: flyer.image, flyerTitle: flyer.title },
    });
  };

  // Format category name for display on the badge
  const formatCategoryName = (category) => {
    return category
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div
      className="flyer-card modern"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flyer-image-container">
        {!imageError ? (
          <img
            src={flyer.image}
            alt={flyer.title}
            className="flyer-image"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="image-placeholder">
            <p>Image not available</p>
          </div>
        )}
        <div className="category-badge">
          {formatCategoryName(flyer.category)}
        </div>

        {/* Animated overlay on hover */}
        <div className={`flyer-image-overlay ${isHovered ? "visible" : ""}`}>
          <p className="overlay-description">{flyer.description}</p>
        </div>
      </div>
      <div className="flyer-content">
        <h2 className="flyer-title">{flyer.title}</h2>
        <div className="flyer-actions">
          <Link to={`${flyer.link}`} className="btn view-details-btn">
            View Details
          </Link>
          <button
            onClick={handlePriceOverlayClick}
            className="btn download-price-btn"
          >
            Customize Flyer
          </button>
        </div>
      </div>
    </div>
  );
};

const PriceOverlayWrapper = () => {
  const location = useLocation();
  const { flyerImageUrl, flyerTitle } = location.state || {};
  return (
    <PriceOverlayTool
      preloadedImage={flyerImageUrl}
      preloadedTitle={flyerTitle}
    />
  );
};

const App = () => {
  return (
    <Router>
      <div className="app">
        <nav className="main-nav">
          <div className="logo">
            <Link to="/">
              <img
                src="https://cdn.yourholiday.me/static/dynimg/partner/98/300x150/3182372-3182371_nexusdmc_hrz_blk.png"
                alt="logo"
                className="nav-logo"
              ></img>
            </Link>
          </div>
          <ul className="nav-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/price-overlay">GFS Canvas</Link>
            </li>
          </ul>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<FlyerGallery />} />
            <Route path="/gallery" element={<FlyerGallery />} />
            <Route path="/price-overlay" element={<PriceOverlayWrapper />} />
          </Routes>
        </main>

        <footer className="main-footer">
          <div className="footer-content">
            <div className="footer-logo">
              <Link to="/">
                <img
                  src="https://grow.nexusdmc.com/wp-content/uploads/2025/03/NexusDMC-logo-1.png"
                  alt="logo"
                  className="foo-logo"
                ></img>
              </Link>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h3>Destinations</h3>
                <ul>
                  <li>
                    <Link to="/gallery?region=asia">Asia</Link>
                  </li>
                  <li>
                    <Link to="/gallery?region=africa">Africa</Link>
                  </li>
                  <li>
                    <Link to="/gallery?region=europe">Europe</Link>
                  </li>
                  <li>
                    <Link to="/gallery?region=north_america">
                      North America
                    </Link>
                  </li>
                  <li>
                    <Link to="/gallery?region=south_america">
                      South America
                    </Link>
                  </li>
                  <li>
                    <Link to="/gallery?region=oceania">Oceania</Link>
                  </li>
                </ul>
              </div>
              <div className="footer-column">
                <h3>Company</h3>
                <ul>
                  <li>
                    <Link to="https://www.nexusdmc.com/">About Us</Link>
                  </li>
                  <li>
                    <Link to="https://www.nexusdmc.com/service/contactus">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link to="https://www.nexusdmc.com/tours/footer/privacy-policy-244">
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Nexus DMC. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
