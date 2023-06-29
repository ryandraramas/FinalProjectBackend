// JobPost.js

const express = require('express');
const router = express.Router();
const JobPostController = require('../controllers/JobPostController');

// Create a new job post
router.post('/jobPosts', JobPostController.createJobPost);

// Get all job posts
router.get('/jobPosts', JobPostController.getAllJobPosts);

// Get a single job post by ID
router.get('/jobPosts/:id', JobPostController.getJobPostById);

// Update a job post by ID
router.put('/jobPosts/:id', JobPostController.updateJobPost);

// Delete a job post by ID
router.delete('/jobPosts/:id', JobPostController.deleteJobPost);

module.exports = router;
