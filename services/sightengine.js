import env from "../config/env.js";

const SIGHTENGINE_URL = "https://api.sightengine.com/1.0/check.json";

export async function analyzeImage(imageUrl) {
  try {
    const form = new URLSearchParams();

    form.append("url", imageUrl);
    form.append("models", "nudity,wad,gore,offensive,face-attributes,quality");

    form.append("api_user", env.SIGHTENGINE_API_USER);
    form.append("api_secret", env.SIGHTENGINE_API_SECRET);

    const response = await fetch(SIGHTENGINE_URL, {
      method: "POST",
      body: form
    });

    const data = await response.json();

    return {
      success: true,
      data
    };

  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}
