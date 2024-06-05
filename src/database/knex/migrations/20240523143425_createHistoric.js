exports.up = knex => knex.schema.createTable("historic", table => {
    table.increments("id");
    table.text("code", 10).notNullable().unique();
    table.text("details").notNullable();

    table
        .enum("status", ["pendente", "preparando", "entregue", "cancelar"], {useNative: true, enumName: "status"})
        .notNullable().defaultTo("pendente");
        
    table.integer("user_id").references("id").inTable("users").onDelete("CASCADE");


    table.timestamp("created_at").default(knex.fn.now()); 
    table.timestamp("updated_at").default(knex.fn.now()); 
}); 

exports.down = knex => knex.schema.dropTable("historic");
