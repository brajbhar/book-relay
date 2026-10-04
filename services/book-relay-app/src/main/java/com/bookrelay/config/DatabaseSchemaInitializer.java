package com.bookrelay.config;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSchemaInitializer implements ApplicationRunner {

    private static final String[] SCHEMAS = {"auth", "catalog", "lending", "fulfillment"};

    private final JdbcTemplate jdbcTemplate;

    public DatabaseSchemaInitializer(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(ApplicationArguments args) {
        try {
            jdbcTemplate.execute(
                    """
                    IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'book_relay')
                        CREATE DATABASE book_relay
                    """);
        } catch (Exception ignored) {
            // database may already exist
        }
        for (String schema : SCHEMAS) {
            jdbcTemplate.execute(
                    "IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = N'"
                            + schema
                            + "') EXEC('CREATE SCHEMA "
                            + schema
                            + "')");
        }
    }
}
