exports.up = knex => knex.schema.createTable("categories", table => {
    table.increments("id");
    table
        .enum("type", ["entrada", "refeição", "sobremesa", "bebida"], {useNative: true, enumName: "categories"})
        .notNullable();
    table.boolean("favorite").defaultTo(false);  
    table.boolean("most_ordered").defaultTo(false);  

    table.integer("dishe_id").references("id").inTable("dishes").onDelete("CASCADE");
    table.integer("user_id").references("id").inTable("users");

    table.timestamp("created_at").default(knex.fn.now()); 
}); 

exports.down = knex => knex.schema.dropTable("categories");
