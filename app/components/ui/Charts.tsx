"use client";

import "swiper/css";

import { A11y, Navigation, Pagination, Scrollbar } from "swiper/modules";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, TooltipProps, XAxis, YAxis } from "recharts";
import { Box, Typography } from "@mui/material";
import React, { JSX } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import { ProcessedWorkoutData } from "@/app/progress/page";
import { curveCardinal } from "d3-shape";
import { formatDate } from "@/app/utils/helpers";
import { useWindowSize } from "@/app/utils/helpers-fe";

const Charts = ({ exerciseHistory, viewState }: { exerciseHistory: ProcessedWorkoutData[]; viewState: boolean }) => {
  const cardinal = curveCardinal.tension(0.2);
  const width = useWindowSize("width");
  const isMobile = (width ?? 0) < 540;

  // Filter today's exercises
  const filterByToday = (data: ProcessedWorkoutData[]) => {
    const today = formatDate();
    return data
      .map((exercise) => {
        const todayEntry = exercise.data.find((entry) => entry.date.toString() === today);
        if (!todayEntry) return null;

        return {
          exercise: exercise.exercise,
          data: todayEntry.sets.map((set: { setNumber: number; weight: number; reps: number }) => ({
            setNumber: set.setNumber,
            weight: set.weight,
            reps: set.reps,
          })),
        };
      })
      .filter(Boolean) as {
      exercise: string;
      data: { setNumber: number; weight: number; reps: number }[];
    }[];
  };

  // Tooltip for both views
  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>): JSX.Element | null => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;

      if ("setNumber" in d) {
        return (
          <Box sx={{ background: "#ccc", border: "1px solid #ccc", p: 1 }}>
            <Typography variant="body2" sx={{ color: "#2E2E2E" }}>
              Set {d.setNumber}
            </Typography>
            <Typography variant="body2" sx={{ color: "#2E2E2E" }}>
              Weight: {d.weight} lbs
            </Typography>
            <Typography variant="body2" sx={{ color: "#2E2E2E" }}>
              Reps: {d.reps}
            </Typography>
          </Box>
        );
      }

      return (
        <Box className="custom-tooltip">
          <p>{payload?.[0]?.payload?.date}</p>
          {payload[0].payload.sets.map((set: { setNumber: number; weight: number }, idx: number) => (
            <p key={idx}>
              Set {set.setNumber}: {set.weight}lbs
            </p>
          ))}
        </Box>
      );
    }
    return null;
  };

  // Reusable chart block
  const renderSingleChart = (
    exercise: string,
    chartData: {
      setNumber: number;
      weight: number;
      reps?: number;
      date?: string;
      avgWeight?: number;
    }[],
    todayView: boolean
  ) => (
    <Box
      key={exercise}
      mb={4}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        flex: isMobile ? "1 1 100%" : "1 1 45%",
        minWidth: 0, // ⚠️ Important for ResponsiveContainer
        height: 320, // chart height (can tweak)
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ textAlign: "center" }}>
        {exercise}
      </Typography>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          {todayView ? (
            <XAxis dataKey="setNumber" tickFormatter={(n) => `Set ${n}`} />
          ) : (
            <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
          )}
          <YAxis type="number" domain={[0, "dataMax + 20"]} />
          {todayView && isMobile ? null : <Tooltip content={<CustomTooltip />} />}
          <Area
            type={cardinal}
            dataKey={todayView ? "weight" : "avgWeight"}
            stroke="#82ca9d"
            fill="#82ca9d"
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );

  // Main chart renderer
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderChart = (data: { exercise: string; data: any }[], todayView: boolean = false) => {
    if (isMobile) {
      return (
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={16}
          slidesPerView={1}
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
        >
          {data.map(({ exercise, data: chartData }) => (
            <SwiperSlide key={exercise}>{renderSingleChart(exercise, chartData, todayView)}</SwiperSlide>
          ))}
        </Swiper>
      );
    }

    return (
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, width: "100%" }}>
        {data.map(({ exercise, data: chartData }) => renderSingleChart(exercise, chartData, todayView))}
      </Box>
    );
  };

  if (!viewState) {
    const filteredExercises = filterByToday(exerciseHistory);

    if (filteredExercises.length > 0) {
      return <Box sx={{ display: "flex", flexWrap: "wrap" }}>{renderChart(filteredExercises, true)}</Box>;
    } else {
      return (
        <Box>
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            {"Sorry, no exercises today :("}
          </Typography>
        </Box>
      );
    }
  }

  return (
    <Box
      sx={{
        margin: `${width && width < 540 ? "0" : "0 auto"}`,
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      {renderChart(exerciseHistory)}
    </Box>
  );
};

export default Charts;
