exports.up = knex => knex.schema.createTable("ingredients", table => {
    table.increments("id");
    table.text("ingredient").notNullable();

    table.integer("dishe_id").references("id").inTable("dishes").onDelete("CASCADE");
    table.integer("user_id").references("id").inTable("users").onDelete("CASCADE");

    table.timestamp("created_at").default(knex.fn.now()); 
}); 

exports.down = knex => knex.schema.dropTable("ingredients");