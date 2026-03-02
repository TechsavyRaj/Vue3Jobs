import express from 'express';
import Job from '../models/Job.js';

const router = express.Router();

// @route   GET /api/jobs
// @desc    Get all jobs
router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find();
        // Return an array of transformed jobs matching original json-server format
        const formattedJobs = jobs.map(job => {
            const jobObj = job.toObject();
            jobObj.id = jobObj._id.toString();
            delete jobObj._id;
            delete jobObj.__v;
            return jobObj;
        });
        res.json(formattedJobs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/jobs/:id
// @desc    Get single job by ID
router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ msg: 'Job not found' });
        }
        const jobObj = job.toObject();
        jobObj.id = jobObj._id.toString();
        delete jobObj._id;
        delete jobObj.__v;
        res.json(jobObj);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Job not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/jobs
// @desc    Add a job
router.post('/', async (req, res) => {
    try {
        const newJob = new Job({
            title: req.body.title,
            type: req.body.type,
            location: req.body.location,
            description: req.body.description,
            salary: req.body.salary,
            company: {
                name: req.body.company.name,
                description: req.body.company.description,
                contactEmail: req.body.company.contactEmail,
                contactPhone: req.body.company.contactPhone
            }
        });

        const job = await newJob.save();
        const jobObj = job.toObject();
        jobObj.id = jobObj._id.toString();
        delete jobObj._id;
        delete jobObj.__v;
        res.json(jobObj);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/jobs/:id
// @desc    Update a job
router.put('/:id', async (req, res) => {
    try {
        let job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ msg: 'Job not found' });
        }

        job = await Job.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { returnDocument: 'after' }
        );

        const jobObj = job.toObject();
        jobObj.id = jobObj._id.toString();
        delete jobObj._id;
        delete jobObj.__v;
        res.json(jobObj);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Job not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/jobs/:id
// @desc    Delete a job
router.delete('/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ msg: 'Job not found' });
        }

        await job.deleteOne();
        res.json({ msg: 'Job removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Job not found' });
        }
        res.status(500).send('Server Error');
    }
});

export default router;
