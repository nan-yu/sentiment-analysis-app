import { z, GenerateResponse, genkit } from 'genkit';
import { ai } from './genkit.config';
import { logger } from 'genkit/logging';
import { analyzeRequestSchema, analyzeResponseSchema, videoSearchSchema, videoIdSchema, videoListSchema, commentListSchema } from './data_schema';

logger.setLogLevel('debug');

const ytApiKey = "AIzaSyD7UyjVw3I-IPnzuWgOTeEabYrMeL87AGc";
const ytBaseUrl = "https://youtube.googleapis.com/youtube/v3"

const inputSchema = ai.defineSchema("analyzeRequestSchema", analyzeRequestSchema);
const outputSchema = ai.defineSchema("analyzeResponseSchema", analyzeResponseSchema);

async function fetchVideoList(input: z.infer<typeof videoSearchSchema>): Promise<z.infer<typeof videoListSchema>> {
    logger.info(`fetching a list of videos with input ${JSON.stringify(input)}, videoSearchSchema is \n${JSON.stringify(videoSearchSchema)}`);
    const { topic } = videoSearchSchema.parse(input);
    logger.info(`topic is ${topic}`);
    var url = `${ytBaseUrl}/search?part=id&order=viewCount&type=video&q=${topic}&key=${ytApiKey}`;
    logger.info(`video list URL: ${url}`);

    var response = await fetch(url, { method: "GET", headers: [["accept", "application/json"]] });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP error fetching video list. status: ${response.status}\n${text}`);
    }
    const videos: z.infer<typeof videoListSchema> = await response.json();
    return videos;
}

async function fetchVideoComments(input: z.infer<typeof videoIdSchema>): Promise<z.infer<typeof commentListSchema>> {
  logger.info(`retrieving comments for the first video with id ${JSON.stringify(input)}`);
  const {kind, videoId} = videoIdSchema.parse(input);
  logger.info(`videoId is ${videoId}`)
  var url = `${ytBaseUrl}/commentThreads?part=snippet&order=relevance&videoId=${videoId}&key=${ytApiKey}`
  logger.info(`comment list URL: ${url}`);

  var response = await fetch(url, { method: "GET", headers: [["accept", "application/json"]] });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP error fetching comment list. status: ${response.status}\n${text}`);
  }
  const comments: z.infer<typeof commentListSchema> = await response.json();
  logger.info(`comment list is ${JSON.stringify(comments)}`)
  return comments;
}

export const searchForVideos = ai.defineTool(
  {
    name: "searchForVideo",
    description: "Search for video for a particular subject. Returns a list of relevant matches",
    inputSchema: videoSearchSchema,
    outputSchema: videoListSchema,
  },
  fetchVideoList,
);

export const videoComments = ai.defineTool(
  {
    name: "fetchVideoComments",
    description: "Fetch a list of comments for a particular video",
    inputSchema: videoIdSchema,
    outputSchema: commentListSchema,
  },
  fetchVideoComments,
);

export const analyzeFlow = ai.defineFlow(
    {
        name: "analyzeFlow",
        inputSchema: analyzeRequestSchema,
        outputSchema: analyzeResponseSchema,
    },
    async function (input: z.infer<typeof analyzeRequestSchema>) {
        // 1. get a list of videos for the topic
        const videos = await fetchVideoList(input);
        logger.info(`fetched videos: ${JSON.stringify(videos)}`)
        logger.info(`first video id is ${videos.items[0].id.videoId}`)
        if (videos.items.length == 0) {
          logger.error("no videos are found");
          throw new Error(`no videos are found`);
        }
        // 2. get the comment for the first video
        const commentList = await fetchVideoComments(videos.items[0].id)
        const comments = commentList.items.map((comement) => comement.snippet.topLevelComment.snippet.textOriginal)
        logger.info("========================================================")
        logger.info(`extracted comments are ${JSON.stringify(comments)}`)
        input.comments = comments
        // 3. providing all the comments, extract the postivie and negative aspects
        const prompt = ai.prompt("sentiment.analysis");
        const llmResponse: GenerateResponse<z.infer<typeof analyzeResponseSchema>> = await prompt(input);
        logger.info(JSON.stringify(llmResponse));
        var generatedOutput: z.infer<typeof analyzeResponseSchema> | null = null;
        try {
          generatedOutput = llmResponse.output;
        } catch (e) {
          throw new Error(`Error retrieving LLM response: ${e}`);
        }
        if (!generatedOutput) {
          throw new Error("Error retrieving LLM response.");
        } else {
          logger.info(`Response:\n${JSON.stringify(generatedOutput, null, "  ")}`);
          return generatedOutput;
        }
    }
);
