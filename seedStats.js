// seedStats.js  (project root ma, models/ controllers/ routes/ sanga same level)
const sequelize = require("./config/database"); // your sequelize instance
const CafeStat = require("./models/CafeStat");

async function seed() {
    try {
        await sequelize.sync(); // ensures cafe_stats table exists

        const existing = await CafeStat.count();

        if (existing > 0) {
            console.log("CafeStat table already has data. Skipping seed.");
            process.exit(0);
        }

        await CafeStat.bulkCreate([
            { icon: "fa-solid fa-calendar-days", targetValue: 2,     suffix: "+", label: "Years Experience", order: 1 },
            { icon: "fa-solid fa-chef-hat",      targetValue: 10,    suffix: "+", label: "Expert Chefs",      order: 2 },
            { icon: "fa-solid fa-utensils",      targetValue: 100,   suffix: "+", label: "Menu Items",        order: 3 },
            { icon: "fa-solid fa-users",         targetValue: 10000, suffix: "+", label: "Happy Customers",   order: 4 },
        ]);

        console.log("Cafe stats seeded successfully.");
        process.exit(0);

    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
}

seed();