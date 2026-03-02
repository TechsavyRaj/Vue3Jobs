import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import Job from './models/Job.js';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);

// Read JSON file
const jobs = JSON.parse(
    fs.readFileSync(new URL('../src/assets/jobs.json', import.meta.url), 'utf-8')
);

// Import into DB
const importData = async () => {
    try {
        await Job.deleteMany(); // Clear existing data
        await Job.insertMany(jobs.jobs);
        console.log('Data Imported!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

if (process.argv[2] === '-i') {
    importData();
} else {
    importData();
}
