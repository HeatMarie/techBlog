const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comments} = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, async (req,res) => {
    try{
        const postData = await Post.findAll(req.session.user_id, {
            attributes:[
                'id',
                'title',
                'content',
                'created_at'
            ],
            include: [ {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
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
        res.status(500).json(err);
    }
});
router.get('/post/:id', withAuth, async (req, res) => {
    try{
        const postData = await Post.findByPk(req.params.id, {
            attributes: [
                'id',
                'title',
                'content',
                'created_at'
            ],
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

router.get('/new', (req, res) => {
    res.render('new-post')
})


module.exports = router;