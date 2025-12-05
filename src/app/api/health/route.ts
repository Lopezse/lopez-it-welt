/**
 * Health Check Endpoint - Enterprise++ Standard
 * 
 * GET /api/health
 * Für Load Balancer Health-Checks
 */

import { NextResponse } from "next/server";
import { getConnection } from "@/lib/database";

export async function GET() {
    try {
        // Schnelle DB-Prüfung
        const pool = await getConnection();
        const connection = await pool.getConnection();
        await connection.ping();
        connection.release();

        return NextResponse.json(
            { status: "healthy", timestamp: new Date().toISOString() },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { 
                status: "unhealthy", 
                error: error instanceof Error ? error.message : "Unknown error",
                timestamp: new Date().toISOString()
            },
            { status: 503 }
        );
    }
}



