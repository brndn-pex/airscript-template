import requests
import json

# Airtable API Key
airtable_api_key = "YOUR_AIRTABLE_API_KEY"

# Airtable Base ID
airtable_base_id = "YOUR_AIRTABLE_BASE_ID"

# Webflow API Key
webflow_api_key = "YOUR_WEBFLOW_API_KEY"

# Webflow Collection ID
webflow_collection_id = "YOUR_WEBFLOW_COLLECTION_ID"

# Airtable API Endpoint
airtable_endpoint = f"https://api.airtable.com/v0/{airtable_base_id}/TableName"

# Webflow API Endpoint
webflow_endpoint = f"https://api.webflow.com/collections/{webflow_collection_id}/items"

# Request Headers for Airtable API
airtable_headers = {
    "Authorization": f"Bearer {airtable_api_key}",
    "Content-Type": "application/json"
}

# Request Headers for Webflow API
webflow_headers = {
    "Authorization": f"Bearer {webflow_api_key}",
    "Content-Type": "application/json"
}

def sync_records():
    # Get all records from Airtable
    airtable_response = requests.get(airtable_endpoint, headers=airtable_headers)
    airtable_records = airtable_response.json()["records"]

    # Loop through Airtable records
    for record in airtable_records:
        data = {
            "fields": record["fields"]
        }

        # Check if record exists in Webflow CMS
        webflow_response = requests.get(webflow_endpoint, headers=webflow_headers, params={"filter": {"_id": record["id"]}})
        webflow_records = webflow_response.json()["items"]

        if webflow_records:
            # Update record in Webflow CMS
            webflow_record = webflow_records[0]
            requests.patch(f"{webflow_endpoint}/{webflow_record['_id']}", headers=webflow_headers, data=json.dumps(data))
        else:
            # Create record in Webflow CMS
            requests.post(webflow_endpoint, headers=webflow_headers, data=json.dumps(data))

# Run the sync_records function
sync_records()
