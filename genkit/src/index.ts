import { ai } from './genkit.config';
import { analyzeFlow } from "./flows";

ai.startFlowServer({ flows: [analyzeFlow] });
