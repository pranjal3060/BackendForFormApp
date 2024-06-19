import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

interface Submission {
  name: string;
  email: string;
  phone: string;
  github_link: string;
  stopwatch_time: string;
}

const dbFilePath = path.join(__dirname, '../db.json');

// Helper function to read from db.json
const readDatabase = (): Submission[] => {
  const data = fs.readFileSync(dbFilePath, 'utf-8');
  return JSON.parse(data);
};

// Helper function to write to db.json
const writeDatabase = (data: Submission[]) => {
  fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), 'utf-8');
};

// Ping endpoint
router.get('/ping', (req: any, res: { json: (arg0: { success: boolean; }) => void; }) => {
  res.json({ success: true });
});

// Submit endpoint
router.post('/submit', (req: { body: { name: any; email: any; phone: any; github_link: any; stopwatch_time: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error?: string; success?: boolean; submission?: Submission; }): void; new(): any; }; }; }) => {
  const { name, email, phone, github_link, stopwatch_time } = req.body;
  if (!name || !email || !phone || !github_link || !stopwatch_time) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const newSubmission: Submission = { name, email, phone, github_link, stopwatch_time };
  const submissions = readDatabase();
  submissions.push(newSubmission);
  writeDatabase(submissions);

  res.status(201).json({ success: true, submission: newSubmission });
});

// Read endpoint
router.get('/read', (req: { query: { index: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: string; }): any; new(): any; }; }; json: (arg0: { success: boolean; submission: Submission; }) => void; }) => {
  const { index } = req.query;
  if (index === undefined || isNaN(Number(index))) {
    return res.status(400).json({ error: 'Invalid index' });
  }

  const submissions = readDatabase();
  const submissionIndex = Number(index);

  if (submissionIndex < 0 || submissionIndex >= submissions.length) {
    return res.status(404).json({ error: 'Submission not found' });
  }

  res.json({ success: true, submission: submissions[submissionIndex] });
});

// Edit endpoint
router.put('/edit', (req: { body: { index: any; name: any; email: any; phone: any; github_link: any; stopwatch_time: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: string; }): any; new(): any; }; }; json: (arg0: { success: boolean; submission: { name: any; email: any; phone: any; github_link: any; stopwatch_time: any; }; }) => void; }) => {
    const { index, name, email, phone, github_link, stopwatch_time } = req.body;
    if (index === undefined || isNaN(Number(index))) {
      return res.status(400).json({ error: 'Invalid index' });
    }
  
    const submissions = readDatabase();
    const submissionIndex = Number(index);
  
    if (submissionIndex < 0 || submissionIndex >= submissions.length) {
      return res.status(404).json({ error: 'Submission not found' });
    }
  
    const updatedSubmission = {
      ...submissions[submissionIndex],
      name: name || submissions[submissionIndex].name,
      email: email || submissions[submissionIndex].email,
      phone: phone || submissions[submissionIndex].phone,
      github_link: github_link || submissions[submissionIndex].github_link,
      stopwatch_time: stopwatch_time || submissions[submissionIndex].stopwatch_time,
    };
  
    submissions[submissionIndex] = updatedSubmission;
    writeDatabase(submissions);
  
    res.json({ success: true, submission: updatedSubmission });
  });
  
// Delete endpoint
router.delete('/delete', (req: { query: { index: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: string; }): any; new(): any; }; }; json: (arg0: { success: boolean; }) => void; }) => {
    const { index } = req.query;
    if (index === undefined || isNaN(Number(index))) {
      return res.status(400).json({ error: 'Invalid index' });
    }
  
    const submissions = readDatabase();
    const submissionIndex = Number(index);
  
    if (submissionIndex < 0 || submissionIndex >= submissions.length) {
      return res.status(404).json({ error: 'Submission not found' });
    }
  
    submissions.splice(submissionIndex, 1);
    writeDatabase(submissions);
  
    res.json({ success: true });
  });
  
// Search by email endpoint
router.get('/search', (req: { query: { email: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: string; }): any; new(): any; }; }; json: (arg0: { success: boolean; submissions: Submission[]; }) => void; }) => {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: 'Missing email query parameter' });
    }
  
    const submissions = readDatabase();
    const result = submissions.filter(submission => submission.email === email);
  
    if (result.length === 0) {
      return res.status(404).json({ error: 'No submissions found' });
    }
  
    res.json({ success: true, submissions: result });
  });
  


export default router;
