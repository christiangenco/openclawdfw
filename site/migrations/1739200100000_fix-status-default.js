/** Fix the status column default — remove extra quotes */

exports.up = (pgm) => {
  pgm.alterColumn("subscribers", "status", {
    default: pgm.func("'pending'"),
  });
};

exports.down = (pgm) => {
  // no-op, default was always meant to be 'pending'
};
