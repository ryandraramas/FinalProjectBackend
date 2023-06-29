const multer = require('multer');
const JobPostModel = require('../models/JobPostModel');

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed!'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// Create a new job post
exports.createJobPost = [
  upload.single('foto'),
  (req, res, next) => {
    const { deskripsi, category, salary } = req.body;
    const foto = req.file.filename;

    const jobPost = new JobPostModel({
      deskripsi: deskripsi,
      category: category,
      foto: foto,
      salary: salary,
    });

    jobPost.save((err, savedJobPost) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to create JobPost' });
      }

      return res.status(201).json(savedJobPost);
    });
  },
];

// Get all job posts
exports.getAllJobPosts = (req, res) => {
  JobPostModel.find({}, (err, jobPosts) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to get JobPosts' });
    }

    return res.status(200).json(jobPosts);
  });
};

// Get a single job post by ID
exports.getJobPostById = (req, res) => {
  const jobId = req.params.id;

  JobPostModel.findById(jobId, (err, jobPost) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to get JobPost' });
    }

    if (!jobPost) {
      return res.status(404).json({ error: 'JobPost not found' });
    }

    return res.status(200).json(jobPost);
  });
};

// Update a job post by ID
exports.updateJobPost = (req, res) => {
  const jobId = req.params.id;
  const { deskripsi, category, salary } = req.body;

  JobPostModel.findByIdAndUpdate(
    jobId,
    { deskripsi: deskripsi, category: category, salary: salary },
    { new: true },
    (err, updatedJobPost) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to update JobPost' });
      }

      if (!updatedJobPost) {
        return res.status(404).json({ error: 'JobPost not found' });
      }

      return res.status(200).json(updatedJobPost);
    }
  );
};

// Delete a job post by ID
exports.deleteJobPost = (req, res) => {
  const jobId = req.params.id;

  JobPostModel.findByIdAndDelete(jobId, (err, deletedJobPost) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete JobPost' });
    }

    if (!deletedJobPost) {
      return res.status(404).json({ error: 'JobPost not found' });
    }

    return res.status(200).json({ message: 'JobPost deleted successfully' });
  });
};
