const jwt = require('jsonwebtoken');
const secretKey = require('../../config/secretKey');

module.exports = routes => {
    
    const db = routes.config.firebaseConfig.collection('users')

    routes.post('/login', async (req, res) => {
        try {
            let data = await db.get();
            let filteredUser = data.docs.find(doc => {
                let user = doc.data();
                
                return user.email == req.body.email && user.password == req.body.password 

            });

            if(filteredUser) {
                filteredUser = extractUser(filteredUser);
                let id = filteredUser.id;
                const token = jwt.sign({ id }, secretKey);
                res.send({ auth: true, token, user: filteredUser });
            } else 
                return res.status(404).send('User not found');

        } catch(error) {
            return res.status(500).send(error)
        }
    });

    extractUser = user => {
        let v = user.data();

        return {
            id: user.id,
            name: v.name,
            email: v.email,
            password: v.password
        }
    }

}