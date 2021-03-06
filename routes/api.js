const router = require("express").Router();
const { db } = require("../models/workouts.js");
const Workout = require("../models/workouts.js");



router.get('/api/workouts', (req, res) => {
  Workout.aggregate([{
    $addFields: {
      totalDuration: { $sum: "$exercises.duration" }
    }
  }])
    .sort({ _id: 1 })
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
  Workout.aggregate([{
    $addFields: {
      totalDuration: { $sum: "$exercises.duration" }
    }
  }])
    .sort({ day: -1 })
    .then(dbWorkout => {
      function compare(a, b) {
        const dayA = a.day;
        const dayB = b.day;

        let comparison = 0;
        if (dayA > dayB) {
          comparison = 1;
        } else if (dayA < dayB) {
          comparison = -1;
        }
        return comparison;
      }
      dbWorkout.length = 7;
      dbWorkout.sort(compare)
      res.json(dbWorkout);
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