//const validateToken = require('../../config/security/tokenValidator')

module.exports = routes => {

    const db = routes.config.firebaseConfig.collection('jobs');
    
    extractJob = job => {
        let v = job.data();

        return {
            id: job.id,
            name: v.name,
            salary: v.salary,
            description: v.description,
            skills: v.skills,
            area: v.area,
            diferrentials: v.diferrentials,
            isPcd: v.isPcd,
            isActive: v.isActive
        }
    }

    routes.post('/jobs', /*validateToken,*/ async (req, res) => {
        try {
            await db.doc().set(req.body);

            return res.send('Job added succesfully');

        } catch (error) {
            return res.status(500).send(error) 
        }
    });

    routes.get('/jobs/', /*validateToken,*/ async (req, res) => {
        try {
            let docs = await db.get();
            let jobs = [];

            docs.forEach(doc => {
                jobs.push(extractJob(doc));
            });

            return res.send(jobs);

        } catch(error) {
            return res.status(500).send(error);
        }
    });


    routes.get('/jobs/:jobId', async (req, res) => {
        try {
            let job = await db.doc(req.params.jobId).get();

            if(job.exists)
               return res.send(extractJob(job));
            else 
                return res.status(404).send('Job not found');

        } catch(error) {
            return res.status(500).send(error);
        }
    });
    

    routes.put('/jobs/:jobId', async (req, res) => {
        try {
            let job = await db.doc(req.params.jobId).update(req.body);

            if(job)
                return res.send(`Job ${req.params.jobId} has been updated!`);
            else    
                return res.status(404).send('Job not found');

        } catch(error) {
            return res.status(500).send(error.toString())
        }
    });

    routes.delete('/jobs/:jobId', async (req, res) => {
        try {
            let job = await db.doc(req.params.jobId).delete();

            if(job)
                return res.send(`Job ${req.params.jobId} has been deleted!`);
            else    
                return res.status(404).send('Job not found');

        } catch(error) {
            return res.status(500).send(error)
        }
    })
}