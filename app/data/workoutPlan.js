export const workoutPlan = [
	{
		week: 1,
		focus: "Endurance & Strength Stability",
		days: [
			{
				weekday: "Sunday",
				type: "Full Body Strength Training",
				exercises: [
					{ name: "Romanian Deadlift", rep: "4", sets: 8 },
					{ name: "Incline Dumbbell Press", rep: 3, sets: 10 },
					{ name: "Lat Pulldown", rep: 3, sets: 10 },
					{ name: "Step-Through Lunges", rep: 3, sets: 10 },
					{ name: "Core: Hanging Knee Raises", rep: 3, sets: 10 },
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
					{ name: "Bulgarian Split Squat", rep: 3, sets: 10 },
					{ name: "Single-Leg Romanian Deadlift", rep: 3, sets: 10 },
					{ name: "Step Up", rep: 3, sets: 10 },
					{ name: "Core: Hanging Leg Raises", rep: 3, sets: 10 },
				],
			},
			{
				weekday: "Wednesday",
				type: "Running (Endurance Focus, 25-30 min)",
				workout: "Run/Walk Intervals: 4 min run / 1 min walk (repeat 5x)",
			},
			{
				weekday: "Thursday",
				type: "Recovery Day",
			},
			{
				weekday: "Friday",
				type: "Short Upper Body Strength (30-40 min)",
				exercises: [
					{ name: "Single-Arm Dumbbell Overhead Press", rep: 3 },
					{ name: "Dumbbell Row", rep: 3, sets: 10 },
					{ name: "Core: Pallof Press", rep: 3, sets: 10 },
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
					{ name: "Romanian Deadlift", rep: 4, sets: 10 },
					{ name: "Dumbbell Bench Press", rep: "3x8-10" },
					{ name: "Single-Leg Step Downs", rep: 3, sets: 10 },
					{ name: "Barbell Row", rep: 3, sets: 10 },
					{ name: "Core: Hanging Knee Raises", rep: 3, sets: 12 },
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
					{ name: "Lateral Lunges", rep: 3, sets: 10 },
					{ name: "Single Leg Pistol W Box ", rep: 3, sets: 10 },
					{ name: "Hip Thrust", rep: 3, sets: 10 },
					{ name: "Core: Reverse Crunches", rep: 3, sets: 10 },
				],
			},
			{
				weekday: "Wednesday",
				type: "Running (Speed or Tempo Focus, 20-30 min)",
				workout: "30-sec sprint + 90-sec walk (repeat 6-8x)",
			},
			{
				weekday: "Thursday",
				type: "Recovery Day",
			},
			{
				weekday: "Friday",
				type: "Short Upper Body Strength (30-40 min)",
				exercises: [
					{ name: "Single-Arm Dumbbell Bench Press", rep: 3, sets: 10 },
					{ name: "Dumbbell Snatch", rep: 3, sets: 10 },
					{
						name: "Core: Side Plank with Hip Dips",
						rep: 3,
						sets: 10,
					},
				],
			},
			{ weekday: "Saturday", type: "Hot Yoga (Mobility & Recovery)" },
		],
	},
];
