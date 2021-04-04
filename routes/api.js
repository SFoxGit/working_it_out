const router = require("express").Router();
const Workout = require("../models/workouts.js");



router.get('/api/workouts', (req, res) => {
  Workout.aggregate([{
    $addFields: {
      totalDuration: { $sum: "$exercises.duration" }
    }
  }])
    .sort({ date: -1 })
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.status(400).json(err);
    })
});

router.post('/api/workouts', ({ body }, res) => {
  console.log(body)
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
      console.log(dbWorkout);
      res.json(dbWorkout)
    })
    .catch(err => {
      res.status(400).json(err);
    })
});

//workouts range?????????
router.get('/api/workouts/range', (req, res) => {
  Workout.aggregate([{
    $addFields: {
      totalDuration: { $sum: "$exercises.duration" }
    }
  }])
    .sort({ day: -1 })
    .then(dbWorkout => {
      const lastSeven = dbWorkout.slice(0, 7);
      console.log(lastSeven);
      res.json(lastSeven);
    })
    .catch(err => {
      res.status(400).json(err);
    })
})

// range testing of $group instead
// Workout.aggregate([
//   {
//     $group: {
//       _id: { day: "$day" },
//       totalDuration: { $sum: "$exercises.duration" },
//       exercises: [
//         {
//           type: "$type",
//           name: "$name",
//           duration: "$duration",
//           weight: { $sum: "$weight" },
//         }
//       ]
//     }
//   },
//   {
//     $project: {
//       _id: 0,
//       day: "$_id.day",
//       totalDuration: "$_id.exercises.duration",
//     }
//   }
// ])
























module.exports = router;