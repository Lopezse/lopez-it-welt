const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");
const { ApolloServer } = require("apollo-server-express");
const winston = require("winston");
require("dotenv").config();

// Enterprise++ Imports
const database = require("./config/database");
const authMiddleware = require("./middleware/auth");
const errorHandler = require("./middleware/errorHandler");
const auditLogger = require("./middleware/auditLogger");
const securityMiddleware = require("./middleware/security");

// Enterprise++ Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const contentRoutes = require("./routes/content");
const mediaRoutes = require("./routes/media");
const agentRoutes = require("./routes/agents");
const complianceRoutes = require("./routes/compliance");
const auditRoutes = require("./routes/audit");

// Enterprise++ GraphQL Schema
const { typeDefs, resolvers } = require("./graphql/schema");

// Enterprise++ Logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  defaultMeta: { service: "enterprise-api" },
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

// Enterprise++ App
const app = express();
const PORT = process.env.PORT || 3001;

// =====================================================
// ENTERPRISE++ SECURITY MIDDLEWARE
// =====================================================

// Helmet Security Headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }),
);

// CORS Configuration
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minuten
  max: 100, // Max 100 Requests pro IP
  message: {
    error: "Zu viele Anfragen von dieser IP",
    retryAfter: "15 Minuten",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Slow Down
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 Minuten
  delayAfter: 50, // Nach 50 Requests
  delayMs: 500, // 500ms Verzögerung
});

app.use("/api/", limiter);
app.use("/api/", speedLimiter);

// Compression
app.use(compression());

// Body Parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// =====================================================
// ENTERPRISE++ CUSTOM MIDDLEWARE
// =====================================================

// Security Middleware
app.use(securityMiddleware);

// Audit Logging
app.use(auditLogger);

// Request Logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    timestamp: new Date().toISOString(),
  });
  next();
});

// =====================================================
// ENTERPRISE++ ROUTES
// =====================================================

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "Lopez IT Welt Enterprise++ API",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", authMiddleware, userRoutes);
app.use("/api/content", authMiddleware, contentRoutes);
app.use("/api/media", authMiddleware, mediaRoutes);
app.use("/api/agents", authMiddleware, agentRoutes);
app.use("/api/compliance", authMiddleware, complianceRoutes);
app.use("/api/audit", authMiddleware, auditRoutes);

// =====================================================
// ENTERPRISE++ GRAPHQL SETUP
// =====================================================

async function startApolloServer() {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      // GraphQL Context mit Authentication
      return {
        user: req.user,
        logger,
        database,
      };
    },
    formatError: (error) => {
      logger.error("GraphQL Error:", error);
      return {
        message: error.message,
        code: error.extensions?.code || "INTERNAL_SERVER_ERROR",
      };
    },
    plugins: [
      {
        requestDidStart: () => ({
          willSendResponse({ response }) {
            logger.info("GraphQL Response", {
              operationName: response.data?.operationName,
              timestamp: new Date().toISOString(),
            });
          },
        }),
      },
    ],
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: "/graphql" });

  logger.info(`GraphQL Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`);
}

// =====================================================
// ENTERPRISE++ ERROR HANDLING
// =====================================================

// 404 Handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route nicht gefunden",
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
});

// Global Error Handler
app.use(errorHandler);

// =====================================================
// ENTERPRISE++ SERVER STARTUP
// =====================================================

async function startServer() {
  try {
    // Database Connection
    await database.connect();
    logger.info("Database connected successfully");

    // Start Apollo Server
    await startApolloServer();

    // Start Express Server
    app.listen(PORT, () => {
      logger.info(`Enterprise++ Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
      logger.info(`Health Check: http://localhost:${PORT}/health`);
      logger.info(`API Documentation: http://localhost:${PORT}/api/docs`);
    });
  } catch (error) {
    logger.error("Server startup failed:", error);
    process.exit(1);
  }
}

// Graceful Shutdown
process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, shutting down gracefully");
  await database.disconnect();
  process.exit(0);
});

process.on("SIGINT", async () => {
  logger.info("SIGINT received, shutting down gracefully");
  await database.disconnect();
  process.exit(0);
});

// Unhandled Rejection Handler
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
});

// Uncaught Exception Handler
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});

// Start Server
startServer();

module.exports = app;
