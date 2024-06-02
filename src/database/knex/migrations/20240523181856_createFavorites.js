exports.up = knex => knex.schema.createTable("favorites", table => {
    table.increments("id");
    table.boolean("favorite").defaultTo(false);   

    table.integer("dishe_id").references("id").inTable("dishes").onDelete("CASCADE");
    table.integer("user_id").references("id").inTable("users").onDelete("CASCADE");

    table.timestamp("created_at").default(knex.fn.now()); 
}); 

exports.down = knex => knex.schema.dropTable("categories");
