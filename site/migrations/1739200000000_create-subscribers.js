/** @type {import("node-pg-migrate").MigrationBuilder} */

exports.up = (pgm) => {
  pgm.createTable("subscribers", {
    id: "id", // SERIAL PRIMARY KEY
    email: { type: "text", notNull: true, unique: true },
    name: { type: "text" },
    lead_magnet: { type: "text", notNull: true },
    status: { type: "text", notNull: true, default: "'pending'" }, // pending → active → unsubscribed
    drip_step: { type: "integer", notNull: true, default: 0 },
    drip_next_at: { type: "timestamptz" },
    confirmed_at: { type: "timestamptz" }, // double opt-in confirmation
    subscribed_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("NOW()"),
    },
    unsubscribed_at: { type: "timestamptz" },
  });

  pgm.createIndex("subscribers", "status");
  pgm.createIndex("subscribers", "drip_next_at");
};

exports.down = (pgm) => {
  pgm.dropTable("subscribers");
};
