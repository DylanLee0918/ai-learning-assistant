import express from "express";
import { body } from "express-validator";
import {
	register,
	login,
	getProfile,
	updateProfile,
	changePassword,
} from "../controllers/authController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// Validation middleware
const registerValidation = [
	body("username")
		.trim()
		.isLength({ min: 3 })
		.withMessage("Username must be at least 3 characters long"),
	body("email")
		.isEmail()
		.normalizeEmail()
		.withMessage("Please provide a valid email address"),
	body("password")
		.isLength({ min: 6 })
		.withMessage("Password must be at least 6 characters long"),
];

const loginValidation = [
	body("email")
		.isEmail()
		.normalizeEmail()
		.withMessage("Please provide a valid email address"),
	body("password").notEmpty().withMessage("Password is required"),
];

// Public routes
router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);

// Protected routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.post("/change-password", protect, changePassword);

// ==================== SWAGGER SCHEMAS ====================

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required: [username, email, password]
 *       properties:
 *         username:
 *           type: string
 *           minLength: 3
 *           example: johndoe
 *         email:
 *           type: string
 *           format: email
 *           example: johndoe@email.com
 *         password:
 *           type: string
 *           minLength: 6
 *           example: secret123
 *
 *     LoginRequest:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: johndoe@email.com
 *         password:
 *           type: string
 *           example: secret123
 *
 *     UserProfile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 64abc123def456
 *         username:
 *           type: string
 *           example: johndoe
 *         email:
 *           type: string
 *           example: johndoe@email.com
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *     AuthResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *         user:
 *           $ref: '#/components/schemas/UserProfile'
 *
 *     ValidationError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Please provide a valid email address
 *
 *     UnauthorizedError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Not authorized, token failed
 */

// ==================== PUBLIC ROUTES ====================

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       409:
 *         description: Email already in use
 */
router.post("/register", registerValidation, register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Invalid email or password
 */
router.post("/login", loginValidation, login);

// ==================== PROTECTED ROUTES ====================

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get the logged-in user's profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 */
router.get("/profile", protect, getProfile);

/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     summary: Update the logged-in user's profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: newusername
 *               email:
 *                 type: string
 *                 format: email
 *                 example: newemail@email.com
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 */
router.put("/profile", protect, updateProfile);

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Change the logged-in user's password
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: oldsecret123
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *                 example: newsecret123
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Validation error or current password incorrect
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 */
router.post("/change-password", protect, changePassword);

export default router;
