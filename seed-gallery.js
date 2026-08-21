const Gallery = require("./models/Gallery");

const images = [
  // =========================
  // MAIN GALLERY
  // =========================

  {
    title: "Cafe Interior",
    imageUrl: "assets/images/gallery/img1.png",
    category: "ambiance",
    description: "Beautiful Fuzion Cafe interior",
  },
  {
    title: "Coffee Latte",
    imageUrl: "assets/images/gallery/img2.jpg",
    category: "food",
    description: "Freshly prepared coffee latte",
  },
  {
    title: "Pastry",
    imageUrl: "assets/images/gallery/img3.jpg",
    category: "food",
    description: "Fresh and delicious pastry",
  },
  {
    title: "Restaurant Setup",
    imageUrl: "assets/images/gallery/img4.png",
    category: "ambiance",
    description: "Beautiful restaurant setup",
  },
  {
    title: "Beverages",
    imageUrl: "assets/images/gallery/img5.jpg",
    category: "drinks",
    description: "Refreshing beverages at Fuzion Cafe",
  },
  {
    title: "Dish Presentation",
    imageUrl: "assets/images/gallery/img6.jpg",
    category: "food",
    description: "Beautifully presented dish",
  },
  {
    title: "Food Close-up",
    imageUrl: "assets/images/gallery/img7.jpg",
    category: "food",
    description: "Delicious food at Fuzion Cafe",
  },
  {
    title: "Drink Service",
    imageUrl: "assets/images/gallery/img8.jpg",
    category: "drinks",
    description: "Refreshing drinks and beverages",
  },
  {
    title: "Event Gathering",
    imageUrl: "assets/images/gallery/img9.png",
    category: "events",
    description: "Special event gathering at Fuzion Cafe",
  },

  // =========================
  // CUSTOMER MEMORIES
  // =========================

  {
    title: "Customer Memory 1",
    imageUrl: "assets/images/gallery/gallery2.jpg",
    category: "events",
    description: "Beautiful customer moment at Fuzion Cafe",
  },
  {
    title: "Customer Memory 2",
    imageUrl: "assets/images/gallery/gallery3.jpg",
    category: "events",
    description: "Memorable moment at Fuzion Cafe",
  },
  {
    title: "Customer Memory 3",
    imageUrl: "assets/images/gallery/memory3.jpg",
    category: "events",
    description: "A special customer memory",
  },
  {
    title: "Customer Memory 4",
    imageUrl: "assets/images/gallery/gallery6.jpg",
    category: "events",
    description: "Happy moments at Fuzion Cafe",
  },
  {
    title: "Customer Memory 5",
    imageUrl: "assets/images/gallery/gallery4.jpeg",
    category: "events",
    description: "Special guest moment",
  },
  {
    title: "Customer Memory 6",
    imageUrl: "assets/images/gallery/memory6.jpg",
    category: "events",
    description: "Beautiful memories at Fuzion Cafe",
  },

  // =========================
  // BEHIND THE SCENES
  // =========================

  {
    title: "In The Kitchen",
    imageUrl: "assets/images/gallery/bts1.jpg",
    category: "ambiance",
    description: "Kitchen preparation at Fuzion Cafe",
  },
  {
    title: "Coffee Crafting",
    imageUrl: "assets/images/gallery/bts2.jpg",
    category: "drinks",
    description: "Coffee preparation and crafting",
  },
  {
    title: "Our Team",
    imageUrl: "assets/images/gallery/bts3.jpg",
    category: "ambiance",
    description: "Our team behind the scenes",
  },
  {
    title: "Plating Art",
    imageUrl: "assets/images/gallery/bts4.jpg",
    category: "food",
    description: "Beautiful food plating",
  },
  {
    title: "Fresh Ingredients",
    imageUrl: "assets/images/gallery/bts5.jpg",
    category: "food",
    description: "Fresh ingredients used at Fuzion Cafe",
  },
  {
    title: "Kitchen Energy",
    imageUrl: "assets/images/gallery/bts6.jpg",
    category: "ambiance",
    description: "Energy inside the Fuzion kitchen",
  },

  // =========================
  // EVENTS
  // =========================

  {
    title: "Corporate Gathering",
    imageUrl: "assets/images/gallery/event1.jpg",
    category: "events",
    description:
      "Corporate breakfast meeting with premium coffee and catering services",
  },
  {
    title: "Birthday Celebration",
    imageUrl: "assets/images/gallery/event2.jpg",
    category: "events",
    description:
      "Birthday celebration with custom menu and beautiful ambiance",
  },
  {
    title: "Wedding Reception",
    imageUrl: "assets/images/gallery/event3.jpg",
    category: "events",
    description:
      "Elegant wedding reception with premium cuisine",
  },
  {
    title: "Private Dinner Party",
    imageUrl: "assets/images/gallery/event4.jpg",
    category: "events",
    description:
      "Private dinner with personalized menu and exclusive arrangement",
  },
];

async function seedGallery() {
  try {
    console.log("Adding gallery images...");

    for (const image of images) {
      await Gallery.create({
        ...image,
        status: "Active",
      });
    }

    console.log(`✅ Successfully added ${images.length} gallery images.`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Gallery seed error:", error);
    process.exit(1);
  }
}

seedGallery();