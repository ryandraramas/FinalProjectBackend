const mongoose = require('mongoose');

const jobPostSchema = new mongoose.Schema({
  deskripsi: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  foto: {
    type: String,
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
});

const JobPostModel = mongoose.model('JobPost', jobPostSchema);

module.exports = JobPostModel;
