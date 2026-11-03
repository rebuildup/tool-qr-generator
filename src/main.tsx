import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import QrGeneratorApp from "./QrGeneratorApp";
import "./styles.css";

const container = document.getElementById("root");

if (!container) {
	throw new Error("QR Generator: missing #root element");
}

createRoot(container).render(
	<StrictMode>
		<QrGeneratorApp />
	</StrictMode>,
);
