import { z } from 'genkit';

export const videoSearchSchema = z.object({
    topic: z.string().describe("A query to search for the video list"),
})

export const analyzeRequestSchema = z.object({
    topic: z.string().describe("A topic for sentiment analysis"),
    comments: z.array(z.string()).describe("The list of comments for the first video"),
})

export const analyzeResponseSchema = z.object({
    positive: z.array(z.string()).describe("Positive aspects of the topic"),
    negative: z.array(z.string()).describe("Negative aspects of the topic"),
})

export const videoIdSchema = z.object({
    kind: z.string().describe("Identifies the API resource's type"),
    videoId: z.string().describe("The ID that YouTube uses to uniquely identify the video"),
})

export const videoItemSchema = z.object({
    // kind: z.string().describe("Identifies the API resource's type"),
    // etag: z.string().describe("The Etag of this resource"),
    id: videoIdSchema,
})

// export const pageInfoSchema = z.object({
//     totalResults: z.number().describe("The total number of results in the result set."),
//     resultsPerPage: z.number().describe("The number of results included in the API response"),
// })

export const videoListSchema = z.object({
    // kind: z.string().describe("Identifies the API resource's type. The value will be youtube#videoListResponse"),
    // etag: z.string().describe("The Etag of this resource"),
    // nextPageToken: z.string().describe("The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set"),
    // regionCode: z.string().describe("The code of the region"),
    // pageInfo: pageInfoSchema.describe("The pageInfo object encapsulates paging information for the result set"),
    items: z.array(videoItemSchema).describe("A list of videos that match the request criteria"),
})

export const nestedCommentSnippetSchema = z.object({
    textOriginal: z.string().describe("The original, raw text of the comment as it was initially posted or last updated"),
    // other fields are omitted
})

export const topLevelCommentSchema = z.object({
    snippet: nestedCommentSnippetSchema.describe("The snippet object contains basic details about the comment"),
    // other fields are omitted
})

export const commentSnippetSchema = z.object({
    topLevelComment: topLevelCommentSchema.describe("The thread's top-level comment"),
    // other fields are omitted
})

export const commentItemSchema = z.object({
    snippet: commentSnippetSchema.describe("The snippet object contains basic details about the comment thread"),
    // other fields are omitted
})

export const commentListSchema = z.object({
    items: z.array(commentItemSchema).describe("A list of comment threads that match the request criteria"),
    // other fields are omitted
})