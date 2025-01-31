import { genkit } from 'genkit';
import { vertexAI } from "@genkit-ai/vertexai";
import { logger } from 'genkit/logging';
import { enableFirebaseTelemetry } from "@genkit-ai/firebase";
import { enableGoogleCloudTelemetry } from '@genkit-ai/google-cloud';
import { AlwaysOnSampler } from '@opentelemetry/sdk-trace-base';

logger.setLogLevel('debug');

// configure a Genkit instance
export const ai = genkit({
    promptDir: "./prompts",
    plugins: [vertexAI({ location: 'us-central1' })],
});

enableFirebaseTelemetry();
enableGoogleCloudTelemetry({
    sampler: new AlwaysOnSampler(),
    forceDevExport: false, // Set this to true to export telemetry for local runs
    autoInstrumentation: true,
    autoInstrumentationConfig: {
        '@opentelemetry/instrumentation-fs': { enabled: false },
        '@opentelemetry/instrumentation-dns': { enabled: false },
        '@opentelemetry/instrumentation-net': { enabled: false },
    },
    metricExportIntervalMillis: 5_000,
    metricExportTimeoutMillis: 2_000,
});