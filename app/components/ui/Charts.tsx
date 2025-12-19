"use client";

import "swiper/css";

import { A11y, Navigation, Pagination, Scrollbar } from "swiper/modules";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Box, Typography } from "@mui/material";
import React, { JSX } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import { ProcessedWorkoutData } from "@/app/progress/page";
import type { TooltipContentProps } from "recharts/types/component/Tooltip";
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
  const CustomTooltip = ({ active, payload }: TooltipContentProps<number, string>): JSX.Element | null => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;

      if ("setNumber" in d) {
        // Today view tooltip
        return (
          <Box sx={{ background: "#ccc", border: "1px solid #ccc", p: 1 }}>
            <Typography variant="body2" sx={{ color: "#2E2E2E" }}>
              Set {d.setNumber}
            </Typography>
            <Typography variant="body2" sx={{ color: "#2E2E2E" }}>
              {d.weight > 0 ? `${d.weight}lbs × ${d.reps} reps` : `${d.reps} reps (bodyweight)`}
            </Typography>
          </Box>
        );
      }

      // Historical view tooltip
      const data = payload[0].payload;
      const avgWeight = typeof data.avgWeight === "string" ? parseFloat(data.avgWeight) : data.avgWeight || 0;
      const totalReps = typeof data.totalReps === "string" ? parseFloat(data.totalReps) : data.totalReps || 0;
      const isMixedData = data.sets
        ? data.sets.some((set: { weight: number }) => set.weight > 0) &&
          data.sets.some((set: { weight: number }) => set.weight === 0)
        : avgWeight > 0 && totalReps > 0;

      return (
        <Box sx={{ background: "#ccc", border: "1px solid #ccc", p: 1 }}>
          <Typography variant="body2" sx={{ color: "#2E2E2E", fontWeight: "bold" }}>
            {data.date}
          </Typography>
          {data.sets?.map((set: { setNumber: number; weight: number; reps: number }, idx: number) => (
            <Typography key={idx} variant="body2" sx={{ color: "#2E2E2E" }}>
              Set {set.setNumber}:{" "}
              {set.weight > 0 ? `${set.weight}lbs × ${set.reps} reps` : `${set.reps} reps (bodyweight)`}
            </Typography>
          ))}

          {isMixedData && (
            <Typography variant="body2" sx={{ color: "#666", fontStyle: "italic" }}>
              🟢 Weight • 🟠 Reps
            </Typography>
          )}
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
      totalReps?: number | string;
    }[],
    todayView: boolean
  ) => {
    // Convert string values to numbers and create processed data
    const processedData = chartData.map((data) => ({
      ...data,
      avgWeight: typeof data.avgWeight === "string" ? parseFloat(data.avgWeight) : data.avgWeight || 0,
      totalReps: typeof data.totalReps === "string" ? parseFloat(data.totalReps) : data.totalReps || 0,
    }));

    // Determine chart type: all weights, all bodyweight, or mixed
    const hasWeights = todayView
      ? processedData.some((data) => data.weight > 0)
      : processedData.some((data) => data.avgWeight > 0);

    const hasBodyweight = todayView
      ? processedData.some((data) => data.weight === 0)
      : processedData.some((data) => data.avgWeight === 0);

    const isMixed = hasWeights && hasBodyweight;
    const isAllBodyweight = !hasWeights; // All weights are 0

    const yAxisLabel = isAllBodyweight ? "Reps" : "Weight (lbs)";
    const dataKey = todayView ? (isAllBodyweight ? "reps" : "weight") : isAllBodyweight ? "totalReps" : "avgWeight";

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
            {isMixed ? (
              <ComposedChart data={processedData}>
                <CartesianGrid strokeDasharray="3 3" />
                {todayView ? (
                  <XAxis dataKey="setNumber" tickFormatter={(n) => `Set ${n}`} />
                ) : (
                  <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
                )}
                <YAxis
                  yAxisId="weight"
                  type="number"
                  domain={[0, "dataMax + 20"]}
                  label={{ value: "Weight (lbs)", angle: -90, position: "insideLeft" }}
                />
                <YAxis
                  yAxisId="reps"
                  orientation="right"
                  type="number"
                  domain={[0, "dataMax + 5"]}
                  label={{ value: "Reps", angle: 90, position: "insideRight" }}
                />
                {todayView && isMobile ? null : <Tooltip content={CustomTooltip} />}
                <Area
                  yAxisId="weight"
                  type={cardinal}
                  dataKey={todayView ? "weight" : "avgWeight"}
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.3}
                  connectNulls={false}
                />
                <Line
                  yAxisId="reps"
                  type={cardinal}
                  dataKey={todayView ? "reps" : "totalReps"}
                  stroke="#ff7300"
                  strokeWidth={2}
                  dot={{ fill: "#ff7300", strokeWidth: 2, r: 4 }}
                  connectNulls={false}
                />
              </ComposedChart>
            ) : (
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
                {todayView && isMobile ? null : <Tooltip content={CustomTooltip} />}
                <Area type={cardinal} dataKey={dataKey} stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
              </AreaChart>
            )}
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
