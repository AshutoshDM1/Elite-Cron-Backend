/**
 * @swagger
 * /api/v1/cron:
 *   post:
 *     summary: Create a new cron job
 *     description: Creates a new cron job with an associated URL to monitor
 *     tags: [Cron Jobs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - interval
 *               - url
 *             properties:
 *               interval:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *                 example: "0 0 * * *"
 *                 description: Cron expression or interval string (e.g., "0 0 * * *" for daily at midnight)
 *               url:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *                 format: uri
 *                 example: "https://example.com"
 *                 description: The URL to monitor (must be a valid URL)
 *     responses:
 *       201:
 *         description: Cron job created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Cron created successfully
 *                 statusCode:
 *                   type: number
 *                   example: 201
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     interval:
 *                       type: string
 *                       example: "0 0 * * *"
 *                     url:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                           example: "123e4567-e89b-12d3-a456-426614174001"
 *                         url:
 *                           type: string
 *                           example: "https://example.com"
 *                         status:
 *                           type: string
 *                           enum: [UP, DOWN, PENDING]
 *                           example: "PENDING"
 *                         totalUpTime:
 *                           type: number
 *                           example: 0
 *                         totalDownTime:
 *                           type: number
 *                           example: 0
 *                         averageResponseTime:
 *                           type: number
 *                           example: 0
 *                         lastCheckedAt:
 *                           type: string
 *                           format: date-time
 *                           nullable: true
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Bad request - Invalid input or missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Validation error
 *                 statusCode:
 *                   type: number
 *                   example: 400
 *                 error:
 *                   type: string
 *                   example: "Invalid interval or URL"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 statusCode:
 *                   type: number
 *                   example: 500
 *                 error:
 *                   type: string
 *                   example: "Error message"
 * 
 *   get:
 *     summary: Get all cron jobs
 *     description: Retrieves a list of all cron jobs with their associated URLs
 *     tags: [Cron Jobs]
 *     responses:
 *       200:
 *         description: Cron jobs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Cron found successfully
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: "123e4567-e89b-12d3-a456-426614174000"
 *                       interval:
 *                         type: string
 *                         example: "0 0 * * *"
 *                       url:
 *                         type: object
 *                         nullable: true
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                             example: "123e4567-e89b-12d3-a456-426614174001"
 *                           url:
 *                             type: string
 *                             example: "https://example.com"
 *                           status:
 *                             type: string
 *                             enum: [UP, DOWN, PENDING]
 *                             example: "PENDING"
 *                           totalUpTime:
 *                             type: number
 *                             example: 0
 *                           totalDownTime:
 *                             type: number
 *                             example: 0
 *                           averageResponseTime:
 *                             type: number
 *                             example: 0
 *                           lastCheckedAt:
 *                             type: string
 *                             format: date-time
 *                             nullable: true
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 statusCode:
 *                   type: number
 *                   example: 500
 *                 error:
 *                   type: string
 *                   example: "Error message"
 * 
 * /api/v1/cron/{id}:
 *   get:
 *     summary: Get a cron job by ID
 *     description: Retrieves a specific cron job with its URL and last 50 check logs
 *     tags: [Cron Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *         description: The UUID of the cron job to retrieve
 *     responses:
 *       200:
 *         description: Cron job retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Cron found successfully
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     interval:
 *                       type: string
 *                       example: "*&#47;1 * * * *"
 *                     url:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                         url:
 *                           type: string
 *                           example: "https://www.google.com"
 *                         status:
 *                           type: string
 *                           enum: [UP, DOWN, PENDING, ERROR]
 *                           example: "UP"
 *                         totalUpTime:
 *                           type: number
 *                           example: 3600
 *                         totalDownTime:
 *                           type: number
 *                           example: 120
 *                         averageResponseTime:
 *                           type: number
 *                           example: 245.5
 *                         totalChecks:
 *                           type: number
 *                           example: 100
 *                         lastStatus:
 *                           type: string
 *                           nullable: true
 *                           example: "UP"
 *                         lastCheckedAt:
 *                           type: string
 *                           format: date-time
 *                           nullable: true
 *                         logs:
 *                           type: array
 *                           description: Last 50 check logs ordered by checkAt desc
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                                 format: uuid
 *                               status:
 *                                 type: string
 *                                 enum: [UP, DOWN, ERROR]
 *                                 example: "UP"
 *                               statusCode:
 *                                 type: number
 *                                 nullable: true
 *                                 example: 200
 *                               responseTime:
 *                                 type: number
 *                                 nullable: true
 *                                 example: 245
 *                               errorMessage:
 *                                 type: string
 *                                 nullable: true
 *                                 example: null
 *                               errorType:
 *                                 type: string
 *                                 nullable: true
 *                                 example: null
 *                               checkAt:
 *                                 type: string
 *                                 format: date-time
 *                               createdAt:
 *                                 type: string
 *                                 format: date-time
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Bad request - Invalid UUID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Validation error
 *                 statusCode:
 *                   type: number
 *                   example: 400
 *       404:
 *         description: Cron job not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Cron not found
 *                 statusCode:
 *                   type: number
 *                   example: 404
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete a cron job by ID
 *     description: Deletes a cron job and its associated URL by ID
 *     tags: [Cron Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *         description: The UUID of the cron job to delete
 *     responses:
 *       200:
 *         description: Cron job deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Cron deleted successfully
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     interval:
 *                       type: string
 *                       example: "0 0 * * *"
 *                     url:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                           example: "123e4567-e89b-12d3-a456-426614174001"
 *                         url:
 *                           type: string
 *                           example: "https://example.com"
 *                         status:
 *                           type: string
 *                           enum: [UP, DOWN, PENDING]
 *                           example: "PENDING"
 *                         totalUpTime:
 *                           type: number
 *                           example: 0
 *                         totalDownTime:
 *                           type: number
 *                           example: 0
 *                         averageResponseTime:
 *                           type: number
 *                           example: 0
 *                         lastCheckedAt:
 *                           type: string
 *                           format: date-time
 *                           nullable: true
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Bad request - Invalid UUID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Validation error
 *                 statusCode:
 *                   type: number
 *                   example: 400
 *                 error:
 *                   type: string
 *                   example: "Invalid UUID format"
 *       404:
 *         description: Cron job not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Cron job not found
 *                 statusCode:
 *                   type: number
 *                   example: 404
 *                 error:
 *                   type: string
 *                   example: "Cron job with the specified ID does not exist"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 statusCode:
 *                   type: number
 *                   example: 500
 *                 error:
 *                   type: string
 *                   example: "Error message"
 */
