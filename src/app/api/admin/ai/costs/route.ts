// =====================================================
// AI CENTER - COSTS API
// =====================================================
// GET /api/admin/ai/costs - Kosten-Übersicht
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/database";
import { RowDataPacket } from "mysql2/promise";
import { AICostTracker, AISettingsService } from "@/lib/ai-center/settings-service";

// =====================================================
// GET - Kosten-Übersicht
// =====================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30");
    
    const pool = await getConnection();
    const settings = await AISettingsService.getSettings();
    
    // Kosten pro Tag
    const [dailyCosts] = await pool.execute<RowDataPacket[]>(`
      SELECT 
        date,
        SUM(tokens_input) as tokens_input,
        SUM(tokens_output) as tokens_output,
        SUM(cost_total) as cost
      FROM ai_cost_tracking
      WHERE date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      GROUP BY date
      ORDER BY date ASC
    `, [days]);
    
    // Kosten pro Provider
    const [providerCosts] = await pool.execute<RowDataPacket[]>(`
      SELECT 
        provider,
        SUM(tokens_input) as tokens_input,
        SUM(tokens_output) as tokens_output,
        SUM(cost_total) as cost
      FROM ai_cost_tracking
      WHERE date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      GROUP BY provider
      ORDER BY cost DESC
    `, [days]);
    
    // Kosten pro Endpoint
    const [endpointCosts] = await pool.execute<RowDataPacket[]>(`
      SELECT 
        endpoint,
        COUNT(*) as requests,
        SUM(tokens_input) as tokens_input,
        SUM(tokens_output) as tokens_output,
        SUM(cost_total) as cost
      FROM ai_cost_tracking
      WHERE date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      GROUP BY endpoint
      ORDER BY cost DESC
      LIMIT 10
    `, [days]);
    
    // Heute
    const today = new Date().toISOString().split("T")[0];
    const todayCost = dailyCosts.find((d: any) => 
      new Date(d.date).toISOString().split("T")[0] === today
    );
    
    // Gestern
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    const yesterdayCost = dailyCosts.find((d: any) => 
      new Date(d.date).toISOString().split("T")[0] === yesterday
    );
    
    // Totals
    const totalCost = dailyCosts.reduce((sum: number, d: any) => sum + Number(d.cost), 0);
    const totalTokensInput = dailyCosts.reduce((sum: number, d: any) => sum + Number(d.tokens_input), 0);
    const totalTokensOutput = dailyCosts.reduce((sum: number, d: any) => sum + Number(d.tokens_output), 0);
    
    // Limit-Status
    const costStatus = await AICostTracker.checkCostLimit();
    
    // Chart-Daten formatieren
    const chartData = dailyCosts.map((d: any) => ({
      date: new Date(d.date).toISOString().split("T")[0],
      cost: Number(d.cost),
      tokens_input: Number(d.tokens_input),
      tokens_output: Number(d.tokens_output)
    }));
    
    return NextResponse.json({
      success: true,
      data: {
        summary: {
          total_cost: totalCost,
          total_tokens_input: totalTokensInput,
          total_tokens_output: totalTokensOutput,
          today: todayCost ? Number(todayCost.cost) : 0,
          yesterday: yesterdayCost ? Number(yesterdayCost.cost) : 0,
          avg_daily: totalCost / Math.max(dailyCosts.length, 1),
          days_analyzed: days
        },
        limits: {
          daily: settings.cost_limit_daily,
          monthly: settings.cost_limit_monthly,
          warning_threshold: settings.cost_warning_threshold,
          status: costStatus
        },
        by_day: chartData,
        by_provider: providerCosts.map((p: any) => ({
          provider: p.provider,
          cost: Number(p.cost),
          tokens_input: Number(p.tokens_input),
          tokens_output: Number(p.tokens_output)
        })),
        by_endpoint: endpointCosts.map((e: any) => ({
          endpoint: e.endpoint,
          requests: Number(e.requests),
          cost: Number(e.cost),
          tokens_input: Number(e.tokens_input),
          tokens_output: Number(e.tokens_output)
        }))
      }
    });
    
  } catch (error) {
    console.error("❌ Costs API Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Fehler" },
      { status: 500 }
    );
  }
}

