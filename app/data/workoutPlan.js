export const workoutPlan = [
	{
		week: 1,
		focus: "Endurance & Strength Stability",
		days: [
			{
				weekday: "Sunday",
				type: "Full Body Strength Training",
				exercises: [
					{ name: "Deadlifts", rep: "4x6-8" },
					{ name: "Incline Dumbbell Press", rep: "3x8-10" },
					{ name: "Lat Pulldown or Assisted Pull-Ups", rep: "3x8-12" },
					{ name: "Step-Through Lunges", rep: "3x10 per leg" },
					{ name: "Core: Hanging Knee Raises", rep: "3x12" },
				],
			},
			{
				weekday: "Monday",
				type: "Short Strength (Unilateral Lower Body, 30-40 min)",
				exercises: [
					{ name: "Bulgarian Split Squats", rep: "3x8-10 per leg" },
					{ name: "Single-Leg Romanian Deadlifts", rep: "3x10 per leg" },
					{ name: "Step-Ups (Weighted)", rep: "3x10 per leg" },
					{ name: "Core: Hanging Leg Raises", rep: "3x12" },
				],
			},
			{
				weekday: "Tuesday",
				type: "Running (Endurance Focus, 25-30 min)",
				workout: "Run/Walk Intervals: 4 min run / 1 min walk (repeat 5x)",
			},
			{
				weekday: "Wednesday",
				type: "Full Body Strength Training",
				exercises: [
					{ name: "Squats", rep: "4x6-8" },
					{ name: "Dumbbell Bench Press", rep: "3x8-10" },
					{ name: "Barbell Rows", rep: "3x10-12" },
					{ name: "Single-Leg Glute Bridges", rep: "3x10 per side" },
					{ name: "Core: Russian Twists", rep: "3x20 total" },
				],
			},
			{
				weekday: "Thursday",
				type: "Short Upper Body Strength (30-40 min)",
				exercises: [
					{ name: "Single-Arm Dumbbell Overhead Press", rep: "3x8 per arm" },
					{ name: "Dumbbell Rows (One Arm)", rep: "3x10 per arm" },
					{ name: "Core: Pallof Press", rep: "3x10 per side" },
				],
			},
			{ weekday: "Friday", type: "Recovery Day" },
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
					{ name: "Trap Bar Deadlifts", rep: "4x6-8" },
					{ name: "Push-Ups or Dumbbell Press", rep: "3x8-10" },
					{ name: "Single-Leg Step Downs", rep: "3x8-10 per leg" },
					{ name: "Cable Rows", rep: "3x10-12" },
					{ name: "Core: Hanging Knee Raises", rep: "3x12" },
				],
			},
			{
				weekday: "Monday",
				type: "Short Strength (Unilateral Lower Body, 30-40 min)",
				exercises: [
					{ name: "Lateral Lunges", rep: "3x8-10 per leg" },
					{ name: "Pistol Squats to Box", rep: "3x10 per leg" },
					{ name: "Hip Thrusts", rep: "3x10-12" },
					{ name: "Core: Reverse Crunches", rep: "3x12" },
				],
			},
			{
				weekday: "Tuesday",
				type: "Running (Speed or Tempo Focus, 20-30 min)",
				workout: "30-sec sprint + 90-sec walk (repeat 6-8x)",
			},
			{ weekday: "Wednesday", type: "Recovery Day" },
			{
				weekday: "Thursday",
				type: "Short Upper Body Strength (30-40 min)",
				exercises: [
					{ name: "Single-Arm Dumbbell Bench Press", rep: "3x8 per arm" },
					{ name: "Dumbbell Snatch", rep: "3x10 per arm" },
					{
						name: "Core: Side Plank with Hip Dips",
						rep: "3x20 sec per side",
					},
				],
			},
			{ weekday: "Friday", type: "Recovery Day" },
			{ weekday: "Saturday", type: "Hot Yoga (Mobility & Recovery)" },
		],
	},
];
