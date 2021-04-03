const router = require("express").Router();
const Workout = require("../models/workouts.js");

router.get('/exercise', (req, res) => {
  res.redirect('exercise.html')
});

router.get('/api/workouts', (req, res) => {
  Workout.find({})
    .sort({ date: -1 })
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.status(400).json(err);
    })
});

router.post('/api/workouts', ({ body }, res) => {
  Workout.create(body)
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.status(400).json(err);
    })
});

router.post('/api/workouts/bulk', ({ body }, res) => {
  Workout.insertMany(body)
    .then(dbWorkout => {
      res.json(dbWorkout)
    })
    .catch(err => {
      res.status(400).json(err);
    })
});

router.put('/api/workouts/:id', (req, res) => {
  console.log(req.body);
  Workout.findByIdAndUpdate(req.params.id,
    {
      $push: {
        exercises: [req.body]
      }
    },
    { new: true })
    .then(dbWorkout => {
      res.json(dbWorkout)
    })
    .catch(err => {
      res.status(400).json(err);
    })
});

//workouts range?????????
router.get('/api/workouts/range', (req, res) => {
  Workout.find({})
    .sort({ date: -1 })
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.status(400).json(err);
    })
})


























module.exports = router;