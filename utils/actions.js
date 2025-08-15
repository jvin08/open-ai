'use server';
import OpenAI from "openai";
import { db } from "../app/db/index"
import { token, assets, portfolioNames } from "@/app/db/schema"
import { toursTable as tour } from "@/app/db/schema";
import {eq, asc, and, sql, notLike} from "drizzle-orm";
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

export const generateAssetData = async (symbol) => {
  const query = `If the stock, or etf, or cryptocurrency with ${symbol} exists, find its name.
  Response should be in the following format:
  {
    "symbol": "${symbol}",
    "text": "description",
    "data": "last closing data",
    "updated_at": ${new Date().toLocaleString()}
  }
  If you can't find provided information return { "asset" : null } with no additional characters`
  try {
    const response = await openai.chat.completions.create({
      messages: [{ 
        role: 'system', 
        content: 'You are a financial assistant that identifies asset name and last price  based on their symbols.'
      }, {
        role: 'user',
        content: query
      }],
      model: 'gpt-4o-mini',
      temperature: 0,
      max_tokens: 200,
    })  
    const assetData = JSON.parse(response.choices[0].message.content);
    return {asset: assetData, tokens: response.usage.total_tokens}
  }
  catch (error) {
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

export const createNewAsset = async (asstetData) => {
  const asset = await db.insert(assets).values(asstetData).returning();
  return asset[0];
};
export const deleteAssets = async ({clerkId, assetQuantity, assetSymbol, portfolioName}) => {
  // Fetch assets for the user with the specified symbol, ordered by price (ascending)
  const assetsToDelete = await db
    .select()
    .from(assets)
    .where(and(eq( assets.clerkId, clerkId ), eq(assets.assetSymbol, assetSymbol), eq(assets.portfolioName, portfolioName)))
    .orderBy(asc(assets.assetSymbol));
  let remainingQuantity = assetQuantity;
  let deletedAssets = [];

  for (const asset of assetsToDelete) {
    if (remainingQuantity <= 0) break;

    const deleteQuantity = Math.min(asset.assetQuantity, remainingQuantity);
    remainingQuantity -= deleteQuantity;

    // Delete the asset or update its quantity if some remain
    if (deleteQuantity >= asset.assetQuantity) {
      const deleted = await db
        .delete(assets)
        .where(eq(assets.id, asset.id))
        .returning();
      deletedAssets.push(deleted[0]);
    } else {
      const updated = await db
        .update(assets)
        .set({ assetQuantity: asset.assetQuantity - deleteQuantity })
        .where(eq(assets.id, asset.id))
        .returning();
      deletedAssets.push(updated[0]);
    }
  }

  return deletedAssets;
};
export const createNewPortfolio = async (name) => {
  console.log("adding portfolio", name)
  const portfolio = await db.insert(portfolioNames).values({name: name}).returning();
  return portfolio[0];
}
export const getAllPortfolios = async () => {
  const portfolios = await db.select().from(portfolioNames).orderBy(asc(portfolioNames.name))
  return portfolios
}
export const getUserPortfolios = async (userId) => {
  const portfolios = await db
    .selectDistinctOn([assets.portfolioName])
    .from(assets).where(eq(assets.clerkId, userId))
    .orderBy(asc(assets.portfolioName));
  return portfolios;
};
export const getUserAssets = async (userId) => {
  const data = await db.select().from(assets).where(eq(assets.clerkId, userId))
  return data
}
export const getUniqueSymbols = async (userID) => {
  const uniques = await db
  .select({
    symbol: assets.assetSymbol,
    price: sql`MAX(${assets.lastPrice})`.as('price'), // example
    time: sql`MAX(${assets.updatedAt})`.as('time')
  })
  .from(assets)
  .where(and(eq(assets.clerkId, userID), notLike(assets.assetSymbol, "$")))
  .groupBy(assets.assetSymbol);
  return uniques
}
export const updateAssetPrice = async (symbol, price, time) => {
  console.log("Updating prices...", time, price, symbol)
  return await db.update(assets).set({ lastPrice: price, updatedAt: time }).where(eq(assets.assetSymbol, symbol)).returning();
}
export const getAssetsByPortfolioName = async (name, clerkId) => {
  const portfolio = await db.select()
  .from(assets)
  .where(and(eq(assets.portfolioName, name), eq(assets.clerkId, clerkId)))
  .orderBy(asc(assets.portfolioName))
  return portfolio
}
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
export const generateUnspashTourImage = async ({city, country}) => {
  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
  try {
    return await fetch(`https://api.unsplash.com/search/photos?query=${city} ${country}&client_id=${unsplashKey}`)
    .then(response => response.json())
    .then(data => data.results[Math.floor(Math.random() * 10)].urls.regular);
  } catch (error) {
    return null;
  }
}
export const queryTickers = async (query) => {
  const polygonKey = process.env.POLIGON_DATA
  const url = `https://api.polygon.io/v3/reference/tickers?search=${query}&active=true&order=asc&limit=5&sort=ticker&apiKey=${polygonKey}`
  try {
    return await fetch(url).then(response => response.json())
  } catch (error) {
    return null;
  }
}
export const searchTickerQuote = async (ticker, type) => {
  console.log("searching quote for " + ticker)
  const twelveKey = process.env.TWELVE_DATA;
  const tickerQuery = type === "crypto" ? ticker + "/USD" : ticker
  const url = `https://api.twelvedata.com/price?symbol=${tickerQuery}&apikey=${twelveKey}`
  try {
    return await fetch(url).then(response => response.json())
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
export const addCash = async (clerkId, dollars, portfolioName) => {  
  const existingCash = await db
    .select()
    .from(assets)
    .where(
      and(
        eq(assets.clerkId, clerkId),
        eq(assets.assetType, "cash"),
        eq(assets.portfolioName, portfolioName)
      )
    );
  if (existingCash.length > 0) {
    await db
      .update(assets)
      .set({
        assetQuantity: sql`${assets.assetQuantity} + ${dollars}`
      })
      .where(
        and(
          eq(assets.clerkId, clerkId),
          eq(assets.assetType, "cash"),
          eq(assets.portfolioName, portfolioName)
        )
      );
      revalidatePath("/portfolio");
      return existingCash
  } else {
    const newCash = await db.insert(assets).values({
      clerkId,
      assetName: "US Dollar",
      assetSymbol: "$",
      assetType: "cash",
      assetQuantity: dollars,
      assetPrice: 1,
      portfolioName: portfolioName,
      lastPrice: 1,
      updatedAt: new Date()
    });
    revalidatePath("/portfolio");
    return newCash
  }
};

