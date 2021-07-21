const router = require('express').Router();
const { Post, User, Comment} = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, async(req, res) => {
    try{
        const userData = await User.findByPk(req.session.user_id, {
            attributes: { exclude: ['password'] },
            include: [{ model: Post}],
        });

        const user = userData.get({ plain: true });
        console.log(user);
        res.render('dashboard', {
            user,
            logged_in: true
        });
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
})

router.get('/dashboard', withAuth, async (req,res) => {
    try{
        const postData = await Post.findAll({
            where: {
                user_id: req.session.user_id
            },

            include: [ {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ],
    });

    const posts = postData.map((post) => post.get({ plain: true }));
    

    res.render('dashboard', {
        posts,
        logged_in: true
    });
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
});
router.get('/post/:id', withAuth, async (req, res) => {
    try{
        const postData = await Post.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['username'],
                },
                {
                    model: Comment,
                    attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                    include: {
                        model: User,
                        attributes: ['username']
                    }
                }
            ],
        });

        if(!postData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }

        const post = postData.get({ plain: true });

        res.render('edit-post', {
            post,
            logged_in: true
        });
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
});

router.get('/newPost', (req, res) => {
    res.render('newPost')
})


module.exports = router;