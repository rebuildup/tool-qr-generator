"use client";

import { useCallback, useEffect, useState } from "react";
import QRCodeDisplay from "./QRCodeDisplay";
import QRColorSettings from "./QRColorSettings";
import QRInputSettings from "./QRInputSettings";
import QRParametersSettings from "./QRParametersSettings";
import type { ErrorLevel, InputType } from "./qr-code.utils";
import { processInputTexts } from "./qr-code.utils";

const DEFAULT_INPUT_TYPE: InputType = "url";
const DEFAULT_SIZE = 256;
const DEFAULT_ERROR_LEVEL: ErrorLevel = "M";
const DEFAULT_MARGIN = 4;
const DEFAULT_FOREGROUND = "#000000";
const DEFAULT_BACKGROUND = "#ffffff";
const PROCESS_DEBOUNCE_MS = 500;

export default function QRCodeGenerator() {
	const [inputType, setInputType] = useState<InputType>(DEFAULT_INPUT_TYPE);
	const [inputText, setInputText] = useState("");
	const [size, setSize] = useState(DEFAULT_SIZE);
	const [errorLevel, setErrorLevel] = useState<ErrorLevel>(DEFAULT_ERROR_LEVEL);
	const [margin, setMargin] = useState(DEFAULT_MARGIN);
	const [foregroundColor, setForegroundColor] = useState(DEFAULT_FOREGROUND);
	const [backgroundColor, setBackgroundColor] = useState(DEFAULT_BACKGROUND);
	const [processedTexts, setProcessedTexts] = useState<string[]>([]);
	const [isBulkMode, setIsBulkMode] = useState(false);

	useEffect(() => {
		const handler = setTimeout(() => {
			setProcessedTexts(processInputTexts(inputText, isBulkMode));
		}, PROCESS_DEBOUNCE_MS);
		return () => clearTimeout(handler);
	}, [inputText, isBulkMode]);

	const resetForm = useCallback(() => {
		setInputText("");
		setSize(DEFAULT_SIZE);
		setErrorLevel(DEFAULT_ERROR_LEVEL);
		setMargin(DEFAULT_MARGIN);
		setForegroundColor(DEFAULT_FOREGROUND);
		setBackgroundColor(DEFAULT_BACKGROUND);
	}, []);

	return (
		<div className="fixed inset-0 w-screen h-dvh z-[9999] bg-white text-black font-sans overflow-y-auto p-8">
			<div style={{ maxWidth: "900px", margin: "0 auto" }}>
				{/*
				 * The breadcrumb that used to live here linked to the host
				 * routes (`/` and `/tools`). Inside the embedding iframe those
				 * targets are not the tool, so following them would navigate the
				 * frame away from the app. The heading below carries the same
				 * title, so the breadcrumb is dropped instead of repointed.
				 */}

				<h1
					style={{
						borderBottom: "1px solid #ccc",
						paddingBottom: "10px",
						marginBottom: "20px",
						fontSize: "1.5rem",
						fontWeight: "normal",
					}}
				>
					QR Code Generator
				</h1>

				<div className="qr-layout">
					<div>
						<QRInputSettings
							inputType={inputType}
							onInputTypeChange={setInputType}
							inputText={inputText}
							onInputTextChange={setInputText}
							isBulkMode={isBulkMode}
							onBulkModeChange={setIsBulkMode}
						/>
						<QRParametersSettings
							size={size}
							onSizeChange={setSize}
							margin={margin}
							onMarginChange={setMargin}
							errorLevel={errorLevel}
							onErrorLevelChange={setErrorLevel}
						/>
						<QRColorSettings
							foregroundColor={foregroundColor}
							onForegroundColorChange={setForegroundColor}
							backgroundColor={backgroundColor}
							onBackgroundColorChange={setBackgroundColor}
						/>
					</div>
					<QRCodeDisplay
						processedTexts={processedTexts}
						inputType={inputType}
						isBulkMode={isBulkMode}
						options={{
							size,
							margin,
							errorLevel,
							foregroundColor,
							backgroundColor,
						}}
						onReset={resetForm}
					/>
				</div>
			</div>
		</div>
	);
}
