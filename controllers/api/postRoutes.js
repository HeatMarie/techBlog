const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');


router.post('/', withAuth, async (req, res) => {
    try{
        const newPost = await Post.create({
            title: req.body.title,
            content: req.body.content,
            create_at: req.body,
            user_id: req.session.user_id,
        });
        
        res.status(200).json(newPost);
    } catch (err){
        console.log(err)
        res.status(400).json(err);
    }
});

router.put('/:id', withAuth, async (req,res) => {
    try {
        const editPost = await Post.update({
            title: req.body.title,
            content: req.body.content,
        }, {
            where: {
                id: req.params.id
            }
        })

        if (!editPost) {
            res.status(404).json({ message: 'No post with that id exists'});
        }
        res.status(200).json(editPost);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
})

router.delete('/delete/:id', withAuth, async (req, res) => {
    try {
        const postData = await Post.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id,
            },
        });

        if (!postData) {
            res.status(400).json({ message: 'No post found with this idi' });
            return;
        }

        res.status(200).json(postData);
    } catch (err) {
        res.sendStatus(500).json(err);
    }
});

module.exports = router;