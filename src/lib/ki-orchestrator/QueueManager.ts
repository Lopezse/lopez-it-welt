/**
 * Queue Manager - Enterprise++ Standard
 * 
 * Verwaltet Orchestrator-Tasks in Redis-Queue
 * Standard: BullMQ (Redis-basiert)
 * 
 * WICHTIG: Optional - nur aktiv, wenn Redis verfügbar ist
 */

import type { OrchestratorTask } from "./types";
import { logger } from "@/lib/logger";

// Redis Connection Config
const redisConfig = {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
    password: process.env.REDIS_PASSWORD || undefined,
};

// Queue-Status
let queueEnabled = false;
let queueModule: any = null;

/**
 * Initialisiert Queue-Manager (lazy loading)
 */
async function initializeQueue(): Promise<boolean> {
    if (queueModule !== null) {
        return queueEnabled;
    }

    try {
        // Prüfe, ob Redis verfügbar ist
        const redisModule = await import("ioredis");
        const Redis = redisModule.default || redisModule.Redis;
        const testClient = new Redis(redisConfig);
        await testClient.ping();
        await testClient.quit();

        // BullMQ importieren (wenn Redis verfügbar)
        queueModule = await import("bullmq");
        queueEnabled = true;
        logger.info("Queue Manager: Redis verfügbar, Queue aktiviert");
        return true;
    } catch (error: unknown) {
        logger.warn("Queue Manager: Redis nicht verfügbar, Queue deaktiviert", { error: String(error) });
        queueEnabled = false;
        return false;
    }
}

/**
 * Task in Queue einreihen
 */
export async function enqueueTask(
    task: OrchestratorTask,
    options?: {
        priority?: number;
        delay?: number;
    }
): Promise<string | null> {
    const isEnabled = await initializeQueue();
    if (!isEnabled || !queueModule) {
        logger.warn("Queue Manager: Queue nicht verfügbar, Task wird synchron verarbeitet");
        return null;
    }

    try {
        const { Queue } = queueModule;
        const queue = new Queue("orchestrator-tasks", {
            connection: redisConfig,
            defaultJobOptions: {
                attempts: 3,
                backoff: {
                    type: "exponential",
                    delay: 2000,
                },
                removeOnComplete: {
                    age: 3600, // 1 Stunde
                    count: 1000,
                },
                removeOnFail: {
                    age: 86400, // 24 Stunden
                },
            },
        });

        const job = await queue.add(
            `task-${task.agent}-${task.purpose}`,
            task,
            {
                priority: options?.priority || 0,
                delay: options?.delay || 0,
            }
        );

        logger.info(`Task in Queue eingereiht: ${job.id}`);
        return job.id!;
    } catch (error) {
        logger.error("Fehler beim Einreihen des Tasks in die Queue", error);
        return null;
    }
}

/**
 * Queue-Status abrufen
 */
export async function getQueueStatus(): Promise<{
    enabled: boolean;
    waiting?: number;
    active?: number;
    completed?: number;
    failed?: number;
}> {
    const isEnabled = await initializeQueue();
    if (!isEnabled || !queueModule) {
        return { enabled: false };
    }

    try {
        const { Queue } = queueModule;
        const queue = new Queue("orchestrator-tasks", {
            connection: redisConfig,
        });

        const [waiting, active, completed, failed] = await Promise.all([
            queue.getWaitingCount(),
            queue.getActiveCount(),
            queue.getCompletedCount(),
            queue.getFailedCount(),
        ]);

        return {
            enabled: true,
            waiting,
            active,
            completed,
            failed,
        };
    } catch (error) {
        logger.error("Fehler beim Abrufen des Queue-Status", error);
        return { enabled: false };
    }
}

/**
 * Worker initialisieren (für Background-Processing)
 */
export async function initializeWorker(
    processTask: (task: OrchestratorTask) => Promise<any>
): Promise<boolean> {
    const isEnabled = await initializeQueue();
    if (!isEnabled || !queueModule) {
        return false;
    }

    try {
        const { Worker } = queueModule;
        const worker = new Worker(
            "orchestrator-tasks",
            async (job: any) => {
                logger.info(`Processing orchestrator task: ${job.id}`);
                return await processTask(job.data);
            },
            {
                connection: redisConfig,
                concurrency: parseInt(process.env.QUEUE_CONCURRENCY || "5"),
            }
        );

        worker.on("completed", (job: any) => {
            logger.info(`Task completed: ${job.id}`);
        });

        worker.on("failed", (job: any, err: any) => {
            logger.error(`Task failed: ${job?.id}`, { error: String(err) });
        });

        logger.info("Queue Worker initialisiert");
        return true;
    } catch (error) {
        logger.error("Fehler beim Initialisieren des Queue-Workers", error);
        return false;
    }
}



