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
        // Determine if showing reps instead of weights for today view
        const isShowingReps = d.weight === 0;

        return (
          <Box sx={{ background: "#ccc", border: "1px solid #ccc", p: 1 }}>
            <Typography variant="body2" sx={{ color: "#2E2E2E" }}>
              Set {d.setNumber}
            </Typography>
            {d.weight !== 0 ? (
              <Typography variant="body2" sx={{ color: "#2E2E2E" }}>
                Weight: {d.weight} lbs
              </Typography>
            ) : null}
            <Typography variant="body2" sx={{ color: "#2E2E2E" }}>
              Reps: {d.reps}
            </Typography>
            {isShowingReps && (
              <Typography variant="body2" sx={{ color: "#666", fontStyle: "italic" }}>
                (Showing reps - no weight data)
              </Typography>
            )}
          </Box>
        );
      }

      // Historical view tooltip
      const data = payload[0].payload;
      const allWeightsZero =
        data.sets?.every((set: { weight: number }) => set.weight === 0) ||
        (typeof data.avgWeight === "string" ? parseFloat(data.avgWeight) : data.avgWeight) === 0;

      return (
        <Box sx={{ background: "#ccc", border: "1px solid #ccc", p: 1 }}>
          <Typography variant="body2" sx={{ color: "#2E2E2E", fontWeight: "bold" }}>
            {data.date}
          </Typography>
          {data.sets?.map((set: { setNumber: number; weight: number; reps: number }, idx: number) => (
            <Typography key={idx} variant="body2" sx={{ color: "#2E2E2E" }}>
              Set {set.setNumber}: {allWeightsZero ? `${set.reps} reps` : `${set.weight}lbs`}
            </Typography>
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
      avgWeight?: number | string;
      avgReps?: number | string;
    }[],
    todayView: boolean
  ) => {
    // Convert string values to numbers and create processed data
    const processedData = chartData.map((data) => ({
      ...data,
      avgWeight: typeof data.avgWeight === "string" ? parseFloat(data.avgWeight) : data.avgWeight || 0,
      avgReps: typeof data.avgReps === "string" ? parseFloat(data.avgReps) : data.avgReps || 0,
    }));

    // Determine if we should show reps instead of weights
    const shouldShowReps = todayView
      ? processedData.every((data) => data.weight === 0)
      : processedData.every((data) => data.avgWeight === 0);

    const yAxisLabel = shouldShowReps ? "Reps" : "Weight (lbs)";
    const dataKey = todayView ? (shouldShowReps ? "reps" : "weight") : shouldShowReps ? "avgReps" : "avgWeight";

    return (
      <Box
        key={exercise}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          height: isMobile ? "100%" : "350px",
          width: "100%",
          padding: isMobile ? 2 : 1,
          boxSizing: "border-box",
          mb: isMobile ? 0 : 2,
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ textAlign: "center", mb: 2 }}>
          {exercise}
        </Typography>
        <Box sx={{ width: "100%", height: isMobile ? "300px" : "280px", minHeight: isMobile ? "300px" : "280px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" />
              {todayView ? (
                <XAxis dataKey="setNumber" tickFormatter={(n) => `Set ${n}`} />
              ) : (
                <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
              )}
              <YAxis
                type="number"
                domain={[0, "dataMax + 20"]}
                label={{ value: yAxisLabel, angle: -90, position: "insideLeft" }}
              />
              {todayView && isMobile ? null : <Tooltip content={<CustomTooltip />} />}
              <Area type={cardinal} dataKey={dataKey} stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    );
  };

  // Main chart renderer - swipeable on mobile, static grid on desktop
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
          grabCursor={true}
          style={{ width: "100%", height: "400px" }}
        >
          {data.map(({ exercise, data: chartData }) => (
            <SwiperSlide key={exercise} style={{ height: "100%" }}>
              {renderSingleChart(exercise, chartData, todayView)}
            </SwiperSlide>
          ))}
        </Swiper>
      );
    }

    // Desktop static grid view
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 3,
          width: "100%",
        }}
      >
        {data.map(({ exercise, data: chartData }) => renderSingleChart(exercise, chartData, todayView))}
      </Box>
    );
  };

  // Today's view (viewState = false)
  if (!viewState) {
    const filteredExercises = filterByToday(exerciseHistory);

    if (filteredExercises.length > 0) {
      return (
        <Box sx={{ width: "100%", height: isMobile ? "440px" : "auto" }}>{renderChart(filteredExercises, true)}</Box>
      );
    } else {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            {"Sorry, no exercises today :("}
          </Typography>
        </Box>
      );
    }
  }

  // Historical view (viewState = true)
  return <Box sx={{ width: "100%", height: isMobile ? "440px" : "auto" }}>{renderChart(exerciseHistory, false)}</Box>;
};

export default Charts;
