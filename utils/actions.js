'use server';
import OpenAI from "openai";
import { db } from "../app/db/index"
import { token } from "@/app/db/schema"
import { toursTable as tour } from "@/app/db/schema";
import {eq, asc, and, sql} from "drizzle-orm";
import { revalidatePath } from "next/cache";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export const generateChatResponse = async (chatMessages) => {
  try {
    const response = await openai.chat.completions.create({
      messages: [{ role: 'system', content: 'you are a helpful assistant' },
        ...chatMessages
      ],
      model: 'gpt-4o-mini',
      temperature: 0,
      max_tokens: 200,
    })  
    return response.choices[0].message
  }
  catch (error) {
    console.log(error);
    return null;
  }
}

export const getExistingTour = async ({ city, country }) => {
  const result = await db
    .select()
    .from(tour)
    .where(and(eq(tour.city, city), eq(tour.country, country)));
  return result[0] || null; // Drizzle returns an array, so we get the first item
};


export const generateTourResponse = async ({ city, country }) => {
  const query = `Find a ${city} in this ${country},
    If ${city} in this ${country} exists, create a list of things families can do in this ${city}, ${country}.
    Once you have a list, create a one-day tour. Response should be in the following JSON format:
    {
      "tour": {
        "city": "${city}",
        "country": "${country}",
        "title": "title of the tour",
        "description": "description of the city and tour",
        "stops": ["short paragraph on the stop 1, size 50 tokens", 
        "short paragraph on the stop 1, size 50 tokens", 
        "short paragraph on the stop 1, size 50 tokens"]
      }
    }
    If you can't find info on exact ${city}, or ${city} does not exist, or it's population is less than 1, 
    or it is not located in the following ${country} return { "tour": null}, with no additional characters.`;
  try {
    const response = await openai.chat.completions.create({
      messages: [
        {role: 'system', content: 'you are a tour guide'},
        {role: 'user', content: query}
      ],
      model: 'gpt-4o-mini',
      temperature: 0,
    })
    const tourData = JSON.parse(response.choices[0].message.content);
    if(!tourData.tour){
      return null;
    }
    return { tour: tourData.tour, tokens: response.usage.total_tokens };
  } catch (error) {
    console.log(error)
    return null;  
  }
};

export const createNewTour = async (tourData) => {
  const result = await db.insert(tour).values(tourData).returning();
  return result[0];
};

export const getAllTours = async (searchTerm) => {
  try {
      if (!searchTerm) {
          const tours = await db.select().from(tour).orderBy(asc(tour.city));
          return tours;
      }
      const tours = await db
        .select()
        .from(tour)
        .where(sql`city ilike ${'%' + searchTerm + '%'} or country ilike ${'%' + searchTerm + '%'}`)
        .orderBy(asc(tour.city));
      return tours;
  } catch (error) {
      console.error("Database query failed:", error);
      throw new Error("Could not fetch tours");
  }
};

export const getSingleTour = async (id) => {
  const singleTour = await db.select().from(tour).where(eq(tour.id, id));
  return singleTour;
}

export const generateTourImage = async ({ city, country }) => {
  try {
    const tourImage = await openai.images.generate({
      prompt: `a panoramic view of the ${city} ${country}`,
      n: 1,
      size: "256x256"
    })
    return tourImage?.data[0]?.url
  } catch (error) {
    return null;
  }
}

export const fetchUserTokensById = async (clerkId) => {
  const result = await db.select().from(token).where(eq(token.clerkId, clerkId));
  return result[0]?.tokens;
};

export const generateUserTokensForId = async (clerkId) => {
  const result = await db.insert(token).values({ clerkId: clerkId }).returning();
  return result[0]?.tokens;
};

export const fetchOrGenerateTokens = async (clerkId) => {
  const result = await fetchUserTokensById(clerkId)
  if(result) {
    return result;
  }
  return (await generateUserTokensForId(clerkId));
};

export const subtractTokens = async (clerkId, tokens) => {
  const result = await db.update(token)
    .set({
      tokens: sql`${token.tokens} - ${tokens}`
    })
    .where(eq(token.clerkId, clerkId))
    revalidatePath("/profile");
  return result.tokens;
}
