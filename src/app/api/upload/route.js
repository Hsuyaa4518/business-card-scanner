import { NextResponse } from "next/server";
import { AzureKeyCredential, DocumentAnalysisClient } from "@azure/ai-form-recognizer";

const endpoint = process.env.AZURE_ENDPOINT;
const apiKey = process.env.AZURE_KEY;

if (!endpoint || !apiKey) {
  throw new Error("Azure Form Recognizer credentials are missing!");
}

const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(apiKey));

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to Uint8Array buffer
    const fileBuffer = await file.arrayBuffer();
    const fileBytes = new Uint8Array(fileBuffer);

    console.log("Starting document analysis...");
    
    // Analyze document
    const poller = await client.beginAnalyzeDocument("prebuilt-businessCard", fileBytes);
    const result = await poller.pollUntilDone();
    
    console.log("Document analysis complete");

    if (!result || !result.documents || result.documents.length === 0) {
      console.log("No documents found in Azure response");
      return NextResponse.json({ business_cards: [] }, { status: 200 });
    }

    // Return all extracted fields instead of filtering specific ones
    const businessCards = result.documents.map(doc => {
      return {
        docType: doc.docType,
        confidence: doc.confidence,
        fields: doc.fields
      };
    });

    console.log("Extracted document data:", JSON.stringify(businessCards, null, 2));
    
    return NextResponse.json({ business_cards: businessCards });
  } catch (error) {
    console.error("Error processing business card:", error);
    return NextResponse.json({ 
      error: "Server error", 
      details: String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}