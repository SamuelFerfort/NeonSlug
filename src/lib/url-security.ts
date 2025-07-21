export async function checkUrlSafety(url: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client: {
            clientId: "url-shortener",
            clientVersion: "1.0.0",
          },
          threatInfo: {
            threatTypes: [
              "MALWARE",
              "SOCIAL_ENGINEERING",
              "UNWANTED_SOFTWARE",
              "POTENTIALLY_HARMFUL_APPLICATION",
            ],
            platformTypes: ["ANY_PLATFORM"],
            threatEntryTypes: ["URL"],
            threatEntries: [{ url }],
          },
        }),
      }
    );

    if (!response.ok) {
      console.error("Safe Browsing API error:", response.status);
      // If API fails, allow the URL (don't block legitimate users)
      return true;
    }

    const result = await response.json();
    // If matches exist, URL is malicious
    return !result.matches || result.matches.length === 0;
  } catch (error) {
    console.error("URL safety check failed:", error);
    // If check fails, allow the URL (don't block legitimate users)
    return true;
  }
}
