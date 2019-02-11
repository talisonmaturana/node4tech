const userModel = require('../../models/user');

let collectionUsers = [];

module.exports = routes => {

    routes.get('/', (req, res) => {
        res.send('Ok');
    })

    routes.get('/users', (req, res) => {
        res.send(collectionUsers);
    })

    routes.get('/users/:userId', (req, res) => {
        let user = collectionUsers.find(user => user.id == req.params.userId) 
        if(user){
            res.send(user);
        } else {
            res.status(204).send('User not found');
        }
    });

    routes.put('/users/:userId/', (req, res) => {
        collectionUsers.forEach(user => {
            if(user.id == req.params.userId){
                try {

                    user.name = req.body.name,
                    user.email = req.body.email,
                    user.password = req.body.password

                    res.send(user);

                } catch(error) {

                    return res.status(500).send('Parametros inválidos');
                }
            }
        });
    });

    routes.delete('/users/:idParams', (req, res) => {

        let userExists = false;

        collectionUsers.forEach((user, index) => {
            if(user.id == req.params.idParams){
                userExists = true;

                collectionUsers.splice(index, 1);

                res.send('Ok');
            }
        });

        if(!userExists)
            res.status(404).send('User not found');
    });

    routes.post('/users', (req, res) => {
        try{
            let user = new userModel.User(
                req.body.id,
                req.body.name,
                req.body.email,
                req.body.password
            )

            collectionUsers.push(user);

            res.send(user);

        } catch(error) { res.status(500).send(error) }
    });
}