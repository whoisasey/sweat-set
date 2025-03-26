export const workoutPlan = [
	{
		week: 1,
		focus: "Endurance & Strength Stability",
		days: [
			{
				weekday: "Sunday",
				type: "Full Body Strength Training",
				exercises: [
					{ name: "Romanian Deadlift", reps: 3, sets: 8 },
					{ name: "Incline Dumbbell Press", reps: 3, sets: 10 },
					{ name: "Lat Pulldown", reps: 3, sets: 10 },
					{ name: "Step-Through Lunges", reps: 3, sets: 10 },
					{ name: "Core: Hanging Knee Raises", reps: 3, sets: 10 },
				],
			},
			{
				weekday: "Monday",
				type: "Recovery Day",
			},
			{
				weekday: "Tuesday",
				type: "Short Strength (Unilateral Lower Body, 30-40 min)",
				exercises: [
					{ name: "Bulgarian Split Squat", reps: 3, sets: 10 },
					{ name: "Single-Leg Romanian Deadlift", reps: 3, sets: 10 },
					{ name: "Step Up", reps: 3, sets: 10 },
					{ name: "Core: Hanging Leg Raises", reps: 3, sets: 10 },
				],
			},
			{
				weekday: "Wednesday",
				type: "Running (Endurance Focus, 25-30 min)",
				workout: "Run/Walk Intervals: 4 min run / 1 min walk (repseat 5x)",
			},
			{
				weekday: "Thursday",
				type: "Recovery Day",
			},
			{
				weekday: "Friday",
				type: "Short Upper Body Strength (30-40 min)",
				exercises: [
					{ name: "Single-Arm Dumbbell Overhead Press", reps: 3, sets: 10 },
					{ name: "Dumbbell Row", reps: 3, sets: 10 },
					{ name: "Core: Pallof Press", reps: 3, sets: 10 },
				],
			},
			{ weekday: "Saturday", type: "Hot Yoga (Mobility & Recovery)" },
		],
	},
	{
		week: 2,
		focus: "Progression & Speed Focus",
		days: [
			{
				weekday: "Sunday",
				type: "Full Body Strength Training",
				exercises: [
					{ name: "Romanian Deadlift", reps: 3, sets: 10 },
					{ name: "Dumbbell Bench Press", reps: 3, sets: 10 },
					{ name: "Single-Leg Step Downs", reps: 3, sets: 10 },
					{ name: "Barbell Row", reps: 3, sets: 10 },
					{ name: "Core: Hanging Knee Raises", reps: 3, sets: 12 },
				],
			},
			{
				weekday: "Monday",
				type: "Recovery Day",
			},
			{
				weekday: "Tuesday",
				type: "Short Strength (Unilateral Lower Body, 30-40 min)",
				exercises: [
					{ name: "Lateral Lunges", reps: 3, sets: 10 },
					{ name: "Single Leg Pistol W Box ", reps: 3, sets: 10 },
					{ name: "Hip Thrust", reps: 3, sets: 10 },
					{ name: "Core: Reverse Crunches", reps: 3, sets: 10 },
				],
			},
			{
				weekday: "Wednesday",
				type: "Running (Speed or Tempo Focus, 20-30 min)",
				workout: "30-sec sprint + 90-sec walk (repseat 6-8x)",
			},
			{
				weekday: "Thursday",
				type: "Recovery Day",
			},
			{
				weekday: "Friday",
				type: "Short Upper Body Strength (30-40 min)",
				exercises: [
					{ name: "Single-Arm Dumbbell Bench Press", reps: 3, sets: 10 },
					{ name: "Dumbbell Snatch", reps: 3, sets: 10 },
					{
						name: "Core: Side Plank with Hip Dips",
						reps: 3,
						sets: 10,
					},
				],
			},
			{ weekday: "Saturday", type: "Hot Yoga (Mobility & Recovery)" },
		],
	},
];
