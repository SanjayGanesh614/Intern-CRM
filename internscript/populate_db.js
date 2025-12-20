const admin = require('firebase-admin');
const serviceAccount = require('/home/user/Intern-reachout-CRM/functions/serviceAccountKey.json');
const jobsData = require('./jobs_data.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const populateDatabase = async () => {
  const internshipsCollection = db.collection('internships');
  const existingIds = new Set();

  const snapshot = await internshipsCollection.get();
  snapshot.forEach(doc => {
    existingIds.add(doc.id);
  });

  const batch = db.batch();
  let newJobCount = 0;

  jobsData.forEach(dataSet => {
    dataSet.data.forEach(job => {
      const jobId = job.job_id;
      if (jobId && !existingIds.has(jobId)) {
        const newInternshipRef = internshipsCollection.doc(jobId);
        batch.set(newInternshipRef, {
          id: jobId,
          title: job.job_title,
          company: job.employer_name,
          location: job.job_location,
          city: job.job_city,
          state: job.job_state,
          country: job.job_country,
          type: job.job_employment_type,
          apply_link: job.job_apply_link,
          description: (job.job_description || '').substring(0, 300) + '...',
          posted_at: job.job_posted_at,
          publisher: job.job_publisher
        });
        existingIds.add(jobId);
        newJobCount++;
      }
    });
  });

  if (newJobCount > 0) {
    await batch.commit();
    console.log(`Successfully added ${newJobCount} new internships.`);
  } else {
    console.log('No new internships to add.');
  }
};

populateDatabase().catch(error => {
  console.error('Error populating database:', error);
});
