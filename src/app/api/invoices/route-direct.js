/**
 * DIREKTE VERSION - POST /api/invoices
 * Test mit direktem Import ohne TypeScript
 */

const mysql = require("mysql2/promise");

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "lopez_it_welt",
  port: 3306,
  charset: "utf8mb4",
};

async function createConnectionDirect() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute("SET NAMES utf8mb4");
    await connection.execute("SET CHARACTER SET utf8mb4");
    return connection;
  } catch (error) {
    console.error("❌ MySQL-Verbindung fehlgeschlagen:", error);
    throw error;
  }
}

async function POST(request) {
  let connection = null;

  try {
    const body = await request.json();
    const { debtor, issued_at, total_gross } = body;

    connection = await createConnectionDirect();

    let customerId = "system";
    try {
      const [customers] = await connection.execute("SELECT id FROM lopez_customers LIMIT 1");
      if (Array.isArray(customers) && customers.length > 0) {
        customerId = String(customers[0].id);
      }
    } catch (e) {
      console.error("Customer query failed:", e);
    }

    const year = new Date().getFullYear();
    let invoiceNumber = `${year}-0001`;
    try {
      const [maxRows] = await connection.execute(
        `SELECT MAX(CAST(SUBSTRING(invoice_number, 6) AS UNSIGNED)) as max_num 
         FROM lopez_invoices 
         WHERE invoice_number LIKE ?`,
        [`${year}-%`],
      );
      if (Array.isArray(maxRows) && maxRows.length > 0 && maxRows[0].max_num) {
        const nextNum = maxRows[0].max_num + 1;
        invoiceNumber = `${year}-${String(nextNum).padStart(4, "0")}`;
      }
    } catch (e) {
      console.error("Invoice number query failed:", e);
    }

    const netAmount = total_gross ? total_gross / 1.19 : 0;
    const taxAmount = netAmount * 0.19;
    const grossAmount = netAmount + taxAmount;

    const [result] = await connection.execute(
      `INSERT INTO lopez_invoices 
       (invoice_number, customer_id, issue_date, service_date, net_amount, tax_rate, tax_amount, gross_amount, status, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'draft', 'system')`,
      [
        invoiceNumber,
        customerId,
        issued_at || new Date().toISOString().slice(0, 10),
        issued_at || new Date().toISOString().slice(0, 10),
        netAmount,
        19.0,
        taxAmount,
        grossAmount,
      ],
    );

    const invoiceId = result.insertId;

    if (invoiceId) {
      try {
        await connection.execute(
          `INSERT INTO lopez_invoice_items (invoice_id, pos, item_text, qty, unit, unit_price, net_line)
           VALUES (?, 1, ?, 1, 'Stk', ?, ?)`,
          [invoiceId, debtor || "Position 1", netAmount, netAmount],
        );
      } catch (e) {
        console.error("Item insert failed:", e);
      }
    }

    if (connection) {
      await connection.end();
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          id: invoiceId,
          invoice_number: invoiceNumber,
          status: "draft",
          net_amount: netAmount,
          tax_amount: taxAmount,
          gross_amount: grossAmount,
        },
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      },
    );
  } catch (error) {
    console.error("Invoice POST Error:", error);
    console.error("Error message:", error?.message);
    console.error("Error code:", error?.code);

    if (connection) {
      try {
        await connection.end();
      } catch {}
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: error?.message || "Internal Server Error",
        code: error?.code,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      },
    );
  }
}

module.exports = { POST };


 * DIREKTE VERSION - POST /api/invoices
 * Test mit direktem Import ohne TypeScript
 */

const mysql = require("mysql2/promise");

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "lopez_it_welt",
  port: 3306,
  charset: "utf8mb4",
};

async function createConnectionDirect() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute("SET NAMES utf8mb4");
    await connection.execute("SET CHARACTER SET utf8mb4");
    return connection;
  } catch (error) {
    console.error("❌ MySQL-Verbindung fehlgeschlagen:", error);
    throw error;
  }
}

async function POST(request) {
  let connection = null;

  try {
    const body = await request.json();
    const { debtor, issued_at, total_gross } = body;

    connection = await createConnectionDirect();

    let customerId = "system";
    try {
      const [customers] = await connection.execute("SELECT id FROM lopez_customers LIMIT 1");
      if (Array.isArray(customers) && customers.length > 0) {
        customerId = String(customers[0].id);
      }
    } catch (e) {
      console.error("Customer query failed:", e);
    }

    const year = new Date().getFullYear();
    let invoiceNumber = `${year}-0001`;
    try {
      const [maxRows] = await connection.execute(
        `SELECT MAX(CAST(SUBSTRING(invoice_number, 6) AS UNSIGNED)) as max_num 
         FROM lopez_invoices 
         WHERE invoice_number LIKE ?`,
        [`${year}-%`],
      );
      if (Array.isArray(maxRows) && maxRows.length > 0 && maxRows[0].max_num) {
        const nextNum = maxRows[0].max_num + 1;
        invoiceNumber = `${year}-${String(nextNum).padStart(4, "0")}`;
      }
    } catch (e) {
      console.error("Invoice number query failed:", e);
    }

    const netAmount = total_gross ? total_gross / 1.19 : 0;
    const taxAmount = netAmount * 0.19;
    const grossAmount = netAmount + taxAmount;

    const [result] = await connection.execute(
      `INSERT INTO lopez_invoices 
       (invoice_number, customer_id, issue_date, service_date, net_amount, tax_rate, tax_amount, gross_amount, status, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'draft', 'system')`,
      [
        invoiceNumber,
        customerId,
        issued_at || new Date().toISOString().slice(0, 10),
        issued_at || new Date().toISOString().slice(0, 10),
        netAmount,
        19.0,
        taxAmount,
        grossAmount,
      ],
    );

    const invoiceId = result.insertId;

    if (invoiceId) {
      try {
        await connection.execute(
          `INSERT INTO lopez_invoice_items (invoice_id, pos, item_text, qty, unit, unit_price, net_line)
           VALUES (?, 1, ?, 1, 'Stk', ?, ?)`,
          [invoiceId, debtor || "Position 1", netAmount, netAmount],
        );
      } catch (e) {
        console.error("Item insert failed:", e);
      }
    }

    if (connection) {
      await connection.end();
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          id: invoiceId,
          invoice_number: invoiceNumber,
          status: "draft",
          net_amount: netAmount,
          tax_amount: taxAmount,
          gross_amount: grossAmount,
        },
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      },
    );
  } catch (error) {
    console.error("Invoice POST Error:", error);
    console.error("Error message:", error?.message);
    console.error("Error code:", error?.code);

    if (connection) {
      try {
        await connection.end();
      } catch {}
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: error?.message || "Internal Server Error",
        code: error?.code,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      },
    );
  }
}

module.exports = { POST };



















