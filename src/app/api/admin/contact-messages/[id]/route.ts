import mysql from "mysql2/promise";
import { NextRequest, NextResponse } from "next/server";

// GET /api/admin/contact-messages/[id] - Einzelne Nachricht laden
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const messageId = parseInt(params.id);

    if (isNaN(messageId)) {
      return NextResponse.json({ error: "Ungültige Nachrichten-ID" }, { status: 400 });
    }

    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "lopez_erp",
    });

    // Nachricht laden
    const messageQuery = `
            SELECT 
                id,
                name,
                email,
                phone,
                company,
                subject,
                message,
                status,
                priority,
                assigned_to,
                response_message,
                response_sent_at,
                response_sent_by,
                ip_address,
                user_agent,
                referrer,
                is_spam,
                spam_score,
                tags,
                notes,
                created_at,
                updated_at
            FROM lopez_business_contact_messages 
            WHERE id = ? AND is_spam = FALSE
        `;

    const [messageRows] = await connection.execute(messageQuery, [messageId]);
    const message = (messageRows as any)[0];

    if (!message) {
      await connection.end();
      return NextResponse.json({ error: "Nachricht nicht gefunden" }, { status: 404 });
    }

    // Kommentare laden
    const commentsQuery = `
            SELECT 
                id,
                comment,
                is_internal,
                created_at,
                created_by
            FROM lopez_business_contact_comments 
            WHERE message_id = ?
            ORDER BY created_at ASC
        `;

    const [commentRows] = await connection.execute(commentsQuery, [messageId]);

    // Anhänge laden (falls vorhanden)
    const attachmentsQuery = `
            SELECT 
                id,
                filename,
                original_filename,
                file_size,
                mime_type,
                created_at
            FROM lopez_support_contact_attachments 
            WHERE message_id = ? AND is_active = TRUE
            ORDER BY created_at ASC
        `;

    const [attachmentRows] = await connection.execute(attachmentsQuery, [messageId]);

    await connection.end();

    return NextResponse.json({
      success: true,
      data: {
        ...message,
        comments: commentRows,
        attachments: attachmentRows,
      },
    });
  } catch (error) {
    // Fehler beim Laden der Nachricht: ${error}
    return NextResponse.json({ error: "Fehler beim Laden der Nachricht" }, { status: 500 });
  }
}

// PATCH /api/admin/contact-messages/[id] - Nachricht aktualisieren
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const messageId = parseInt(params.id);
    const body = await request.json();
    const { status, priority, assigned_to, response_message, notes, tags } = body;

    if (isNaN(messageId)) {
      return NextResponse.json({ error: "Ungültige Nachrichten-ID" }, { status: 400 });
    }

    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "lopez_erp",
    });

    // Update-Felder zusammenbauen
    const updateFields = [];
    const updateValues = [];

    if (status) {
      updateFields.push("status = ?");
      updateValues.push(status);
    }

    if (priority) {
      updateFields.push("priority = ?");
      updateValues.push(priority);
    }

    if (assigned_to !== undefined) {
      updateFields.push("assigned_to = ?");
      updateValues.push(assigned_to);
    }

    if (response_message !== undefined) {
      updateFields.push("response_message = ?");
      updateValues.push(response_message);

      if (response_message) {
        updateFields.push("response_sent_at = NOW()");
        updateFields.push("response_sent_by = ?");
        updateValues.push("admin"); // TODO: Echte Benutzer-ID
      }
    }

    if (notes !== undefined) {
      updateFields.push("notes = ?");
      updateValues.push(notes);
    }

    if (tags !== undefined) {
      updateFields.push("tags = ?");
      updateValues.push(JSON.stringify(tags));
    }

    if (updateFields.length === 0) {
      await connection.end();
      return NextResponse.json(
        { error: "Keine gültigen Felder zum Aktualisieren" },
        { status: 400 },
      );
    }

    updateFields.push("updated_at = NOW()");
    updateValues.push(messageId);

    const updateQuery = `
            UPDATE lopez_business_contact_messages 
            SET ${updateFields.join(", ")}
            WHERE id = ?
        `;

    const [result] = await connection.execute(updateQuery, updateValues);

    if ((result as any).affectedRows === 0) {
      await connection.end();
      return NextResponse.json({ error: "Nachricht nicht gefunden" }, { status: 404 });
    }

    await connection.end();

    return NextResponse.json({
      success: true,
      message: "Nachricht erfolgreich aktualisiert",
    });
  } catch (error) {
    // Fehler beim Aktualisieren der Nachricht: ${error}
    return NextResponse.json({ error: "Fehler beim Aktualisieren der Nachricht" }, { status: 500 });
  }
}

// DELETE /api/admin/contact-messages/[id] - Nachricht löschen (Soft Delete)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const messageId = parseInt(params.id);

    if (isNaN(messageId)) {
      return NextResponse.json({ error: "Ungültige Nachrichten-ID" }, { status: 400 });
    }

    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "lopez_erp",
    });

    // Soft Delete - Status auf 'archiviert' setzen
    const deleteQuery = `
            UPDATE lopez_business_contact_messages 
            SET status = 'archiviert', updated_at = NOW()
            WHERE id = ?
        `;

    const [result] = await connection.execute(deleteQuery, [messageId]);

    if ((result as any).affectedRows === 0) {
      await connection.end();
      return NextResponse.json({ error: "Nachricht nicht gefunden" }, { status: 404 });
    }

    await connection.end();

    return NextResponse.json({
      success: true,
      message: "Nachricht erfolgreich archiviert",
    });
  } catch (error) {
    // Fehler beim Löschen der Nachricht: ${error}
    return NextResponse.json({ error: "Fehler beim Löschen der Nachricht" }, { status: 500 });
  }
}
