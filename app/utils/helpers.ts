import { useEffect, useState } from "react";

export const capitalizeWords = (value: string) => {
	return value
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(" ");
};

export const formatDate = (dateString?: string | Date) => {
	return new Date(dateString ?? Date.now()).toLocaleDateString("en-US", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});
};

export const useWindowSize = (dimension: "width" | "height") => {
	const [size, setSize] = useState<number | undefined>(undefined);

	useEffect(() => {
		const handleResize = () => {
			setSize(dimension === "width" ? window.innerWidth : window.innerHeight);
		};

		handleResize();

		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);
	}, [dimension]);
	return size;
};
