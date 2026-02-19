import express from "express";
import {
	uploadDocument,
	getDocuments,
	getDocument,
	deleteDocument,
} from "../controllers/documentController.js";
import protect from "../middleware/auth.js";
import upload from "../config/multer.js";

const router = express.Router();

// All routes are protected
router.use(protect);

router.post("/upload", upload.single("file"), uploadDocument);
router.get("/", getDocuments);
router.get("/:id", getDocument);
router.delete("/:id", deleteDocument);

// ==================== SWAGGER SCHEMAS ====================

/**
 * @swagger
 * components:
 *   schemas:
 *     Document:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 64abc123def456
 *         filename:
 *           type: string
 *           example: report.pdf
 *         originalName:
 *           type: string
 *           example: Q4 Report.pdf
 *         mimetype:
 *           type: string
 *           example: application/pdf
 *         size:
 *           type: number
 *           example: 204800
 *         uploadedBy:
 *           type: string
 *           example: 64abc123def456
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *     UploadResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: File uploaded successfully
 *         document:
 *           $ref: '#/components/schemas/Document'
 *
 *     DocumentNotFound:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Document not found
 */

// ==================== PROTECTED ROUTES ====================

/**
 * @swagger
 * /api/documents/upload:
 *   post:
 *     summary: Upload a new document
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Document uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadResponse'
 *       400:
 *         description: No file provided or invalid file type
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 */
router.post("/upload", upload.single("file"), uploadDocument);

/**
 * @swagger
 * /api/documents:
 *   get:
 *     summary: Get all documents for the logged-in user
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of documents retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Document'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 */
router.get("/", getDocuments);

/**
 * @swagger
 * /api/documents/{id}:
 *   get:
 *     summary: Get a single document by ID
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The document ID
 *         example: 64abc123def456
 *     responses:
 *       200:
 *         description: Document retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Document'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 *       404:
 *         description: Document not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DocumentNotFound'
 */
router.get("/:id", getDocument);

/**
 * @swagger
 * /api/documents/{id}:
 *   delete:
 *     summary: Delete a document by ID
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The document ID
 *         example: 64abc123def456
 *     responses:
 *       200:
 *         description: Document deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Document deleted successfully
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 *       404:
 *         description: Document not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DocumentNotFound'
 */
router.delete("/:id", deleteDocument);

export default router;
