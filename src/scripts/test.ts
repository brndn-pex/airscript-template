import request from "request";
import querystring from "querystring";

// Airtable API Key
const airtableApiKey = "key720Ssx9IUuMzL0
";

// Airtable Base ID
const airtableBaseId = "appb47pyO7iVnORcl";

// Webflow API Key
const webflowApiKey = "9d4754a753fe0d07f22e885bfdddce7e40f759900e014c6e6bedc9062bd97cba";

// Webflow Collection ID
const webflowCollectionId = "63ce4dbd57b94e569df73a1a";

// Airtable API Endpoint
const airtableEndpoint = `https://api.airtable.com/v0/${airtableBaseId}/tbl9HutW5wtaLndrp`;

// Webflow API Endpoint
const webflowEndpoint = `https://api.webflow.com/collections/${webflowCollectionId}/items`;

// Request Headers for Airtable API
const airtableHeaders = {
  Authorization: `Bearer ${airtableApiKey}`,
  "Content-Type": "application/json"
};

// Request Headers for Webflow API
const webflowHeaders = {
  Authorization: `Bearer ${webflowApiKey}`,
  "Content-Type": "application/json"
};

function syncRecords() {
  // Get all records from Airtable
  request.get(
    {
      url: airtableEndpoint,
      headers: airtableHeaders
    },
    (error, response, body) => {
      const airtableRecords = JSON.parse(body).records;

      // Loop through Airtable records
      airtableRecords.forEach(record => {
        const data = {
          fields: record.fields
        };

        // Check if record exists in Webflow CMS
        request.get(
          {
            url: `${webflowEndpoint}?${querystring.stringify({
              filter: { _id: record.id }
            })}`,
            headers: webflowHeaders
          },
          (error, response, body) => {
            const webflowRecords = JSON.parse(body).items;

            if (webflowRecords.length) {
              // Update record in Webflow CMS
              const webflowRecord = webflowRecords[0];
              request.patch(
                {
                  url: `${webflowEndpoint}/${webflowRecord._id}`,
                  headers: webflowHeaders,
                  body: JSON.stringify(data)
                },
                () => { }
              );
            } else {
              // Create record in Webflow CMS
              request.post(
                {
                  url: webflowEndpoint,
                  headers: webflowHeaders,
                  body: JSON.stringify(data)
                },
                () => { }
              );
            }
          }
        );
      });
    }
  );
}

// Run the sync_records function
syncRecords();
