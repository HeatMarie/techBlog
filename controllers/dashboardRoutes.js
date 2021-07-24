const router = require('express').Router();
const { Post, User, Comment} = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, async(req, res) => {
    try{
        const userData = await User.findByPk(req.session.user_id, {
            attributes: { exclude: ['password'] },
            include: [{ model: Post}],
        });

        const postData = await Post.findAll({
            where: {
                user_id: req.session.user_id
            },

            include: [ 
                {
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


        const user = userData.get({ plain: true });
        console.log('user', user);
        console.log('post', user.posts);
        res.render('dashboard', {
            example: "MY NAME",
            posts,
            user,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
})


router.get('/edit/:id', withAuth, async (req, res) => {
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
        console.log('post', post)
        res.render('edit', {
            post,
            logged_in: req.session.logged_in
        });

    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
});

router.get('/newPost', (req, res) => {
    res.render('newPost')
})


router.get('/newComment/:id', async (req, res) => {
    try {
        console.log("Fuck this")
        const postData = await Post.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['username']
                }
            ]
        });

        if (!postData){
            res.status(404).json({ message: 'Nothing found with this id.'})
            return;
        }

        const post = await postData.get({ plain: true });

        const commentData = await Comment.findAll({
            include: [
                {
                    model: User,
                    attributes: ['username']
                }
            ]
        });

        const comments = await commentData.map((comment) => comment.get({ plain: true }));

        res.render('newComment'),{
            post,
            comments,
            logged_in: req.session.logged_in
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
})

module.exports = router;