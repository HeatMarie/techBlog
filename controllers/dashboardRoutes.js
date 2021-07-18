const router = require('express').Router();
const { Post, Comments} = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, async (req, res) => {
    try {
        const userData = await User.findByPk(req.session.user_id, {
            attributes: { exclude: ['password'] },
            include: [{ model: Post }],
        });

        const user = userData.get({ plain: true });

        res.render(dashboard, {
            ...user,
            logged_in: true
        });
    } catch (err) {
        res.status(500).json(err);
    }

})

module.exports = router;