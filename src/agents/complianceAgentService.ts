// =====================================================
// Compliance Agent Service - Eigenständiger Service
// =====================================================
// Erstellt: 2025-07-02
// Zweck: Compliance-Agent als eigenständiger Service
// Integration: Läuft auf Port 4001, erreichbar von allen Projekten
// =====================================================

import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { createComplianceSystemMySQL } from '../lib/compliance-system-mysql';
import { KIAgentFactory } from '../lib/ki-agent';

const app = express();
const PORT = process.env.AGENT_PORT || 4001;

// =====================================================
// Middleware
// =====================================================

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
    ],
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// =====================================================
// Security Middleware
// =====================================================

const validateApiKey = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const apiKey = req.headers['x-api-key'] || req.headers['authorization'];
  const expectedKey =
    process.env.AGENT_API_KEY || 'default-key-change-in-production';

  if (apiKey !== expectedKey) {
    res.status(401).json({
      status: 'error',
      message: 'Unauthorized - Invalid API Key',
    });
    return;
  }

  next();
};

// =====================================================
// Health Check
// =====================================================

app.get('/health', (req: Request, res: Response): void => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'compliance-agent',
    version: '1.0.0',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

// =====================================================
// Compliance Agent Endpoints
// =====================================================

app.post(
  '/compliance/check',
  validateApiKey,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { input, context, options } = req.body;

      if (!input) {
        res.status(400).json({
          status: 'error',
          message: 'Input is required',
        });
        return;
      }

      // Compliance-Agent erstellen
      const complianceAgent = KIAgentFactory.createAgent('compliance');

      // Task ausführen
      const result = await complianceAgent.executeTask({
        id: `task_${Date.now()}`,
        description: input,
        category: 'compliance',
        priority: options?.priority || 'medium',
        context: context || {},
      });

      res.json({
        status: 'success',
        result: {
          isCompliant: result.success,
          complianceScore: result.compliance_result?.score || 0,
          violations: (result.compliance_result as any)?.violations || [],
          suggestions: (result.compliance_result as any)?.suggestions || [],
          executionTime: result.execution_time,
          rulesApplied: result.rules_applied?.length || 0,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Compliance Agent Error:', error);
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      });
    }
  }
);

// =====================================================
// Quality Agent Endpoints
// =====================================================

app.post(
  '/quality/check',
  validateApiKey,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { input, context, options } = req.body;

      if (!input) {
        res.status(400).json({
          status: 'error',
          message: 'Input is required',
        });
        return;
      }

      // Quality-Agent erstellen
      const qualityAgent = KIAgentFactory.createAgent('quality');

      // Task ausführen
      const result = await qualityAgent.executeTask({
        id: `task_${Date.now()}`,
        description: input,
        category: 'quality',
        priority: options?.priority || 'medium',
        context: context || {},
      });

      res.json({
        status: 'success',
        result: {
          qualityScore: result.result?.quality_score || 0,
          issues: result.result?.issues || [],
          recommendations: result.result?.recommendations || [],
          executionTime: result.execution_time,
          rulesApplied: result.rules_applied?.length || 0,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Quality Agent Error:', error);
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      });
    }
  }
);

// =====================================================
// Development Agent Endpoints
// =====================================================

app.post(
  '/development/support',
  validateApiKey,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { input, context, options } = req.body;

      if (!input) {
        res.status(400).json({
          status: 'error',
          message: 'Input is required',
        });
        return;
      }

      // Development-Agent erstellen
      const developmentAgent = KIAgentFactory.createAgent('development');

      // Task ausführen
      const result = await developmentAgent.executeTask({
        id: `task_${Date.now()}`,
        description: input,
        category: 'development',
        priority: options?.priority || 'medium',
        context: context || {},
      });

      res.json({
        status: 'success',
        result: {
          developmentSupport: result.result?.development_support || [],
          securityChecked: result.result?.security_checked || false,
          bestPractices: result.result?.best_practices || [],
          executionTime: result.execution_time,
          rulesApplied: result.rules_applied?.length || 0,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Development Agent Error:', error);
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      });
    }
  }
);

// =====================================================
// Memory System Endpoints
// =====================================================

app.get(
  '/memory/stats',
  validateApiKey,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const complianceSystem = createComplianceSystemMySQL();
      await complianceSystem.initialize();

      // Memory-Statistiken abrufen
      const stats = await complianceSystem.generateComplianceReport(1); // Dummy ID

      res.json({
        status: 'success',
        stats: {
          totalRules: stats.total_violations,
          complianceScore: stats.compliance_score,
          criticalViolations: stats.critical_violations,
          highViolations: stats.high_violations,
          mediumViolations: stats.medium_violations,
          lowViolations: stats.low_violations,
          recommendations: stats.recommendations,
        },
        timestamp: new Date().toISOString(),
      });

      await complianceSystem.close();
    } catch (error) {
      console.error('Memory Stats Error:', error);
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      });
    }
  }
);

// =====================================================
// Batch Processing Endpoint
// =====================================================

app.post(
  '/batch/process',
  validateApiKey,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { tasks, agentType = 'compliance' } = req.body;

      if (!Array.isArray(tasks) || tasks.length === 0) {
        res.status(400).json({
          status: 'error',
          message: 'Tasks array is required and must not be empty',
        });
        return;
      }

      // Agent erstellen
      const agent = KIAgentFactory.createAgent(agentType);
      const results = [];

      // Tasks parallel verarbeiten
      for (const task of tasks) {
        try {
          const result = await agent.executeTask({
            id: task.id || `task_${Date.now()}_${Math.random()}`,
            description: task.description,
            category: task.category || agentType,
            priority: task.priority || 'medium',
            context: task.context || {},
          });

          results.push({
            taskId: task.id,
            status: 'success',
            result,
          });
        } catch (taskError) {
          results.push({
            taskId: task.id,
            status: 'error',
            error:
              taskError instanceof Error ? taskError.message : 'Unknown error',
          });
        }
      }

      res.json({
        status: 'success',
        results,
        summary: {
          total: tasks.length,
          successful: results.filter(r => r.status === 'success').length,
          failed: results.filter(r => r.status === 'error').length,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Batch Processing Error:', error);
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      });
    }
  }
);

// =====================================================
// Error Handling
// =====================================================

app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
    timestamp: new Date().toISOString(),
  });
});

// =====================================================
// 404 Handler
// =====================================================

app.use('*', (req: Request, res: Response): void => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found',
    availableEndpoints: [
      'GET /health',
      'POST /compliance/check',
      'POST /quality/check',
      'POST /development/support',
      'GET /memory/stats',
      'POST /batch/process',
    ],
    timestamp: new Date().toISOString(),
  });
});

// =====================================================
// Server Start
// =====================================================

app.listen(PORT, () => {
  console.log(`✅ Compliance Agent Service running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log(`🔒 API Key required for all endpoints except /health`);
  console.log(
    `📊 Memory usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`
  );
});

// =====================================================
// Graceful Shutdown
// =====================================================

process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  process.exit(0);
});

export default app;
