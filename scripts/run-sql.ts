import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { readFileSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

async function runSQL() {
  try {
    // Read the SQL file
    const sqlFilePath = join(process.cwd(), "scripts", "view-users.sql");
    const sqlContent = readFileSync(sqlFilePath, "utf-8");

    // Parse SQL: split by semicolons, but preserve multi-line queries
    const lines = sqlContent.split("\n");
    const queries: { comment?: string; query: string }[] = [];
    let currentQuery = "";
    let currentComment = "";

    for (const line of lines) {
      const trimmed = line.trim();
      
      // Check if it's a comment line
      if (trimmed.startsWith("--")) {
        if (trimmed.length > 2) {
          currentComment = trimmed.substring(2).trim();
        }
        continue;
      }

      // Add to current query
      if (trimmed) {
        currentQuery += (currentQuery ? " " : "") + line;
      }

      // If line ends with semicolon, finalize the query
      if (trimmed.endsWith(";")) {
        const query = currentQuery.trim();
        if (query && query !== ";") {
          queries.push({
            comment: currentComment || undefined,
            query: query.replace(/;$/, ""), // Remove trailing semicolon
          });
        }
        currentQuery = "";
        currentComment = "";
      }
    }

    // Handle any remaining query without semicolon
    if (currentQuery.trim()) {
      queries.push({
        comment: currentComment || undefined,
        query: currentQuery.trim(),
      });
    }

    console.log("Executing SQL queries from view-users.sql...\n");
    console.log("=".repeat(60));

    for (let i = 0; i < queries.length; i++) {
      const { comment, query } = queries[i];

      if (comment) {
        console.log(`\n-- ${comment}`);
      }

      try {
        // Execute the query
        const result = await prisma.$queryRawUnsafe(query);

        // Display results
        if (Array.isArray(result) && result.length > 0) {
          console.table(result);
          console.log(`\nRows returned: ${result.length}`);
        } else if (result) {
          console.log(result);
        } else {
          console.log("Query executed successfully (no rows returned)");
        }
      } catch (error: any) {
        console.error(`\nError executing query ${i + 1}:`);
        console.error(error.message);
        console.error(`Query: ${query.substring(0, 100)}...`);
      }

      console.log("=".repeat(60));
    }
  } catch (error: any) {
    console.error("Error reading SQL file:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runSQL();

