const router = require('express').Router();
const { User } = require('../../models');

router.get('/', (req, res) => {
    try {
        const userData = await User.findAll({
            attributes: { exclude: ['password'] }
        });

        res.json(userData)
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
})

router.get('/:id', (req, res) => {
    try{
        const userData = await User.findByPk({
            attributes: {exclude: ['password'] },
            where: {
                id: req.params.id
            },
            include: [{
                model: this.post,
                attributes: [
                    'id',
                    'title',
                    'content',
                    'created_at'
                ]
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'created_at'],
                include: {
                    model: Post,
                    attributes: ['title']
                }
            },
            {
                model: Post,
                attributes: ['title']
            }        
            ]
        });

        if (!userData){
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }

        res.json(userData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.post('/', async (req,res) => {
    try {
        const userData = await User.create({
            username: req.body.username,
            password: req.body.password
        });

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.username = userData.username;
            req.session.logged_in = true;

            res.status(200).json(userData);
        });
    } catch (err) {
        console.log(err);
        res.status(400).json(err)
    }
});

router.post('/login', async (req, res) => {
    try {
        const userData = await User.findOne({ where: { email: req.body.email } });

        if (!userData){
            res
                .status(400)
                .json({ message: 'Incorrect email or password, please try again' });
            return;
        }

        const validPassword = await userData.checkPassword(req.body.password);

        if (!validPassword) {
            res
                .status(400)
                .json({ message: 'Incorrect email or password, please try again' });
            return;
        }

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.username= userData.username;
            req.session.logged_in = true;

            res.json({ user: userData, message: 'You are now logged in!' });
        });
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
});

router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end()
    }
});

router.put('/:id', (req, res)  => {
    try{
        const userData = User.update(req.body, {
            individualHooks: true,
            where: {
                id: req.params.id
            }
        })

        if (!userData[0]) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }

        res.json(userData);

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.delete('/:id', (req, res) => {
    try {
        const userData = User.destroy({
            where: {
                id: req.params.id
            }
        })
        if (!userData) {
            res.status(404).json({ message: 'No user was found with this id' });
            return;
        }
        res.json(userData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;