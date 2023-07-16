const express = require('express');
const router = express.Router();
const { 
  createJobPost, 
  getAllJobPosts, 
  getJobPostById, 
  updateJobPost, 
  deleteJobPost 
} = require('../controllers/JobPostController');

// Create a new job post
router.post('/', createJobPost);

// Get all job posts
router.get('/', getAllJobPosts);

// Get a single job post by ID
router.get('/:id', getJobPostById);

// Update a job post by ID
router.put('/:id', updateJobPost);

// Delete a job post by ID
router.delete('/:id', deleteJobPost);

module.exports = router;
