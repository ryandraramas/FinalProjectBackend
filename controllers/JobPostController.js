const multer = require('multer');
const fs = require('fs');
const JobPostModel = require('../models/JobPostModel');

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    // Get the file extension
    const fileExtension = file.originalname.split('.').pop().toLowerCase();
    // Create the formatted filename with extension
    const formattedFilename = file.fieldname + '-' + uniqueSuffix + '.' + fileExtension;
    cb(null, formattedFilename);
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
exports.createJobPost = (req, res, next) => {
  upload.single('foto')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Error uploading file
      return res.status(500).json({ error: 'Failed to upload file' });
    } else if (err) {
      // Other error
      return res.status(500).json({ error: err.message });
    }

    const { deskripsi, category, salary } = req.body;

    // Remove commas from salary and replace the dot separators
    const formattedSalary = salary.replace(/,/g, '').replace(/\./g, '');

    const foto = req.file.filename;

    const jobPost = new JobPostModel({
      deskripsi: deskripsi,
      category: category,
      foto: foto,
      salary: formattedSalary,
    });

    jobPost
      .save()
      .then((savedJobPost) => {
        // Add dot separators back to the salary before sending the response
        const formattedSavedJobPost = {
          ...savedJobPost._doc,
          salary: formatSalary(savedJobPost.salary),
        };
        return res.status(201).json(formattedSavedJobPost);
      })
      .catch((error) => {
        return res.status(500).json({ error: 'Failed to create JobPost' });
      });
  });
};

// Function to format the salary value with dot separators
const formatSalary = (salary) => {
  return salary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};




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
      return res.status(500).json({ error });
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
