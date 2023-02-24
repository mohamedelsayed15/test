const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Task = require('../models/task')
//=========================================================
router.post('/createTask',auth,async (req, res) => { 
    try {
        const task = await new Task({
            // ... means everything in req.body
            ...req.body,
            owner:req.user._id
        })
        await task.save()
        res.status(201).send(task)
    } catch (e) { 
        res.status(400).send(e)
    }
})
// VERY IMPORTANT NOTE PLS NOTE THAT PLSSSSSSSSSSSSSSSSSS
// we have NUMBER OF 2 END POINTS WITH "GET" 
//one gets id  in parameters and the other doesnt
// what happens when u have the one with id in parameters above the other one
// the application will go and find the one with id as match and then 
// TAKE THE ID AS "myTasks" which will cause an error
// so U MAKE THE ONE WITH ID BELOW THE OTHER ONE, TY PLS DONT MAKE THIS MISTAKE AGAIN
// query ?completed='true'
// query ?limit=10&skip=30
// query ?sortBy=createdAt:asc
// query ?sortBy=createdAt&order=-1
router.get('/myTasks', auth, async (req, res) => { //NOTE ME
    try {
        const match = {}

    if (req.query.completed) { 
        match.completed = req.query.completed ==='true'
    }
        const sort = {}
        if (req.query.order !== '1') { req.query.order = -1 }
        if (req.query.sortBy ) { 
        //we use bracket notation because we deal with a string in sortby
        // so if we wanna assign a string value to object we use []
        sort[req.query.sortBy] = parseInt(req.query.order)
        }

        await req.user.populate({
            path: 'tasks',
            match, 
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        })
        res.send(req.user.tasks)
    } catch (e) { 
        res.status(500).send()
        console.log(e)
    }
})
router.get('/:_id', auth, async (req, res) => { //NOTE ME
    try {

        const task = await Task.findOne({ _id: req.params._id, owner: req.user._id })

        if (!task) { return res.status(404).send({ Error: "not found" }) }

        res.send(task)

     }
    catch (e) { res.send(e) }

})

router.patch('/alterTask/:_id', auth,async (req, res) => {
   try{
        const updates = Object.keys(req.body)
        const allowedUpdates = ["title","description", "completed"]
        const validupdates = updates.every(update => allowedUpdates.includes(update))
        if (validupdates === false ) { return res.status(404).send( { ERROR: "invalid updates!" }) }
        const task = await Task.findOne({ _id: req.params._id, owner: req.user._id })

        updates.forEach(update => task[update] = req.body[update])

        await task.save()
        if (!task) { return res.status(404).send({ ERROR: "task were not found" }) }
        res.send(task)
    } catch (e) {
        res.send(e)
        console.error(e)
    }
})
router.delete('/:_id',auth ,async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params._id, owner: req.user._id })
        if (!task) { 
            return res.status(404).send({ERROR: "task were not found"})
        }
        res.send(task)
    } catch (e) { 
        res.status(500).send(e)
    }
})
//=========================================================
module.exports = router
