import express from "express";
import {
	getFlashcards,
	getAllFlashcardSets,
	reviewFlashcard,
	toggleStartFlashcard,
	deleteFlashcardSet,
} from "../controllers/flashcardController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", getAllFlashcardSets);
router.get("/:documentId", getFlashcards);
router.post("/:cardId/review", reviewFlashcard);
router.put("/:cardId/star", toggleStartFlashcard);
router.delete("/:id", deleteFlashcardSet);

// ==================== SWAGGER SCHEMAS ====================

/**
 * @swagger
 * components:
 *   schemas:
 *     Flashcard:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 64abc123def456
 *         question:
 *           type: string
 *           example: What is the capital of France?
 *         answer:
 *           type: string
 *           example: Paris
 *         starred:
 *           type: boolean
 *           example: false
 *         nextReviewAt:
 *           type: string
 *           format: date-time
 *         interval:
 *           type: number
 *           example: 1
 *         easeFactor:
 *           type: number
 *           example: 2.5
 *         documentId:
 *           type: string
 *           example: 64abc123def456
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *     FlashcardSet:
 *       type: object
 *       properties:
 *         documentId:
 *           type: string
 *           example: 64abc123def456
 *         documentName:
 *           type: string
 *           example: Q4 Report.pdf
 *         totalCards:
 *           type: number
 *           example: 20
 *         starredCards:
 *           type: number
 *           example: 5
 *         dueCards:
 *           type: number
 *           example: 8
 *
 *     ReviewRequest:
 *       type: object
 *       required: [rating]
 *       properties:
 *         rating:
 *           type: integer
 *           minimum: 0
 *           maximum: 5
 *           example: 4
 *           description: SM-2 quality rating (0 = complete blackout, 5 = perfect recall)
 *
 *     ReviewResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Flashcard reviewed successfully
 *         flashcard:
 *           $ref: '#/components/schemas/Flashcard'
 *
 *     FlashcardNotFound:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Flashcard not found
 */

// ==================== PROTECTED ROUTES ====================

/**
 * @swagger
 * /api/flashcards:
 *   get:
 *     summary: Get all flashcard sets for the logged-in user
 *     tags: [Flashcards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of flashcard sets retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FlashcardSet'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 */
router.get("/", getAllFlashcardSets);

/**
 * @swagger
 * /api/flashcards/{documentId}:
 *   get:
 *     summary: Get all flashcards for a specific document
 *     tags: [Flashcards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: documentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The document ID to retrieve flashcards for
 *         example: 64abc123def456
 *     responses:
 *       200:
 *         description: Flashcards retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Flashcard'
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
router.get("/:documentId", getFlashcards);

/**
 * @swagger
 * /api/flashcards/{cardId}/review:
 *   post:
 *     summary: Submit a review rating for a flashcard
 *     tags: [Flashcards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *         description: The flashcard ID to review
 *         example: 64abc123def456
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewRequest'
 *     responses:
 *       200:
 *         description: Flashcard reviewed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReviewResponse'
 *       400:
 *         description: Invalid rating value
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 *       404:
 *         description: Flashcard not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FlashcardNotFound'
 */
router.post("/:cardId/review", reviewFlashcard);

/**
 * @swagger
 * /api/flashcards/{cardId}/star:
 *   put:
 *     summary: Toggle the starred status of a flashcard
 *     tags: [Flashcards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *         description: The flashcard ID to star or unstar
 *         example: 64abc123def456
 *     responses:
 *       200:
 *         description: Flashcard star status toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Flashcard'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 *       404:
 *         description: Flashcard not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FlashcardNotFound'
 */
router.put("/:cardId/star", toggleStartFlashcard);

/**
 * @swagger
 * /api/flashcards/{id}:
 *   delete:
 *     summary: Delete a flashcard set by document ID
 *     tags: [Flashcards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The flashcard set ID to delete
 *         example: 64abc123def456
 *     responses:
 *       200:
 *         description: Flashcard set deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Flashcard set deleted successfully
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 *       404:
 *         description: Flashcard set not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FlashcardNotFound'
 */
router.delete("/:id", deleteFlashcardSet);

export default router;
